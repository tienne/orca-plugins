# Git Logs 스크린샷

[English](README.md) · 한국어

영문 샘플 데이터를 사용하는 브라우저 DEMO 이미지입니다. 실제 저장소 정보나 Orca 호스트를 촬영한 화면은 아닙니다. 이미지를 사용할 때는 DEMO 표시를 유지하십시오.

| 이미지                                               | 내용                                                     |
| ---------------------------------------------------- | -------------------------------------------------------- |
| [git-logs-dark.png](git-logs-dark.png)               | 다크 테마의 커밋 그래프, 커밋 정보, 변경 파일, 좌우 Diff |
| [git-logs-light.png](git-logs-light.png)             | 같은 화면의 라이트 테마                                  |
| [git-logs-commit-menu.png](git-logs-commit-menu.png) | 다크 테마의 커밋 우클릭 메뉴                             |

모든 이미지는 1600 × 1000 PNG 파일입니다. 작성자, 메시지, 경로, 코드는 fixture 데이터입니다. 캡처할 때 Git 명령을 실행하지 않으며 Orca 플러그인 실행 승인도 필요하지 않습니다.

## 이미지 다시 만들기

저장소 루트에서 의존성을 설치한 뒤 실행하십시오.

```sh
pnpm install
pnpm nx run git-logs:screenshots
```

플러그인을 빌드한 뒤 이미지 세 장을 `docs/screenshots/`에 저장합니다. 설치된 Google Chrome을 사용합니다. Chromium을 사용하려면 `pnpm exec playwright install chromium`을 실행하고 `PW_CHANNEL=chromium`을 설정하십시오.

## DEMO 열기

```sh
pnpm nx run git-logs:preview
```

`http://127.0.0.1:4173/?lang=en&sample=en`을 열고 테마를 선택하십시오. `lang=en`은 UI를 영어로 표시하고 `sample=en`은 브라우저 DEMO의 영문 샘플 데이터를 선택합니다. 실제 Orca의 Git 데이터를 번역하는 옵션은 아닙니다.

개발 환경과 검증 방법은 [저장소 README](../../README.ko.md)와 [개발 안내](../development.ko.md)를 참고하십시오.

## Orcatopia

[orcatopia-island.png](orcatopia-island.png)은 최대로 확장한 섬에 에펠탑·후지산·타지마할·킨더다이크·페트라와 벚꽃 숲, 화단, 석재 산책로, 분수, 파빌리온, 연못, 가로등을 배치한 영문 정원 fixture입니다. 기존 게임 장식만 사용하며 보유 수량과 제작 기록을 검증한 배치입니다. 전체 페이지 캡처로 DEMO 표시를 유지합니다. 실제 사용자 저장이나 Orca 호스트 캡처가 아닙니다.

다음 명령으로 다시 생성하고 복사합니다.

```sh
pnpm nx run landmark-island:ui-test --grep='Orcatopia showcase'
cp test-results/landmark-island/orcatopia-island-demo.png docs/screenshots/orcatopia-island.png
```

### 제품 소개 이미지

[영어 소개](../../plugins/landmark-island/assets/orcatopia-introduction.png)와 [한국어 소개](../../plugins/landmark-island/assets/orcatopia-introduction.ko.png)는 1600 × 1000 홍보 이미지입니다. 직접 그린 섬 아이콘, Orcatopia 제품명, 짧은 소개 문구와 실제 브라우저에서 촬영한 fixture 정원을 함께 보여 줍니다. 화면에는 DEMO 표시를 명시합니다. 시스템 글꼴과 로컬 SVG/CSS로 구성하며 다운로드한 폰트나 생성형 게임 화면은 포함하지 않습니다. 영어·한국어 플러그인 README의 첫 이미지로 각각 사용합니다. 설치 후에도 같은 상대 경로가 작동하도록 두 이미지를 패키지의 `assets/`에 포함합니다.

재생성 가능한 레이아웃은 `plugins/landmark-island/tests/introduction.ts`에 있습니다. showcase 테스트에서 언어별 실제 게임 화면을 촬영한 뒤 소개 이미지를 구성합니다. 정원은 fixture의 12종 수집 기록으로 최대 318칸을 해금합니다. 랜드마크 5종 사이로 중앙 화단, 벚꽃 숲, 연못 쉼터, 풍차 초원과 해안 산책길을 조성합니다. 유료 제작 장식은 정상 보유·제작 기록을 사용합니다. showcase 테스트에서 최대 확장과 보행 연결성을 검증하며 실제 섬 저장 데이터는 변경하지 않습니다.

```sh
pnpm nx run landmark-island:ui-test --grep='Orcatopia showcase'
cp test-results/landmark-island/orcatopia-introduction.png plugins/landmark-island/assets/orcatopia-introduction.png
cp test-results/landmark-island/orcatopia-introduction.ko.png plugins/landmark-island/assets/orcatopia-introduction.ko.png
cp test-results/landmark-island/orcatopia-island-demo.png docs/screenshots/orcatopia-island.png
pnpm nx run landmark-island:build
pnpm validate
```

로컬 소개 자료이며, 이 이미지를 만들었다고 공개 디렉터리에 게시하거나 배포 후보를 갱신한 것은 아닙니다.
