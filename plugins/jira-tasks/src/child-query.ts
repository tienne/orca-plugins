import type { ChildQueryInput, ChildOptions, JiraTask } from './protocol';
export function quoteJql(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}
function values(value: unknown, max: number): string[] {
  if (value === undefined) return [];
  if (
    !Array.isArray(value) ||
    value.length > max ||
    value.some(
      (item) =>
        typeof item !== 'string' ||
        !item ||
        item.length > 200 ||
        /[\x00-\x1f]/.test(item),
    )
  )
    throw new Error('Invalid child issue query.');
  return [...new Set(value as string[])];
}
export function childJql(input: ChildQueryInput): string {
  const clauses = [`parent = ${quoteJql(input.key)}`];
  const search = input.search ?? '';
  if (
    typeof search !== 'string' ||
    search.length > 200 ||
    /[\x00-\x1f]/.test(search)
  )
    throw new Error('Invalid child search.');
  if (search.trim()) {
    const term = search.trim();
    if (/^[a-z][a-z0-9_]*-\d+$/i.test(term))
      clauses.push(`key = ${quoteJql(term.toUpperCase())}`);
    else {
      const words = term
        .replace(/[+\-&|!(){}[\]^"~*?:\\/]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      if (!words) throw new Error('Enter an issue key or title words.');
      clauses.push(
        `summary ~ ${quoteJql(words + (/^[\p{L}\p{N}']+$/u.test(words.split(' ').at(-1)!) ? '*' : ''))}`,
      );
    }
  }
  const statuses = values(input.statuses, 100);
  if (statuses.length)
    clauses.push(`status IN (${statuses.map(quoteJql).join(', ')})`);
  const assignees = values(input.assignees, 100);
  const assigned = assignees
    .filter((value) => value !== 'unassigned')
    .map((value) => {
      if (!value.startsWith('id:'))
        throw new Error('The selected assignee has no Jira account ID.');
      return value.slice(3);
    });
  if (assigned.some((value) => !value)) throw new Error('Invalid assignee.');
  const assigneeClauses: string[] = [];
  if (assigned.length)
    assigneeClauses.push(`assignee IN (${assigned.map(quoteJql).join(', ')})`);
  if (assignees.includes('unassigned'))
    assigneeClauses.push('assignee IS EMPTY');
  if (assigneeClauses.length) clauses.push(`(${assigneeClauses.join(' OR ')})`);
  return `${clauses.join(' AND ')} ORDER BY key ASC`;
}
export function optionAccumulator() {
  const statuses = new Set<string>();
  const assignees = new Map<string, string>();
  return {
    add(tasks: JiraTask[]) {
      for (const task of tasks) {
        if (task.status) statuses.add(task.status);
        if (task.assigneeId)
          assignees.set(`id:${task.assigneeId}`, task.assignee);
        else if (!task.assignee) assignees.set('unassigned', '');
      }
    },
    unseenJql(key: string): string {
      const accounts = [...assignees.keys()]
        .filter((value) => value.startsWith('id:'))
        .map((value) => value.slice(3));
      const unknown = [
        accounts.length
          ? `assignee NOT IN (${accounts.map(quoteJql).join(', ')})`
          : 'assignee IS NOT EMPTY',
      ];
      if (!assignees.has('unassigned')) unknown.push('assignee IS EMPTY');
      if (statuses.size)
        unknown.push(
          `status NOT IN (${[...statuses].map(quoteJql).join(', ')})`,
        );
      return `parent = ${quoteJql(key)} AND (${unknown.join(' OR ')}) ORDER BY key ASC`;
    },
    result(limited: boolean): ChildOptions {
      return {
        statuses: [...statuses],
        assignees: [...assignees].map(([value, label]) => ({ value, label })),
        limited,
      };
    },
  };
}
