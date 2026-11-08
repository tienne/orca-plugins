# Git Logs 개발 안내

[English](development.md) · 한국어

Git Logs의 호스트 연결 방식, Git 동작, 배포 조건을 정리한 문서입니다. 사용법은 [플러그인 안내](../plugins/git-logs/README.ko.md)를 참고하십시오. 명령은 저장소 루트에서 실행합니다.

이 소스에는 0.2.0용 읽기 전용 기능이 들어 있습니다. 태그 뱃지, 로그 필터, 이력을 나눠 불러오는 무한 스크롤, 두 커밋 비교, 파일 히스토리, 키보드 이동입니다. manifest 버전은 아직 0.1.1이고 0.2.0은 릴리스하지 않았습니다. 이 기능은 `prepare`/`execute`, `operations.ts`, manifest의 capabilities, 최소 Orca 버전, 실행 프로필을 바꾸지 않습니다.

## 빌드와 검증

Node.js 22.12 이상 또는 24 이상, pnpm 10, Git, Orca CLI가 필요합니다.

```sh
pnpm install
pnpm nx run-many -t build typecheck test ui-test -p git-logs
pnpm validate
```

`build`는 React, Monaco, editor worker, SVG 아이콘, Git worker, 의존 라이선스를 `dist/plugins/git-logs`에 묶습니다. 소스 manifest는 패키징된 파일을 가리키므로 Orca 검증은 이 폴더를 대상으로 실행하십시오. 설치한 플러그인이 다른 패키지나 `node_modules` symlink에 의존해서는 안 됩니다.

`test`는 임시 저장소의 Git 작업, 번역, 산출물 규칙을 검사합니다. `ui-test`는 패키징한 UI를 브라우저에서 검증합니다. 영문 DEMO 이미지 생성은 [스크린샷 안내](screenshots/README.ko.md)를 참고하십시오.

결과를 하나만 보려면 대상을 따로 실행하십시오.

```sh
pnpm nx run git-logs:test      # Git/worker, 번역, 산출물 검사
pnpm nx run git-logs:ui-test   # 패키징한 UI와 fixture를 쓰는 브라우저 테스트
pnpm validate                  # 빌드 산출물의 Orca 검증
```

CI가 아닐 때 `ui-test`는 4173 포트에서 이미 실행 중인 서버를 재사용합니다. 오래된 preview 서버가 떠 있으면 예전 빌드를 테스트해 잘못된 결과가 나올 수 있으니 `ui-test` 전에 종료하십시오.

브라우저 테스트는 Google Chrome을 사용합니다. Chromium은 `pnpm exec playwright install chromium` 실행 후 `PW_CHANNEL=chromium`을 설정하십시오. `preview` 주소는 `http://127.0.0.1:4173`이고 소스를 수정하면서 보려면 `pnpm dev`를 사용하십시오. Orca bridge가 없으면 `?fixture=<이름>`으로 데모 상태를 고릅니다. 페이지와 비교 시나리오는 `paged`, `stale`, `many`, `rename`, `unrelated`입니다. `src/ui/fixture.ts`에는 페이지 크기와 로드 상한의 복사본이 따로 있으므로 worker 상수를 바꾸면 함께 고치십시오.

## 코드 구조

| 경로                               | 역할                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------ |
| `plugins/git-logs/src/ui`          | 그래프, 파일 목록, Monaco Diff, 메뉴, 테마, 브라우저 fixture             |
| `plugins/git-logs/src/ui/hooks`    | `main.tsx`에서 분리한 패널 상태: 저장소, 필터, 페이지, 비교, 키보드 이동 |
| `plugins/git-logs/src/worker`      | Git 조회와 변경, 경로 검사, 비교 문서, 호스트 호출                       |
| `plugins/git-logs/src/protocol.ts` | UI/worker 메시지와 사용하는 Orca API의 최소 타입                         |
| `plugins/git-logs/src/i18n`        | 한국어와 영어 문구, 언어 선택, 번역 테스트                               |
| `scripts/build-plugin.mjs`         | 번들 생성과 산출물 검사                                                  |
| `plugins/git-logs/showcase`        | 영문 DEMO 캡처                                                           |

브라우저 UI는 Node, 파일, Git에 직접 접근하지 않습니다. 같은 플러그인의 worker와 `plugin.request`로 통신합니다. Worker는 인자 배열로 Git을 실행하고 저장소 경계, 경로, ref를 검사합니다. 셸 문자열을 이어 붙여 명령을 만들지 마십시오.

## Orca 연결

최소 호스트 버전은 Orca 1.4.248입니다. 공개 문서의 `main`은 더 새로운 기능을 설명할 수 있습니다. API를 추가하기 전에 설치 CLI의 버전별 가이드, 필드의 `Since`, validator를 확인하십시오.

플러그인은 `trusted-worker`, `workspace:read`, `workspace:write`를 선언합니다. Trusted worker는 UI 샌드박스 밖에서 OS 사용자 계정으로 실행됩니다. Workspace 권한이 Node의 전체 파일 접근 범위를 제한하는 것은 아닙니다.

`workspace:read`는 현재 문맥, 작업 공간 목록, 변경 이벤트를 제공합니다. `workspace:write`는 `workspace.open`과 `editor.open`에 사용합니다. 이 권한은 내장 명령 실행도 허용하지만 Git Logs는 해당 명령을 호출하지 않습니다.

`host.has`, API major/minor, 메서드 존재 여부를 검사하십시오. Worker 요청은 API 1.2, 작업 공간 목록과 중앙 편집기 열기는 API 1.3이 필요합니다. `document.session`도 따로 검사합니다. 지원하지 않는 호스트에서는 API를 추정해 호출하지 않고 오류를 표시합니다.

설치본의 타입 생성기는 번들 선언 파일 누락으로 실패했습니다. 그래서 `protocol.ts`에는 구현에서 확인한 API 타입만 관리합니다. Orca를 올릴 때 타입 생성을 다시 확인하십시오.

### 작업 공간 연결

설치본의 `workspace.readContext`는 이름, 브랜치, 터미널 목록만 주고 경로나 ID는 주지 않습니다. 이름과 브랜치를 `workspace.list`와 대조해 로컬 Git worktree 하나로 식별할 수 있을 때만 자동 연결합니다. 설치본의 로컬 `hostId`는 `"local"`이며 이전 형식인 `null`도 허용합니다.

이름과 브랜치가 중복되거나, 로컬/SSH 이름이 겹치거나, 목록이 잘렸다면 사용자가 선택하도록 합니다. 작업 공간 이름으로 경로를 만들거나 worker의 현재 디렉터리를 대체 경로로 쓰지 마십시오. 선택 목록에는 Orca가 관리하는 로컬 Git 작업 공간만 포함합니다. 임의 경로 입력은 없습니다.

`workspace.changed`를 구독하고 이전 요청의 늦은 응답이 새 연결을 덮어쓰지 않게 하십시오. 연결은 worker 메모리에만 보관합니다. Worker가 다시 시작하면 사이드바를 통해 재연결합니다.

### 패널과 중앙 편집기

패널은 `index.html`, custom editor는 `editor.html`을 사용합니다. 호스트가 사이드바에도 `orca.document`를 줄 수 있으므로 별도의 surface 표시로 구분하십시오.

Custom editor는 문서 내용만 받고 파일 경로는 받지 않습니다. Worker는 `.orca/git-logs/<uuid>.orcadiff`에 저장소, 비교 기준, 선택 파일을 기록합니다. 해당 작업 공간을 연 다음 `editor.open`에 작업 공간 내부 상대 경로를 전달합니다.

상위 디렉터리를 검사하고 symlink나 저장소 밖 경로를 거절합니다. 문서는 `wx`, mode `0600`으로 생성하며, 생성 전에 로컬 Git 제외 상태를 확인하되, 확인에 실패해도 경고를 남기고 문서를 생성합니다. 소스 파일, index, 공유 `.gitignore`는 바꾸지 않습니다. 문서는 사용자가 지우거나 워크트리 폴더를 실제로 삭제할 때까지 남습니다.

문서에 경로가 적혀 있어도 해당 저장소 접근을 자동 허용하지 않습니다. 사이드바에서 먼저 연결해야 합니다. 편집기는 작업 공간을 전환해도 문서의 저장소와 비교 기준을 유지합니다. 두 커밋 비교 문서는 더 높은 `version`을 쓰며 'Git 조회와 비교'의 '문서 버전'에서 설명합니다.

중앙 편집기는 데스크톱 앱의 isolated frame을 요구합니다. 일반 파일 클릭을 가로채거나 Orca 내장 Diff를 교체하는 API가 있다고 가정하지 마십시오.

### 로컬 제외 설정

Worker는 `workspace.created`, `workspace.changed`를 구독합니다. 생성 이벤트의 ID를 `workspace.list`로 다시 조회하고 로컬 worktree인지 확인한 뒤 실제 경로를 대조합니다. 작업 공간 전환에서는 현재 context를 다시 읽으며 모호하거나 잘린 목록에서는 임의로 선택하지 않습니다. 이벤트 경로나 SSH 경로만으로 파일에 접근하지 않습니다. 이 백그라운드 검사는 비교 문서의 저장소 접근 권한을 대신하지 않습니다.

사이드바 연결, 비교 로드, Diff 문서 열기 전에도 확인해 기존 작업 공간과 놓친 이벤트를 보완합니다. `--git-common-dir`, `--git-path info/exclude`로 메타데이터 위치를 찾습니다. 기존 바이트와 줄바꿈을 유지하며 정확한 `/.orca/git-logs/` 규칙이 없을 때 한 번 추가합니다. 공유 ignore 규칙이 있어도 로컬 등록은 유지합니다. 연결된 worktree들이 사용하는 동일한 exclude 경로의 갱신은 직렬화합니다.

링크가 하나인 기존의 작은 일반 exclude 파일만 수정합니다. Symlink, hard link, 잘못된 경로, 없는 메타데이터는 거절합니다. 생성 플래그 없이 열고 device/inode를 전후로 비교한 뒤 append합니다. 부모 경로가 교체돼도 외부 파일을 생성하지 않아야 합니다. 읽기 크기를 제한하고 실제 문서가 untracked로 나타나면 경고합니다. 문서를 만들기 직전에 실제 파일명을 검사하며, 대표 파일이나 끝에 slash를 붙인 경로만으로 전체 제외 여부를 판단하지 않습니다.

제외 설정에 실패해도 비교 문서를 생성하고 Diff를 엽니다. 열기 응답의 선택 필드 `setupWarning`을 패널에서 번역해 표시합니다. 문서가 untracked로 남으면 깨끗한 작업 상태를 요구하는 Git 동작이 차단될 수 있습니다. 저장소 접근 권한과 경로 검증은 계속 적용합니다. 공유 ignore의 부정 규칙을 덮어쓰지 않습니다. 규칙은 같은 로컬 저장소의 worktree들이 공유하므로 작업 공간 하나를 닫을 때 삭제하지 않습니다. 추적 중인 문서와 이전 `git-tools` 경로도 바꾸지 않습니다. Worktree별 설정 확장이나 전역 제외 설정은 활성화하지 않습니다.

## Git 조회와 비교

- 부모 관계에 따라 커밋을 200개씩, 최대 5,000개까지 불러옵니다. 커밋 비교는 전체 해시에 고정합니다.
- 브랜치는 별도 목록에서 정식 로컬/원격 ref를 선택합니다. 이력 필터를 바꿔도 체크아웃하지 않습니다. 원격 HEAD 별칭은 빼고 검색 결과는 최대 100개 보여 줍니다.
- 텍스트 검색과 필터는 불러온 행이 아니라 선택한 이력 전체를 대상으로 Git이 실행하며 둘 중 하나라도 켜져 있으면 그래프 선을 숨깁니다. 새로고침은 브랜치 선택을 유지하되 ref가 사라졌으면 초기화합니다. 작업 공간 전환도 필터를 초기화합니다.
- 작업 트리는 HEAD와 디스크의 최종 내용을 비교합니다. `staged`, `unstaged`, `untracked`는 상태이며 별도 비교 모드는 아닙니다. 최종 내용이 HEAD와 같으면 제외합니다.
- 선택 커밋은 기본적으로 첫 번째 부모와 비교합니다. 다른 직접 부모를 선택할 수 있고 최초 커밋은 빈 트리와 비교합니다.
- 작업 트리는 저장된 파일을 읽습니다. 미저장 편집 내용은 제외합니다. 조회 시점이 고정돼 있지 않으므로 HEAD가 바뀌면 새로고침이 필요할 수 있습니다.

텍스트 Diff는 UTF-8 파일당 768 KiB, 변경 파일 2,000개까지 지원합니다. 추가, 삭제, 이름 변경, 빈 파일, 없는 파일을 구분합니다. 바이너리, 비 UTF-8, 큰 파일, symlink, submodule, unmerged 경로는 상태를 표시합니다. 실행 비트만 바뀌면 텍스트 변경이 없을 수 있습니다.

Shallow 저장소는 로컬 이력만 보여 줍니다. Partial clone은 자동 객체 fetch를 피하기 위해 거절합니다. Fetch, SSH 접근, 원격 파일 접근, Git LFS 다운로드는 없습니다.

### 로그 필터와 페이지 (0.2.0, 미공개)

`log` 요청은 `repo`, `all`, `branchRef`, 선택 필드인 `filter`와 `cursor`를 받습니다. 응답에는 기존 필드에 `nextCursor`와 `hasMore`가 추가됩니다. `filter`는 `{ text, author, since, until, path, follow }`이며 모든 필드가 선택입니다. UI는 입력을 300ms 멈춘 뒤 요청하고 형식이 맞는 날짜만 보냅니다.

태그는 같은 `for-each-ref` 호출에서 `refs/tags`를 함께 읽어 커밋 행에 `tag: <이름>` 라벨로 붙입니다. 커밋을 가리키는 태그나, 대상이 커밋인 주석 태그만 대상입니다. 태그는 `branches`에 넣지 않으므로 브랜치 선택창과 아래 커서 스냅샷에서 제외됩니다.

`validateFilter`는 Git을 호출하기 전에 실행하며 다음 규칙을 적용합니다.

- `text`와 `author`는 문자열이어야 하고 앞뒤 공백을 자르며 비어 있으면 무시합니다. 200자를 넘거나 줄바꿈, 캐리지 리턴, NUL이 있으면 거절합니다. 값은 `--grep=<text>`, `--author=<text>` 인자 하나로 만들고 `--fixed-strings`, `--regexp-ignore-case`를 함께 씁니다. `--`로 시작하는 값이 옵션으로 해석되지 않습니다.
- `since`와 `until`은 `YYYY-MM-DD` 형식이어야 하고 `Date`로 왕복 변환해도 같아야 하므로 `2026-02-30`은 거절합니다. 하루 전체를 포함하도록 `--since=<날짜> 00:00:00`, `--until=<날짜> 23:59:59`로 바꿉니다. Git은 committer date에 적용하며 목록에는 author date가 보입니다.
- `path`는 저장소 안의 상대 경로인지 검사하고(절대 경로, `..`, `.git`, NUL은 거절합니다) 4,096자 제한도 적용합니다. `--` 뒤에 두고 `log` 앞에 전역 옵션 `--literal-pathspecs`를 붙여 `:(glob)` 같은 pathspec magic을 해석하지 않습니다.
- `follow`는 boolean이어야 하며 `path`가 있을 때만 의미가 있습니다. `all`과 함께 오면 worker가 거절합니다. `--follow`는 시작 커밋에서 경로가 tree가 아닐 때만 붙입니다. UI는 전체 브랜치 범위에서 요청 전에 `follow`를 빼며 worker 검사는 마지막 방어선입니다.
- 쓸 수 있는 필드가 하나도 없는 필터는 필터 없는 목록을 돌려줍니다.

`text`가 16진수 4~64자이면 worker가 `rev-parse --verify --quiet <text>^{commit}`도 실행합니다. 결과가 입력한 글자로 시작하는 전체 해시일 때만 인정하므로 같은 이름의 브랜치나 태그는 일치하지 않습니다. 해당 커밋이 아직 없으면 첫 페이지 맨 위에 추가하고 이후 페이지에서는 반복하지 않습니다.

페이지는 `protocol.ts`의 상수 `PAGE_SIZE = 200`, `LOAD_LIMIT = 5000`을 씁니다. Worker와 UI, 브라우저 fixture가 같은 값을 쓰도록 이 파일에서 한 번만 선언합니다. Worker는 다음 페이지 유무를 알려고 페이지 크기보다 한 행 더 요청하고 페이지 크기를 `LOAD_LIMIT - skip`으로 제한합니다. `hasMore`는 더 읽을 행이 있고 다음 offset이 상한 미만일 때만 true이며 `nextCursor`도 그때만 있습니다. 상한에서는 `hasMore`가 false이고 UI가 안내를 표시합니다. 일반 페이지는 `--skip`을 씁니다. `follow`에서는 `--skip`이 파일을 바꾸지 않은 커밋까지 세고 건너뛴 구간의 이름 변경을 놓치므로 worker가 처음부터 읽어 앞의 `skip`개 행을 직접 버립니다.

커서는 offset과 스냅샷 해시를 담은 base64url JSON입니다. Worker는 재시작하면 메모리를 잃으므로 상태를 저장하지 않습니다. 스냅샷은 다음 값을 합친 SHA-256입니다. HEAD 해시, `for-each-ref`의 `refs/heads`와 `refs/remotes` 전체 줄, `all` 플래그, `branchRef`, 정규화한 필터(인자, 경로, `follow`)입니다. 전체 브랜치 보기(`all`)에서는 `--all`이 지나가는 태그, stash, notes 같은 다른 ref 줄도 합치므로 태그를 옮기거나 지우면 커서가 무효가 됩니다. 현재 브랜치나 선택한 브랜치 범위에서는 태그를 넣지 않으므로 태그를 추가하거나 옮겨도 커서는 유효합니다. 범위 밖의 브랜치라도 움직이면 무효가 됩니다.

다음 경우는 잘못된 커서 오류입니다. 커서가 512자를 넘을 때, base64url 문자 집합을 벗어날 때, JSON이 아닐 때, offset이 0부터 상한 사이의 정수가 아닐 때입니다. 스냅샷이 다르면 `stale-cursor:`로 시작하는 메시지로 실패하고 UI는 이 오류를 받으면 첫 페이지부터 다시 불러옵니다. UI는 한 번에 페이지 요청 하나만 보내고 이전 필터, 브랜치, 새로고침에 속한 응답은 버립니다.

첫 페이지를 읽는 `log` 요청(필터 변경과 새로고침 포함)은 `cancelKey: 'filter'`를 보냅니다. Worker는 같은 저장소에서 앞서 들어온 `filter` 요청의 Git 실행을 중단하고 새 요청만 처리합니다. 페이지 요청에는 `cancelKey`가 없어서 필터 요청을 취소하지 않습니다.

목록은 커밋 제목만 싣습니다. `commitMessage`는 `repo`와 전체 `commit` 해시를 받아 `git show -s --format=%B`의 결과를 `{ message }`로 돌려줍니다. UI는 커밋을 선택할 때 요청하며 제목을 먼저 보여 줍니다. 요청이 실패하면 제목은 유지하고 오류 안내만 표시하며 앞서 선택했던 커밋의 늦은 응답은 버립니다.

### 두 커밋 비교 (0.2.0, 미공개)

`range` 비교는 `{ kind: 'range', base, target, mergeBase? }`입니다. `base`와 `target`은 전체 커밋 해시여야 하며 줄인 해시나 ref 이름은 다른 비교와 같은 오류로 거절합니다. 기본 왼쪽은 `base`입니다. `mergeBase: true`이면 worker가 `git merge-base base target`을 실행해 그 결과를 왼쪽으로 쓰고 결과가 없으면 공통 조상 없음 오류로 실패합니다. 같은 커밋 검사는 이 대체 뒤에 실행하므로 `mergeBase: true`에서 `target`이 `base`의 조상일 때도 같은 오류가 납니다. 파일 목록은 `git diff --no-ext-diff --no-textconv -M --name-status -z <left> <target> --`로 만듭니다. 응답은 `mergeBase`를 boolean으로 정규화하고 확정한 왼쪽 해시를 `left`, target을 `right`로 돌려줍니다. 파일별 `diff` 요청도 변경 목록을 다시 계산하므로 같은 규칙으로 왼쪽이 정해집니다.

변경 파일 2,000개 제한과 파일당 768 KiB 텍스트 제한은 커밋 비교와 똑같이 range에도 적용합니다. 파일 수가 넘으면 일부만 보여 주지 않고 오류를 돌려줍니다.

기준 커밋은 패널의 UI 상태로만 갖고 있으며 worker나 문서에는 저장하지 않습니다. 진입 경로는 메뉴 항목과 칩뿐이고 브랜치나 태그 이름을 고르는 선택기는 없습니다.

### 문서 버전

`.orcadiff` 문서에는 `version`이 있습니다. Worker는 `range` 비교에는 `2`, 나머지 비교에는 `1`을 기록합니다. Worker와 편집기 모두 1과 2를 받아들이고 `range`가 들어 있는 version 1 문서와 그 밖의 버전은 지원하지 않는 문서 오류로 거절합니다. Git Logs 0.1.1은 version 1만 받으므로 version 2 문서를 열지 못합니다. 0.2.0 이전에 만든 문서는 계속 열립니다.

## Git 변경 작업

Worker는 확인 준비와 토큰 실행을 나눠 처리합니다. 토큰은 5분 동안 한 번만 사용할 수 있습니다. 실행 직전에 HEAD, 브랜치, 저장소 상태, 작업 공간, 체크아웃 대상 ref를 다시 검사합니다. 현재 문맥에서 작업 공간을 하나로 식별할 수 없으면 변경 작업은 거절합니다.

Index나 작업 트리 변경, untracked 파일, assume-unchanged, skip-worktree, sparse checkout, 진행 중인 merge/rebase/cherry-pick/revert/bisect를 거절합니다. Ignored 파일이 대상 경로를 막아도 거절합니다. 자동 stash, 변경 폐기, 다른 worktree의 브랜치를 강제로 가져오는 동작은 넣지 않습니다.

| 작업            | 동작                                                                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| 체크아웃        | 선택 커밋의 로컬 브랜치로 전환하거나 Detached HEAD로 이동                                               |
| 브랜치 생성     | 전환 없이 생성. `/`가 포함된 이름도 지원                                                                |
| 병합            | 가능하면 fast-forward, 아니면 merge 커밋 생성                                                           |
| 리베이스        | 현재 브랜치를 대상 위에 다시 적용. Merge 보존, interactive, squash, 다른 브랜치 ref 자동 갱신은 없음    |
| 체리픽 / 리버트 | Merge 커밋은 mainline 부모 필요. Merge 리버트는 이후 병합에도 영향                                      |
| 리셋            | Soft는 index와 파일 유지. Mixed는 index 갱신, 파일 유지. Hard는 둘 다 교체하며 짧은 대상 해시 입력 필요 |

Reset과 rebase 전에는 HEAD를 `refs/git-logs/backups/<timestamp>-<uuid>`에 보관하고 결과에 표시합니다. 이 참조는 커밋만 보존하며 미커밋 파일을 백업하지 않습니다. 자동 삭제하지 않으니 복구 전에 `git show <backup-ref>`로 확인하십시오. 공유 브랜치의 reset과 rebase는 이력을 바꿀 수 있습니다. Push와 force push UI는 없습니다.

같은 common Git directory의 변경 작업은 직렬화합니다. 터미널이나 다른 앱은 이 잠금에 참여하지 않으므로 전체 저장소 작업이 원자적이라고 보장하지 마십시오. 제한 시간은 120초입니다.

UI 작업은 Git hooks, 커밋 서명, 자동 stash, rerere 적용, submodule 재귀 갱신을 비활성화합니다. 저장소의 filters와 merge driver는 실행될 수 있습니다. 실행 뒤 그래프와 작업 트리를 다시 읽습니다.

충돌이나 실패는 Git 출력과 충돌 파일을 표시합니다. 자동 롤백이나 재시도는 하지 않습니다. 터미널에서 충돌을 해결하고 stage한 뒤 해당 `git merge --continue`, `git rebase --continue`, `git cherry-pick --continue`, `git revert --continue`로 계속하거나 `--abort`로 중단하십시오. 빈 cherry-pick처럼 충돌 파일 없이 멈춘 경우도 실패입니다. 충돌 편집기와 staging UI는 없습니다.

## UI 동작

Monaco는 읽기 전용이며 좁은 화면에서도 좌우 비교를 유지합니다. Worker는 CDN이나 blob이 아닌 번들 상대 경로로 불러옵니다. 호스트의 ResizeObserver 반복 경고를 피하려면 크기 갱신을 `requestAnimationFrame`에 예약하십시오. 테마나 언어를 바꿀 때 모델과 스크롤을 초기화하지 마십시오.

화면, 글자, 선택, 테두리, 포커스, radius에는 문서에 공개된 `--orca-*` 프레임 변수를 사용합니다. Root의 rem 기준은 16px로 유지합니다. 앱 내부의 chart, diff, syntax, 폰트, 밀도 토큰도 프레임에 있다고 가정하지 마십시오. 그래프와 추가 강조색에는 로컬 의미색을 쓰고 삭제에는 공개 destructive 색상을 씁니다. 그래프 색은 로컬 색상과 호스트 foreground를 혼합합니다. 작성자, 날짜, 해시는 서로 다른 글자색으로 구분합니다.

커밋 정보와 파일 영역은 내부 스크롤을 사용하고 가운데 핸들로 높이를 조절합니다. 공간이 충분할 때 기본 높이는 144px/240px이며 작은 창에서는 줄입니다. 포인터와 키보드 조절, Escape 취소, 더블클릭 초기화를 지원합니다. 가능하면 프레임 로컬 저장소에 높이를 저장합니다. 기존 설정을 위해 `git-tools.panes.v1.*` 키를 유지하며 별도의 저장소 권한을 추가하지 않습니다.

### 언어

공개 `window.orca.locale`을 읽습니다. 한국어와 영어 BCP-47 태그를 지원하고 잘못되거나 지원하지 않는 값은 `en-US`로 표시합니다. 날짜와 숫자는 지원하는 지역 태그를 `Intl`에 전달합니다. 커밋 데이터와 원본 Git 출력은 번역하지 않습니다.

전용 언어 변경 이벤트가 없으므로 마운트, 포커스 복귀, 500ms 간격으로 확인합니다. Orca 1.4.248은 연결 시점에만 locale을 줄 수 있어 패널을 다시 열거나 reload해야 할 수 있습니다. 비공개 bridge 메시지나 앱 설정 파일은 읽지 마십시오.

Manifest와 카탈로그의 설명 필드는 언어별로 나뉘지 않으며 문자열 하나만 받습니다. 문서는 영어를 기본으로 작성하고 각 문서에서 별도의 `.ko.md` 한국어 안내로 연결합니다. UI 언어 설정은 문서 언어와 별개입니다.

번역 문구는 `src/i18n/ko.json`과 `en.json`에서 관리합니다. 기존 한국어 소스 문장을 키로 유지합니다. 언어를 추가할 때 선택 로직과 테스트도 확장하십시오. Monaco 내장 문구 일부는 영어입니다.

브라우저에서는 `navigator.language`, `lang` query, 언어 선택창을 사용합니다. `sample=en`은 Orca bridge가 없을 때만 영문 샘플을 선택합니다. 실제 호스트 데이터에는 어떤 재정의 옵션도 적용하지 않습니다.

## 검증 기록

2026-11-04에 로컬 Git 2.41.0으로 검증했습니다. 검증 범위는 build/typecheck, Git/worker 27개, 번역 5개, 산출물 2개, 브라우저 UI 21개, 스크린샷 시나리오 2개였습니다. 빌드와 manifest 검증을 통과했고 라이트, 다크, 좁은 화면을 확인했습니다.

임시 Git 저장소에서 최초 및 merge 커밋, 현재/전체 브랜치, 200개 제한, 메시지 전문, 특수 파일명, 이름 변경, 삭제, staged/unstaged 조합, 상쇄 변경, staged 삭제 후 재생성, 바이너리/큰 파일/비 UTF-8, symlink, 충돌, 경계 검사, worker 메시지를 확인합니다. 변경 작업은 각 명령, 백업, 만료된 확인, 중복 실행, 다른 worktree 사용, 현재 작업 공간 경계, 숨겨진 index 플래그, ignored 파일 충돌을 검사합니다.

2026-11-05에는 로컬 제외 설정의 임시 저장소 테스트 14개를 추가해 Git·번역·패키징 검사가 48개가 됐습니다. 경고가 번역되고 그래프를 유지하는 경우를 포함해 브라우저 검사는 22개입니다. 이벤트 전달은 fixture 호스트로 검사했으며 새 구독의 실제 호스트 전달은 아직 확인하지 않았습니다.

이름 변경 전에 승인한 개발 플러그인으로 macOS의 Orca 1.4.248에서 저장소 연결, 작업 공간 선택, 중앙 탭, `document.session`, Monaco 렌더를 확인했습니다. 다크/라이트 캡처에 프레임 오류나 로컬 에셋 CSP 차단이 없었습니다. 실제 사용자 저장소에서는 메뉴와 확인창만 열고 변경 명령을 실행하지 않았습니다. 2026-11-05에는 새 이름인 `local.git-logs` 개발 빌드를 승인하고 로드했습니다. Active 핸들러가 현재 로컬 작업 공간을 찾았고, 비교 문서 두 개를 각각 중앙 탭으로 열었습니다. 실제 창 캡처에서 선택한 protocol 파일의 Monaco 좌우 정렬, 줄 내부 강조, 변경 없는 영역 접기를 확인했습니다. 생성 문서는 `git check-ignore`를 통과했고 추적 파일의 변경은 없었습니다. 플러그인 로그와 `plugin check`에도 오류가 없었습니다. 편집기 중복 등록을 피하려고 이전 `local.git-tools`를 비활성화했습니다. 네이티브 접근성 조회는 권한이 허용된 것으로 표시돼도 실패해 실제 우클릭 조작은 다시 확인하지 못했습니다. 다른 OS, 호스트 버전, 원격 호스트는 검증하지 않았습니다.

2026-11-08에는 0.2.0 읽기 전용 기능을 임시 저장소의 Git worker 테스트와 fixture를 쓰는 브라우저 테스트로 확인했습니다. Worker 테스트는 태그 라벨, 필터 검증과 글자 그대로의 일치, 날짜 범위, 경로와 `follow` 처리, 200개 단위 페이지와 커서 검증 및 stale 커서, 전체 브랜치 보기에서 태그가 움직였을 때의 커서 무효화, 필터 요청 취소, 해시 접두사 행, `commitMessage`, merge-base 옵션 유무에 따른 range 비교, 같은 커밋과 공통 조상 없음 오류, 파일 수 초과, 문서 버전을 다룹니다. 브라우저 테스트는 태그 뱃지, 필터 칩과 숨겨진 그래프, 무한 스크롤과 5,000개 안내, stale 커서 재로드, 비교 기준 메뉴와 칩, merge-base 토글, 편집기 진입점의 version 2 문서, 이름 변경 추적을 포함한 파일 히스토리 메뉴, 방향키 이동을 다룹니다. 방향키 이동 테스트에는 메뉴나 선택창, 입력란에 포커스가 있을 때 이동하지 않는 경우와 방향키를 누르고 있어도 멈춘 커밋만 요청하는 경우도 들어 있습니다. 개수는 테스트 구성에 따라 바뀌므로 숫자로 적지 않았습니다. 현재 결과는 위 대상을 실행해 확인하십시오.

개발 중 임시 저장소에서 필터와 페이지 요청이 응답하기까지 0.04~0.6초 걸렸습니다. 2026-11-08에는 커밋이 약 12,600개인 로컬 프로젝트 저장소(비공개)에서 worker의 `log`를 직접 호출해 한 번씩 쟀습니다. 첫 페이지는 0.26초, 작성자와 텍스트, 경로 필터는 0.13~0.19초, 전체 브랜치 보기에 작성자 필터를 건 경우는 0.19초였습니다. offset 0과 2,400, 4,800의 일반 페이지는 모두 0.13초였습니다. 이력이 가장 긴 파일(커밋 약 300개)의 `follow`는 offset 200에서 0.98초였습니다. 이력이 이보다 긴 파일이 없어 `follow`의 깊은 offset은 재지 못했습니다. 저장소 크기와 장비가 다르므로 이 값을 보장하지 않고 검증된 목표 시간도 없습니다. 브라우저 fixture는 Git을 실행하지 않고 Orca에서도 실행하지 않으며 0.2.0 기능을 실제 호스트에서 확인한 기록도 없습니다. `docs/screenshots`의 스크린샷은 다시 만들지 않았고 이 기능을 보여 주지 않습니다.

## 패키징과 릴리스

빌드는 symlink, `node_modules`, 실행 파일, 네이티브 모듈, 아카이브, 검토하지 않은 파일 형식을 거절합니다. Worker의 Node 내장 모듈 외 의존성은 번들에 포함해야 합니다. WASM과 폰트 파일은 배포하지 않습니다. 공개 디렉터리는 0.1.0의 Codicon 폰트를 거절했습니다. 0.1.1부터 빌드가 설치된 Monaco 글리프를 인라인 SVG 마스크로 변환합니다. 편집기 아이콘 레지스트리로 별칭을 해석하고 currentColor로 테마 색상을 따릅니다. 폰트 파싱은 빌드할 때만 실행하며 패키지 검사는 폰트 파일의 재유입을 거절합니다.

번들은 `worker.js` 실행을 위해 `type: module`을 선언합니다. 비교 문서와 로컬 검증 캡처는 배포 에셋이 아닙니다. 설치용 폴더에는 두 언어의 안내와 의존 라이선스를 포함합니다.

소스는 [tienne/orca-plugins](https://github.com/tienne/orca-plugins)에 있습니다. `dist/`는 소스 브랜치의 Git 추적 대상에서 제외돼 있습니다. 임의 커밋이나 해시로 카탈로그 항목을 만들지 마십시오. 릴리스할 때는 다음 순서를 따릅니다.

1. 설치용 산출물을 배포 저장소에 커밋합니다.
2. 커밋한 폴더에 `orca plugin release-entry`를 실행해 메타데이터를 만듭니다.
3. 카탈로그의 `source.path`를 패키징된 manifest가 있는 폴더로 지정합니다. Orca는 그 폴더만 설치합니다.
4. 생성된 전체 커밋과 `contentHash`로 릴리스를 고정하고 검증한 뒤 공개 등록 전에 설치를 확인합니다.

Tienne 소유 저장소에서 설치할 때 공개 ID는 `tienne.git-logs`입니다. 예약된 `orca-` ID 접두사나 게시자 이름은 사용하지 않습니다. 최소 Orca 버전을 올릴 때도 이전 클라이언트가 호환되는 버전을 설치할 수 있도록 기존 카탈로그 릴리스를 유지합니다. Manifest에서 deprecated `publisher`는 생략합니다. 공개 등록 페이지의 설명은 달랐으므로 릴리스 전에 최신 validator와 다시 대조하십시오. 카탈로그 배포와 공개 디렉터리 등록은 별도 절차입니다. 모노레포 카탈로그가 디렉터리의 루트 manifest 조건도 충족한다고 가정하지 마십시오.

### 이름 변경 호환성

현재 경로와 명령은 `git-logs`입니다. 기존 `.orca/git-tools/*.orcadiff` 문서와 `refs/git-tools/backups/` 참조는 옮기거나 삭제하지 않습니다. 문서 형식과 `.orcadiff` 확장자는 호환되며 새 문서와 백업에는 `git-logs`를 사용합니다.

새 로컬 ID는 Orca 승인이 필요합니다. 준비가 끝나면 이전 개발 연결을 해제해 패널과 편집기의 중복 등록을 피하십시오. 오프라인 검증 통과가 실행 승인을 뜻하지는 않습니다.

### 등록 정책과 검색

설치와 사용은 무료로 유지합니다. 유료 잠금, 라이선스 키, 체험판, telemetry, analytics, 추적, 외부 데이터 수집은 추가하지 않습니다. 공개 등록에는 소스를 공개하고 MIT와 의존 라이선스를 유지합니다. 동작을 숨기는 난독화는 넣지 않습니다. Orca, JetBrains 등 다른 제작사의 보증을 암시하지 마십시오. IntelliJ는 비교 UX의 참고 자료일 뿐 브랜드를 사용하지 않습니다. 정책을 위반하면 공개 목록에서 삭제될 수 있으며, Orca는 kill list로 유해한 릴리스의 실행을 차단할 수 있습니다.

설명에는 `Git logs`, `Git tree`, `commit graph`, `side-by-side diff`를 포함합니다. 현재 manifest/catalog에는 별도 키워드나 검색 별칭 필드가 없습니다. 공개한 카탈로그는 같은 설명을 사용합니다. 등록한 GitHub 토픽에는 `orca-plugin`, `git-logs`, `git-tree`, `commit-graph`, `git-diff`가 있습니다. 공개 디렉터리 배포와 인덱싱 확인은 [배포 가이드](releases.ko.md#디렉터리용-번들-공개)를 참고하십시오. 토픽 등록이 검색 노출이나 순위를 보장하지는 않습니다.

## CI와 배포 자동화

PR 검사는 GitHub 호스팅 Ubuntu에서, Orca 검증과 공개는 신뢰한 수동 macOS job에서 실행하도록 구성했습니다. 러너 설정, 미리보기·공개 모드, 소스 태그, 출처 기록과 카탈로그 고정은 [Git 브랜치와 배포](releases.ko.md)를 참고하십시오. `pnpm nx run git-logs:release-test`는 로컬 bare 저장소로 배포 로직을 검사합니다. `ORCA_RELEASE_INTEGRATION=1`과 운영체제에 맞는 Orca CLI를 지정하면 실제 검증·해시 생성으로 반복합니다. GitHub 호스팅 결과는 저장소의 PR 검사와 Actions 실행 기록에서 확인하십시오. 로컬 검증 통과가 호스팅 CI 성공을 뜻하지는 않습니다.

## 참고 문서

- Orca: [개발 가이드](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md), [Manifest](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-manifest.md), [Host API](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-host-api.md), [Catalog](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-catalog.md), [테마 토큰](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-theme-tokens.md), [등록 정책](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-listing-policy.md), [공개 등록](https://www.onorca.dev/plugins/add)
- Git: [merge](https://git-scm.com/docs/git-merge), [rebase](https://git-scm.com/docs/git-rebase), [cherry-pick](https://git-scm.com/docs/git-cherry-pick), [revert](https://git-scm.com/docs/git-revert), [reset](https://git-scm.com/docs/git-reset)
- UX 참고: [IntelliJ Differences Viewer](https://www.jetbrains.com/help/idea/differences-viewer.html)
