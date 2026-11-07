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

[orcatopia-island.png](orcatopia-island.png)은 에펠탑·타지마할·페트라를 배치한 영문 브라우저 fixture입니다. 전체 페이지 캡처로 DEMO 표시를 유지합니다. 실제 사용자 저장이나 Orca 호스트 캡처가 아닙니다.

다음 명령으로 다시 생성하고 복사합니다.

```sh
pnpm nx run landmark-island:ui-test --grep='Orcatopia showcase'
cp test-results/landmark-island/orcatopia-island-demo.png docs/screenshots/orcatopia-island.png
```
