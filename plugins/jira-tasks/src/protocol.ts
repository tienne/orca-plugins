export type TaskFilter = 'assigned' | 'reported' | 'all' | 'done';
export interface JiraSite {
  id: string;
  siteUrl: string;
  email: string;
}
export interface Connection {
  sites: JiraSite[];
  selectedSiteId: string | null;
}
export interface JiraTask {
  key: string;
  title: string;
  url: string;
  project: string;
  status: string;
  category: string;
  issueType?: { name: string; subtask: boolean };
  assignee: string;
  assigneeId?: string;
  assigneeAvatarUrl?: string;
  reporter?: { name: string; avatarUrl: string };
  priority: string;
  updatedAt: string;
  description: string;
  descriptionTruncated: boolean;
  images?: { alt: string; src: string }[];
  parent?: { key: string; title: string; issueTypeName: string } | null;
}
export interface TaskPage {
  tasks: JiraTask[];
  limitReached: boolean;
}
export interface ChildQueryInput {
  siteId: string;
  key: string;
  search?: string;
  statuses?: string[];
  assignees?: string[];
  includeOptions?: boolean;
}
export interface ChildOptions {
  statuses: string[];
  assignees: { value: string; label: string }[];
  limited: boolean;
}
export interface ChildPage extends TaskPage {
  options?: ChildOptions;
}
declare module 'orca' {
  interface PluginRequests {
    'jira.avatar': { input: { url: string }; output: string | null };
    'jira.connection': { input: undefined; output: Connection };
    'jira.list': {
      input: { siteId: string; filter: TaskFilter };
      output: TaskPage;
    };
    'jira.children': {
      input: ChildQueryInput;
      output: ChildPage;
    };
    'jira.issue': { input: { siteId: string; key: string }; output: JiraTask };
  }
}
