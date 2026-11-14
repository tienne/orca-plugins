import type { OrcaFrameApi } from 'orca/frame';
import type {
  Connection,
  JiraTask,
  TaskFilter,
  TaskPage,
  ChildOptions,
} from './protocol';
import { en, ko } from './strings';
import { statusTone } from './status-tone';
import { issueTypeTone } from './issue-type';

const bridge = (window as unknown as { orca: OrcaFrameApi }).orca;
const uiLocale = /^ko(?:-|$)/i.test(bridge.locale) ? 'ko-KR' : 'en-US';
const t = uiLocale === 'ko-KR' ? ko : en;
document.documentElement.lang = uiLocale;
const app = document.querySelector<HTMLElement>('#app')!;
let connection: Connection = { sites: [], selectedSiteId: null };
let siteId = '';
let filter: TaskFilter = 'assigned';
let page: TaskPage = { tasks: [], limitReached: false };
let selected: JiraTask | null = null;
let busy = true;
let error = '';
let query = '';
let project = '';
let status = '';
let pending: AbortController | undefined;
let children: TaskPage = { tasks: [], limitReached: false };
let childrenBusy = false;
let childrenError = '';
let childQuery = '';
let childStatuses = new Set<string>();
let childAssignees = new Set<string>();
let childOptions: ChildOptions = {
  statuses: [],
  assignees: [],
  limited: false,
};
let appliedChildCriteria = '';
let childPending: AbortController | undefined;

interface DetailSnapshot {
  task: JiraTask;
  children: TaskPage;
  busy: boolean;
  error: string;
  childrenBusy: boolean;
  childrenError: string;
  query: string;
  statuses: string[];
  assignees: string[];
  scrollY: number;
  childScrollY: number;
  options: ChildOptions;
  appliedCriteria: string;
}
const navigationHistory: DetailSnapshot[] = [];
let listScrollY = 0;
function goToList(): void {
  pending?.abort();
  navigationHistory.length = 0;
  selected = null;
  busy = false;
  error = '';
  render();
  requestAnimationFrame(() => window.scrollTo(0, listScrollY));
}
function goBack(): void {
  const previous = navigationHistory.pop();
  if (!previous) {
    goToList();
    return;
  }
  pending?.abort();
  pending = new AbortController();
  selected = previous.task;
  children = previous.children;
  busy = false;
  error = previous.error;
  childrenBusy = previous.childrenBusy;
  childrenError = previous.childrenError;
  childQuery = previous.query;
  childStatuses = new Set(previous.statuses);
  childAssignees = new Set(previous.assignees);
  childOptions = previous.options;
  appliedChildCriteria = previous.appliedCriteria;
  const restoreScroll = () =>
    requestAnimationFrame(() => {
      window.scrollTo(0, previous.scrollY);
      const list = document.querySelector<HTMLElement>('.children-list');
      if (list) list.scrollTop = previous.childScrollY;
    });
  render();
  restoreScroll();
  if (previous.busy) void loadIssue(previous.task, true).then(restoreScroll);
  else if (previous.childrenBusy)
    void loadChildren(previous.task.key, pending.signal).then(restoreScroll);
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text = '',
  className = '',
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function issueTypeBadge(type?: {
  name: string;
  subtask?: boolean;
}): HTMLElement {
  if (!type?.name) return el('span');
  const badge = el('span', '', 'issue-type-badge');
  const tone = issueTypeTone(type);
  badge.style.setProperty('--type-hue', String(tone.hue));
  badge.title = `${t.issueType}: ${type.name}`;
  badge.setAttribute('aria-label', badge.title);
  const symbol = el('span', tone.symbol, 'issue-type-symbol');
  symbol.setAttribute('aria-hidden', 'true');
  badge.append(symbol, el('span', type.name, 'issue-type-name'));
  return badge;
}
function statusBadge(task: JiraTask): HTMLElement {
  const category =
    task.category === 'done'
      ? 'done'
      : task.category === 'indeterminate'
        ? 'progress'
        : 'todo';
  const badge = el('span', task.status, 'badge status-badge');
  badge.dataset.category = category;
  const tone = statusTone(task.status);
  badge.style.setProperty('--status-hue', String(tone.hue));
  badge.style.setProperty('--status-chroma', String(tone.chroma));
  return badge;
}
const avatarRequests = new Map<string, Promise<string | null>>();
const observedAvatars = new Set<HTMLElement>();
function clearDetachedAvatars(): void {
  for (const avatar of observedAvatars)
    if (!avatar.isConnected) {
      avatarObserver.unobserve(avatar);
      observedAvatars.delete(avatar);
    }
}
const avatarObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const avatar = entry.target as HTMLElement;
    avatarObserver.unobserve(avatar);
    observedAvatars.delete(avatar);
    const url = avatar.dataset.url;
    if (!url) continue;
    let result = avatarRequests.get(url);
    if (!result) {
      if (avatarRequests.size >= 100)
        avatarRequests.delete(avatarRequests.keys().next().value!);
      result = bridge.plugin
        .request('jira.avatar', { url }, { timeoutMs: 8000 })
        .catch(() => null);
      avatarRequests.set(url, result);
    }
    void result.then((src) => {
      if (
        !src ||
        !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(src) ||
        !avatar.isConnected
      )
        return;
      const img = el('img');
      img.alt = '';
      img.addEventListener('load', () => {
        if (avatar.isConnected) avatar.replaceChildren(img);
      });
      img.src = src;
    });
  }
});
function profileView(
  value: string | undefined,
  imageUrl: string | undefined,
  role: 'assignee' | 'reporter',
  fallback: string,
): HTMLElement {
  const person = el('span', '', `${role}-person`);
  const name = value || fallback;
  person.title = name;
  const avatar = el(
    'span',
    value ? Array.from(value.split(/[\s(]/)[0]).slice(0, 2).join('') : '—',
    `${role}-avatar`,
  );
  avatar.setAttribute('aria-hidden', 'true');
  avatar.title = name;
  if (value && imageUrl) {
    avatar.dataset.url = imageUrl;
    avatarObserver.observe(avatar);
    observedAvatars.add(avatar);
  }
  person.append(avatar, el('span', name, `${role}-name`));
  return person;
}
function assigneeView(task: JiraTask): HTMLElement {
  return profileView(
    task.assignee,
    task.assigneeAvatarUrl,
    'assignee',
    t.unassigned,
  );
}
function assigneeKey(task: JiraTask): string {
  return task.assigneeId
    ? `id:${task.assigneeId}`
    : task.assignee
      ? `name:${task.assignee}`
      : 'unassigned';
}
function multiSelect(
  label: string,
  options: { value: string; label: string }[],
  selection: Set<string>,
  onChange: () => void,
) {
  const field = el('div', '', 'field');
  field.append(el('span', label));
  const picker = el('details', '', 'status-picker');
  picker.setAttribute('name', 'child-filters');
  const summary = el('summary');
  summary.setAttribute('aria-label', label);
  const choices = el('div', '', 'status-options');
  const refresh = () => {
    summary.textContent = selection.size
      ? options
          .filter((option) => selection.has(option.value))
          .map((option) => option.label)
          .join(', ')
      : t.any;
    summary.title = summary.textContent;
    choices.querySelectorAll<HTMLInputElement>('input').forEach((checkbox) => {
      checkbox.checked = selection.has(checkbox.value);
    });
  };
  for (const option of options) {
    const row = el('label', '', 'status-option');
    const checkbox = el('input');
    checkbox.type = 'checkbox';
    checkbox.value = option.value;
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) selection.add(option.value);
      else selection.delete(option.value);
      refresh();
      onChange();
    });
    row.append(checkbox, el('span', option.label));
    choices.append(row);
  }
  picker.append(summary, choices);
  field.append(picker);
  refresh();
  return { field, refresh };
}
function button(
  text: string,
  action: () => unknown,
  className = '',
): HTMLButtonElement {
  const node = el('button', text, className);
  node.type = 'button';
  node.addEventListener('click', () => {
    void action();
  });
  return node;
}
function safeLink(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}
function link(label: string, url: string): HTMLElement {
  if (!safeLink(url)) return el('span', label);
  const node = el('a', label);
  node.href = url;
  node.addEventListener('click', (event) => {
    event.preventDefault();
    void bridge.host.call('shell.openExternal', { url });
  });
  return node;
}
function inline(node: HTMLElement, text: string): void {
  const pattern =
    /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    node.append(
      document.createTextNode(
        text.slice(cursor, match.index).replace(/\\([\[\]])/g, '$1'),
      ),
    );
    node.append(
      match[1]
        ? link(match[1], match[2])
        : el(match[3] ? 'strong' : 'code', match[3] || match[4]),
    );
    cursor = match.index! + match[0].length;
  }
  node.append(
    document.createTextNode(text.slice(cursor).replace(/\\([\[\]])/g, '$1')),
  );
}
function imageFigure(image: { alt: string; src: string }): HTMLElement {
  const figure = el('figure');
  const preview = button(
    '',
    () => {
      const dialog = el('dialog');
      const bar = el('div', '', 'topbar');
      bar.append(
        el('span', image.alt, 'muted'),
        button(t.close, () => dialog.close()),
      );
      const full = el('img');
      full.src = image.src;
      full.alt = image.alt;
      dialog.append(bar, full);
      dialog.addEventListener('close', () => dialog.remove());
      document.body.append(dialog);
      dialog.showModal();
    },
    'image-button',
  );
  preview.setAttribute('aria-label', `${t.enlargeImage}: ${image.alt}`);
  const img = el('img');
  img.src = image.src;
  img.alt = image.alt;
  img.loading = 'lazy';
  img.addEventListener('error', () => {
    preview.replaceChildren(el('span', t.imageUnavailable));
    preview.disabled = true;
  });
  preview.append(img);
  figure.append(preview, el('figcaption', `${image.alt} · ${t.enlargeImage}`));
  return figure;
}
function description(task: JiraTask): HTMLElement {
  const root = el('div', '', 'description');
  let section = el('section');
  root.append(section);
  let paragraph: string[] = [];
  const lists: {
    indent: number;
    list: HTMLOListElement | HTMLUListElement;
    item: HTMLLIElement;
  }[] = [];
  const flush = () => {
    if (paragraph.length) {
      const p = el('p');
      inline(p, paragraph.join('\n'));
      section.append(p);
      paragraph = [];
    }
  };
  for (const raw of task.description.split('\n')) {
    const line = raw.trim();
    const normalized = line
      .replace(/^\*\*|\*\*$/g, '')
      .replace(/\\([\[\]])/g, '$1');
    const heading =
      normalized.match(/^\[([^\]]{1,70})\]$/) ||
      normalized.match(/^#{1,3}\s+(.+)$/);
    const image = line.match(/^\[\[image:(\d+)\]\]$/);
    const item = raw.match(/^(\s*)(?:([-*])|(\d+)\.)\s+(.+)$/);
    if (heading) {
      flush();
      lists.length = 0;
      if (section.childNodes.length) {
        section = el('section');
        root.append(section);
      }
      section.append(el('h2', heading[1]));
    } else if (image) {
      flush();
      lists.length = 0;
      const attachment = task.images?.[Number(image[1])];
      if (
        attachment &&
        /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(
          attachment.src,
        )
      )
        section.append(imageFigure(attachment));
    } else if (item) {
      flush();
      const indent = item[1].length;
      while (lists.length && lists.at(-1)!.indent > indent) lists.pop();
      const ordered = Boolean(item[3]);
      if (
        !lists.length ||
        lists.at(-1)!.indent < indent ||
        lists.at(-1)!.list.tagName !== (ordered ? 'OL' : 'UL')
      ) {
        if (lists.at(-1)?.indent === indent) lists.pop();
        const list = ordered ? el('ol') : el('ul');
        if (ordered) (list as HTMLOListElement).start = Number(item[3]);
        (lists.at(-1)?.item ?? section).append(list);
        lists.push({ indent, list, item: el('li') });
      }
      const li = el('li');
      inline(li, item[4]);
      lists.at(-1)!.list.append(li);
      lists.at(-1)!.item = li;
    } else if (!line) {
      flush();
    } else if (line.startsWith('> ')) {
      flush();
      lists.length = 0;
      const quote = el('blockquote');
      inline(quote, line.slice(2));
      section.append(quote);
    } else {
      lists.length = 0;
      paragraph.push(raw);
    }
  }
  flush();
  if (!task.description) section.append(el('p', t.noDescription, 'muted'));
  return root;
}
function selectField(
  label: string,
  value: string,
  options: { value: string; label: string }[],
  action: (value: string) => void,
): HTMLElement {
  const field = el('label', '', 'field');
  field.append(el('span', label));
  const control = el('select');
  control.setAttribute('aria-label', label);
  options.forEach((item) => {
    const option = el('option', item.label);
    option.value = item.value;
    control.append(option);
  });
  control.value = value;
  control.disabled = busy;
  control.addEventListener('change', () => action(control.value));
  field.append(control);
  return field;
}
function renderList(container: HTMLElement): void {
  container.replaceChildren();
  clearDetachedAvatars();
  const tasks = page.tasks.filter(
    (task) =>
      (!project || task.project === project) &&
      (!status || task.status === status) &&
      `${task.key} ${task.title}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  container.append(
    el('div', `${tasks.length} / ${page.tasks.length} ${t.issues}`, 'muted'),
  );
  if (page.limitReached) container.append(el('p', t.limit, 'muted'));
  if (!tasks.length) {
    container.append(el('p', t.empty, 'empty'));
    return;
  }
  const list = el('div', '', 'task-list');
  list.setAttribute('role', 'list');
  for (const task of tasks) {
    const row = button('', () => loadIssue(task), 'task-row');
    row.setAttribute('aria-label', task.title);
    const meta = el('span', '', 'task-meta');
    const owner = assigneeView(task);
    owner.classList.add('list-assignee');
    meta.append(
      el('span', task.key, 'meta'),
      issueTypeBadge(task.issueType),
      statusBadge(task),
      owner,
    );
    row.append(el('span', task.title, 'title'), meta);
    list.append(row);
  }
  container.append(list);
}
function childCriteria() {
  return {
    search: childQuery.trim(),
    statuses: [...childStatuses].sort(),
    assignees: [...childAssignees].sort(),
  };
}
function renderChildren(container: HTMLElement): void {
  container.replaceChildren();
  clearDetachedAvatars();
  const heading = el('div', '', 'children-heading');
  heading.append(el('h2', t.children));
  if (!childrenBusy && !childrenError)
    heading.append(
      el(
        'span',
        `${children.tasks.length}${children.limitReached ? '+' : ''}`,
        'badge',
      ),
    );
  container.append(heading);
  if (childrenBusy) {
    container.append(el('p', t.loadingChildren, 'muted'));
    return;
  }
  const submit = () => {
    if (selected && pending) return loadChildren(selected.key, pending.signal);
  };
  const controls = el('div', '', 'children-controls');
  const searchField = el('label', '', 'field child-search-field');
  searchField.append(el('span', t.childSearch));
  const input = el('input');
  input.type = 'search';
  input.maxLength = 200;
  input.value = childQuery;
  input.placeholder = t.childSearchHint;
  input.setAttribute('aria-label', t.childSearch);
  searchField.append(input);
  const hint = el('p', '', 'muted child-query-hint');
  const apply = button(t.runQuery, submit, 'child-query-button');
  const reset = button(
    t.clearFilters,
    () => {
      childQuery = '';
      childStatuses.clear();
      childAssignees.clear();
      return submit();
    },
    'ghost child-filter-reset',
  );
  const updateDraft = () => {
    const dirty = JSON.stringify(childCriteria()) !== appliedChildCriteria;
    hint.textContent = dirty ? t.queryChanged : t.queryApplied;
    reset.hidden =
      !childQuery &&
      !childStatuses.size &&
      !childAssignees.size &&
      (!appliedChildCriteria ||
        appliedChildCriteria ===
          JSON.stringify({ search: '', statuses: [], assignees: [] }));
  };
  const statuses = [
    ...new Set([
      ...childOptions.statuses,
      ...children.tasks.map((task) => task.status),
      ...childStatuses,
    ]),
  ]
    .filter(Boolean)
    .sort();
  const statusPicker = multiSelect(
    t.childStatus,
    statuses.map((value) => ({ value, label: value })),
    childStatuses,
    updateDraft,
  );
  const assignees = new Map(
    childOptions.assignees.map((option) => [
      option.value,
      option.label || t.unassigned,
    ]),
  );
  for (const task of children.tasks)
    if (task.assigneeId || !task.assignee)
      assignees.set(assigneeKey(task), task.assignee || t.unassigned);
  const assigneePicker = multiSelect(
    t.childAssignee,
    [...assignees]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, uiLocale)),
    childAssignees,
    updateDraft,
  );
  input.addEventListener('input', () => {
    childQuery = input.value;
    updateDraft();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.isComposing) {
      event.preventDefault();
      void submit();
    }
  });
  controls.append(searchField, statusPicker.field, assigneePicker.field);
  heading.append(reset, apply);
  container.append(controls, hint);
  updateDraft();
  if (childrenError) {
    container.append(
      el('p', `${t.childrenError}: ${childrenError}`, 'error'),
      button(t.retry, submit),
    );
    return;
  }
  if (!children.tasks.length)
    container.append(el('p', t.noMatchingChildren, 'muted'));
  else {
    const list = el('div', '', 'children-list');
    list.setAttribute('role', 'list');
    for (const task of children.tasks) {
      const row = button('', () => loadIssue(task), 'child-row');
      row.setAttribute('aria-label', `${task.key} ${task.title}`);
      const meta = el('span', '', 'task-meta');
      meta.append(
        el('span', task.key, 'parent-key'),
        issueTypeBadge(task.issueType),
        statusBadge(task),
      );
      const owner = el('span', '', 'child-assignee');
      owner.append(el('span', t.assignee, 'muted'), assigneeView(task));
      row.append(meta, el('span', task.title, 'child-title'), owner);
      list.append(row);
    }
    container.append(list);
  }
  if (children.limitReached)
    container.append(el('p', t.childrenLimit, 'muted'));
  if (childOptions.limited)
    container.append(el('p', t.childOptionsLimited, 'muted'));
}
async function loadChildren(
  key: string,
  signal: AbortSignal,
  includeOptions = false,
): Promise<void> {
  childPending?.abort();
  const request = new AbortController();
  childPending = request;
  const requestSignal = AbortSignal.any([signal, request.signal]);
  const criteria = childCriteria();
  childrenBusy = true;
  childrenError = '';
  const update = () => {
    if (requestSignal.aborted || selected?.key !== key) return;
    const container = document.querySelector<HTMLElement>('#child-issues');
    if (container) renderChildren(container);
  };
  update();
  try {
    const result = await bridge.plugin.request(
      'jira.children',
      { siteId, key, ...criteria, includeOptions },
      { signal: requestSignal, timeoutMs: 120000 },
    );
    if (requestSignal.aborted || selected?.key !== key) return;
    children = result;
    appliedChildCriteria = JSON.stringify(criteria);
    if (result.options) {
      const people = new Map(
        [...childOptions.assignees, ...result.options.assignees].map(
          (option) => [option.value, option.label],
        ),
      );
      childOptions = {
        statuses: [
          ...new Set([...childOptions.statuses, ...result.options.statuses]),
        ],
        assignees: [...people].map(([value, label]) => ({ value, label })),
        limited: result.options.limited,
      };
    }
    childrenBusy = false;
    update();
  } catch (e) {
    if (requestSignal.aborted || selected?.key !== key) return;
    childrenBusy = false;
    childrenError = e instanceof Error ? e.message : String(e);
    update();
  }
}
function render(): void {
  app.replaceChildren();
  clearDetachedAvatars();
  const bar = el('header', '', 'topbar');
  if (selected) {
    const navigation = el('div', '', 'detail-navigation');
    navigation.append(
      button(`‹ ${t.back}`, goBack, 'ghost'),
      button(t.toList, goToList, 'ghost list-navigation'),
    );
    bar.append(navigation);
    const actions = el('div', '', 'detail-actions');
    const refresh = button(
      '↻',
      () => {
        if (selected) return loadIssue(selected, true);
      },
      'ghost',
    );
    refresh.disabled = busy;
    refresh.setAttribute('aria-label', t.refresh);
    refresh.title = t.refresh;
    refresh.classList.add('refresh-icon');
    actions.append(refresh);
    if (selected.url) actions.append(link(`${t.open} ↗`, selected.url));
    bar.append(actions);
  } else {
    bar.classList.add('list-topbar');
    bar.append(el('h1', 'Jira Tasks'));
    const refresh = button('↻', () => load(true), 'ghost');
    refresh.disabled = busy;
    refresh.setAttribute('aria-label', t.refresh);
    refresh.title = t.refresh;
    refresh.classList.add('refresh-icon');
    bar.append(refresh);
  }
  app.append(bar);
  if (!selected && connection.sites.length) {
    if (connection.sites.length > 1)
      app.append(
        selectField(
          t.site,
          siteId,
          connection.sites.map((site) => ({
            value: site.id,
            label: `${site.siteUrl.replace(/^https:\/\//, '')} · ${site.email}`,
          })),
          (value) => {
            siteId = value;
            query = project = status = '';
            void load();
          },
        ),
      );
    const scopes = el('div', '', 'scope-options');
    scopes.setAttribute('role', 'group');
    scopes.setAttribute('aria-label', t.scope);
    for (const value of [
      'assigned',
      'reported',
      'all',
      'done',
    ] as TaskFilter[]) {
      const scope = button(
        t[value],
        () => {
          filter = value;
          void load();
        },
        'scope-option',
      );
      scope.setAttribute('aria-pressed', String(filter === value));
      scope.disabled = busy;
      scopes.append(scope);
    }
    app.append(scopes);
  }
  if (selected) {
    if (selected.parent) {
      const parent = selected.parent;
      const container = el('div', '', 'parent-issue');
      container.append(el('div', t.parent, 'muted'));
      const parentButton = button(
        '',
        () =>
          loadIssue({
            key: parent.key,
            title: parent.title || parent.key,
            url: '',
            project: '',
            status: '',
            category: '',
            assignee: '',
            priority: '',
            updatedAt: '',
            description: '',
            descriptionTruncated: false,
          }),
        'parent-link',
      );
      parentButton.setAttribute(
        'aria-label',
        `${t.parent}: ${parent.key} ${parent.title}`,
      );
      const label = el('span', '', 'parent-label');
      label.append(el('span', parent.key, 'parent-key'));
      if (parent.issueTypeName)
        label.append(issueTypeBadge({ name: parent.issueTypeName }));
      parentButton.append(
        label,
        el('span', parent.title || parent.key, 'parent-title'),
      );
      container.append(parentButton);
      app.append(container);
    } else if (!busy) app.append(el('p', t.noParent, 'muted parent-empty'));
    const meta = el('div', '', 'issue-meta');
    meta.append(
      el('span', selected.key, 'issue-key'),
      issueTypeBadge(selected.issueType),
      statusBadge(selected),
    );
    app.append(meta, el('h1', selected.title, 'issue-title'));
    const properties = el('div', '', 'properties');
    const dl = el('dl');
    const owner = el('dd');
    owner.append(assigneeView(selected));
    dl.append(el('dt', t.assignee), owner);
    const reporter = el('dd');
    reporter.append(
      profileView(
        selected.reporter?.name,
        selected.reporter?.avatarUrl,
        'reporter',
        t.unknownReporter,
      ),
    );
    dl.append(el('dt', t.reporter), reporter);
    for (const [label, value] of [
      [t.priority, selected.priority || '—'],
      [t.project, selected.project],
    ])
      dl.append(el('dt', label), el('dd', value));
    if (Number.isFinite(Date.parse(selected.updatedAt)))
      dl.append(
        el('dt', t.updated),
        el('dd', new Date(selected.updatedAt).toLocaleString(uiLocale)),
      );
    properties.append(dl);
    app.append(properties);
    if (busy) app.append(el('p', t.loadingDetail, 'muted'));
    else if (error) {
      app.append(
        el('p', error, 'error'),
        button(t.retry, () => loadIssue(selected!, true)),
      );
    } else {
      const childSection = el('section', '', 'child-issues');
      childSection.id = 'child-issues';
      renderChildren(childSection);
      app.append(childSection);
      app.append(
        el('h2', t.description, 'description-label'),
        description(selected),
      );
      if (selected.descriptionTruncated)
        app.append(el('p', t.truncated, 'muted'));
      const footer = el('footer', '', 'footer');
      if (selected.url) footer.append(link(t.fullIssue, selected.url));
      app.append(footer);
    }
  } else if (busy) app.append(el('p', t.loading, 'muted'));
  else if (error) app.append(el('p', error, 'error'));
  else if (!siteId)
    app.append(
      el('p', t.noConnection, 'empty'),
      el('p', t.connectHint, 'muted'),
    );
  else {
    const toolbar = el('div', '', 'list-toolbar');
    const searchField = el('label', '', 'field compact-field compact-search');
    searchField.append(el('span', t.search));
    const input = el('input');
    input.type = 'search';
    input.placeholder = t.searchHint;
    input.setAttribute('aria-label', t.search);
    input.value = query;
    searchField.append(input);
    toolbar.append(searchField);
    const results = el('div');
    input.addEventListener('input', () => {
      query = input.value;
      renderList(results);
    });
    const choices = (values: string[], label: string) => [
      { value: '', label: `${label}: ${t.any}` },
      ...[...new Set(values)]
        .filter(Boolean)
        .sort()
        .map((value) => ({ value, label: `${label}: ${value}` })),
    ];
    const filters = el('div', '', 'filters');
    filters.append(
      selectField(
        t.project,
        project,
        choices(
          page.tasks.map((task) => task.project),
          t.project,
        ),
        (value) => {
          project = value;
          renderList(results);
        },
      ),
      selectField(
        t.status,
        status,
        choices(
          page.tasks.map((task) => task.status),
          t.status,
        ),
        (value) => {
          status = value;
          renderList(results);
        },
      ),
    );
    filters
      .querySelectorAll('.field')
      .forEach((field) => field.classList.add('compact-field'));
    toolbar.append(filters);
    app.append(toolbar, results);
    renderList(results);
  }
}
async function load(connect = false): Promise<void> {
  navigationHistory.length = 0;
  listScrollY = 0;
  pending?.abort();
  const request = new AbortController();
  pending = request;
  busy = true;
  error = '';
  selected = null;
  render();
  try {
    if (connect) {
      connection = await bridge.plugin.request('jira.connection', undefined, {
        signal: request.signal,
      });
      if (request.signal.aborted) return;
      if (!connection.sites.some((site) => site.id === siteId))
        siteId = connection.selectedSiteId ?? '';
    }
    const nextPage = siteId
      ? await bridge.plugin.request(
          'jira.list',
          { siteId, filter },
          { signal: request.signal },
        )
      : { tasks: [], limitReached: false };
    if (!request.signal.aborted) {
      page = nextPage;
      if (project && !page.tasks.some((task) => task.project === project))
        project = '';
      if (status && !page.tasks.some((task) => task.status === status))
        status = '';
      busy = false;
      render();
    }
  } catch (e) {
    if (!request.signal.aborted) {
      busy = false;
      error = e instanceof Error ? e.message : String(e);
      render();
    }
  }
}
async function loadIssue(
  task: JiraTask,
  preserveFilters = false,
): Promise<void> {
  pending?.abort();
  const request = new AbortController();
  pending = request;
  if (!preserveFilters) {
    if (selected && selected.key !== task.key) {
      navigationHistory.push({
        task: selected,
        children,
        busy,
        error,
        childrenBusy,
        childrenError,
        query: childQuery,
        statuses: [...childStatuses],
        assignees: [...childAssignees],
        scrollY: window.scrollY,
        childScrollY:
          document.querySelector<HTMLElement>('.children-list')?.scrollTop ?? 0,
        options: childOptions,
        appliedCriteria: appliedChildCriteria,
      });
      if (navigationHistory.length > 30) navigationHistory.shift();
    } else if (!selected) listScrollY = window.scrollY;
  }
  selected = task;
  if (!preserveFilters) {
    childQuery = '';
    childStatuses.clear();
    childAssignees.clear();
    childOptions = { statuses: [], assignees: [], limited: false };
    appliedChildCriteria = '';
  }
  children = { tasks: [], limitReached: false };
  childrenBusy = true;
  childrenError = '';
  busy = true;
  error = '';
  render();
  if (!preserveFilters) window.scrollTo(0, 0);
  void loadChildren(task.key, request.signal, true);
  try {
    const detail = await bridge.plugin.request(
      'jira.issue',
      { siteId, key: task.key },
      { signal: request.signal },
    );
    if (!request.signal.aborted) {
      selected = detail;
      busy = false;
      render();
    }
  } catch (e) {
    if (!request.signal.aborted) {
      busy = false;
      error = e instanceof Error ? e.message : String(e);
      render();
    }
  }
}
for (const eventName of ['pointerdown', 'focusin'])
  document.addEventListener(eventName, (event) => {
    if (!(event.target instanceof Node)) return;
    for (const picker of document.querySelectorAll<HTMLDetailsElement>(
      '.status-picker[open]',
    )) {
      if (!picker.contains(event.target)) picker.open = false;
    }
  });
window.addEventListener('pagehide', () => pending?.abort());
void load(true);
