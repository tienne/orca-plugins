import type { Connection, JiraTask, TaskPage } from './protocol';
export const connection: Connection = {
  sites: [
    {
      id: 'demo-site',
      siteUrl: 'https://demo.atlassian.net',
      email: 'demo@example.com',
    },
  ],
  selectedSiteId: 'demo-site',
};
export const task: JiraTask = {
  key: 'DEMO-101',
  title: 'Improve the checkout experience',
  url: 'https://demo.atlassian.net/browse/DEMO-101',
  project: 'DEMO',
  status: 'In progress',
  category: 'indeterminate',
  issueType: { name: 'Story', subtask: false },
  assignee: 'Alex',
  reporter: {
    name: 'Casey',
    avatarUrl:
      'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/demo-reporter/48',
  },
  assigneeAvatarUrl:
    'https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/demo/48',
  priority: 'High',
  updatedAt: '2026-11-14T00:00:00Z',
  description:
    '## Summary\n\nReview the checkout flow with the product team.\n\n## Acceptance criteria\n\n- Keep the selected time when navigating back.\n- Show an inline message when a time is unavailable.\n\n### Design reference\n\n[Open the design](https://example.com/design)\n\n> 🖼 checkout-flow.png',
  descriptionTruncated: false,
};
export const page: TaskPage = {
  tasks: [
    task,
    {
      ...task,
      key: 'DEMO-102',
      title: 'Fix reservation search',
      assignee: '',
      project: 'BOOK',
      status: 'To do',
      category: 'new',
    },
  ],
  limitReached: false,
};
