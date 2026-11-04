import { randomUUID } from 'node:crypto';
import { lstat, realpath } from 'node:fs/promises';
import { resolve } from 'node:path';
import type {
  OperationInput,
  OperationPlan,
  OperationResult,
} from '../protocol';
import { commitHash, git, repository } from './git';

async function text(root: string, args: string[]) {
  return (await git(root, args)).toString().trim();
}
async function optional(root: string, args: string[]) {
  try {
    return await text(root, args);
  } catch {
    return '';
  }
}
async function exists(path: string) {
  try {
    await lstat(path);
    return true;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw e;
  }
}
async function state(root: string) {
  if ((await repository(root)) !== root)
    throw new Error('저장소 경계가 변경됐습니다. 다시 연결하세요.');
  const directory = await text(root, ['rev-parse', '--absolute-git-dir']);
  for (const entry of [
    'MERGE_HEAD',
    'CHERRY_PICK_HEAD',
    'REVERT_HEAD',
    'rebase-merge',
    'rebase-apply',
    'sequencer',
    'BISECT_LOG',
  ]) {
    if (await exists(resolve(directory, entry)))
      throw new Error(
        `진행 중인 Git 작업(${entry})이 있습니다. 터미널에서 완료하거나 중단한 뒤 새로고침하세요.`,
      );
  }
  const flags = (await git(root, ['ls-files', '-v', '-z']))
    .toString()
    .split('\0');
  if (
    flags.some(
      (entry) =>
        entry && (entry[0] === entry[0].toLowerCase() || entry[0] === 'S'),
    )
  )
    throw new Error(
      'assume-unchanged/skip-worktree 또는 sparse checkout 항목이 있습니다. 이 저장소의 변경 명령은 지원하지 않습니다.',
    );
  const dirty = await git(root, [
    'status',
    '--porcelain=v1',
    '-z',
    '--untracked-files=all',
    '--ignore-submodules=none',
  ]);
  if (dirty.length)
    throw new Error(
      '커밋되지 않은 변경 또는 untracked 파일이 있습니다. 먼저 보관/커밋/정리하세요. 자동 stash나 변경 폐기는 하지 않습니다.',
    );
  const head = await text(root, ['rev-parse', '--verify', 'HEAD']);
  const branch = await optional(root, ['symbolic-ref', '-q', 'HEAD']);
  return { head, branch };
}
async function checkIgnored(root: string, target: string, rebase = false) {
  const commits = (
    await text(root, ['rev-list', '--no-walk', '--parents', target])
  ).split(/\s+/);
  const paths = new Set<string>();
  for (const commit of commits)
    for (const path of (
      await git(root, ['ls-tree', '-r', '--name-only', '-z', commit])
    )
      .toString()
      .split('\0'))
      if (path) paths.add(path);
  if (rebase) {
    const raw = (
      await git(root, [
        'log',
        '--format=',
        '--raw',
        '-z',
        '--no-renames',
        '--no-ext-diff',
        `${target}..HEAD`,
        '--',
      ])
    )
      .toString()
      .split('\0');
    for (let i = 0; i < raw.length; i++)
      if (raw[i].trimStart().startsWith(':') && raw[i + 1]) paths.add(raw[++i]);
  }
  const ignored = (
    await git(root, [
      'ls-files',
      '--others',
      '--ignored',
      '--exclude-standard',
      '--directory',
      '-z',
    ])
  )
    .toString()
    .split('\0')
    .filter(Boolean);
  for (const entry of ignored) {
    const path = entry.replace(/\/$/, '');
    if (
      [...paths].some(
        (tracked) =>
          tracked === path ||
          tracked.startsWith(path + '/') ||
          path.startsWith(tracked + '/'),
      )
    )
      throw new Error(
        `ignored 파일과 대상 경로가 겹칩니다: ${entry}. 먼저 별도로 보관하세요.`,
      );
  }
}
const policies = {
  checkout:
    '선택 커밋으로 이동합니다. 로컬 브랜치를 선택하면 그 브랜치로, 아니면 Detached HEAD로 전환합니다.',
  branch:
    '선택 커밋에 새 로컬 브랜치를 만듭니다. 현재 브랜치는 전환하지 않습니다.',
  merge:
    '선택 커밋을 현재 브랜치로 병합합니다. 가능하면 fast-forward하며, 아니면 merge 커밋을 만듭니다.',
  rebase:
    '현재 브랜치의 커밋들을 선택 커밋 위에 다시 쌓습니다. 커밋 해시가 바뀌며 merge 커밋은 보존하지 않는 일반 rebase입니다. 공유한 이력을 바꿀 수 있습니다.',
  'cherry-pick': '선택 커밋의 변경을 현재 브랜치에 새 커밋으로 적용합니다.',
  revert:
    '선택 커밋의 변경을 취소하는 새 커밋을 현재 브랜치에 만듭니다. 기존 이력은 유지합니다.',
  reset:
    '현재 브랜치의 끝을 선택 커밋으로 옮깁니다. 공유한 브랜치의 이력을 바꿀 수 있습니다.',
};
export function createOperations() {
  const plans = new Map<
    string,
    {
      plan: OperationPlan;
      snapshot: string;
      expires: number;
      branchRef?: string;
    }
  >();
  const locks = new Set<string>();
  async function locked<T>(root: string, run: () => Promise<T>) {
    const common = await realpath(
      resolve(root, await text(root, ['rev-parse', '--git-common-dir'])),
    );
    if (locks.has(common))
      throw new Error('이 저장소에서 다른 Git 변경 명령이 실행 중입니다.');
    locks.add(common);
    try {
      return await run();
    } finally {
      locks.delete(common);
    }
  }
  return {
    async prepare(root: string, input: OperationInput): Promise<OperationPlan> {
      return locked(root, async () => {
        if (!input || !Object.hasOwn(policies, input.action))
          throw new Error('지원하지 않는 Git 명령입니다.');
        const before = await state(root);
        const target = await commitHash(root, input.commit);
        await checkIgnored(root, target, input.action === 'rebase');
        const parents = (
          await text(root, ['show', '-s', '--format=%P', target, '--'])
        )
          .split(' ')
          .filter(Boolean);
        if (
          !before.branch &&
          ['merge', 'rebase', 'cherry-pick', 'revert', 'reset'].includes(
            input.action,
          )
        )
          throw new Error(
            '현재 Detached HEAD입니다. 먼저 로컬 브랜치로 체크아웃하세요.',
          );
        let branchRef: string | undefined;
        if (input.branch !== undefined) {
          if (
            typeof input.branch !== 'string' ||
            !input.branch ||
            input.branch.startsWith('-') ||
            input.branch === 'HEAD' ||
            input.branch.includes('\0')
          )
            throw new Error('유효한 로컬 브랜치 이름이 필요합니다.');
          await git(root, ['check-ref-format', '--branch', input.branch]);
          branchRef = `refs/heads/${input.branch}`;
        }
        let command: string[];
        let summary: string = policies[input.action];
        switch (input.action) {
          case 'checkout':
            if (
              branchRef &&
              (await text(root, ['rev-parse', '--verify', branchRef])) !==
                target
            )
              throw new Error(
                '브랜치가 선택 커밋을 가리키지 않습니다. 새로고침하세요.',
              );
            command = branchRef
              ? ['switch', '--no-overwrite-ignore', '--no-guess', input.branch!]
              : ['switch', '--no-overwrite-ignore', '--detach', target];
            break;
          case 'branch':
            if (!branchRef) throw new Error('새 브랜치 이름을 입력하세요.');
            if (await optional(root, ['show-ref', '--verify', branchRef]))
              throw new Error('이미 존재하는 브랜치입니다.');
            command = ['branch', '--no-track', input.branch!, target];
            break;
          case 'merge':
            command = [
              'merge',
              '--no-edit',
              '--no-gpg-sign',
              '--no-autostash',
              '--no-squash',
              '--commit',
              '--ff',
              target,
            ];
            break;
          case 'rebase':
            command = [
              'rebase',
              '--merge',
              '--no-autostash',
              '--no-gpg-sign',
              '--no-update-refs',
              '--no-rebase-merges',
              '--no-autosquash',
              '--no-fork-point',
              target,
            ];
            break;
          case 'cherry-pick':
          case 'revert': {
            const mainline: string[] = [];
            if (parents.length > 1) {
              if (
                !Number.isInteger(input.mainline) ||
                input.mainline! < 1 ||
                input.mainline! > parents.length
              )
                throw new Error(
                  'merge 커밋의 기준 부모(mainline)를 명시적으로 선택하세요.',
                );
              mainline.push('-m', String(input.mainline));
              summary += ` 부모 ${input.mainline}(${parents[input.mainline! - 1].slice(0, 7)})을 기준으로 합니다.`;
            } else if (input.mainline !== undefined)
              throw new Error('일반 커밋에는 mainline을 지정할 수 없습니다.');
            command = [
              input.action,
              '--no-edit',
              '--no-gpg-sign',
              ...mainline,
              target,
            ];
            break;
          }
          case 'reset':
            if (!['soft', 'mixed', 'hard'].includes(input.resetMode ?? ''))
              throw new Error('reset 모드를 선택하세요.');
            summary +=
              input.resetMode === 'soft'
                ? ' Soft: index와 파일을 유지하며 변경을 staged 상태로 남깁니다.'
                : input.resetMode === 'mixed'
                  ? ' Mixed: index를 갱신하고 파일은 유지해 변경을 unstaged 상태로 남깁니다.'
                  : ' Hard: index와 작업 트리를 선택 커밋 내용으로 바꿉니다. 경로를 막는 untracked 파일이 삭제될 수 있습니다.';
            command = ['reset', `--${input.resetMode}`, target];
            break;
        }
        const plan: OperationPlan = {
          token: randomUUID(),
          root,
          action: input.action,
          head: before.head,
          currentBranch:
            before.branch.replace(/^refs\/heads\//, '') || 'Detached HEAD',
          target,
          command,
          summary,
          confirmation:
            input.action === 'reset' && input.resetMode === 'hard'
              ? target.slice(0, 7)
              : '',
          ...(['reset', 'rebase'].includes(input.action)
            ? {
                backupRef: `refs/git-tools/backups/${Date.now()}-${randomUUID()}`,
              }
            : {}),
        };
        for (const [key, value] of plans)
          if (value.expires < Date.now()) plans.delete(key);
        if (plans.size >= 50) plans.delete(plans.keys().next().value!);
        plans.set(plan.token, {
          plan,
          snapshot: JSON.stringify(before),
          branchRef,
          expires: Date.now() + 300000,
        });
        return plan;
      });
    },
    async execute(
      root: string,
      token: string,
      confirmation: string,
    ): Promise<OperationResult> {
      const saved = plans.get(token);
      if (!saved || saved.plan.root !== root || saved.expires < Date.now())
        throw new Error('확인이 만료됐습니다. 메뉴에서 다시 준비하세요.');
      if (saved.plan.confirmation !== confirmation)
        throw new Error('확인용 커밋 해시가 일치하지 않습니다.');
      // Consume before any await: a token can run at most once, even on failure.
      plans.delete(token);
      return locked(root, async () => {
        const { plan } = saved;
        if (JSON.stringify(await state(root)) !== saved.snapshot)
          throw new Error(
            'HEAD 또는 현재 브랜치가 변경됐습니다. 다시 확인하세요.',
          );
        if (
          saved.branchRef &&
          plan.action === 'checkout' &&
          (await text(root, ['rev-parse', '--verify', saved.branchRef])) !==
            plan.target
        )
          throw new Error('체크아웃할 브랜치가 변경됐습니다. 다시 확인하세요.');
        if (
          saved.branchRef &&
          plan.action === 'branch' &&
          (await optional(root, ['show-ref', '--verify', saved.branchRef]))
        )
          throw new Error('새 브랜치가 이미 만들어졌습니다. 다시 확인하세요.');
        await checkIgnored(root, plan.target, plan.action === 'rebase');
        if (plan.backupRef)
          await git(root, [
            'update-ref',
            plan.backupRef,
            plan.head,
            '0'.repeat(plan.head.length),
          ]);
        let output = '';
        let failed = false;
        try {
          output = (
            await git(
              root,
              [
                '-c',
                'core.hooksPath=/dev/null',
                '-c',
                'commit.gpgSign=false',
                '-c',
                'merge.autoStash=false',
                '-c',
                'rerere.enabled=false',
                '-c',
                'submodule.recurse=false',
                ...(plan.action === 'merge'
                  ? ['-c', `branch.${plan.currentBranch}.mergeOptions=`]
                  : []),
                ...plan.command,
              ],
              120000,
            )
          ).toString();
        } catch (error) {
          failed = true;
          const e = error as {
            stderr?: Buffer;
            stdout?: Buffer;
            message?: string;
          };
          output = [e.stderr?.toString(), e.stdout?.toString(), e.message]
            .filter(Boolean)
            .join('\n');
        }
        const conflicts = (
          await git(root, ['diff', '--name-only', '--diff-filter=U', '-z'])
        )
          .toString()
          .split('\0')
          .filter(Boolean);
        return {
          status: conflicts.length ? 'conflict' : failed ? 'failed' : 'success',
          message:
            (conflicts.length
              ? '충돌이 발생했습니다. 터미널에서 해결 후 계속하거나 해당 Git 작업을 --abort 하세요. 자동 롤백은 하지 않았습니다.\n'
              : failed
                ? '명령이 완료되지 않았습니다. 부분 적용 여부를 확인하고, 터미널에서 진행 중인 작업을 완료/중단하세요.\n'
                : '완료했습니다.\n') + output.slice(0, 12000),
          conflicts,
          ...(plan.backupRef ? { backupRef: plan.backupRef } : {}),
        };
      });
    },
  };
}
