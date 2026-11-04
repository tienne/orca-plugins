# Git Tools 0.1.0

로컬 Git 커밋 그래프 + 읽기 전용 Monaco 좌우 diff를 제공하는 Orca 플러그인입니다. Git 변경 명령은 없습니다. 최소 Orca 버전은 1.4.248입니다.

## 사용

Git Tools 사이드바에서 저장소 절대 경로를 입력해 연결합니다. 최근 200개 커밋의 부모 그래프, HEAD/로컬·원격 브랜치, 검색, 새로고침, 메시지 전문과 변경 파일을 탐색합니다.

- 작업 트리: HEAD → 현재 디스크 최종 내용. staged(HEAD↔index), unstaged(index↔디스크), untracked(index에 없음)는 상태 표시입니다. 별도의 index diff 모드는 없습니다. HEAD와 같아진 내용은 제외됩니다.
- 커밋: 선택 커밋 → 직접 부모 기준 비교. 좌측은 부모, 우측은 선택 커밋입니다. Merge는 부모를 선택하며 최초 커밋의 좌측은 빈 트리입니다.

파일과 동일 경로의 로컬 Orca workspace를 선택하고 **중앙 Diff 탭 열기**를 누릅니다. 임시 `.orcadiff` 문서에 저장소·비교 기준·선택 파일을 담아 custom editor로 엽니다. 소스 파일과 index는 수정하지 않습니다. 중앙 뷰어는 좌우 정렬, 줄/단어 내 강조, 동기 스크롤, 이전/다음 변경, 동일 영역 접기, 줄 앞뒤 공백 무시를 지원합니다.

## 접근과 제한

`trusted-worker`는 사용자 계정 권한으로 Node 코드를 실행합니다. `workspace:read`는 대상 workspace 탐색, `workspace:write`는 중앙 editor 탭 열기에 사용합니다. 설치/실행은 이 접근에 대한 사용자 승인 뒤에 진행해야 합니다.

UTF-8 파일당 768 KiB까지 텍스트 비교합니다. 바이너리·비 UTF-8·큰 파일·symlink·submodule·충돌은 별도 상태로 표시합니다. 빈 파일과 파일 없음은 구분합니다. 변경 파일 2,000개 초과는 오류입니다. 검색은 로드된 최근 200개에서만 수행합니다. 원격 branch는 로컬 ref만 읽으며 SSH/fetch/Git LFS 다운로드는 지원하지 않습니다. 디스크 조회이므로 저장하지 않은 편집 내용은 포함하지 않으며 수동 새로고침이 필요합니다.

`.orcadiff`는 코드가 아닌 JSON 설명 문서입니다. 외부 문서의 경로를 자동으로 신뢰하지 않으며 사이드바에서 해당 저장소에 먼저 연결해야 합니다. worker 재시작 시 다시 연결합니다. HEAD 변경 시 새로고침이 필요합니다. 임시 문서는 OS가 정리할 수 있습니다.

UI/Monaco/editor worker는 모두 로컬 번들입니다. 일반 브라우저 preview는 명확히 표시된 **DEMO fixture**입니다. Git 데이터로 오인하지 마세요. 상단에서 로딩/오류/빈 상태와 테마도 확인할 수 있습니다.

**검증 경계:** build/typecheck, 실제 임시 Git 테스트, packaged manifest validation과 브라우저 UI 테스트를 수행합니다. 승인된 Orca plugin frame의 CSP·worker, document.session, 임시 파일 editor.open 연결은 사용자 승인 후 별도 검증이 필요합니다. 호스트 타입 생성은 설치본 선언 파일 누락으로 실패해 확인된 API 타입만 수동 관리합니다.

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

`ui-test`는 설치된 Google Chrome을 사용합니다. Chromium 사용 시 `pnpm exec playwright install chromium` 후 `PW_CHANNEL=chromium`을 설정합니다. 배포 폴더는 `dist/plugins/git-tools`이며 독립 설치에 저장소의 node_modules가 필요하지 않습니다. 이 작업에서 plugin load/approve 또는 공개 배포는 실행하지 않았습니다.
