// plugins/jira-tasks/src/strings.ts
var en = {
  refresh: "Refresh",
  site: "Jira site",
  scope: "Show",
  assigned: "Assigned to me",
  reported: "Reported by me",
  all: "All issues",
  done: "Completed",
  search: "Search loaded issues",
  searchHint: "Key or title",
  project: "Project",
  issueType: "Issue type",
  parent: "Parent issue",
  children: "Child issues",
  childSearch: "Search child issues",
  childStatus: "Child issue status",
  childAssignee: "Child issue assignee",
  clearFilters: "Reset query",
  runQuery: "Search",
  childSearchHint: "Full issue key or title words",
  queryChanged: "Press Search to apply these conditions across all child issues.",
  queryApplied: "Queried in Jira using these conditions.",
  childOptionsLimited: "Some query choices could not be discovered. Use an issue key or title to narrow the query.",
  noMatchingChildren: "No child issues match this query.",
  noChildren: "No child issues",
  loadingChildren: "Loading child issues\u2026",
  childrenError: "Could not load child issues",
  childrenLimit: "Showing up to 100 matching issues. Narrow the conditions to see other matches.",
  noParent: "No parent issue",
  status: "Status",
  any: "All",
  loading: "Loading Jira tasks\u2026",
  noConnection: "Connect Jira in Orca",
  connectHint: "Add your Jira account in Orca Tasks, then refresh this panel.",
  empty: "No matching issues",
  emptyHint: "Try another filter or refresh the list.",
  error: "Could not load Jira",
  detailError: "Could not load issue details",
  back: "Back",
  toList: "Issue list",
  assignee: "Assignee",
  reporter: "Reporter",
  unknownReporter: "Not available",
  unassigned: "Unassigned",
  priority: "Priority",
  updated: "Updated",
  open: "Open in Jira",
  noDescription: "No description.",
  truncated: "The description is shortened. Open Jira for the full issue.",
  limit: "Up to 100 issues \xB7 Search and filters apply to this list.",
  issues: "issues",
  retry: "Retry",
  loadingDetail: "Loading issue\u2026",
  description: "Description",
  enlargeImage: "Enlarge image",
  imageUnavailable: "Image unavailable. Open the attachment in Jira.",
  close: "Close",
  attachmentHint: "Images and attachments are available in Jira.",
  fullIssue: "View full issue and attachments"
};
var ko = {
  refresh: "\uC0C8\uB85C\uACE0\uCE68",
  site: "Jira \uC0AC\uC774\uD2B8",
  scope: "\uC870\uD68C \uBC94\uC704",
  assigned: "\uB0B4 \uB2F4\uB2F9",
  reported: "\uB0B4\uAC00 \uB4F1\uB85D",
  all: "\uC804\uCCB4 \uD2F0\uCF13",
  done: "\uC644\uB8CC",
  search: "\uBD88\uB7EC\uC628 \uD2F0\uCF13 \uAC80\uC0C9",
  searchHint: "\uD2F0\uCF13 \uBC88\uD638 \uB610\uB294 \uC81C\uBAA9",
  project: "\uD504\uB85C\uC81D\uD2B8",
  issueType: "\uD2F0\uCF13 \uC720\uD615",
  parent: "\uC0C1\uC704 \uD56D\uBAA9",
  children: "\uD558\uC704 \uD56D\uBAA9",
  childSearch: "\uD558\uC704 \uD2F0\uCF13 \uAC80\uC0C9",
  childStatus: "\uD558\uC704 \uD2F0\uCF13 \uC0C1\uD0DC",
  childAssignee: "\uD558\uC704 \uD2F0\uCF13 \uB2F4\uB2F9\uC790",
  clearFilters: "\uC870\uAC74 \uCD08\uAE30\uD654",
  runQuery: "\uC870\uD68C",
  childSearchHint: "\uC804\uCCB4 \uD2F0\uCF13 \uBC88\uD638 \uB610\uB294 \uC81C\uBAA9 \uB2E8\uC5B4",
  queryChanged: "\uC870\uD68C \uBC84\uD2BC\uC744 \uB204\uB974\uBA74 \uC804\uCCB4 \uD558\uC704 \uD2F0\uCF13\uC5D0\uC11C \uC870\uAC74\uC744 \uC801\uC6A9\uD569\uB2C8\uB2E4.",
  queryApplied: "Jira\uC5D0 \uC870\uAC74\uC744 \uC801\uC6A9\uD574 \uC870\uD68C\uD55C \uACB0\uACFC\uC785\uB2C8\uB2E4.",
  childOptionsLimited: "\uC120\uD0DD \uD56D\uBAA9\uC744 \uC77C\uBD80\uB9CC \uBD88\uB7EC\uC654\uC2B5\uB2C8\uB2E4. \uD2F0\uCF13 \uBC88\uD638\xB7\uC81C\uBAA9\uC73C\uB85C\uB3C4 \uC870\uD68C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  noMatchingChildren: "\uC870\uD68C \uC870\uAC74\uC5D0 \uB9DE\uB294 \uD558\uC704 \uD2F0\uCF13\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  noChildren: "\uD558\uC704 \uD56D\uBAA9\uC774 \uC5C6\uC2B5\uB2C8\uB2E4",
  loadingChildren: "\uD558\uC704 \uD56D\uBAA9\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026",
  childrenError: "\uD558\uC704 \uD56D\uBAA9\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4",
  childrenLimit: "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uACB0\uACFC\uB97C \uCD5C\uB300 100\uAC1C \uD45C\uC2DC\uD569\uB2C8\uB2E4. \uC870\uAC74\uC744 \uB354 \uC881\uD788\uBA74 \uB2E4\uB978 \uACB0\uACFC\uB3C4 \uC870\uD68C\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  noParent: "\uC0C1\uC704 \uD56D\uBAA9 \uC5C6\uC74C",
  status: "\uC0C1\uD0DC",
  any: "\uC804\uCCB4",
  loading: "Jira \uC791\uC5C5\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026",
  noConnection: "Orca\uC5D0\uC11C Jira\uB97C \uC5F0\uACB0\uD574 \uC8FC\uC138\uC694",
  connectHint: "Orca \uC791\uC5C5 \uD654\uBA74\uC5D0\uC11C Jira \uACC4\uC815\uC744 \uC5F0\uACB0\uD55C \uB4A4 \uC0C8\uB85C\uACE0\uCE68\uD574 \uC8FC\uC138\uC694.",
  empty: "\uC870\uAC74\uC5D0 \uB9DE\uB294 \uD2F0\uCF13\uC774 \uC5C6\uC2B5\uB2C8\uB2E4",
  emptyHint: "\uD544\uD130\uB97C \uBC14\uAFB8\uAC70\uB098 \uBAA9\uB85D\uC744 \uC0C8\uB85C\uACE0\uCE68\uD574 \uBCF4\uC138\uC694.",
  error: "Jira \uC791\uC5C5\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4",
  detailError: "\uD2F0\uCF13 \uC0C1\uC138\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4",
  back: "\uB4A4\uB85C\uAC00\uAE30",
  toList: "\uBAA9\uB85D\uC73C\uB85C",
  assignee: "\uB2F4\uB2F9\uC790",
  reporter: "\uBCF4\uACE0\uC790",
  unknownReporter: "\uC815\uBCF4 \uC5C6\uC74C",
  unassigned: "\uBBF8\uC9C0\uC815",
  priority: "\uC6B0\uC120\uC21C\uC704",
  updated: "\uC218\uC815",
  open: "Jira\uC5D0\uC11C \uC5F4\uAE30",
  noDescription: "\uC124\uBA85\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  truncated: "\uC124\uBA85\uC744 \uC77C\uBD80\uB9CC \uD45C\uC2DC\uD588\uC2B5\uB2C8\uB2E4. \uC804\uCCB4 \uB0B4\uC6A9\uC740 Jira\uC5D0\uC11C \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
  limit: "\uCD5C\uB300 100\uAC1C \xB7 \uAC80\uC0C9\xB7\uD544\uD130\uB294 \uBD88\uB7EC\uC628 \uBAA9\uB85D\uC5D0 \uC801\uC6A9",
  issues: "\uAC1C",
  retry: "\uB2E4\uC2DC \uC2DC\uB3C4",
  loadingDetail: "\uD2F0\uCF13\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026",
  description: "\uC0C1\uC138 \uB0B4\uC6A9",
  enlargeImage: "\uC774\uBBF8\uC9C0 \uD655\uB300",
  imageUnavailable: "\uC774\uBBF8\uC9C0\uB97C \uD45C\uC2DC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. Jira\uC5D0\uC11C \uD655\uC778\uD574 \uC8FC\uC138\uC694.",
  close: "\uB2EB\uAE30",
  attachmentHint: "\uC774\uBBF8\uC9C0\uC640 \uCCA8\uBD80 \uD30C\uC77C\uC740 Jira\uC5D0\uC11C \uD655\uC778\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  fullIssue: "\uC804\uCCB4 \uB0B4\uC6A9\uACFC \uCCA8\uBD80 \uD30C\uC77C \uBCF4\uAE30"
};

// plugins/jira-tasks/src/status-tone.ts
function statusTone(status2) {
  const name = status2.trim().toUpperCase().replace(/[\s_-]+/g, " ");
  const colors = {
    "IN PROGRESS": { hue: 255, chroma: 0.14 },
    "\uC9C4\uD589 \uC911": { hue: 255, chroma: 0.14 },
    "IN QA": { hue: 300, chroma: 0.14 },
    QA: { hue: 300, chroma: 0.14 },
    "\uD14C\uC2A4\uD2B8 \uC911": { hue: 300, chroma: 0.14 },
    PR: { hue: 205, chroma: 0.12 },
    "IN REVIEW": { hue: 205, chroma: 0.12 },
    "\uB9AC\uBDF0 \uC911": { hue: 205, chroma: 0.12 },
    HOLD: { hue: 75, chroma: 0.13 },
    "ON HOLD": { hue: 75, chroma: 0.13 },
    \uBCF4\uB958: { hue: 75, chroma: 0.13 },
    BLOCKED: { hue: 25, chroma: 0.15 },
    \uCC28\uB2E8: { hue: 25, chroma: 0.15 },
    DONE: { hue: 150, chroma: 0.13 },
    COMPLETED: { hue: 150, chroma: 0.13 },
    \uC644\uB8CC: { hue: 150, chroma: 0.13 },
    RESOLVED: { hue: 175, chroma: 0.12 },
    BACKLOG: { hue: 225, chroma: 0.055 },
    "TO DO": { hue: 260, chroma: 0.015 },
    TODO: { hue: 260, chroma: 0.015 },
    CANCELLED: { hue: 30, chroma: 0.055 },
    CANCELED: { hue: 30, chroma: 0.055 },
    \uCDE8\uC18C: { hue: 30, chroma: 0.055 }
  };
  if (Object.hasOwn(colors, name)) return colors[name];
  let hash = 0;
  for (const character of name)
    hash = Math.imul(hash, 31) + character.codePointAt(0) | 0;
  return { hue: Math.abs(hash) % 360, chroma: 0.11 };
}

// plugins/jira-tasks/src/issue-type.ts
function issueTypeTone(type) {
  const name = type.name.trim().toLowerCase();
  if (/bug|버그|결함/.test(name)) return { hue: 25, symbol: "!" };
  if (/epic|에픽/.test(name)) return { hue: 300, symbol: "\u25C6" };
  if (/story|스토리/.test(name)) return { hue: 150, symbol: "\u25C7" };
  if (type.subtask || /sub[ -]?task|하위\s*(작업|항목)/.test(name))
    return { hue: 205, symbol: "\u21B3" };
  if (/task|작업/.test(name)) return { hue: 255, symbol: "\u2713" };
  let hash = 0;
  for (const character of name)
    hash = Math.imul(hash, 31) + character.codePointAt(0) | 0;
  return { hue: Math.abs(hash) % 360, symbol: "\u25C7" };
}

// plugins/jira-tasks/src/frame.ts
var bridge = window.orca;
var uiLocale = /^ko(?:-|$)/i.test(bridge.locale) ? "ko-KR" : "en-US";
var t = uiLocale === "ko-KR" ? ko : en;
document.documentElement.lang = uiLocale;
var app = document.querySelector("#app");
var connection = { sites: [], selectedSiteId: null };
var siteId = "";
var filter = "assigned";
var page = { tasks: [], limitReached: false };
var selected = null;
var busy = true;
var error = "";
var query = "";
var project = "";
var status = "";
var pending;
var children = { tasks: [], limitReached: false };
var childrenBusy = false;
var childrenError = "";
var childQuery = "";
var childStatuses = /* @__PURE__ */ new Set();
var childAssignees = /* @__PURE__ */ new Set();
var childOptions = {
  statuses: [],
  assignees: [],
  limited: false
};
var appliedChildCriteria = "";
var childPending;
var childOptionsLoaded = false;
var navigationVersion = 0;
var navigationHistory = [];
var listScrollY = 0;
function goToList() {
  const version = ++navigationVersion;
  pending?.abort();
  navigationHistory.length = 0;
  selected = null;
  busy = false;
  error = "";
  render();
  requestAnimationFrame(() => {
    if (version === navigationVersion && !selected)
      window.scrollTo(0, listScrollY);
  });
}
function goBack() {
  const previous = navigationHistory.pop();
  if (!previous) {
    goToList();
    return;
  }
  ++navigationVersion;
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
  childOptionsLoaded = previous.optionsLoaded;
  appliedChildCriteria = previous.appliedCriteria;
  render();
  const reload = previous.busy ? loadIssue(previous.task, true) : previous.childrenBusy ? loadChildren(previous.task.key, pending.signal) : void 0;
  const request = pending;
  const version = navigationVersion;
  const restoreScroll = () => requestAnimationFrame(() => {
    if (request.signal.aborted || version !== navigationVersion || pending !== request || selected?.key !== previous.task.key)
      return;
    window.scrollTo(0, previous.scrollY);
    const list = document.querySelector(".children-list");
    if (list) list.scrollTop = previous.childScrollY;
  });
  restoreScroll();
  if (reload) void reload.then(restoreScroll);
}
function el(tag, text = "", className = "") {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function issueTypeBadge(type) {
  if (!type?.name) return el("span");
  const badge = el("span", "", "issue-type-badge");
  const tone = issueTypeTone(type);
  badge.style.setProperty("--type-hue", String(tone.hue));
  badge.title = `${t.issueType}: ${type.name}`;
  badge.setAttribute("aria-label", badge.title);
  const symbol = el("span", tone.symbol, "issue-type-symbol");
  symbol.setAttribute("aria-hidden", "true");
  badge.append(symbol, el("span", type.name, "issue-type-name"));
  return badge;
}
function statusBadge(task) {
  const category = task.category === "done" ? "done" : task.category === "indeterminate" ? "progress" : "todo";
  const badge = el("span", task.status, "badge status-badge");
  badge.dataset.category = category;
  const tone = statusTone(task.status);
  badge.style.setProperty("--status-hue", String(tone.hue));
  badge.style.setProperty("--status-chroma", String(tone.chroma));
  return badge;
}
var avatarRequests = /* @__PURE__ */ new Map();
var observedAvatars = /* @__PURE__ */ new Set();
function clearDetachedAvatars() {
  for (const avatar of observedAvatars)
    if (!avatar.isConnected) {
      avatarObserver.unobserve(avatar);
      observedAvatars.delete(avatar);
    }
}
var avatarObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const avatar = entry.target;
    avatarObserver.unobserve(avatar);
    observedAvatars.delete(avatar);
    const url = avatar.dataset.url;
    if (!url) continue;
    let result = avatarRequests.get(url);
    if (!result) {
      if (avatarRequests.size >= 100)
        avatarRequests.delete(avatarRequests.keys().next().value);
      result = bridge.plugin.request("jira.avatar", { url }, { timeoutMs: 8e3 }).catch(() => null);
      avatarRequests.set(url, result);
    }
    void result.then((src) => {
      if (!src || !/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(src) || !avatar.isConnected)
        return;
      const img = el("img");
      img.alt = "";
      img.addEventListener("load", () => {
        if (avatar.isConnected) avatar.replaceChildren(img);
      });
      img.src = src;
    });
  }
});
function profileView(value, imageUrl, role, fallback) {
  const person = el("span", "", `${role}-person`);
  const name = value || fallback;
  person.title = name;
  const avatar = el(
    "span",
    value ? Array.from(value.split(/[\s(]/)[0]).slice(0, 2).join("") : "\u2014",
    `${role}-avatar`
  );
  avatar.setAttribute("aria-hidden", "true");
  avatar.title = name;
  if (value && imageUrl) {
    avatar.dataset.url = imageUrl;
    avatarObserver.observe(avatar);
    observedAvatars.add(avatar);
  }
  person.append(avatar, el("span", name, `${role}-name`));
  return person;
}
function assigneeView(task) {
  return profileView(
    task.assignee,
    task.assigneeAvatarUrl,
    "assignee",
    t.unassigned
  );
}
function assigneeKey(task) {
  return task.assigneeId ? `id:${task.assigneeId}` : task.assignee ? `name:${task.assignee}` : "unassigned";
}
function multiSelect(label, options, selection, onChange) {
  const field = el("div", "", "field");
  field.append(el("span", label));
  const picker = el("details", "", "status-picker");
  picker.setAttribute("name", "child-filters");
  const summary = el("summary");
  summary.setAttribute("aria-label", label);
  const choices = el("div", "", "status-options");
  const refresh = () => {
    summary.textContent = selection.size ? options.filter((option) => selection.has(option.value)).map((option) => option.label).join(", ") : t.any;
    summary.title = summary.textContent;
    choices.querySelectorAll("input").forEach((checkbox) => {
      checkbox.checked = selection.has(checkbox.value);
    });
  };
  for (const option of options) {
    const row = el("label", "", "status-option");
    const checkbox = el("input");
    checkbox.type = "checkbox";
    checkbox.value = option.value;
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selection.add(option.value);
      else selection.delete(option.value);
      refresh();
      onChange();
    });
    row.append(checkbox, el("span", option.label));
    choices.append(row);
  }
  picker.append(summary, choices);
  field.append(picker);
  refresh();
  return { field, refresh };
}
function button(text, action, className = "") {
  const node = el("button", text, className);
  node.type = "button";
  node.addEventListener("click", () => {
    void action();
  });
  return node;
}
function safeLink(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}
function link(label, url) {
  if (!safeLink(url)) return el("span", label);
  const node = el("a", label);
  node.href = url;
  node.addEventListener("click", (event) => {
    event.preventDefault();
    void bridge.host.call("shell.openExternal", { url });
  });
  return node;
}
function inline(node, text) {
  const pattern = /\[([^\]]+)\]\((https:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    node.append(
      document.createTextNode(
        text.slice(cursor, match.index).replace(/\\([\[\]])/g, "$1")
      )
    );
    node.append(
      match[1] ? link(match[1], match[2]) : el(match[3] ? "strong" : "code", match[3] || match[4])
    );
    cursor = match.index + match[0].length;
  }
  node.append(
    document.createTextNode(text.slice(cursor).replace(/\\([\[\]])/g, "$1"))
  );
}
function imageFigure(image) {
  const figure = el("figure");
  const preview = button(
    "",
    () => {
      const dialog = el("dialog");
      const bar = el("div", "", "topbar");
      bar.append(
        el("span", image.alt, "muted"),
        button(t.close, () => dialog.close())
      );
      const full = el("img");
      full.src = image.src;
      full.alt = image.alt;
      dialog.append(bar, full);
      dialog.addEventListener("close", () => dialog.remove());
      document.body.append(dialog);
      dialog.showModal();
    },
    "image-button"
  );
  preview.setAttribute("aria-label", `${t.enlargeImage}: ${image.alt}`);
  const img = el("img");
  img.src = image.src;
  img.alt = image.alt;
  img.loading = "lazy";
  img.addEventListener("error", () => {
    preview.replaceChildren(el("span", t.imageUnavailable));
    preview.disabled = true;
  });
  preview.append(img);
  figure.append(preview, el("figcaption", `${image.alt} \xB7 ${t.enlargeImage}`));
  return figure;
}
function description(task) {
  const root = el("div", "", "description");
  let section = el("section");
  root.append(section);
  let paragraph = [];
  const lists = [];
  const flush = () => {
    if (paragraph.length) {
      const p = el("p");
      inline(p, paragraph.join("\n"));
      section.append(p);
      paragraph = [];
    }
  };
  for (const raw of task.description.split("\n")) {
    const line = raw.trim();
    const normalized = line.replace(/^\*\*|\*\*$/g, "").replace(/\\([\[\]])/g, "$1");
    const heading = normalized.match(/^\[([^\]]{1,70})\]$/) || normalized.match(/^#{1,3}\s+(.+)$/);
    const image = line.match(/^\[\[image:(\d+)\]\]$/);
    const item = raw.match(/^(\s*)(?:([-*])|(\d+)\.)\s+(.+)$/);
    if (heading) {
      flush();
      lists.length = 0;
      if (section.childNodes.length) {
        section = el("section");
        root.append(section);
      }
      section.append(el("h2", heading[1]));
    } else if (image) {
      flush();
      lists.length = 0;
      const attachment = task.images?.[Number(image[1])];
      if (attachment && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(
        attachment.src
      ))
        section.append(imageFigure(attachment));
    } else if (item) {
      flush();
      const indent = item[1].length;
      while (lists.length && lists.at(-1).indent > indent) lists.pop();
      const ordered = Boolean(item[3]);
      if (!lists.length || lists.at(-1).indent < indent || lists.at(-1).list.tagName !== (ordered ? "OL" : "UL")) {
        if (lists.at(-1)?.indent === indent) lists.pop();
        const list = ordered ? el("ol") : el("ul");
        if (ordered) list.start = Number(item[3]);
        (lists.at(-1)?.item ?? section).append(list);
        lists.push({ indent, list, item: el("li") });
      }
      const li = el("li");
      inline(li, item[4]);
      lists.at(-1).list.append(li);
      lists.at(-1).item = li;
    } else if (!line) {
      flush();
    } else if (line.startsWith("> ")) {
      flush();
      lists.length = 0;
      const quote = el("blockquote");
      inline(quote, line.slice(2));
      section.append(quote);
    } else {
      lists.length = 0;
      paragraph.push(raw);
    }
  }
  flush();
  if (!task.description) section.append(el("p", t.noDescription, "muted"));
  return root;
}
function selectField(label, value, options, action) {
  const field = el("label", "", "field");
  field.append(el("span", label));
  const control = el("select");
  control.setAttribute("aria-label", label);
  options.forEach((item) => {
    const option = el("option", item.label);
    option.value = item.value;
    control.append(option);
  });
  control.value = value;
  control.disabled = busy;
  control.addEventListener("change", () => action(control.value));
  field.append(control);
  return field;
}
function renderList(container) {
  container.replaceChildren();
  clearDetachedAvatars();
  const tasks = page.tasks.filter(
    (task) => (!project || task.project === project) && (!status || task.status === status) && `${task.key} ${task.title}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  );
  container.append(
    el("div", `${tasks.length} / ${page.tasks.length} ${t.issues}`, "muted")
  );
  if (page.limitReached) container.append(el("p", t.limit, "muted"));
  if (!tasks.length) {
    container.append(el("p", t.empty, "empty"));
    return;
  }
  const list = el("div", "", "task-list");
  list.setAttribute("role", "list");
  for (const task of tasks) {
    const row = button("", () => loadIssue(task), "task-row");
    row.setAttribute("aria-label", task.title);
    const meta = el("span", "", "task-meta");
    const owner = assigneeView(task);
    owner.classList.add("list-assignee");
    meta.append(
      el("span", task.key, "meta"),
      issueTypeBadge(task.issueType),
      statusBadge(task),
      owner
    );
    row.append(el("span", task.title, "title"), meta);
    list.append(row);
  }
  container.append(list);
}
function childCriteria() {
  return {
    search: childQuery.trim(),
    statuses: [...childStatuses].sort(),
    assignees: [...childAssignees].sort()
  };
}
function renderChildren(container) {
  const announcement = container.querySelector(".children-announcement") ?? el("p", "", "muted children-announcement");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", "polite");
  announcement.setAttribute("aria-atomic", "true");
  for (const child of [...container.children])
    if (child !== announcement) child.remove();
  if (!announcement.isConnected) container.append(announcement);
  announcement.textContent = childrenBusy ? t.loadingChildren : childrenError ? t.childrenError : `${children.tasks.length}${children.limitReached ? "+" : ""} ${t.issues}`;
  clearDetachedAvatars();
  const heading = el("div", "", "children-heading");
  heading.append(el("h2", t.children));
  if (!childrenBusy && !childrenError)
    heading.append(
      el(
        "span",
        `${children.tasks.length}${children.limitReached ? "+" : ""}`,
        "badge"
      )
    );
  container.append(heading);
  const submit = () => {
    if (selected && pending) return loadChildren(selected.key, pending.signal);
  };
  const controls = el("div", "", "children-controls");
  const searchField = el("label", "", "field child-search-field");
  searchField.append(el("span", t.childSearch));
  const input = el("input");
  input.type = "search";
  input.id = "child-search";
  input.maxLength = 200;
  input.value = childQuery;
  input.placeholder = t.childSearchHint;
  input.setAttribute("aria-label", t.childSearch);
  searchField.append(input);
  const hint = el("p", "", "muted child-query-hint");
  const apply = button(t.runQuery, submit, "child-query-button");
  apply.id = "child-apply";
  const reset = button(
    t.clearFilters,
    () => {
      childQuery = "";
      childStatuses.clear();
      childAssignees.clear();
      return submit();
    },
    "ghost child-filter-reset"
  );
  reset.id = "child-reset";
  const updateDraft = () => {
    const dirty = JSON.stringify(childCriteria()) !== appliedChildCriteria;
    hint.textContent = dirty ? t.queryChanged : t.queryApplied;
    reset.hidden = !childQuery && !childStatuses.size && !childAssignees.size && (!appliedChildCriteria || appliedChildCriteria === JSON.stringify({ search: "", statuses: [], assignees: [] }));
  };
  const statuses = [
    .../* @__PURE__ */ new Set([
      ...childOptions.statuses,
      ...children.tasks.map((task) => task.status),
      ...childStatuses
    ])
  ].filter(Boolean).sort();
  const statusPicker = multiSelect(
    t.childStatus,
    statuses.map((value) => ({ value, label: value })),
    childStatuses,
    updateDraft
  );
  const assignees = new Map(
    childOptions.assignees.map((option) => [
      option.value,
      option.label || t.unassigned
    ])
  );
  for (const task of children.tasks)
    if (task.assigneeId || !task.assignee)
      assignees.set(assigneeKey(task), task.assignee || t.unassigned);
  const assigneePicker = multiSelect(
    t.childAssignee,
    [...assignees].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, uiLocale)),
    childAssignees,
    updateDraft
  );
  for (const [id, field] of [
    ["child-status", statusPicker.field],
    ["child-assignee", assigneePicker.field]
  ]) {
    field.querySelector("details").id = `${id}-picker`;
    field.querySelector("summary").id = `${id}-summary`;
    for (const checkbox of field.querySelectorAll("input"))
      checkbox.id = `${id}-${encodeURIComponent(checkbox.value)}`;
  }
  input.addEventListener("input", () => {
    childQuery = input.value;
    updateDraft();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.isComposing) {
      event.preventDefault();
      void submit();
    }
  });
  controls.append(searchField, statusPicker.field, assigneePicker.field);
  heading.append(reset, apply);
  container.append(controls, hint);
  updateDraft();
  if (childOptions.limited)
    container.append(el("p", t.childOptionsLimited, "muted"));
  if (childrenBusy) return;
  if (childrenError) {
    container.append(
      el("p", t.childrenError, "error"),
      button(t.retry, submit)
    );
    return;
  }
  if (!children.tasks.length)
    container.append(el("p", t.noMatchingChildren, "muted"));
  else {
    const list = el("div", "", "children-list");
    list.setAttribute("role", "list");
    for (const task of children.tasks) {
      const row = button("", () => loadIssue(task), "child-row");
      row.setAttribute("aria-label", `${task.key} ${task.title}`);
      const meta = el("span", "", "task-meta");
      meta.append(
        el("span", task.key, "parent-key"),
        issueTypeBadge(task.issueType),
        statusBadge(task)
      );
      const owner = el("span", "", "child-assignee");
      owner.append(el("span", t.assignee, "muted"), assigneeView(task));
      row.append(meta, el("span", task.title, "child-title"), owner);
      list.append(row);
    }
    container.append(list);
  }
  if (children.limitReached)
    container.append(el("p", t.childrenLimit, "muted"));
}
async function loadChildren(key, signal, includeOptions = !childOptionsLoaded) {
  childPending?.abort();
  const request = new AbortController();
  childPending = request;
  const requestSignal = AbortSignal.any([signal, request.signal]);
  const criteria = childCriteria();
  childrenBusy = true;
  childrenError = "";
  const update = () => {
    if (requestSignal.aborted || selected?.key !== key) return;
    const container = document.querySelector("#child-issues");
    if (container) {
      const focused = document.activeElement;
      const focusId = focused instanceof HTMLElement && container.contains(focused) ? focused.id : "";
      const selection = focused instanceof HTMLInputElement && focused.selectionStart !== null ? [
        focused.selectionStart,
        focused.selectionEnd,
        focused.selectionDirection ?? void 0
      ] : void 0;
      const pickers = [
        ...container.querySelectorAll("details[id]")
      ].map((picker) => ({
        id: picker.id,
        open: picker.open,
        scrollTop: picker.querySelector(".status-options")?.scrollTop ?? 0
      }));
      renderChildren(container);
      for (const picker of pickers) {
        const restored = document.getElementById(picker.id);
        if (restored instanceof HTMLDetailsElement) {
          restored.open = picker.open;
          const options = restored.querySelector(".status-options");
          if (options) options.scrollTop = picker.scrollTop;
        }
      }
      const control = focusId ? document.getElementById(focusId) : null;
      control?.focus({ preventScroll: true });
      if (control instanceof HTMLInputElement && selection)
        control.setSelectionRange(...selection);
    }
  };
  update();
  try {
    const result = await bridge.plugin.request(
      "jira.children",
      { siteId, key, ...criteria, includeOptions },
      { signal: requestSignal, timeoutMs: 12e4 }
    );
    if (requestSignal.aborted || selected?.key !== key) return;
    children = result;
    appliedChildCriteria = JSON.stringify(criteria);
    if (result.options) {
      childOptionsLoaded = true;
      const people = new Map(
        [...childOptions.assignees, ...result.options.assignees].map(
          (option) => [option.value, option.label]
        )
      );
      childOptions = {
        statuses: [
          .../* @__PURE__ */ new Set([...childOptions.statuses, ...result.options.statuses])
        ],
        assignees: [...people].map(([value, label]) => ({ value, label })),
        limited: result.options.limited
      };
    }
    childrenBusy = false;
    update();
  } catch {
    if (requestSignal.aborted || selected?.key !== key) return;
    childrenBusy = false;
    childrenError = t.childrenError;
    update();
  }
}
function render() {
  app.replaceChildren();
  clearDetachedAvatars();
  const bar = el("header", "", "topbar");
  if (selected) {
    const navigation = el("div", "", "detail-navigation");
    navigation.append(
      button(`\u2039 ${t.back}`, goBack, "ghost"),
      button(t.toList, goToList, "ghost list-navigation")
    );
    bar.append(navigation);
    const actions = el("div", "", "detail-actions");
    const refresh = button(
      "\u21BB",
      () => {
        if (selected) return loadIssue(selected, true);
      },
      "ghost"
    );
    refresh.disabled = busy;
    refresh.setAttribute("aria-label", t.refresh);
    refresh.title = t.refresh;
    refresh.classList.add("refresh-icon");
    actions.append(refresh);
    if (selected.url) actions.append(link(`${t.open} \u2197`, selected.url));
    bar.append(actions);
  } else {
    bar.classList.add("list-topbar");
    bar.append(el("h1", "Jira Tasks"));
    const refresh = button("\u21BB", () => load(true), "ghost");
    refresh.disabled = busy;
    refresh.setAttribute("aria-label", t.refresh);
    refresh.title = t.refresh;
    refresh.classList.add("refresh-icon");
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
            label: `${site.siteUrl.replace(/^https:\/\//, "")} \xB7 ${site.email}`
          })),
          (value) => {
            siteId = value;
            query = project = status = "";
            void load();
          }
        )
      );
    const scopes = el("div", "", "scope-options");
    scopes.setAttribute("role", "group");
    scopes.setAttribute("aria-label", t.scope);
    for (const value of [
      "assigned",
      "reported",
      "all",
      "done"
    ]) {
      const scope = button(
        t[value],
        () => {
          filter = value;
          void load();
        },
        "scope-option"
      );
      scope.setAttribute("aria-pressed", String(filter === value));
      scope.disabled = busy;
      scopes.append(scope);
    }
    app.append(scopes);
  }
  if (selected) {
    if (selected.parent) {
      const parent = selected.parent;
      const container = el("div", "", "parent-issue");
      container.append(el("div", t.parent, "muted"));
      const parentButton = button(
        "",
        () => loadIssue({
          key: parent.key,
          title: parent.title || parent.key,
          url: "",
          project: "",
          status: "",
          category: "",
          assignee: "",
          priority: "",
          updatedAt: "",
          description: "",
          descriptionTruncated: false
        }),
        "parent-link"
      );
      parentButton.setAttribute(
        "aria-label",
        `${t.parent}: ${parent.key} ${parent.title}`
      );
      const label = el("span", "", "parent-label");
      label.append(el("span", parent.key, "parent-key"));
      if (parent.issueTypeName)
        label.append(issueTypeBadge({ name: parent.issueTypeName }));
      parentButton.append(
        label,
        el("span", parent.title || parent.key, "parent-title")
      );
      container.append(parentButton);
      app.append(container);
    } else if (!busy) app.append(el("p", t.noParent, "muted parent-empty"));
    const meta = el("div", "", "issue-meta");
    meta.append(
      el("span", selected.key, "issue-key"),
      issueTypeBadge(selected.issueType),
      statusBadge(selected)
    );
    app.append(meta, el("h1", selected.title, "issue-title"));
    const properties = el("div", "", "properties");
    const dl = el("dl");
    const owner = el("dd");
    owner.append(assigneeView(selected));
    dl.append(el("dt", t.assignee), owner);
    const reporter = el("dd");
    reporter.append(
      profileView(
        selected.reporter?.name,
        selected.reporter?.avatarUrl,
        "reporter",
        t.unknownReporter
      )
    );
    dl.append(el("dt", t.reporter), reporter);
    for (const [label, value] of [
      [t.priority, selected.priority || "\u2014"],
      [t.project, selected.project]
    ])
      dl.append(el("dt", label), el("dd", value));
    if (Number.isFinite(Date.parse(selected.updatedAt)))
      dl.append(
        el("dt", t.updated),
        el("dd", new Date(selected.updatedAt).toLocaleString(uiLocale))
      );
    properties.append(dl);
    app.append(properties);
    if (busy) app.append(el("p", t.loadingDetail, "muted"));
    else if (error) {
      app.append(
        el("p", error, "error"),
        button(t.retry, () => loadIssue(selected, true))
      );
    } else {
      const childSection = el("section", "", "child-issues");
      childSection.id = "child-issues";
      renderChildren(childSection);
      app.append(childSection);
      app.append(
        el("h2", t.description, "description-label"),
        description(selected)
      );
      if (selected.descriptionTruncated)
        app.append(el("p", t.truncated, "muted"));
      const footer = el("footer", "", "footer");
      if (selected.url) footer.append(link(t.fullIssue, selected.url));
      app.append(footer);
    }
  } else if (busy) app.append(el("p", t.loading, "muted"));
  else if (error) app.append(el("p", error, "error"));
  else if (!siteId)
    app.append(
      el("p", t.noConnection, "empty"),
      el("p", t.connectHint, "muted")
    );
  else {
    const toolbar = el("div", "", "list-toolbar");
    const searchField = el("label", "", "field compact-field compact-search");
    searchField.append(el("span", t.search));
    const input = el("input");
    input.type = "search";
    input.placeholder = t.searchHint;
    input.setAttribute("aria-label", t.search);
    input.value = query;
    searchField.append(input);
    toolbar.append(searchField);
    const results = el("div");
    input.addEventListener("input", () => {
      query = input.value;
      renderList(results);
    });
    const choices = (values, label) => [
      { value: "", label: `${label}: ${t.any}` },
      ...[...new Set(values)].filter(Boolean).sort().map((value) => ({ value, label: `${label}: ${value}` }))
    ];
    const filters = el("div", "", "filters");
    filters.append(
      selectField(
        t.project,
        project,
        choices(
          page.tasks.map((task) => task.project),
          t.project
        ),
        (value) => {
          project = value;
          renderList(results);
        }
      ),
      selectField(
        t.status,
        status,
        choices(
          page.tasks.map((task) => task.status),
          t.status
        ),
        (value) => {
          status = value;
          renderList(results);
        }
      )
    );
    filters.querySelectorAll(".field").forEach((field) => field.classList.add("compact-field"));
    toolbar.append(filters);
    app.append(toolbar, results);
    renderList(results);
  }
}
async function load(connect = false) {
  ++navigationVersion;
  navigationHistory.length = 0;
  listScrollY = 0;
  pending?.abort();
  const request = new AbortController();
  pending = request;
  busy = true;
  error = "";
  selected = null;
  render();
  try {
    if (connect) {
      connection = await bridge.plugin.request("jira.connection", void 0, {
        signal: request.signal
      });
      if (request.signal.aborted) return;
      if (!connection.sites.some((site) => site.id === siteId))
        siteId = connection.selectedSiteId ?? "";
    }
    const nextPage = siteId ? await bridge.plugin.request(
      "jira.list",
      { siteId, filter },
      { signal: request.signal }
    ) : { tasks: [], limitReached: false };
    if (!request.signal.aborted) {
      page = nextPage;
      if (project && !page.tasks.some((task) => task.project === project))
        project = "";
      if (status && !page.tasks.some((task) => task.status === status))
        status = "";
      busy = false;
      render();
    }
  } catch {
    if (!request.signal.aborted) {
      busy = false;
      error = t.error;
      render();
    }
  }
}
async function loadIssue(task, preserveFilters = false) {
  ++navigationVersion;
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
        childScrollY: document.querySelector(".children-list")?.scrollTop ?? 0,
        options: childOptions,
        optionsLoaded: childOptionsLoaded,
        appliedCriteria: appliedChildCriteria
      });
      if (navigationHistory.length > 30) navigationHistory.shift();
    } else if (!selected) listScrollY = window.scrollY;
  }
  selected = task;
  if (!preserveFilters) {
    childQuery = "";
    childStatuses.clear();
    childAssignees.clear();
    childOptions = { statuses: [], assignees: [], limited: false };
    childOptionsLoaded = false;
    appliedChildCriteria = "";
  }
  children = { tasks: [], limitReached: false };
  childrenBusy = true;
  childrenError = "";
  busy = true;
  error = "";
  render();
  if (!preserveFilters) window.scrollTo(0, 0);
  void loadChildren(task.key, request.signal, true);
  try {
    const detail = await bridge.plugin.request(
      "jira.issue",
      { siteId, key: task.key },
      { signal: request.signal }
    );
    if (!request.signal.aborted) {
      selected = detail;
      busy = false;
      render();
    }
  } catch {
    if (!request.signal.aborted) {
      busy = false;
      error = t.detailError;
      render();
    }
  }
}
for (const eventName of ["pointerdown", "focusin"])
  document.addEventListener(eventName, (event) => {
    if (!(event.target instanceof Node)) return;
    for (const picker of document.querySelectorAll(
      ".status-picker[open]"
    )) {
      if (!picker.contains(event.target)) picker.open = false;
    }
  });
window.addEventListener("pagehide", () => pending?.abort());
void load(true);
