# Tienne Orca Plugins

pnpm + Nx 기반 Orca 플러그인 모노레포입니다. `git-tools`는 로컬 Git 커밋 그래프와 중앙 읽기 전용 좌우 diff를 제공합니다. Git 변경 명령은 제공하지 않습니다.

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

## Git Tools 사용

1. 승인한 로컬 개발 플러그인의 Git Tools 사이드바에서 **로컬 저장소 절대 경로**를 입력하고 연결합니다. 현재 workspace의 이름을 경로로 추정하지 않습니다.
2. 최근 최대 200개 커밋의 부모 관계와 HEAD, 로컬·원격 브랜치를 탐색합니다. 현재/전체 브랜치 범위와 커밋·작성자·해시·브랜치 검색을 지원합니다. 검색 중에는 생략된 커밋을 잘못 연결하지 않도록 그래프를 숨깁니다.
3. 커밋을 선택하면 메시지 전문, 작성자·날짜와 변경 파일이 나타납니다. Merge는 기본 첫 번째 부모와 비교하며 부모 선택으로 다른 직접 부모와 비교할 수 있습니다. 최초 커밋은 빈 트리와 비교합니다.
4. 작업 트리는 **HEAD → 현재 디스크**의 최종 내용을 비교합니다. `staged`는 HEAD↔index, `unstaged`는 index↔디스크, `untracked`는 index에 없는 파일이라는 상태 표시입니다. 각각 별도의 staged/unstaged diff 모드를 뜻하지 않습니다. HEAD와 같은 내용으로 상쇄된 파일은 제외합니다. 무시된 untracked 파일은 포함하지 않습니다.
5. 변경 파일을 선택한 뒤 동일 경로의 로컬 Orca workspace를 선택하고 **중앙 Diff 탭 열기**를 누릅니다. 임시 폴더에 `.orcadiff` 설명 문서를 생성해 이 플러그인의 custom editor로 엽니다. 소스 파일과 Git index를 수정하지 않습니다.

중앙 뷰어는 파일 탐색, 좌우 정렬, 줄/단어 내 강조, 동기 스크롤, 이전/다음 변경, 동일 영역 접기, 줄 앞뒤 공백 무시를 제공합니다. 좁은 화면에서도 좌우 비교를 유지하며 코드 영역 내부를 가로 스크롤합니다. 소스 수정·변경 적용 버튼은 없습니다.

## 접근 권한 / Orca 연결

빌드 결과는 `dist/plugins/git-tools`입니다. source manifest는 패키징된 `ui/index.html`, `worker.js`를 가리키므로 **검증은 dist 폴더에** 실행합니다. UI·Monaco·editor worker·라이선스는 모두 로컬 번들에 포함됩니다.

이 플러그인은 `trusted-worker`이며 사용자 계정 권한으로 Node 코드를 실행할 수 있습니다. manifest는 다음 접근을 선언합니다.

- `workspace:read`: 로컬 workspace 목록을 읽고 연결한 저장소와 같은 경로의 대상을 찾습니다.
- `workspace:write`: `.orcadiff`를 중앙 editor 탭으로 엽니다. 이 Orca 권한 자체는 built-in command 실행도 허용하지만 Git Tools는 `editor.open`만 호출합니다.

설치/실행은 사용자 승인 이후에만 진행합니다. 검토용 명령:

```sh
orca plugin inspect ./dist/plugins/git-tools --json
# 사용자가 이 플러그인과 위 접근에 동의한 뒤에만:
orca plugin dev load ./dist/plugins/git-tools --json
```

Orca가 `approval_required`를 반환하면 표시된 접근 범위와 fingerprint를 확인한 뒤 사용자 승인 절차를 따릅니다. 이 구현 작업에서는 load/approve를 실행하지 않았습니다.

설치 CLI의 version-matched authoring guide를 기준으로 최소 버전을 `>=1.4.248`로 설정했습니다. `orca plugin types`는 설치본의 `orca-components.d.ts` 누락으로 실패하여 `protocol.ts`에서 사용하는 API만 수동으로 관리합니다.

## 검증 상태와 제한

2026-11-04 로컬 검증: Nx build/typecheck, Git fixture 테스트 11개, packaged UI 테스트 7개, Orca manifest validation 통과. 라이트·다크·360px PNG를 직접 확인했습니다.

- 실제 임시 Git 저장소 테스트: 최초 커밋 전, 최초 커밋, 200개 제한, 현재/전체 브랜치, merge 부모, 메시지 전문, 특수 파일명, rename, 삭제, staged+unstaged, 상쇄 변경, staged 삭제 후 재생성, 바이너리·비 UTF-8·큰 파일, symlink, 충돌, 경계·해시 검사, worker bridge를 검증합니다.
- 패키징 UI는 Orca 일반 브라우저와 Playwright에서 렌더합니다. Monaco worker는 상대 경로의 로컬 JS로 제공하고 네트워크 CDN·blob worker에 의존하지 않습니다.
- **실제 승인된 Orca plugin frame의 CSP/worker 실행, custom editor 문서 session 및 `editor.open`의 임시 경로 허용은 아직 검증하지 않았습니다.** 브라우저 preview 성공을 실호스트 통합 성공으로 간주하지 않습니다. 승인 후 사이드바 연결→중앙 탭 열기→Monaco worker→테마 변경을 확인해야 합니다.
- 텍스트는 UTF-8, 파일당 768 KiB까지입니다. 바이너리·큰 파일·symlink·submodule·unmerged 충돌은 별도 상태로 표시하며 잘못된 텍스트 diff를 만들지 않습니다. 빈 파일과 없는 파일을 구분합니다. 실행 비트만 바뀐 경우 내용 diff가 0개일 수 있습니다.
- 작업 트리는 디스크 기준이며 편집기의 저장되지 않은 내용은 포함하지 않습니다. 조회는 원자적 snapshot이 아닙니다. HEAD가 달라지면 재조회 오류를 표시하고 새로고침을 요구합니다. 커밋 비교는 전체 hash에 고정됩니다. 갱신은 수동입니다.
- 원격 ref는 로컬에 이미 있는 것만 읽습니다. fetch, SSH/원격 파일 접근, Git LFS 다운로드, checkout/staging/revert/commit/push는 없습니다. shallow history는 로컬에 있는 만큼만 보입니다. 자동 객체 fetch를 피하기 위해 partial clone은 연결을 거절합니다. 변경 파일이 2,000개를 넘으면 명시적 오류를 냅니다.
- 연결 목록은 worker 메모리에만 있으며 재시작 시 다시 연결해야 합니다. 설명 문서는 임시 파일이므로 OS 정리 후 다시 생성합니다. 문서를 외부에서 열었더라도 사이드바에서 해당 저장소에 먼저 연결해야 합니다.

## 구조 / 배포

- `plugins/git-tools/src/ui`: React 그래프·파일 탐색·Monaco diff·브라우저 fixture
- `plugins/git-tools/src/worker`: 인자 배열로 실행하는 Git 조회, 경계 검사, 문서 생성과 탭 연결
- `plugins/git-tools/src/protocol.ts`: UI/worker 데이터 계약과 확인된 최소 Orca 타입
- `scripts/build-plugin.mjs`: self-contained 패키징
- `orca-catalog.json`: 첫 릴리스 전이므로 빈 카탈로그

공통 패키지는 실제 재사용이 생기면 추출합니다. 원격 저장소 생성, GitHub push, 공개 배포, main 자동 병합은 하지 않았습니다. `dist/`는 Git에서 제외됩니다. 공개 릴리스에는 별도의 요청과 검증이 필요합니다.

설계 참고: [Orca plugin authoring](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md), [host API](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-host-api.md), [IntelliJ Diff Viewer](https://www.jetbrains.com/help/idea/differences-viewer.html). IntelliJ의 명확한 좌우 비교·변경 이동·동일 영역 접기를 참고했으며 읽기 전용 UX로 구성했습니다.
