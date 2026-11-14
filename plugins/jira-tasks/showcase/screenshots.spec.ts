import { test, expect, type Browser, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { task, connection } from '../src/fixtures';

const assets = resolve('plugins/jira-tasks/assets');
const mark = `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m8 22 24-13 24 13-24 13L8 22Z"/><path d="m8 33 24 13 24-13M8 44l24 13 24-13"/></svg>`;

async function panel(
  browser: Browser,
  theme: 'light' | 'dark',
  locale: 'en' | 'ko',
  detail: boolean,
) {
  const page = await browser.newPage({
    viewport: { width: detail ? 610 : 460, height: 740 },
    deviceScaleFactor: 1,
  });
  await page.addInitScript(
    ({ task, connection, theme, locale }) => {
      const children = [
        {
          ...task,
          key: 'DEMO-102',
          title: 'Keep the selected time when going back',
          issueType: { name: 'Task' },
          status: 'In progress',
          assignee: 'Alex',
          description: '',
        },
        {
          ...task,
          key: 'DEMO-103',
          title: 'Verify checkout on mobile',
          issueType: { name: 'Bug' },
          status: 'In QA',
          assignee: 'Jordan',
          description: '',
        },
        {
          ...task,
          key: 'DEMO-104',
          title: 'Update confirmation copy',
          issueType: { name: 'Task' },
          status: 'Done',
          category: 'done',
          assignee: 'Casey',
          description: '',
        },
      ];
      const issue = {
        ...task,
        parent: {
          key: 'DEMO-10',
          title: 'A smoother booking journey',
          issueTypeName: 'Epic',
        },
        description:
          '## Summary\n\nMake checkout feel clear and predictable, from choosing a time to confirming a booking.\n\n## Acceptance criteria\n\n- Keep the selected time when navigating back.\n- Explain unavailable times with an inline message.',
      };
      (window as unknown as { orca: unknown }).orca = {
        locale: locale === 'ko' ? 'ko-KR' : 'en-US',
        plugin: {
          request: async (name: string) => {
            if (name === 'jira.connection') return connection;
            if (name === 'jira.avatar') return null;
            if (name === 'jira.list')
              return {
                tasks: [
                  task,
                  ...children,
                  {
                    ...task,
                    key: 'DEMO-105',
                    title: 'Review booking analytics',
                    issueType: { name: 'Story' },
                    status: 'To do',
                    assignee: 'Sam',
                  },
                ],
                limitReached: false,
              };
            if (name === 'jira.issue') return issue;
            if (name === 'jira.children')
              return {
                tasks: children,
                limitReached: false,
                options: {
                  statuses: ['In progress', 'In QA', 'Done'],
                  assignees: [{ value: 'id:demo', label: 'Alex' }],
                  limited: false,
                },
              };
            throw new Error(`Unexpected showcase request: ${name}`);
          },
        },
      };
      document.addEventListener('DOMContentLoaded', () => {
        const dark = theme === 'dark';
        document.documentElement.classList.add(theme);
        const colors = {
          background: dark ? '#181818' : '#ffffff',
          foreground: dark ? '#eeeeee' : '#202020',
          card: dark ? '#202020' : '#f8f8f8',
          border: dark ? '#383838' : '#dddddd',
          muted: dark ? '#252525' : '#eeeeee',
          primary: dark ? '#91b9ff' : '#2864cc',
          'muted-foreground': dark ? '#a0a0a0' : '#666666',
          accent: dark ? '#292929' : '#f2f2f2',
          'accent-foreground': dark ? '#eeeeee' : '#202020',
        };
        for (const [key, value] of Object.entries(colors))
          document.documentElement.style.setProperty(`--orca-${key}`, value);
      });
    },
    { task, connection, theme, locale },
  );
  await page.goto('http://127.0.0.1:43281');
  await expect(page.locator('.task-list .task-row')).toHaveCount(5);
  if (detail) {
    await page.getByRole('button', { name: task.title, exact: true }).click();
    await expect(page.locator('.children-list .child-row')).toHaveCount(3);
  }
  return page;
}

async function capture(page: Page) {
  return (await page.screenshot({ type: 'png' })).toString('base64');
}

test('captures public DEMO previews and bilingual introduction artwork', async ({
  browser,
}) => {
  test.setTimeout(90000);
  await mkdir(assets, { recursive: true });
  const cover = await browser.newPage({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 1,
  });
  for (const theme of ['dark', 'light'] as const) {
    const list = await panel(browser, theme, 'en', false);
    const detail = await panel(browser, theme, 'en', true);
    const dark = theme === 'dark';
    await cover.setContent(
      `<html><style>*{box-sizing:border-box}body{margin:0;padding:48px 72px;background:${dark ? '#101212' : '#edf1ef'};color:${dark ? '#ecf4ef' : '#17251e'};font-family:-apple-system,BlinkMacSystemFont,sans-serif}header{display:flex;align-items:center;justify-content:space-between;margin-bottom:30px}h1{font-size:32px;margin:0 0 8px;letter-spacing:-1px}p{margin:0;color:${dark ? '#a2b1aa' : '#586b60'};font-size:17px}.demo{font-size:13px;letter-spacing:2px;border:1px solid #738478;padding:9px 14px;border-radius:30px}.panels{display:flex;gap:32px;justify-content:center}.panel{border:1px solid ${dark ? '#414943' : '#c5cfc9'};border-radius:14px;overflow:hidden;box-shadow:0 16px 42px #0002;background:${dark ? '#181818' : '#fff'}}.label{font-size:12px;letter-spacing:2px;padding:12px 22px;border-bottom:1px solid ${dark ? '#414943' : '#c5cfc9'}}img{display:block;height:740px}footer{margin-top:22px;text-align:center;font-size:13px;color:${dark ? '#a2b1aa' : '#586b60'}}</style><header><div><h1>Jira, within reach.</h1><p>Your issue list and ticket details, in the Orca sidebar.</p></div><span class="demo">DEMO · ${theme.toUpperCase()}</span></header><div class="panels"><div class="panel"><div class="label">01 / ISSUE LIST</div><img src="data:image/png;base64,${await capture(list)}"></div><div class="panel"><div class="label">02 / TICKET DETAILS</div><img src="data:image/png;base64,${await capture(detail)}"></div></div><footer>Browser fixture · Sample issues and people · No private Jira data · Orca theme variables</footer></html>`,
    );
    await cover.screenshot({
      path: resolve(assets, `jira-tasks-${theme}.png`),
    });
    if (dark) {
      for (const locale of ['en', 'ko'] as const) {
        const ko = locale === 'ko';
        const localized = detail;
        await cover.setContent(
          `<html lang="${locale}"><style>*{box-sizing:border-box}body{margin:0;background:#0e1412;color:#eaf3ed;font-family:-apple-system,BlinkMacSystemFont,sans-serif;overflow:hidden}.wrap{display:grid;grid-template-columns:690px 1fr;height:1000px;padding:76px 80px;gap:42px}.brand{display:flex;align-items:center;gap:15px;font-size:24px;font-weight:600;letter-spacing:-.5px}.mark{width:66px;height:66px;padding:14px;border:1px solid #557061;border-radius:18px;color:#a3d7b6;background:#1c3025}svg{width:100%;height:100%}.eyebrow{margin:78px 0 24px;font-size:13px;letter-spacing:3px;color:#9fc5ac}h1{font-size:${ko ? 64 : 74}px;line-height:1.13;letter-spacing:-3px;font-weight:580;margin:0 0 30px}h1 span{color:#a3d7b6}.intro{font-size:21px;line-height:1.7;color:#a9b9af;margin:0;max-width:570px}.features{margin:40px 0 44px;display:grid;gap:15px;font-size:17px;color:#d8e5dd}.features div:before{content:'↳';color:#a3d7b6;margin-right:13px}.shortcut{display:inline-flex;align-items:center;gap:16px;font-size:15px;color:#a9b9af}kbd{font:inherit;color:#eaf3ed;border:1px solid #52675a;border-radius:8px;padding:10px 16px;background:#1c2821}.preview{width:610px;justify-self:end;align-self:center;border:1px solid #46564b;border-radius:18px;overflow:hidden;box-shadow:0 30px 90px #0007;transform:rotate(1.5deg)}.bar{padding:15px 20px;background:#202a24;display:flex;justify-content:space-between;font-size:12px;color:#b3c5b9}.bar span{letter-spacing:2px;color:#a3d7b6}.preview img{width:610px;display:block}.note{position:absolute;bottom:30px;left:80px;font-size:12px;color:#81988a}</style><div class="wrap"><section><div class="brand"><div class="mark">${mark}</div>Jira Tasks</div><div class="eyebrow">BUILT FOR THE ORCA SIDEBAR</div><h1>${ko ? 'Jira 티켓도,<br><span>작업 흐름 곁에.</span>' : 'Keep Jira<br><span>within reach.</span>'}</h1><p class="intro">${ko ? '목록부터 상세, 상위·하위 티켓까지.<br>Orca 안에서 업무의 맥락을 이어가세요.' : 'From the issue list to every child ticket.<br>Stay close to your work, right inside Orca.'}</p><div class="features"><div>${ko ? '상태·담당자로 하위 티켓 조회' : 'Query children by status and assignee'}</div><div>${ko ? '설명·첨부 이미지·담당자 정보 확인' : 'Read descriptions, images and ownership'}</div><div>${ko ? '연결된 Jira 계정과 Orca 테마 그대로' : 'Your connected Jira account. Your Orca theme.'}</div></div><div class="shortcut"><kbd>⌘ J</kbd>${ko ? '필요할 때 바로 열기' : 'One shortcut away'}</div></section><div class="preview"><div class="bar">JIRA TASKS <span>DEMO</span></div><img src="data:image/png;base64,${await capture(localized)}"></div></div><div class="note">${ko ? '브라우저 데모 · 가상 티켓과 인물 · 실제 업무 데이터 미포함' : 'Browser demo · Sample issues and people · No private Jira data'}</div></html>`,
        );
        await cover.screenshot({
          path: resolve(
            assets,
            `jira-tasks-introduction${ko ? '.ko' : ''}.png`,
          ),
        });
      }
    }
    await list.close();
    await detail.close();
  }
  await cover.setViewportSize({ width: 256, height: 256 });
  await cover.setContent(
    `<style>body{margin:0;width:256px;height:256px;display:grid;place-items:center;background:#17271e;color:#a3d7b6}svg{width:168px;height:168px}</style>${mark}`,
  );
  await cover.screenshot({ path: resolve(assets, 'jira-tasks-icon.png') });
  await cover.close();
});
