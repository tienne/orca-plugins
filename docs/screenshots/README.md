# Git Logs screenshots

영어 UI와 가상 저장소 데이터로 캡처한 **브라우저 DEMO**입니다. 실제 저장소 정보나 Orca 호스트 화면이 아닙니다. 이미지 상단의 DEMO 표시를 유지합니다.

| 파일                                                 | 내용                                                    |
| ---------------------------------------------------- | ------------------------------------------------------- |
| [git-logs-dark.png](git-logs-dark.png)               | 다크 테마: 커밋 그래프, 커밋 상세, 변경 파일, 좌우 Diff |
| [git-logs-light.png](git-logs-light.png)             | 같은 화면의 라이트 테마                                 |
| [git-logs-commit-menu.png](git-logs-commit-menu.png) | 다크 테마의 커밋 우클릭 메뉴                            |

모두 PNG, 1600 × 1000입니다. 코드와 작성자·메시지는 fixture 데이터이며 실제 Git 명령은 실행하지 않습니다. 샘플 선택은 브라우저 DEMO에만 적용되며 실제 Orca 데이터의 번역·변경에는 관여하지 않습니다.

모노레포 루트에서 다시 생성합니다.

```sh
pnpm nx run git-logs:screenshots
```

설치된 Google Chrome을 사용합니다. Chromium 사용 시 먼저 `pnpm exec playwright install chromium`을 실행하고 `PW_CHANNEL=chromium`을 설정하세요.

직접 미리 보려면:

```sh
pnpm nx run git-logs:preview
```

`http://127.0.0.1:4173/?lang=en&sample=en`을 열고 상단에서 테마를 선택합니다.
