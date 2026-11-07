# Git 브랜치와 배포

[English](releases.md) · 한국어

`main`에서 소스를 관리하고 `release`에는 설치용 플러그인과 카탈로그를 둡니다. 소스 브랜치의 카탈로그는 빈 템플릿으로 유지합니다. GitHub Actions는 먼저 배포 후보를 만들며, 실제 push는 별도로 선택해야 합니다.

소스는 [tienne/orca-plugins](https://github.com/tienne/orca-plugins)에 공개돼 있습니다. 자동 배포를 위한 릴리스 러너와 환경 보호 규칙은 별도로 설정해야 합니다. Orca는 배포 ref와 하위 폴더 지정을 지원하며, 브랜치 분리는 이 저장소의 운영 규칙입니다.

## 브랜치와 버전

| Ref                  | 내용                                                            |
| -------------------- | --------------------------------------------------------------- |
| `main`               | 소스, 문서, 테스트, 워크플로                                    |
| `feat/*`, `fix/*`    | 리뷰 후 `main`에 병합할 변경                                    |
| `release`            | 빌드한 플러그인, `orca-catalog.json`, `release-provenance.json` |
| `directory/git-logs` | 공개 디렉터리가 읽는 루트 배치의 Git Logs 번들                  |
| `git-logs/vX.Y.Z`    | 해당 버전을 만든 소스 커밋의 변경 불가 태그                     |
| `vX.Y.Z`             | 공개 디렉터리용 루트 번들 커밋의 태그                           |

`release`의 생성 파일을 직접 수정하지 않습니다. 소스를 고쳐 새 버전으로 배포합니다. 첫 배포 후보는 orphan 이력으로 시작하고 이후 후보는 기존 이력과 다른 플러그인 폴더를 유지합니다. `release`를 `main`에 역으로 병합하지 않습니다.

안정 버전 `X.Y.Z`만 지원합니다. 병합 전에 `plugins/git-logs/orca-plugin.json`과 플러그인의 `package.json` 버전을 갱신합니다. 공개한 버전을 다시 사용하거나 낮출 수 없습니다. 이전 릴리스는 유지하며, 32개에 도달하면 호환성을 검토하고 정리할 수 있도록 중단합니다.

## CI

`ci.yml`은 `main` 대상 PR, `main` push, 수동 검사에서 `checks.yml`을 호출합니다. 검사는 저장소 읽기 권한으로 GitHub 호스팅 Ubuntu 러너에서 실행합니다.

- 버전과 다운로드 체크섬을 고정한 actionlint로 워크플로 문법과 표현식을 검사합니다.
- Node 24와 pnpm으로 lockfile 의존성을 설치합니다.
- Nx로 빌드, 타입 검사, Git·번역·패키징 테스트, 배포 테스트, 브라우저 UI 테스트를 실행합니다.
- Playwright는 Chromium과 새 미리보기 서버를 사용합니다.
- 성공한 설치용 빌드는 14일간 보관합니다. 실패 시 결과를 포함해 브라우저 테스트 결과는 7일간 보관합니다.

호스팅 러너의 배포 테스트는 Orca 모의 어댑터로 배포 로직을 검사합니다. Orca 스키마와 해시 호환성까지 검증하는 것은 아닙니다. 승격 단계에서 설치된 실제 Orca CLI로 같은 테스트를 다시 실행합니다.

## GitHub 초기 설정

소스 저장소를 공개한 뒤 저장소 소유자가 설정해야 합니다.

1. 예정된 저장소 `tienne/orca-plugins`를 사용하고 리뷰한 소스를 `main`에 병합합니다.
2. `main`을 보호하고 첫 워크플로 실행에서 확인한 CI 검사를 필수로 지정합니다. `release` 갱신 권한은 배포 관리자나 워크플로로 제한합니다. 배포 주체의 직접 push는 허용하며 소스 브랜치의 PR·CI 요건이 생성된 배포 커밋을 막지 않도록 설정합니다.
3. `self-hosted`, `macOS`, `orca-release` 라벨의 전용 macOS 러너를 등록합니다. 가능하면 작업마다 폐기하는 러너를 사용합니다. 검증한 Orca 데스크톱 CLI, Git, 지원하는 Node 환경이 필요하며 `orca --version`이 동작해야 합니다. 워크플로가 Node 24와 pnpm을 설정합니다.
4. `release-preview`, `production` 환경을 만듭니다. 배포 브랜치는 `main`으로 제한하고, 공개를 활성화하기 전에 `production`의 필수 승인자를 설정합니다. 워크플로는 환경을 참조할 뿐 **보호 규칙을 자동으로 만들지 않습니다.**
5. 공개 job의 `GITHUB_TOKEN`에 저장소 contents 쓰기를 허용합니다. 미리보기는 읽기 권한만 받습니다. 같은 저장소에 배포하므로 개인 액세스 토큰은 필요하지 않습니다.
6. 러너와 환경 설정이 끝나면 저장소 Actions 변수 `ORCA_RELEASE_ENABLED=true`를 지정합니다.

자체 러너는 `tienne/orca-plugins`의 `main`에서 수동 실행하고 활성화 변수까지 설정했을 때만 사용합니다. PR에서는 실행하지 않습니다. 신뢰한 저장소 코드를 실행하고 공개 job에서 배포 자격 증명을 사용하므로 개인 개발 컴퓨터를 러너로 등록하지 않습니다. 작업마다 폐기하는 러너는 임시 배포 후보도 함께 정리합니다.

러너의 Orca는 검증한 버전으로 고정합니다. `plugin validate`와 `plugin release-entry`를 지원해야 하며 로컬 검증에는 1.4.248을 사용했습니다. 두 명령은 플러그인 코드를 실행하거나 승인하지 않습니다.

## 배포 미리보기

GitHub Actions에서 `main`을 선택해 **Release Orca Plugin**를 실행합니다.

- `version`: manifest에 이미 커밋한 안정 버전입니다. 예: `0.1.0`.
- `publish`: 기본값인 선택 해제 상태로 둡니다.

CI를 다시 실행하고 같은 실행·소스 SHA의 산출물을 내려받습니다. macOS 러너는 산출물과 소스 manifest가 일치하는지 검사하고 Orca로 검증한 뒤 후보를 만듭니다.

후보에는 두 커밋이 있습니다.

1. `plugins/git-logs/`의 빌드 파일과 소스 출처 기록.
2. Orca가 생성한 **첫 번째 커밋**과 `contentHash`를 가리키는 카탈로그.

Job 요약에는 소스·산출물·카탈로그 커밋과 content hash를 기록합니다. `release-plan-<SHA>` artifact에는 계획, 후보 카탈로그, 소스 출처 기록이 포함됩니다. 미리보기는 어떤 ref도 push하지 않습니다.

## 공개

미리보기를 검토한 뒤 같은 버전으로 **Release Orca Plugin**를 다시 실행하고 `publish`를 선택합니다. 이전 임시 폴더를 재사용하는 것이 아니라 새 실행에서 다시 빌드·검증하므로 소스 SHA와 content hash를 확인합니다. `production` 환경에는 위에서 설정한 승인 규칙이 적용됩니다.

스크립트는 소스 상태, 후보 이력, 빌드 파일, Orca 해시, 카탈로그, 출처 기록, 배포 URL, 기존 태그, 원격 ref를 검사합니다. Git clean filter가 내용을 바꾸는 경우도 잡도록 카탈로그·출처 기록을 포함한 커밋 blob과 검증 파일을 대조합니다. 이어 `release` 브랜치와 소스 태그를 한 번의 atomic Git push로 갱신합니다.

산출물 커밋의 부모는 이전 release tip이어야 하며 카탈로그 커밋이 그 뒤에 바로 와야 합니다. 서버의 exact-base lease는 사전 검사와 push 사이의 브랜치 변경·삭제를 거절합니다. 이력 재작성은 허용하지 않으며, 부모 관계를 확인한 뒤에만 이 lease를 사용합니다. 기존 태그도 덮어쓰지 않습니다. 별도 push URL 설정의 영향을 받지 않도록 검사한 저장소 URL에 직접 push하며 push 전용 URL 재작성 규칙은 거절합니다.

소스 SHA는 워크플로 시작 시 고정합니다. 공개 사전 검사에서 이미 `main`이 바뀌었다면 중단합니다. 검사 후 다른 작업으로 `main`이 전진해도 산출물·태그·출처 기록은 바뀌지 않고 검토한 소스 스냅샷을 사용합니다. 워크플로는 `main`을 잠그거나 갱신하지 않습니다.

Push 실패를 강제로 재시도하지 않습니다. 최신 release 상태를 가져와 새 후보를 만듭니다. 이전 버전을 자동으로 되돌리거나 재배포하지 않으며, 수정한 소스를 더 높은 버전으로 배포합니다.

## 로컬에서 공개 없이 확인하기

소스 변경을 먼저 커밋하고 빌드합니다. 후보 생성에는 깨끗한 소스 checkout이 필요합니다. 기존 `release` 브랜치가 있다면 `refs/remotes/origin/release`로 fetch합니다. 로컬 ref가 없으면 첫 배포 후보로 취급하지만, 공개 단계에서 실제 원격을 확인하므로 예상하지 못한 기존 브랜치가 있으면 거절합니다.

```sh
pnpm nx run git-logs:build

RELEASE_REPOSITORY=https://github.com/tienne/orca-plugins.git \
RELEASE_VERSION=0.1.0 \
RELEASE_SOURCE_SHA="$(git rev-parse HEAD)" \
RELEASE_REPORT=/tmp/git-logs-release-plan.json \
pnpm nx run git-logs:release-prepare
```

매번 새 report 파일명을 사용합니다. 이 명령은 로컬에서 검증하고 Git 객체를 별도의 임시 저장소로 복사합니다. 네트워크 원격 통신·push·소스 브랜치 변경·플러그인 승인을 하지 않습니다. 출력한 후보 경로를 확인하고 검토가 끝나면 정리합니다. 같은 컴퓨터에서 나중에 공개할 예정이라면 계획 파일과 후보 폴더를 함께 보관합니다.

`release-publish`는 원격 ref를 쓰는 별도 target입니다. 검토한 계획을 가리키는 `RELEASE_PLAN`, 일치하는 HTTPS GitHub origin, 변경되지 않은 소스 checkout이 필요합니다. 공개를 허가받았을 때만 사용하며 CI나 미리보기에는 포함되지 않습니다.

배포 테스트는 다음과 같이 실행합니다.

```sh
pnpm nx run git-logs:release-test
ORCA_RELEASE_INTEGRATION=1 ORCA_CLI_COMMAND=orca pnpm nx run git-logs:release-test
```

테스트는 임시 로컬 bare 저장소에만 push합니다. 두 번째 명령은 실제 Orca validator와 릴리스 해시 생성기를 사용합니다. Linux에서는 GNOME의 동명 도구 대신 Orca 데스크톱 CLI인 `orca-ide`를 지정합니다.

## 설치와 공개 디렉터리

사용자는 Orca의 **Settings → Plugins → ⋯ → Catalog sources…**에서 `tienne/orca-plugins`의 Git URL과 `release` ref를 추가합니다. 카탈로그는 `plugins/git-logs`만 설치하며 ID는 `tienne.git-logs`입니다. 사용자가 소스를 빌드하거나 pnpm을 설치할 필요는 없지만 설치 시 실행 권한 승인은 필요합니다.

자동 릴리스 워크플로는 사용자 지정 카탈로그를 배포합니다. 공개 디렉터리는 `directory/git-logs` 브랜치의 루트 배치 번들과 `vX.Y.Z` 태그로 등록합니다. `git-logs/vX.Y.Z`는 계속 소스 커밋을 가리키며 옮기지 않습니다. 저장소의 `orca-plugin` 토픽으로 탐색을 활성화합니다. 인덱싱 결과는 [디렉터리 상태 페이지](https://www.onorca.dev/plugins/tienne/orca-plugins)에서 확인하십시오. 태그를 공개했다고 검색 노출까지 완료된 것은 아닙니다.

### 디렉터리용 번들 공개

1. 공개한 카탈로그가 고정한 설치 파일 커밋에서 시작합니다. 별도 Git 체크아웃의 루트에 `plugins/git-logs/` 내용만 내보냅니다. 설치 파일은 바꾸지 않으며, 출처는 패키지 파일을 추가하는 대신 커밋 메시지에 기록합니다.
2. 루트에서 `orca plugin validate`, `orca plugin check`, `orca plugin release-entry`를 실행합니다. 생성된 콘텐츠 해시가 기존 카탈로그 릴리스와 같은지 확인하고, 커밋한 각 blob이 검증한 패키지 바이트와 같은지도 대조합니다.
3. 기존 ref를 다시 쓰지 않고 `directory/git-logs`와 새 `vX.Y.Z` 태그를 원자적으로 공개합니다. 이후 번들은 기존 디렉터리 브랜치 이력을 이어야 합니다. 이 저장소의 일반 `vX.Y.Z` 태그는 Git Logs용으로 사용합니다.
4. 공개 상태 페이지를 확인합니다. 인덱싱은 디렉터리 자체 일정으로 실행되므로 실제 목록에 나타나기 전에는 검색할 수 있다고 안내하지 않습니다.

0.1.0의 디렉터리 태그는 `d957b8a6bbff132cac1b4e60e80d5bd518dd1a2e`를 가리키며, 설치 파일 커밋 `c06f01b7c62909b4f8752e1e91a2f182b3dfd97e`에서 내보냈습니다. 두 경로는 같은 파일 18개와 Orca 콘텐츠 해시 `4e4723bf66e38ecee3807d05257019cd025074f6432921e6b70c41f26be14f41`을 갖습니다. 루트 번들은 로컬 검증을 통과했으며 실제 인덱싱 결과는 상태 페이지에서 확인합니다. 디렉터리용 번들 공개는 현재 수동 단계로, `Release Orca Plugin`에는 포함되지 않습니다.

근거: [Orca 배포 가이드](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-authoring.md#5-publish-to-a-catalog), [카탈로그 필드](https://github.com/stablyai/orca/blob/main/docs/reference/plugin-catalog.md), [공개 디렉터리](https://www.onorca.dev/plugins/add).

## Orcatopia 배포 후보

**Release Orca Plugin**에 `plugin` 선택 항목을 추가했습니다. 기본값은 기존 `git-logs`이며 Orcatopia는 `landmark-island`를 선택합니다. CI는 두 플러그인을 각각 검사하고 업로드합니다. 배포 작업은 허용된 플러그인인지 확인하고 같은 소스 SHA의 산출물을 사용하며 실제 Orca CLI 통합 테스트를 실행합니다. 두 플러그인은 같은 릴리스 동시 실행 그룹과 브랜치를 공유합니다. 기본 동작은 미리보기이며 러너·환경 보호·저장소 권한을 자동 설정하지 않습니다.

Orcatopia의 내부 ID는 `landmark-island`, 최초 버전은 `0.1.0`입니다. 카탈로그 정체성은 `tienne.landmark-island`, 소스 태그는 `landmark-island/v0.1.0`, 패키지 경로는 `plugins/landmark-island`입니다. 후보 준비는 Git Logs 파일·카탈로그 이력·출처 정보를 보존합니다. Git Logs 공개 디렉터리에 예약된 일반 `vX.Y.Z` 태그를 사용하지 마세요. Orcatopia의 별도 공개 디렉터리 등록은 아직 준비하지 않았습니다.

커밋과 빌드 후 `git fetch --no-tags origin refs/heads/release:refs/remotes/origin/release`로 로컬 릴리스 기준을 갱신하고 다음과 같이 후보를 만듭니다.

```sh
pnpm nx run landmark-island:build
RELEASE_REPOSITORY=https://github.com/tienne/orca-plugins.git \
RELEASE_VERSION=0.1.0 \
RELEASE_SOURCE_SHA="$(git rev-parse HEAD)" \
RELEASE_REPORT=/tmp/orcatopia-release-plan.json \
pnpm nx run landmark-island:release-prepare
```

매번 새 보고서 파일명을 사용하세요. 별도 임시 저장소에 후보를 만들고 설치된 Orca CLI로 검증하며 푸시하거나 플러그인 코드를 실행하지 않습니다. 보고서의 소스·산출물·카탈로그 커밋과 콘텐츠 해시를 검토합니다. 로컬 미리보기는 `main`이 아닌 브랜치에서도 가능하지만, 나중에 게시하려면 검토한 정확한 소스가 원격 `main`에 있어야 하고 최신 릴리스 기준 및 별도 승인이 필요합니다. 소스·패키지·릴리스 기준이 바뀌면 후보를 다시 준비합니다.

게시 전에 실제 패널 클릭, Orca 전체 재시작 후 저장 유지, 신규 설치·업데이트를 격리 프로필이나 내보낸 백업을 준비한 환경에서 확인해야 합니다. 개발 정체성 `local.landmark-island`와 카탈로그 정체성 `tienne.landmark-island`는 실행 승인이 각각 필요하며 기존 백업 UI로 저장을 옮깁니다. 승인과 저장 공간이 자동 승계된다고 가정하지 마세요. 이 검증은 아직 미완료이며 표시 이름만 바꾸는 것은 개발 정체성을 유지합니다.

게임 기능과 제한은 [한국어 플러그인 안내](../plugins/landmark-island/README.ko.md), 브라우저 fixture 이미지는 [데모 이미지 안내](screenshots/README.ko.md)에 기록합니다. 이미지는 실제 호스트 검증 증거가 아닙니다. 0.1.0 릴리스 노트: 워크트리로 얻는 탐험권, 4개 등급의 랜드마크 36종, 확장되는 섬, 장식 제작, 캔버스 보물상자 연출, 한국어·영어 UI와 로컬 백업·복원. 클라우드 계정·행동 분석·구매 기능은 포함하지 않습니다.

### 로컬 준비 검증 (2026-11-07)

- Nx로 두 플러그인의 빌드·타입 검사와 워커·상태 테스트를 통과했습니다. Git Logs 테스트는 49개입니다.
- Orcatopia 전체 UI 48개와 Git Logs UI 22개를 통과했습니다. 추가한 영문 소개 화면·기존 저장 호환 검사는 별도로 1개 통과했습니다.
- 릴리스·워크플로 테스트는 모의 검증기로 22개, 실제 Orca 1.4.250 CLI로 22개 통과했습니다. 모든 게시 테스트는 임시 로컬 bare 저장소만 사용합니다.
- `pnpm validate`로 두 패키지가 통과했고 고정 버전 actionlint 1.7.11로 워크플로 문법을 확인했습니다. 배포 대상 선택 변경의 독립 정적 검토에서 문제를 찾지 못했습니다. 원격 CI나 운영 승인에 해당하지 않습니다.
- 개발 호스트에서 Orcatopia 이름, 실행 중 상태와 추가 승인 불필요 상태를 확인했습니다. 실제 클릭은 보류 중입니다. 원격 CI 실행·공개 설치·앱 재시작·푸시·게시를 했다고 주장하지 않습니다.
