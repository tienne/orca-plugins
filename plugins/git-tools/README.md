# Git Tools 0.1.0

로컬 Git 커밋 그래프 + 읽기 전용 Monaco 좌우 diff를 제공하는 Orca 플러그인입니다. Git 변경 명령은 없습니다. 최소 Orca 버전은 1.4.248입니다.

## 사용

Git Tools 사이드바에서 저장소 절대 경로를 입력해 연결합니다. 최근 200개 커밋의 부모 그래프, HEAD/로컬·원격 브랜치, 검색, 새로고침, 메시지 전문과 변경 파일을 탐색합니다.

- 작업 트리: HEAD → 현재 디스크 최종 내용. staged(HEAD↔index), unstaged(index↔디스크), untracked(index에 없음)는 상태 표시입니다. 별도의 index diff 모드는 없습니다. HEAD와 같아진 내용은 제외됩니다.
- 커밋: 선택 커밋 → 직접 부모 기준 비교. 좌측은 부모, 우측은 선택 커밋입니다. Merge는 부모를 선택하며 최초 커밋의 좌측은 빈 트리입니다.

파일과 동일 경로의 로컬 Orca workspace를 선택하고 **중앙 Diff 탭 열기**를 누릅니다. 저장소의 `.orca/git-tools/<id>.orcadiff`에 저장소·비교 기준·선택 파일을 담아 대상 workspace의 custom editor로 엽니다. 이 폴더가 Git에서 무시되지 않으면 문서가 untracked로 표시되며 ignore 설정은 자동 변경하지 않습니다. 소스 파일과 index는 수정하지 않습니다. 중앙 뷰어는 좌우 정렬, 줄/단어 내 강조, 동기 스크롤, 이전/다음 변경, 동일 영역 접기, 줄 앞뒤 공백 무시를 지원합니다.

## 접근과 제한

`trusted-worker`는 사용자 계정 권한으로 Node 코드를 실행합니다. `workspace:read`는 대상 workspace 탐색, `workspace:write`는 중앙 editor 탭 열기에 사용합니다. 설치/실행은 이 접근에 대한 사용자 승인 뒤에 진행해야 합니다.

UTF-8 파일당 768 KiB까지 텍스트 비교합니다. 바이너리·비 UTF-8·큰 파일·symlink·submodule·충돌은 별도 상태로 표시합니다. 빈 파일과 파일 없음은 구분합니다. 변경 파일 2,000개 초과는 오류입니다. 검색은 로드된 최근 200개에서만 수행합니다. 원격 branch는 로컬 ref만 읽으며 SSH/fetch/Git LFS 다운로드는 지원하지 않습니다. 디스크 조회이므로 저장하지 않은 편집 내용은 포함하지 않으며 수동 새로고침이 필요합니다.

`.orcadiff`는 코드가 아닌 JSON 설명 문서입니다. 외부 문서의 경로를 자동으로 신뢰하지 않으며 사이드바에서 해당 저장소에 먼저 연결해야 합니다. worker 재시작 시 다시 연결합니다. HEAD 변경 시 새로고침이 필요합니다. 비교 문서는 자동 삭제하지 않으며 필요 없을 때 직접 정리할 수 있습니다. 문서 폴더의 symlink는 거절합니다.

UI/Monaco/editor worker는 모두 로컬 번들입니다. 일반 브라우저 preview는 명확히 표시된 **DEMO fixture**입니다. Git 데이터로 오인하지 마세요. 상단에서 로딩/오류/빈 상태와 테마도 확인할 수 있습니다.

**검증 상태:** build/typecheck, Git·패키징 테스트 13개, 브라우저 UI 테스트 10개, manifest validation과 plugin check가 통과했습니다. 사용자 승인 후 Orca 1.4.248의 실제 사이드바 연결·커밋 그래프·중앙 editor.open·document.session·Monaco diff를 확인했습니다. 다크/라이트 editor shot은 themeApplied/subscribed가 true이고 프레임 오류가 없었습니다. 다른 OS/버전/원격 호스트는 미검증입니다. 호스트 타입 생성은 설치본 선언 파일 누락으로 실패해 확인된 API 타입만 수동 관리합니다.

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

빌드는 symlink/node_modules/실행파일/네이티브 모듈/아카이브/미검토 형식을 거절하고 Node 내장 모듈 외 worker 의존성의 미번들링을 검사합니다. WASM은 포함하지 않습니다. 로컬 폰트는 CLI validator를 통과했으며 공개 디렉터리 수락은 아직 미확인입니다. UI와 Monaco의 배경·글자·선택·테두리·포커스·강조색은 프레임에 공개된 `--orca-*` 변수에 연결합니다. 같은 모드 안의 토큰 변경도 모델을 재생성하지 않고 반영합니다. 전용 diff 추가 색상은 프레임에 공개되지 않아 녹색 의미색 fallback을 유지합니다. API는 `host.has`·minor와 문서 session 존재를 검사합니다. 로컬 validation은 공개 등록 또는 실호스트 실행 검증을 대체하지 않습니다.

원문: [개발 가이드](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md), [Manifest](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-manifest.md), [Host API](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-host-api.md), [Catalog](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-catalog.md), [Theme tokens](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-theme-tokens.md), [Listing policy](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-listing-policy.md), [공개 등록 안내](https://www.onorca.dev/plugins/add).
