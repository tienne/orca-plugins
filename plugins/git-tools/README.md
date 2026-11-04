# Git Logs 0.1.0

로컬 Git 커밋 그래프 + 읽기 전용 Monaco 좌우 diff를 제공하는 Orca 플러그인입니다. 커밋 우클릭으로 체크아웃·브랜치 생성·병합·리베이스·체리픽·리버트·리셋을 제공합니다. 최소 Orca 버전은 1.4.248입니다.

## 사용

Git Logs 사이드바를 열면 현재 열린 Orca 로컬 Git 워크트리에 자동 연결하며 workspace 전환을 따라갑니다. 자동 식별이 모호하면 워크트리를 선택합니다. 연결 대상은 Orca가 관리하는 로컬 Git 워크트리로 한정하며 별도의 경로 입력이나 자동 연결 on/off 설정은 없습니다. 최근 200개 커밋의 부모 그래프, HEAD/로컬·원격 브랜치, 검색, 새로고침, 메시지 전문과 변경 파일을 탐색합니다.

- 작업 트리: HEAD → 현재 디스크 최종 내용. staged(HEAD↔index), unstaged(index↔디스크), untracked(index에 없음)는 상태 표시입니다. 별도의 index diff 모드는 없습니다. HEAD와 같아진 내용은 제외됩니다.
- 커밋: 선택 커밋 → 직접 부모 기준 비교. 좌측은 부모, 우측은 선택 커밋입니다. Merge는 부모를 선택하며 최초 커밋의 좌측은 빈 트리입니다.

파일을 선택하고 **중앙 Diff 탭 열기**를 누릅니다. 연결된 workspace를 중앙 탭의 대상으로 사용합니다. 저장소의 `.orca/git-tools/<id>.orcadiff`에 저장소·비교 기준·선택 파일을 담아 대상 workspace의 custom editor로 엽니다. 이 폴더가 Git에서 무시되지 않으면 문서가 untracked로 표시되며 ignore 설정은 자동 변경하지 않습니다. 소스 파일과 index는 수정하지 않습니다. 중앙 뷰어는 좌우 정렬, 줄/단어 내 강조, 동기 스크롤, 이전/다음 변경, 동일 영역 접기, 줄 앞뒤 공백 무시를 지원합니다.

## 테마와 화면 스타일

패널·메뉴·확인창·버튼·입력은 Orca 프레임에 공개된 background/foreground, card/card-foreground, popover/popover-foreground, primary/primary-foreground, secondary/secondary-foreground, accent/accent-foreground, border/input/ring, radius 토큰을 사용합니다. 선택·hover·포커스에도 대응하는 전경색을 적용합니다. root의 rem 기준은 16px로 유지해 전달받은 radius의 크기가 호스트와 어긋나지 않게 합니다. 패널 제목·버튼·여백은 Orca의 작은 도구 패널 형태에 맞췄고, 브라우저 fallback은 중립적인 라이트/다크 팔레트입니다.

같은 다크/라이트 모드 안에서 토큰·모서리 반경이 바뀌어도 다시 로드하거나 Monaco 모델을 만들지 않습니다. 테스트는 전용 card/popover 글자색, primary/secondary 버튼, 메뉴 키보드 포커스, radius 변경과 Monaco 모델 유지를 검증합니다. 호스트의 폰트·밀도 설정, sidebar/chart/diff/syntax 전용 토큰은 현재 프레임 API에 공개되지 않으므로 앱 디자인과 완전히 동일하게 상속하는 것은 지원하지 않습니다. 그래프·추가/삭제의 의미색은 기존의 로컬 fallback을 유지합니다.

## 언어

Orca의 공개 `window.orca.locale`(BCP-47)을 우선 사용합니다. 한국어(`ko`, `ko-KR`)와 영어(`en`, `en-US`, `en-GB` 등)를 지원하고 미지원/잘못된 locale은 영어(`en-US`)로 표시합니다. 날짜·시간·숫자는 지원 언어의 지역 태그를 `Intl`에 전달합니다. UI 언어가 영어여도 커밋 메시지·작성자·브랜치·경로와 원본 Git 출력은 번역하지 않습니다. 플러그인 메뉴·접근성 레이블·안내·확인창·알려진 worker 오류/결과 문구만 로컬 사전으로 번역하며 외부 번역 요청을 보내지 않습니다.

언어 변경 전용 공개 이벤트는 없으므로 마운트 시점, 포커스 복귀 및 500ms 간격으로 공개 locale 값을 확인합니다. 호스트가 값을 갱신하면 코드 모델과 스크롤을 재생성하지 않고 UI/날짜/접근성 레이블이 바뀝니다. 설치본 1.4.248의 프레임 shell은 초기 연결에서 locale을 받으므로 Orca 설정 변경이 열린 프레임 값에 전달되지 않으면 패널/탭을 다시 열거나 플러그인을 reload해야 합니다. 내부 bridge 메시지나 앱 설정 파일에는 접근하지 않습니다. Monaco 자체의 기본 메뉴·접힌 줄 안내 등 라이브러리 내장 문구는 현재 영어로 남습니다.

브라우저 DEMO는 `navigator.language`를 기본으로 사용하고 상단 언어 선택 또는 `?lang=ko` / `?lang=en`으로 미리 볼 수 있습니다. 실제 Orca에서는 이 query override와 언어 선택을 제공하지 않습니다. 번역은 `src/i18n/en.json`(플러그인 기준)에 관리하며 한국어 원문을 메시지 키로 사용합니다. 언어를 추가할 때는 사전과 `messages.ts`의 지원 locale/사전 선택을 함께 확장하고 UI 및 안전 확인 문구 테스트를 추가합니다.

검증: 한국어 회귀, 영어의 7개 커밋 메뉴/확인창, 영어 worker 오류·hard reset 경고, `en-GB` 날짜, Orca locale 우선순위, 미지원 언어 fallback과 언어 전환 시 Monaco 모델 유지 여부를 브라우저에서 확인합니다. 실제 Orca의 언어 설정을 시험 목적으로 변경하지 않습니다.

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

## 접근과 제한

`trusted-worker`는 사용자 계정 권한으로 Node 코드를 실행합니다. `workspace:read`는 대상 workspace 탐색, `workspace:write`는 중앙 editor 탭 열기에 사용합니다. 설치/실행은 이 접근에 대한 사용자 승인 뒤에 진행해야 합니다.

UTF-8 파일당 768 KiB까지 텍스트 비교합니다. 바이너리·비 UTF-8·큰 파일·symlink·submodule·충돌은 별도 상태로 표시합니다. 빈 파일과 파일 없음은 구분합니다. 변경 파일 2,000개 초과는 오류입니다. 검색은 로드된 최근 200개에서만 수행합니다. 원격 branch는 로컬 ref만 읽으며 SSH/fetch/Git LFS 다운로드는 지원하지 않습니다. 디스크 조회이므로 저장하지 않은 편집 내용은 포함하지 않으며 수동 새로고침이 필요합니다.

`.orcadiff`는 코드가 아닌 JSON 설명 문서입니다. 외부 문서의 경로를 자동으로 신뢰하지 않으며 사이드바가 문서의 저장소에 연결되어 있어야 합니다. worker 재시작 시 열린 workspace에 자동으로 다시 연결합니다. 중앙 diff는 workspace 전환과 별개로 문서의 비교 기준을 유지합니다. HEAD 변경 시 새로고침이 필요합니다. 비교 문서는 자동 삭제하지 않으며 필요 없을 때 직접 정리할 수 있습니다. 문서 폴더의 symlink는 거절합니다.

UI/Monaco/editor worker는 모두 로컬 번들입니다. 일반 브라우저 preview는 명확히 표시된 **DEMO fixture**입니다. Git 데이터로 오인하지 마세요. 상단에서 로딩/오류/빈 상태와 테마도 확인할 수 있습니다.

**검증 상태:** build/typecheck, Git·worker·다국어·패키징 테스트 32개, 브라우저 UI 테스트 17개, manifest validation과 plugin check가 통과했습니다. 사용자 승인 후 Orca 1.4.248의 실제 사이드바 연결·커밋 그래프·중앙 editor.open·document.session·Monaco diff를 확인했습니다. 다크/라이트 editor shot은 themeApplied/subscribed가 true이고 프레임 오류가 없었습니다. 다른 OS/버전/원격 호스트는 미검증입니다. 호스트 타입 생성은 설치본 선언 파일 누락으로 실패해 확인된 API 타입만 수동 관리합니다.

추가 변경 명령 검증: disposable Git 저장소에서 체크아웃/슬래시 브랜치/다른 worktree 점유/merge 설정/일반·merge 커밋 체리픽·리버트/reset 3모드·백업/rebase·충돌/만료된 상태·중복 실행/활성 workspace 경계/숨겨진 index 변경·ignored 충돌을 확인했습니다. 실제 Orca에서는 우클릭 메뉴와 병합 확인창을 렌더하고 실행 없이 닫았습니다. 실제 사용자 저장소의 변경 명령은 시험 실행하지 않았습니다. 독립 검토 3회에서 발견한 숨겨진 변경 검사·merge 설정 문제를 수정했고 마지막 rebase 검토에 추가 차단 지적은 없었습니다.

## 소스 개발

모노레포 루트에서:

```sh
pnpm install
pnpm nx run git-tools:test
pnpm nx run git-tools:typecheck
pnpm build
pnpm validate
pnpm nx run git-tools:ui-test
pnpm nx run git-tools:preview
```

`ui-test`는 설치된 Google Chrome을 사용합니다. Chromium 사용 시 `pnpm exec playwright install chromium` 후 `PW_CHANNEL=chromium`을 설정합니다. 배포 폴더는 `dist/plugins/git-tools`이며 독립 설치에 저장소의 node_modules가 필요하지 않습니다. 사용자가 승인한 로컬 개발 플러그인을 load/approve해 검증했으며 공개 배포는 실행하지 않았습니다.

## 등록 정책을 적용하는 개발 기준

무료 사용을 유지하며 paywall·라이선스 키·체험판·telemetry·analytics·추적·외부 데이터 수집을 넣지 않습니다. IntelliJ는 UX 참고이며 공식 제작/보증을 주장하거나 브랜드를 복제하지 않습니다. 공개 등록 전에는 소스를 공개하고 MIT 및 동봉한 의존 라이선스를 유지해야 합니다.

로컬 identity는 `local.git-tools`입니다. 향후 tienne 소유 Git 저장소에서 설치할 때 `tienne.git-tools`가 됩니다. 최신 manifest/catalog 명세에 따라 deprecated `publisher`는 생략합니다. 공개 등록 안내의 publisher 설명과 차이가 있으므로 실제 릴리스 시 재확인합니다. 카탈로그는 릴리스 전까지 비워 두고 공개 시 `source.path`의 자체 완결적 산출물을 정확한 commit/contentHash로 고정해야 합니다.

빌드는 symlink/node_modules/실행파일/네이티브 모듈/아카이브/미검토 형식을 거절하고 Node 내장 모듈 외 worker 의존성의 미번들링을 검사합니다. WASM은 포함하지 않습니다. 로컬 폰트는 CLI validator를 통과했으며 공개 디렉터리 수락은 아직 미확인입니다. UI와 Monaco의 배경·글자·선택·테두리·포커스·강조색은 프레임에 공개된 `--orca-*` 변수에 연결합니다. 같은 모드 안의 토큰 변경도 모델을 재생성하지 않고 반영합니다. 전용 diff 추가 색상과 그래프 팔레트 토큰은 프레임에 공개되지 않아 로컬 의미색을 사용합니다. 그래프는 파랑·보라·청록·황토·분홍 의미색 85%에 Orca foreground 15%를 혼합하고 다크/라이트별 명도를 조정합니다. 작성자는 foreground/muted-foreground 혼합색, 날짜는 muted-foreground, 고정폭 해시는 그래프 파랑/foreground 혼합색으로 구분합니다. API는 `host.has`·minor와 문서 session 존재를 검사합니다. 로컬 validation은 공개 등록 또는 실호스트 실행 검증을 대체하지 않습니다.

원문: [개발 가이드](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md), [Manifest](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-manifest.md), [Host API](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-host-api.md), [Catalog](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-catalog.md), [Theme tokens](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-theme-tokens.md), [Listing policy](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-listing-policy.md), [공개 등록 안내](https://www.onorca.dev/plugins/add).

현재 workspace API에는 경로/ID가 없어 이름·브랜치를 workspace 목록과 대조합니다. 로컬/SSH를 포함한 중복 이름·브랜치나 잘린 목록에서는 임의의 저장소로 자동 연결하지 않으며 선택을 받습니다. SSH Git은 지원하지 않습니다.

## 표시 이름과 단축키

툴과 사이드바의 표시 이름은 **Git Logs**입니다. 기존 설치와 문서의 호환성을 위해 manifest id/panel id `git-tools`, 설치 identity `local.git-tools` / `tienne.git-tools`, `.orcadiff` 확장자와 저장 경로는 유지합니다.

Orca 1.4.248은 `contributes.commands`와 `contributes.keybindings`로 명령 단축키를 등록할 수 있습니다. 다만 현재 명세에는 특정 플러그인 패널을 여는 action/worker API가 없고 `sidebar.right.toggle`은 마지막 선택된 오른쪽 사이드바 전체만 토글합니다. 이를 Git Logs 전용 열기라고 표시하지 않으며 현재 추가된 단축키는 없습니다.
