# Git Logs 스크린샷

[English](README.md) · 한국어

영문 샘플 데이터를 사용하는 브라우저 DEMO 이미지입니다. 실제 저장소 정보나 Orca 호스트를 촬영한 화면은 아닙니다. 이미지를 사용할 때는 DEMO 표시를 유지하십시오.

| 이미지                                               | 내용                                                     |
| ---------------------------------------------------- | -------------------------------------------------------- |
| [git-logs-dark.png](git-logs-dark.png)               | 다크 테마의 커밋 그래프, 커밋 정보, 변경 파일, 좌우 Diff |
| [git-logs-light.png](git-logs-light.png)             | 같은 화면의 라이트 테마                                  |
| [git-logs-commit-menu.png](git-logs-commit-menu.png) | 다크 테마의 커밋 우클릭 메뉴                             |
| [git-logs-hero.png](git-logs-hero.png)               | 다크 캡처를 틀에 넣고 제목과 짧은 문구를 붙인 소개 카드  |

모든 이미지는 1600 × 1000 PNG 파일입니다. 작성자, 메시지, 경로, 코드는 fixture 데이터입니다. 캡처할 때 Git 명령을 실행하지 않으며 Orca 플러그인 실행 승인도 필요하지 않습니다.

## 이미지 다시 만들기

저장소 루트에서 의존성을 설치한 뒤 실행하십시오.

```sh
pnpm install
pnpm nx run git-logs:screenshots
```

플러그인을 빌드한 뒤 이미지 네 장을 `docs/screenshots/`에 저장합니다. 설치된 Google Chrome을 사용합니다. Chromium을 사용하려면 `pnpm exec playwright install chromium`을 실행하고 `PW_CHANNEL=chromium`을 설정하십시오.

## 플러그인 페이지 이미지

manifest는 `git-logs-hero.png`를 커버로, 다크·라이트·커밋 메뉴 캡처를 스크린샷으로 사용합니다. 다크와 라이트에는 테마를 지정해 Orca 테마에 맞는 쪽만 보이게 합니다. 아이콘은 제품 카드와 같은 문양인 `plugins/git-logs/showcase/icon.svg`를 256 × 256 PNG로 렌더링해 `plugins/git-logs/assets/git-logs-icon.png`에 둡니다. 빌드가 캡처 네 장을 `docs/screenshots/`에서 패키지의 `assets/`로 복사하므로 저장소에는 이미지가 한 벌만 있습니다. manifest 경로는 패키지 안의 파일을 가리키며 소스 트리에는 없습니다. 이미지 크기와 파일 용량은 설치된 Orca 검증기로 확인합니다(`pnpm nx run git-logs:validate-plugin`).

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

[영어 소개](../../plugins/orcatopia/assets/orcatopia-introduction.png)와 [한국어 소개](../../plugins/orcatopia/assets/orcatopia-introduction.ko.png)는 1600 × 1000 홍보 이미지입니다. 직접 그린 섬 아이콘, Orcatopia 제품명, 짧은 소개 문구와 실제 브라우저에서 촬영한 fixture 정원을 함께 보여 줍니다. 화면에는 DEMO 표시를 명시합니다. 시스템 글꼴과 로컬 SVG/CSS로 구성하며 다운로드한 폰트나 생성형 게임 화면은 포함하지 않습니다. 영어·한국어 플러그인 README의 첫 이미지로 각각 사용합니다. 설치 후에도 같은 상대 경로가 작동하도록 두 이미지를 패키지의 `assets/`에 포함합니다.

재생성 가능한 레이아웃은 `plugins/orcatopia/tests/introduction.ts`에 있습니다. showcase 테스트에서 언어별 실제 게임 화면을 촬영한 뒤 소개 이미지를 구성합니다. 전체 페이지 스크린샷은 섬 전체 보기를 사용하고, 소개 이미지는 그 상태에서 확대 버튼을 세 번 눌러 중앙 정원을 크게 촬영한 뒤 기울이지 않은 프레임에 담습니다. 두 화면 모두 동일한 최대 확장 fixture입니다. 정원은 fixture의 15종 수집 기록으로 최대 318칸을 해금합니다(면적 상한은 12종에서 도달). 랜드마크 5종 사이로 중앙 화단, 벚꽃 숲, 연못 쉼터, 풍차 초원과 해안 산책길을 조성합니다. 벚꽃 연못, 돌을 깐 분수 광장, 양치식물과 바위가 있는 숲, 따뜻한 흙빛 오아시스, 튤립 초원에 서로 다른 색을 사용합니다. 사이프러스·소나무·단풍나무·야자수의 실루엣을 섞고 흙길과 석재 산책로를 연결합니다. 낮은 화단과 잔디 여백으로 시야를 확보합니다. 유료 제작 장식은 정상 보유·제작 기록을 사용합니다. showcase 테스트에서 최대 확장과 보행 연결성을 검증하며 실제 섬 저장 데이터는 변경하지 않습니다.

```sh
pnpm nx run landmark-island:ui-test --grep='Orcatopia showcase'
cp test-results/landmark-island/orcatopia-introduction.png plugins/orcatopia/assets/orcatopia-introduction.png
cp test-results/landmark-island/orcatopia-introduction.ko.png plugins/orcatopia/assets/orcatopia-introduction.ko.png
cp test-results/landmark-island/orcatopia-icon.png plugins/orcatopia/assets/orcatopia-icon.png
cp test-results/landmark-island/orcatopia-island-demo.png plugins/orcatopia/assets/orcatopia-island.png
cp test-results/landmark-island/orcatopia-island-demo.png docs/screenshots/orcatopia-island.png
pnpm nx run landmark-island:build
pnpm validate
```

로컬 소개 자료이며, 이 이미지를 만들었다고 공개 디렉터리에 게시하거나 배포 후보를 갱신한 것은 아닙니다.

### 새로운 8개국

[현대 랜드마크 그림](orcatopia-modern-countries.png)은 카타르·아제르바이잔·카자흐스탄·방글라데시·르완다·가나·파나마·우루과이의 새 항목을 보여 줍니다. DEMO 모음 이미지는 게임에 포함된 그림과 영어 도감 이름을 렌더링합니다. 사진이나 네이티브 Orca 캡처가 아닌 브라우저 픽스처입니다. 기관별 출처는 [조사 기록](../modern-landmarks-research.ko.md)에 정리했습니다.

```sh
pnpm nx run landmark-island:ui-test --grep='material artwork'
cp test-results/landmark-island/modern-landmarks-59-demo.png docs/screenshots/orcatopia-modern-countries.png
```

manifest는 영문 소개를 커버, 같은 벡터 문양에서 렌더링한 256 × 256 PNG를 아이콘, 전체 영문 DEMO 정원을 스크린샷으로 사용합니다. 촬영 시 맑은 낮을 명시적으로 선택해 기기 시각에 따라 출시 이미지가 바뀌지 않습니다. 한국어·영어 소개를 모두 동봉하며 이미지 크기와 파일 용량은 설치된 Orca 검증기로 확인합니다.


## 현재 오르카토피아 등록 이미지

현재 소개 이미지는 바다·강이 만나는 섬과 불가사의 등급 확대 장면을 함께 담습니다. `?preview=showcase`에서 바다와 강, 불가사의 확대, SVG 합성을 전환하며 기존 저장 데이터와 독립적으로 동작합니다. 현재 이미지 세트는 `pnpm nx run landmark-island:screenshots`로 생성합니다. 위의 이전 정원 showcase는 별도 fixture로 남습니다. `test-results/landmark-island/`의 `orcatopia-introduction.png`, `orcatopia-introduction.ko.png`, `orcatopia-wonders.png`, `orcatopia-fusion.png`를 `plugins/orcatopia/assets/`에 복사하고, `orcatopia-island-demo.png`는 `orcatopia-island.png`로 복사합니다. 모두 1600 × 1000이며 DEMO 표시를 유지합니다. manifest에는 수상 섬·불가사의 확대·합성 결과를 영문·한국어로 총 6장 등록하고 한국어 소개 이미지도 README에 제공합니다. 외부 이미지 없이 기존 SVG/CSS만 사용하며, 지형별 배치·제작 수량·기존 브라우저 저장 보존을 검사합니다.

현재 휴양지 fixture는 랜드마크 26개(해상 10개), 장식 310개, 강 타일 80개로 구성합니다. 여러 줄로 붙인 강 타일은 넓고 연속된 수면을 표시합니다. 야자수 해안·수목 정원·꽃길·쉼터와 바다의 범선·산호 장식은 정상 보유 수량과 재료로 충당한 제작 기록을 사용합니다.

등록 갤러리는 영문 세 장 다음에 한국어 세 장을 배치한 총 6장입니다. 대표 이미지는 영문을 유지합니다. 재생성 시 `orcatopia-island-demo.ko.png`, `orcatopia-wonders.ko.png`, `orcatopia-fusion.ko.png`도 생성하며 플러그인 assets로 복사합니다. 섬 이미지는 `orcatopia-island.ko.png`로 이름을 바꿉니다. 언어별 자동 전환 없이 같은 갤러리에 함께 노출합니다.

0.4.0의 재촬영 결과는 플러그인 assets의 `orcatopia-<장면>-v0.4.0[.ko].png`에 복사합니다. 기존 버전의 이미지 해시를 보존하기 위해 버전 없는 소개 이미지와 섬 파일은 원본을 유지합니다. `docs/screenshots/orcatopia-island.png`는 현재 문서용 사본입니다.
