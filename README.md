# Tienne Orca Plugins

pnpm + Nx 기반의 Orca 플러그인 모노레포입니다.

## 시작

- Node.js 22.12 이상 또는 24 이상과 pnpm 10을 사용합니다.
- `pnpm install`
- `pnpm build` — `dist/plugins/git-tools`에 독립 설치 가능한 폴더 생성
- `pnpm typecheck`
- `pnpm validate` — 빌드 후 Orca CLI로 배포 폴더 검증
- `pnpm dev` — 일반 브라우저에서 UI 미리보기 (Orca bridge는 연결되지 않음)

## Orca 개발

빌드한 뒤 `orca plugin dev load ./dist/plugins/git-tools --json`으로 개발 폴더를 등록합니다.
코드를 실행하는 플러그인이므로 Orca가 표시하는 접근 범위를 확인하고 승인해야 합니다.
현재 starter worker는 버전 정보만 반환하며 Git 명령은 아직 실행하지 않습니다.
소스 변경 후 다시 빌드합니다. 필요하면 `orca plugin dev reload ./dist/plugins/git-tools --json`을 사용합니다.

## 구조

- `plugins/git-tools/src/ui`: React UI
- `plugins/git-tools/src/worker`: Node.js worker
- `plugins/git-tools/src/protocol.ts`: frame/worker 타입 경계
- `scripts/build-plugin.mjs`: UI·worker 번들 및 배포 폴더 생성
- `orca-catalog.json`: tienne용 카탈로그. 첫 릴리스 전이라 비어 있습니다.

공통 패키지는 실제 재사용이 생기면 `packages/*`에 추출합니다. Graph와 Diff는 하나의 `git-tools` 플러그인으로 개발합니다.

## 배포

Orca는 카탈로그에 지정된 Git 커밋의 하위 폴더만 설치합니다. `dist/`는 로컬 빌드 산출물로 Git에서 제외되어 있으므로 현재 카탈로그는 설치용 릴리스를 포함하지 않습니다.
공개 배포 전에는 생성한 독립 플러그인 폴더를 릴리스 브랜치의 고정 경로에 커밋하고 `orca plugin release-entry`로 해시·커밋을 생성해 카탈로그에 등록해야 합니다. 실제로 존재하지 않는 릴리스 항목은 등록하지 않습니다.

현재는 로컬 개발용이며 GitHub 저장소 생성·push·공개 배포는 하지 않았습니다.
