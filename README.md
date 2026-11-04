# Tienne Orca Plugins

pnpm + Nx 기반 Orca 플러그인 모노레포입니다. `git-tools`는 로컬 Git 커밋 그래프와 중앙 읽기 전용 좌우 diff를 제공합니다. 커밋 우클릭 메뉴에서 로컬 Git 변경 명령도 제공합니다.

## 개발 / 검증

Node.js 22.12 이상 또는 24 이상, pnpm 10, Git, Orca CLI가 필요합니다.

```sh
pnpm install
pnpm nx run git-tools:typecheck
pnpm nx run git-tools:test
pnpm build
pnpm validate
pnpm nx run git-tools:ui-test
pnpm nx run git-tools:preview
# 또는 소스 HMR
pnpm dev
```

`ui-test`는 설치된 Google Chrome을 사용합니다. 다른 환경에서는 `pnpm exec playwright install chromium` 후 `PW_CHANNEL=chromium pnpm nx run git-tools:ui-test`를 실행합니다. 테스트는 `test-results/git-tools`에 라이트·다크·좁은 화면 PNG를 남깁니다. `preview`는 패키징된 UI를 `http://127.0.0.1:4173`에서 제공합니다.

일반 브라우저에서는 **DEMO · 실제 Git 데이터 아님** 표시와 fixture만 나타납니다. 상단에서 일반 변경 / 빈 저장소 / 변경 없음 / 로딩 / 오류 및 테마를 선택할 수 있습니다. 실제 저장소를 웹 서버에 노출하지 않습니다.

## Git Logs 사용

1. Git Logs 사이드바를 열면 **현재 열린 Orca 로컬 Git 워크트리에 자동 연결**합니다. workspace가 바뀌면 연결도 따라갑니다. 이름·브랜치가 중복되거나 자동 식별이 불가능하면 워크트리 선택을 표시합니다. 연결 대상은 Orca가 관리하는 로컬 Git 워크트리이며, 경로 입력이나 자동 연결 on/off 설정 없이 이 흐름을 유지합니다.
2. 최근 최대 200개 커밋의 부모 관계와 HEAD, 로컬·원격 브랜치를 탐색합니다. 현재/전체 브랜치 범위와 커밋·작성자·해시·브랜치 검색을 지원합니다. 검색 중에는 생략된 커밋을 잘못 연결하지 않도록 그래프를 숨깁니다.
3. 커밋을 선택하면 메시지 전문, 작성자·날짜와 변경 파일이 나타납니다. Merge는 기본 첫 번째 부모와 비교하며 부모 선택으로 다른 직접 부모와 비교할 수 있습니다. 최초 커밋은 빈 트리와 비교합니다.
4. 작업 트리는 **HEAD → 현재 디스크**의 최종 내용을 비교합니다. `staged`는 HEAD↔index, `unstaged`는 index↔디스크, `untracked`는 index에 없는 파일이라는 상태 표시입니다. 각각 별도의 staged/unstaged diff 모드를 뜻하지 않습니다. HEAD와 같은 내용으로 상쇄된 파일은 제외합니다. 무시된 untracked 파일은 포함하지 않습니다.
5. 변경 파일을 선택한 뒤 **중앙 Diff 탭 열기**를 누릅니다. 연결된 workspace를 중앙 탭의 대상으로 사용합니다. 저장소 내부 `.orca/git-tools/<id>.orcadiff`에 비교 설명 문서를 생성하고 대상 workspace를 연 뒤 custom editor로 엽니다. `editor.open`은 workspace 내부 상대 경로만 허용하므로 OS 임시 폴더를 사용하지 않습니다. `.orca/`가 Git에서 무시되지 않는 저장소에서는 문서가 untracked로 표시됩니다. 소스 파일과 Git index를 수정하지 않습니다.

중앙 뷰어는 파일 탐색, 좌우 정렬, 줄/단어 내 강조, 동기 스크롤, 이전/다음 변경, 동일 영역 접기, 줄 앞뒤 공백 무시를 제공합니다. 좁은 화면에서도 좌우 비교를 유지하며 코드 영역 내부를 가로 스크롤합니다. 소스 수정·변경 적용 버튼은 없습니다.

## 커밋 우클릭 작업

커밋을 우클릭하거나 포커스 후 `Shift+F10`을 누릅니다. 메뉴의 작업은 **선택 커밋을 대상으로 현재 열린 로컬 워크트리에서** 실행됩니다.

- 체크아웃: 선택 커밋을 가리키는 로컬 브랜치로 전환하거나 Detached HEAD로 이동합니다. 다른 워크트리에서 사용 중인 브랜치를 강제로 가져오지 않습니다.
- 브랜치 생성: 선택 커밋에 새 로컬 브랜치를 만들며 자동 전환하지 않습니다. `/`가 포함된 브랜치 이름도 지원합니다.
- 병합: 선택 커밋을 현재 브랜치로 merge합니다. 가능한 경우 fast-forward, 아니면 merge 커밋을 만듭니다.
- 리베이스: 현재 브랜치의 커밋을 선택 커밋 위에 다시 쌓는 일반 rebase입니다. merge 커밋을 보존하지 않으며 다른 브랜치 ref를 자동 갱신하지 않습니다. interactive rebase/squash는 제공하지 않습니다.
- 체리픽 / 리버트: 선택 커밋을 적용하거나 취소하는 새 커밋을 만듭니다. merge 커밋은 기준 부모(mainline)를 반드시 선택합니다. merge revert는 이후 재병합 결과에도 영향을 줍니다.
- 리셋: soft(index·파일 유지), mixed(파일 유지·index 갱신), hard(index·파일 교체)를 선택합니다. hard는 대상 짧은 해시를 직접 입력해야 실행할 수 있습니다.

**확인 흐름:** 옵션 선택 → 작업 상태 검사 → 저장소/현재 브랜치/HEAD/대상/영향 확인 → 실행. 확인은 5분 동안 유효한 일회성 worker token이며 실행 직전 HEAD·브랜치·작업 상태·체크아웃 대상 ref를 다시 검사합니다. 현재 workspace를 이름/브랜치로 유일하게 확인할 수 없는 경우 변경 명령은 거절합니다. 실행 후 그래프·작업 트리 파일 목록을 갱신합니다. 브라우저 DEMO에서는 확인 화면만 재현하며 Git을 실행하지 않습니다.

첫 버전은 clean index/작업 트리와 untracked 파일이 없는 상태만 지원합니다. 자동 stash/변경 폐기/강제 체크아웃은 하지 않습니다. assume-unchanged/skip-worktree/sparse checkout과 진행 중인 merge/rebase/cherry-pick/revert/bisect를 거절하며, ignored 파일이 대상 경로를 막는 경우에도 거절합니다. `.orcadiff`가 untracked라면 먼저 문서를 정리하거나 사용자가 직접 ignore 규칙을 정해야 합니다.

reset/rebase 전 HEAD를 `refs/git-tools/backups/<timestamp>-<uuid>`로 보관하고 결과에 표시합니다. 이 참조는 커밋만 보존하며 미커밋 파일의 백업이 아닙니다. 자동 삭제하지 않습니다. 복구 전에는 `git show <백업 ref>`로 확인하세요. 공유 브랜치의 reset/rebase는 이력을 바꿀 수 있으며 push/force push는 제공하지 않습니다.

충돌·실패는 출력과 충돌 파일을 표시하고 자동 롤백/재시도하지 않습니다. Git이 진행 중인 상태를 남겼다면 터미널에서 해결·`git add` 후 해당 `git merge --continue`, `git rebase --continue`, `git cherry-pick --continue`, `git revert --continue`를 사용하거나 해당 명령의 `--abort`로 중단하세요. 빈 cherry-pick 등 충돌 파일 없는 중단도 실패로 표시합니다. 충돌 해결용 editor와 staging UI는 범위 밖입니다.

Git hooks와 커밋 서명은 이 UI 명령에서 비활성화하고 자동 stash/rerere 적용/submodule 재귀 갱신도 하지 않습니다. 일반 Git에 설정된 filters/merge driver는 동작할 수 있습니다. 플러그인 내부의 같은 common Git directory 변경 명령은 직렬화하지만 외부 터미널/다른 앱과의 완전한 원자성은 보장하지 않습니다. 실행 중에는 다른 곳에서 같은 저장소의 Git 명령을 실행하지 마세요. 명령 제한 시간은 120초이며 중단 시 상태를 직접 확인해야 합니다. 이 기능은 로컬 Git 2.41.0에서 검증했습니다.

동작 근거: [merge](https://git-scm.com/docs/git-merge), [rebase](https://git-scm.com/docs/git-rebase), [cherry-pick](https://git-scm.com/docs/git-cherry-pick), [revert](https://git-scm.com/docs/git-revert), [reset](https://git-scm.com/docs/git-reset).

## 접근 권한 / Orca 연결

빌드 결과는 `dist/plugins/git-tools`입니다. source manifest는 패키징된 `ui/index.html`, `ui/editor.html`, `worker.js`를 가리키므로 **검증은 dist 폴더에** 실행합니다. UI·Monaco·editor worker·라이선스는 모두 로컬 번들에 포함됩니다.

이 플러그인은 `trusted-worker`이며 사용자 계정 권한으로 Node 코드를 실행할 수 있습니다. manifest는 다음 접근을 선언합니다.

- `workspace:read`: 현재 workspace context와 목록을 읽고, workspace.changed 이벤트로 열린 워크트리를 따라갑니다.
- `workspace:write`: `.orcadiff`를 중앙 editor 탭으로 엽니다. 이 Orca 권한 자체는 built-in command 실행도 허용하지만 Git Logs는 대상 workspace를 표시하는 `workspace.open`과 `editor.open`만 호출합니다.

설치/실행은 사용자 승인 이후에만 진행합니다. 검토용 명령:

```sh
orca plugin inspect ./dist/plugins/git-tools --json
# 사용자가 이 플러그인과 위 접근에 동의한 뒤에만:
orca plugin dev load ./dist/plugins/git-tools --json
```

Orca가 `approval_required`를 반환하면 표시된 접근 범위와 fingerprint를 확인한 뒤 사용자 승인 절차를 따릅니다. 2026-11-04 사용자가 Node 실행과 workspace 읽기/쓰기 범위를 승인한 뒤 로컬 개발 폴더를 load/approve하고 실호스트 검증했습니다. 향후 새로운 접근 권한이나 공개 배포는 별도의 사용자 요청이 필요합니다.

설치 CLI의 version-matched authoring guide를 기준으로 최소 버전을 `>=1.4.248`로 설정했습니다. `orca plugin types`는 설치본의 `orca-components.d.ts` 누락으로 실패하여 `protocol.ts`에서 사용하는 API만 수동으로 관리합니다.

## 검증 상태와 제한

2026-11-04 로컬 검증: Nx build/typecheck, Git/worker fixture 테스트 26개, 패키징 검사 테스트 2개, packaged UI 테스트 15개, Orca manifest validation 통과. 라이트·다크·360px PNG를 직접 확인했습니다.

- 실제 임시 Git 저장소 테스트: 최초 커밋 전, 최초 커밋, 200개 제한, 현재/전체 브랜치, merge 부모, 메시지 전문, 특수 파일명, rename, 삭제, staged+unstaged, 상쇄 변경, staged 삭제 후 재생성, 바이너리·비 UTF-8·큰 파일, symlink, 충돌, 경계·해시 검사, worker bridge를 검증합니다.
- 패키징 UI는 Orca 일반 브라우저와 Playwright에서 렌더합니다. Monaco worker는 상대 경로의 로컬 JS로 제공하고 네트워크 CDN·blob worker에 의존하지 않습니다.
- **Orca 1.4.248 실호스트 검증 완료:** 승인된 dev plugin에서 실제 저장소 연결·커밋 그래프·workspace 선택·중앙 탭 열기·document.session 구독·Monaco diff 렌더를 확인했습니다. 1300×900 다크/라이트 editor shot은 각각 `themeApplied: true`, `subscribed: true`, `errors: []`였습니다. 로컬 worker/폰트 렌더에 CSP 차단은 보고되지 않았습니다. `plugin check`의 custom editor 정적 검사도 issues/warnings 없이 통과했습니다. 다른 Orca 버전·OS·원격 호스트까지 검증한 것은 아닙니다.
- 텍스트는 UTF-8, 파일당 768 KiB까지입니다. 바이너리·큰 파일·symlink·submodule·unmerged 충돌은 별도 상태로 표시하며 잘못된 텍스트 diff를 만들지 않습니다. 빈 파일과 없는 파일을 구분합니다. 실행 비트만 바뀐 경우 내용 diff가 0개일 수 있습니다.
- 작업 트리는 디스크 기준이며 편집기의 저장되지 않은 내용은 포함하지 않습니다. 조회는 원자적 snapshot이 아닙니다. HEAD가 달라지면 재조회 오류를 표시하고 새로고침을 요구합니다. 커밋 비교는 전체 hash에 고정됩니다. 갱신은 수동입니다.
- 원격 ref는 로컬에 이미 있는 것만 읽습니다. fetch, SSH/원격 파일 접근, Git LFS 다운로드, staging/일반 commit/push는 없습니다. shallow history는 로컬에 있는 만큼만 보입니다. 자동 객체 fetch를 피하기 위해 partial clone은 연결을 거절합니다. 변경 파일이 2,000개를 넘으면 명시적 오류를 냅니다.
- 연결 목록은 worker 메모리에만 있으며 재시작 시 사이드바가 열린 workspace에 다시 자동 연결합니다. 설명 문서는 저장소 내부 `.orca/git-tools/`에 유지되며 자동 삭제하지 않습니다. 사용하지 않는 설명 문서는 직접 정리할 수 있습니다. 이 폴더의 symlink는 거절하고 Git ignore 설정은 자동 변경하지 않습니다. 외부 비교 문서는 저장소를 자동으로 신뢰하지 않습니다. 문서의 저장소를 Orca에서 열어 사이드바에 연결한 후 새로고침하세요. 기존 중앙 diff는 workspace 전환에도 문서에 기록된 저장소/비교 기준을 유지합니다.

추가 변경 명령 검증: disposable Git 저장소에서 체크아웃/슬래시 브랜치/다른 worktree 점유/merge 설정/일반·merge 커밋 체리픽·리버트/reset 3모드·백업/rebase·충돌/만료된 상태·중복 실행/활성 workspace 경계/숨겨진 index 변경·ignored 충돌을 확인했습니다. 실제 Orca에서는 우클릭 메뉴와 병합 확인창을 렌더하고 실행 없이 닫았습니다. 실제 사용자 저장소의 변경 명령은 시험 실행하지 않았습니다. 독립 검토 3회에서 발견한 숨겨진 변경 검사·merge 설정 문제를 수정했고 마지막 rebase 검토에 추가 차단 지적은 없었습니다.

## 구조 / 배포

- `plugins/git-tools/src/ui`: React 그래프·파일 탐색·Monaco diff·브라우저 fixture
- `plugins/git-tools/src/worker`: 인자 배열로 실행하는 Git 조회·변경, 경계 검사, 문서 생성과 탭 연결
- `plugins/git-tools/src/protocol.ts`: UI/worker 데이터 계약과 확인된 최소 Orca 타입
- `scripts/build-plugin.mjs`: self-contained 패키징
- `orca-catalog.json`: 첫 릴리스 전이므로 빈 카탈로그

공통 패키지는 실제 재사용이 생기면 추출합니다. 원격 저장소 생성, GitHub push, 공개 배포, main 자동 병합은 하지 않았습니다. `dist/`는 Git에서 제외됩니다. 공개 릴리스에는 별도의 요청과 검증이 필요합니다.

설계 참고: [Orca plugin authoring](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md), [host API](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-host-api.md), [IntelliJ Diff Viewer](https://www.jetbrains.com/help/idea/differences-viewer.html). IntelliJ의 명확한 좌우 비교·변경 이동·동일 영역 접기를 참고했으며 중앙 diff는 읽기 전용이며 Git 변경은 별도 확인창으로 분리했습니다.

## 공식 정책과 이후 개발 규칙

2026-11-04 확인 기준입니다. 등록 정책은 공식/커뮤니티 카탈로그와 공개 디렉터리에 등록할 때 적용됩니다. 현재는 미공개 로컬 개발 단계이며 아래 규칙을 개발 기준으로 유지합니다.

- 설치와 사용은 무료입니다. 유료 잠금·라이선스 키·체험판을 추가하지 않습니다. 추적·telemetry·analytics·사용자 데이터 수집/외부 전송도 추가하지 않습니다. Git 조회 결과는 요청한 로컬 화면에 표시하고, 연결 경로는 worker 메모리 및 사용자가 생성하는 로컬 비교 문서에만 둡니다. 정책상 사용자 소유 유료 API 서비스 연결은 가능하지만 현재 Git Logs는 그런 서비스를 사용하지 않습니다. [등록 정책](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-listing-policy.md)
- IntelliJ는 UX 참고이며 이름·로고·공식 제작/보증 표시를 복제하지 않습니다. Git Logs 소스의 MIT 라이선스와 React·React DOM·Monaco 라이선스 및 Monaco ThirdPartyNotices를 배포물에 유지합니다. 공개 등록 전에는 소스도 저장소에서 공개해야 합니다. Vite의 배포용 minification은 재현 가능한 번들 최적화이며 은폐용 난독화를 추가하지 않습니다. [등록 정책](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-listing-policy.md)
- manifest `id`는 `git-tools`입니다. 현재 로컬 폴더 설치 identity는 `local.git-tools`이며, 향후 **tienne 소유 저장소에서 설치할 때** `tienne.git-tools`가 됩니다. `orca-` id와 예약 publisher를 사용하지 않습니다. 최신 명세는 `publisher`를 저장소 소유자에서 유도하므로 생략합니다. 공개 등록 안내는 아직 `publisher` 기입을 설명하므로 실제 릴리스 시 최신 validator와 등록 절차의 차이를 다시 확인해야 합니다. [Manifest](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-manifest.md), [Catalog](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-catalog.md), [공개 등록 안내](https://www.onorca.dev/plugins/add)
- 모노레포 `source.path`로 설치되는 **그 하위 폴더만** 자체 완결적이어야 합니다. 빌드는 worker의 외부 import가 Node 내장 모듈인지 확인하고, 산출물의 symlink·node_modules·실행 비트·네이티브 모듈·아카이브·미검토 형식을 거절합니다. 현재는 JS/HTML/CSS/JSON/문서/로컬 폰트 등 허용 목록만 패키징하며 WASM은 포함하지 않습니다. 폰트는 로컬 CLI validation을 통과했지만 공개 디렉터리 수락까지 확인한 것은 아닙니다. WASM 등 새 형식을 추가할 때는 그 시점의 validator와 공개 디렉터리 정책을 재검토해야 합니다. [Catalog](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-catalog.md), [디렉터리의 제외 기준](https://www.onorca.dev/plugins/add)
- 공개 릴리스는 정확한 Git commit과 `contentHash`로 고정하고 `release-entry`로 생성합니다. 현재 원격 저장소/릴리스가 없으므로 빈 카탈로그를 유지합니다. 임의 hash·릴리스·설치 링크를 만들지 않습니다. 로컬 `plugin validate` 통과는 공개 등록 승인과 다릅니다. [Catalog](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-catalog.md)
- Host API의 surface·capability·Since를 확인하고 `host.has`와 API major/minor로 사용 가능 여부를 검사합니다. 프레임의 worker 요청은 API 1.2, workspace 목록과 중앙 탭 열기는 API 1.3을 검사하며 없는 메서드에는 설명 가능한 오류를 표시합니다. `document.session`도 함수 존재를 검사합니다. installed CLI 1.4.248의 가이드/validation을 기준으로 `engines.orca >=1.4.248`을 유지하며, 문서 main의 신규 기능을 추가할 때는 그 Since까지 올립니다. `plugin check`는 worker 실행을 포함하므로 load/approve와 마찬가지로 명시적 실행 승인 이후에만 진행합니다. [개발 가이드](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md), [Host API](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-host-api.md)
- 프레임에서 공개된 `--orca-*` CSS 변수와 html light/dark 클래스를 사용합니다. app 전체 theme token을 프레임에서도 사용할 수 있다고 가정하지 않습니다. Monaco의 배경·글자·줄 번호·선택·포커스·위젯·스크롤바·diff 강조도 공개된 Orca 토큰에서 생성합니다. 토큰 값·테마 스타일·light/dark 변경과 theme 이벤트를 감지해 모델/스크롤을 재생성하지 않고 갱신합니다. 프레임에 공개되지 않은 전용 diff/chart/syntax 토큰을 임의로 가정하지 않으며, 추가 표시 녹색은 의미색 fallback을 유지하고 삭제 색은 `--orca-destructive`를 사용합니다. 호스트 토큰이 없는 브라우저 fixture에서는 로컬 기본 팔레트를 사용합니다. [테마 토큰과 Frame CSS 변수](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-theme-tokens.md)
- 정책 위반은 등록 해제 사유이며 유해 플러그인은 kill list로 이미 설치된 사본도 비활성화될 수 있습니다. 공개 등록·배포·load/approve는 별도의 명시적 사용자 승인 범위를 지킵니다. [등록 정책](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-listing-policy.md)

### 실호스트에서 확인한 구현 계약

- sidebar에도 `orca.document`가 제공됩니다. 객체 유무로 표면을 추정하지 않고 `index.html`(panel)과 `editor.html`(custom editor)의 명시적 surface 표시로 구분합니다.
- `workspace.list`의 로컬 `hostId`는 설치본에서 `"local"`입니다. 이전 응답의 `null`도 허용하며 SSH/다른 host는 대상에서 제외합니다.
- `editor.open`에는 `.orca/git-tools/<id>.orcadiff`처럼 workspace 내부의 상대 경로를 전달합니다. 문서 생성 전 상위 디렉터리의 symlink와 저장소 경계를 검사하며 파일은 `wx`, mode 0600으로 생성합니다.
- 번들에는 `type: module`을 선언한 독립 `package.json`을 포함해 worker.js를 ESM으로 실행합니다.
- Monaco 크기 갱신은 ResizeObserver에서 직접 수행하지 않고 requestAnimationFrame에 예약합니다. 실호스트의 ResizeObserver 반복 경고를 재현한 뒤 이 경로로 해결했습니다.
- 재검증용 descriptor와 PNG는 로컬 `.orca/git-tools/`, `.orca/validation/` 아래에 남깁니다. 배포 산출물에는 포함하지 않습니다.

### 열린 workspace의 자동 연결

설치본 `workspace.readContext`는 현재 workspace의 이름·브랜치·terminal 목록만 제공하며 경로/ID는 주지 않습니다. worker가 `workspace.list`와 이름·브랜치를 대조해 후보가 **정확히 하나이고 로컬 Git worktree일 때** 경로를 얻습니다. 이름을 파일 경로로 바꾸거나 worker의 cwd를 저장소 경로로 추정하지 않습니다.

같은 이름/브랜치의 workspace가 여러 개이거나 목록이 truncated인 경우에는 자동 연결하지 않고 선택을 받습니다. 로컬/SSH 간 이름 충돌도 모호한 경우로 처리합니다. 현재 workspace가 없거나 폴더·SSH인 경우에도 Orca의 로컬 Git 워크트리 목록에서만 선택할 수 있습니다. 임의의 저장소 경로를 입력하는 UI/RPC는 제공하지 않습니다. `workspace.changed`를 구독해 새 workspace에 연결하며, 이전 요청의 늦은 응답은 새 연결을 덮어쓰지 못하게 합니다. 이 동작은 추가 capability 없이 기존 `workspace:read` 범위에서 수행합니다.
