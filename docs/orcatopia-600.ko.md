# Orcatopia 600종 확장 기록

[English](orcatopia-600.md) · 한국어

현재 700종 도감은 [바다·강 100종 확장 기록](orcatopia-700.ko.md)에 있습니다. 아래 숫자와 시뮬레이션은 600종 당시의 기록입니다.

이 문서는 개발 중인 카탈로그 확장과 출처와 게임 계약을 기록합니다. 공개 배포나 실제 사용자 저장 검증을 뜻하지 않습니다.

일반 실제 장소 600종과 합성 전용 + 600종을 제공합니다. 기존 306종에 294종을 추가했고 국가 분류는 103곳에서 146곳으로 늘었습니다. 신규 장소는 서로 다른 UNESCO 유산으로 선정했으며 기존 장소와 같은 유산 번호를 쓰거나 같은 위치를 별칭으로 추가하지 않았습니다. 국가 수는 수집 분류 기준이며 국가의 법적 지위 판단을 뜻하지 않습니다.

| 등급     | 기존 | 추가 | 전체 | 등급 확률 | 개별 장소 확률 |
| -------- | ---: | ---: | ---: | --------: | -------------: |
| 발견     |  154 |  137 |  291 |       70% |       0.24055% |
| 보물     |  119 |  124 |  243 |       23% |       0.09465% |
| 경이     |   25 |   29 |   54 |        6% |       0.11111% |
| 불가사의 |    8 |    4 |   12 |        1% |       0.08333% |

| 지형             | 추가 | 전체 | 전체 등급별 수(발견/보물/경이/불가사의) |
| ---------------- | ---: | ---: | --------------------------------------- |
| 육지             |  217 |  504 | 254 / 201 / 40 / 9                      |
| 강               |   34 |   41 | 17 / 17 / 6 / 1                         |
| 바다             |   16 |   22 | 0 / 15 / 6 / 1                          |
| 육지와 바다 겸용 |   27 |   33 | 20 / 10 / 2 / 1                         |

장식은 테마 1,226종(600×2와 기존 수상 호환 13종의 추가 26개), 무료 기본 5종, 정원 중심 4종, 첫 합성 별빛 기념비 600종, 관광 건물 4종으로 총 1,839종입니다. 물 전용은 96테마×2=192종입니다. 일반 발견 선물은 613개 항목, 합성 발견 선물은 600개 항목이며 수량은 서로 다른 장식 ID를 기준으로 셉니다. 기존 수상 호환 13종만 원래 정원 선물과 추가 물 선물을 함께 유지합니다.

## 출처와 재생성

원문은 [UNESCO DataHub whc001](https://data.unesco.org/explore/dataset/whc001/)의 공식 기록입니다. `scripts/data/orcatopia-heritage-294.json`에 공식 명칭, ISO 2자리 국가, 대표 구성 요소 좌표, 원문 API 주소, 조회일(2026-11-15), 원문 소개의 SHA-256을 보존했습니다. `orcatopia-600.tsv`에 직접 정리한 한영 이름, 핵심 특징, 지형, 등급, `orcatopia-600-profiles.tsv`에 그림의 상대 윤곽 높이와 세부 특징을 둡니다. 그림은 측량 모델이 아닌 미니어처 해석이며 움직임은 역사적 사실과 구분한 가상 장면입니다. UNESCO 사진, 로고, 원격 폰트는 사용하지 않습니다. 사실 정보와 번역의 CC BY-SA 4.0 표시는 플러그인의 `licenses/heritage.txt`에 있습니다.

출처 검토는 원문 소개와 핵심 특징을 대조한 내용 검토입니다. 자동 테스트는 원문 내용의 진위를 판정하지 않습니다. 자동으로는 개수, 고유 ID, 유산 번호, 공식 명칭 중복, 국가 코드 형식, 좌표, 출처 연결, 번역, 그림과 장면, 일반/+, 장식 분류를 검사합니다. 넓거나 여러 곳으로 나뉜 유산은 원문 첫 구성 요소의 좌표를 쓰므로 그림 정면의 정확한 위치가 아닐 수 있습니다. 덴마크 분류의 일루리사트처럼 본토 밖 유산도 있으며 낮은 해상도 지도에서 작은 나라의 면이 생략돼도 좌표 점과 국가 목록은 표시합니다.

재생성은 `node scripts/expand-orcatopia-catalog.mjs`, 통계와 수집 속도 계산은 `node scripts/analyze-orcatopia-catalog.mjs`로 재현합니다. 재생성은 네트워크를 사용하지 않으며 기존 306종의 체크섬이 바뀌면 멈춥니다. 기존 306종의 전체 SVG와 장면도 정규화한 해시로 보존 여부를 검사합니다.

## 보존과 해금 주문 통합

기존 ID, 한영 정보, 출처, 등급, 기록, 수량, 배치, + 합성, 장식, 열린 땅, 백업을 유지합니다. 확장만으로 보상을 지급하지 않습니다. 저장 키와 고유 100종에서 최대 1,044칸이 되는 규칙도 그대로입니다. 통합된 main은 관광 기능의 v8 형식을 사용하며 v7에서 추가된 누적 발견과 첫 탐험 소비 기록을 보존합니다. v1~v7을 읽을 수 있고 첫 워커 조회에서 소급 수입 없이 관광 기준시각을 저장합니다. 카탈로그 확장 자체는 별도 이관을 추가하지 않습니다. 새 장소가 담긴 백업은 이후 호환 빌드가 필요합니다. 백업의 구조와 256KiB 제한은 유지하며 내보낼 때 JSON 들여쓰기를 생략합니다. 기존 들여쓴 백업도 읽을 수 있고, 600종 수집과 전체 바닥 배치의 백업이 공백 때문에 제한을 넘지 않게 합니다.

먼저 머지된 해금·관광 기능을 통합했습니다. 누적 고유 12종에서 강, 25종에서 바다를 열고 중복/+를 추가 집계하지 않으며 잠긴 테마는 일반 추첨에서 제외합니다. `collectionTheme`은 공통 `water-themes.ts` 카탈로그를 사용합니다. 육지·바다 겸용도 수집에서는 바다로 분류하므로 육지 배치 가능 여부로 잠금을 우회하지 않습니다. 강 41종의 등급별 후보는 17 / 17 / 6 / 1, 바다·겸용 55종은 20 / 25 / 8 / 2로 모두 네 등급을 갖춥니다. 따라서 첫 탐험에도 기존 가중치를 그대로 적용하며, 빈 등급이 생기는 경우 기존 구현이 남은 등급의 가중치를 재정규화합니다. 테마별 첫 탐험은 기존 탐험권 1장을 사용하고, 확장된 후보에 복원·재시도·합성 보존 검사를 적용합니다.

고정 풀별 10만 회·시드 6257의 비교 기준은 고유 12/25종까지 기존 306종 12.25/26.21회, 제한 없는 600종 12.13/25.61회, 육지 전용 504종 12.15/25.71회입니다. 이 값은 실제 해금 흐름과 구분합니다. 통합된 실제 `draw` 함수를 1만 회·시드 6257로 실행하면 일반 추첨만 사용할 때 강/바다 해금까지 평균 12.15/25.66장의 탐험권을 사용합니다. 12종에서 강 첫 탐험을 즉시 쓰는 경우 그 탐험권까지 포함해 12.15/25.64장입니다. 바다 첫 탐험은 25종 도달 후 추가 1장을 사용합니다. 탐험권을 바로 사용한다고 가정한 수치이며 실제 업무 경과시간은 아닙니다. 초기 중복이 줄어도 전체 도감 완성이 빨라진다는 뜻은 아니며 천장이나 해금 기준 변경은 추가하지 않습니다.

브라우저 테스트는 fixture만 사용합니다. 병렬 워크트리는 `ORCATOPIA_TEST_PORT=43207 pnpm nx run landmark-island:ui-test -- --workers=2`처럼 포트를 분리합니다. 실제 설치, 실행 승인, 사용자 저장 주입, 공개 배포는 이번 확장에 포함하지 않습니다.

도감의 검색 가능한 카드 600개는 유지하되 그림 SVG는 카드가 스크롤 화면에 들어올 때 만듭니다. 재렌더링에는 그림 문자열 캐시를 재사용하며 이미 표시한 카드의 SVG는 유지하고 화면 밖 애니메이션만 멈춥니다. 검토용 단독 미리보기는 여전히 600개 장면을 모두 그립니다. 번역 처리는 문구가 없는 장식 SVG만 건너뛰며 SVG 글자, 접근성 라벨, 지도 제목은 계속 번역합니다. 브라우저 테스트에서 첫 표시, 검색, 스크롤, 새로고침, 일반/+ 및 실시간 언어 전환을 확인합니다.

## 추가 294개 장소

| ID                   | 이름                                 | 국가 코드 | 지형      | 등급     | 원문                                                |
| -------------------- | ------------------------------------ | --------- | --------- | -------- | --------------------------------------------------- |
| `jam`                | 잠의 미나레트                        | AF        | 육지      | 보물     | [UNESCO 211](https://whc.unesco.org/en/list/211/)   |
| `bamiyan`            | 바미안 계곡                          | AF        | 육지      | 경이     | [UNESCO 208](https://whc.unesco.org/en/list/208/)   |
| `butrint`            | 부트린트                             | AL        | 육지      | 보물     | [UNESCO 570](https://whc.unesco.org/en/list/570/)   |
| `berat`              | 베라트와 지로카스트라                | AL        | 육지      | 발견     | [UNESCO 569](https://whc.unesco.org/en/list/569/)   |
| `haghpat`            | 하그파트와 사나힌 수도원             | AM        | 육지      | 보물     | [UNESCO 777](https://whc.unesco.org/en/list/777/)   |
| `geghard`            | 게하르트 수도원                      | AM        | 육지      | 보물     | [UNESCO 960](https://whc.unesco.org/en/list/960/)   |
| `zvartnots`          | 에치미아진과 즈바르트노츠            | AM        | 육지      | 발견     | [UNESCO 1011](https://whc.unesco.org/en/list/1011/) |
| `bakuwalled`         | 바쿠 성곽도시                        | AZ        | 육지      | 보물     | [UNESCO 958](https://whc.unesco.org/en/list/958/)   |
| `gobustan`           | 고부스탄 암각화                      | AZ        | 육지      | 발견     | [UNESCO 1076](https://whc.unesco.org/en/list/1076/) |
| `sheki`              | 셰키 칸 궁전                         | AZ        | 육지      | 보물     | [UNESCO 1549](https://whc.unesco.org/en/list/1549/) |
| `visegrad`           | 비셰그라드 다리                      | BA        | 강        | 보물     | [UNESCO 1260](https://whc.unesco.org/en/list/1260/) |
| `vjetrenica`         | 비예트레니차 동굴                    | BA        | 육지      | 발견     | [UNESCO 1673](https://whc.unesco.org/en/list/1673/) |
| `boyana`             | 보야나 교회                          | BG        | 육지      | 발견     | [UNESCO 42](https://whc.unesco.org/en/list/42/)     |
| `madara`             | 마다라 기마상                        | BG        | 육지      | 발견     | [UNESCO 43](https://whc.unesco.org/en/list/43/)     |
| `kazanlak`           | 카잔라크 트라키아 무덤               | BG        | 육지      | 발견     | [UNESCO 44](https://whc.unesco.org/en/list/44/)     |
| `ivanovo`            | 이바노보 암굴교회                    | BG        | 육지      | 발견     | [UNESCO 45](https://whc.unesco.org/en/list/45/)     |
| `nessebar`           | 고대 네세바르                        | BG        | 육지·바다 | 보물     | [UNESCO 217](https://whc.unesco.org/en/list/217/)   |
| `srebarna`           | 스레바르나 자연보호구역              | BG        | 강        | 발견     | [UNESCO 219](https://whc.unesco.org/en/list/219/)   |
| `pirin`              | 피린 국립공원                        | BG        | 육지      | 보물     | [UNESCO 225](https://whc.unesco.org/en/list/225/)   |
| `qalabahrain`        | 칼라트 알바레인                      | BH        | 육지·바다 | 발견     | [UNESCO 1192](https://whc.unesco.org/en/list/1192/) |
| `dilmunmounds`       | 딜문 고분군                          | BH        | 육지      | 발견     | [UNESCO 1542](https://whc.unesco.org/en/list/1542/) |
| `mir`                | 미르성                               | BY        | 육지      | 보물     | [UNESCO 625](https://whc.unesco.org/en/list/625/)   |
| `nesvizh`            | 네스비시성                           | BY        | 육지      | 발견     | [UNESCO 1196](https://whc.unesco.org/en/list/1196/) |
| `paphos`             | 파포스                               | CY        | 육지      | 발견     | [UNESCO 79](https://whc.unesco.org/en/list/79/)     |
| `troodos`            | 트로도스 벽화교회                    | CY        | 육지      | 발견     | [UNESCO 351](https://whc.unesco.org/en/list/351/)   |
| `choirokoitia`       | 키로키티아                           | CY        | 육지      | 발견     | [UNESCO 848](https://whc.unesco.org/en/list/848/)   |
| `ceskykrumlov`       | 체스키크룸로프                       | CZ        | 육지      | 보물     | [UNESCO 617](https://whc.unesco.org/en/list/617/)   |
| `telc`               | 텔치                                 | CZ        | 육지      | 발견     | [UNESCO 621](https://whc.unesco.org/en/list/621/)   |
| `zelenahora`         | 젤레나호라 순례교회                  | CZ        | 육지      | 보물     | [UNESCO 690](https://whc.unesco.org/en/list/690/)   |
| `kutnahora`          | 쿠트나호라                           | CZ        | 육지      | 보물     | [UNESCO 732](https://whc.unesco.org/en/list/732/)   |
| `lednice`            | 레드니체발티체                       | CZ        | 육지      | 발견     | [UNESCO 763](https://whc.unesco.org/en/list/763/)   |
| `olomouc`            | 올로모우츠 삼위일체 기념주           | CZ        | 육지      | 발견     | [UNESCO 859](https://whc.unesco.org/en/list/859/)   |
| `kromeriz`           | 크로메르지시 정원과 성               | CZ        | 육지      | 발견     | [UNESCO 860](https://whc.unesco.org/en/list/860/)   |
| `litomysl`           | 리토미슐성                           | CZ        | 육지      | 발견     | [UNESCO 901](https://whc.unesco.org/en/list/901/)   |
| `mtskheta`           | 므츠헤타 유적                        | GE        | 육지      | 보물     | [UNESCO 708](https://whc.unesco.org/en/list/708/)   |
| `svaneti`            | 상스바네티                           | GE        | 육지      | 보물     | [UNESCO 709](https://whc.unesco.org/en/list/709/)   |
| `gelati`             | 겔라티 수도원                        | GE        | 육지      | 발견     | [UNESCO 710](https://whc.unesco.org/en/list/710/)   |
| `colchic`            | 콜키스 우림과 습지                   | GE        | 강        | 발견     | [UNESCO 1616](https://whc.unesco.org/en/list/1616/) |
| `split`              | 스플리트 디오클레티아누스 궁전       | HR        | 육지      | 보물     | [UNESCO 97](https://whc.unesco.org/en/list/97/)     |
| `plitvice`           | 플리트비체 호수                      | HR        | 강        | 경이     | [UNESCO 98](https://whc.unesco.org/en/list/98/)     |
| `porec`              | 포레치 에우프라시우스 대성당         | HR        | 육지      | 발견     | [UNESCO 809](https://whc.unesco.org/en/list/809/)   |
| `trogir`             | 트로기르 역사도시                    | HR        | 육지·바다 | 발견     | [UNESCO 810](https://whc.unesco.org/en/list/810/)   |
| `sibenik`            | 시베니크 성 야고보 대성당            | HR        | 육지      | 발견     | [UNESCO 963](https://whc.unesco.org/en/list/963/)   |
| `starigrad`          | 스타리그라드 평원                    | HR        | 육지      | 발견     | [UNESCO 1240](https://whc.unesco.org/en/list/1240/) |
| `holloko`            | 홀로쾨                               | HU        | 육지      | 발견     | [UNESCO 401](https://whc.unesco.org/en/list/401/)   |
| `hortobagy`          | 호르토바지 푸스타                    | HU        | 육지      | 발견     | [UNESCO 474](https://whc.unesco.org/en/list/474/)   |
| `pannonhalma`        | 판논할머 수도원                      | HU        | 육지      | 발견     | [UNESCO 758](https://whc.unesco.org/en/list/758/)   |
| `tokaj`              | 토커이 와인 경관                     | HU        | 육지      | 발견     | [UNESCO 1063](https://whc.unesco.org/en/list/1063/) |
| `sulaimantoo`        | 술라이만투                           | KG        | 육지      | 보물     | [UNESCO 1230](https://whc.unesco.org/en/list/1230/) |
| `yasawi`             | 호자 아흐메드 야사위 영묘            | KZ        | 육지      | 보물     | [UNESCO 1103](https://whc.unesco.org/en/list/1103/) |
| `tanbaly`            | 탄발리 암각화                        | KZ        | 육지      | 발견     | [UNESCO 1145](https://whc.unesco.org/en/list/1145/) |
| `saryarka`           | 사랴르카 초원과 호수                 | KZ        | 강        | 발견     | [UNESCO 1102](https://whc.unesco.org/en/list/1102/) |
| `vilnius`            | 빌뉴스 역사중심지                    | LT        | 육지      | 보물     | [UNESCO 541](https://whc.unesco.org/en/list/541/)   |
| `kernave`            | 케르나베                             | LT        | 육지      | 발견     | [UNESCO 1137](https://whc.unesco.org/en/list/1137/) |
| `kuldiga`            | 쿨디가 구시가지                      | LV        | 육지      | 발견     | [UNESCO 1658](https://whc.unesco.org/en/list/1658/) |
| `durmitor`           | 두르미토르 국립공원                  | ME        | 육지      | 보물     | [UNESCO 100](https://whc.unesco.org/en/list/100/)   |
| `kotor`              | 코토르 지역                          | ME        | 육지·바다 | 보물     | [UNESCO 125](https://whc.unesco.org/en/list/125/)   |
| `orkhon`             | 오르혼 계곡                          | MN        | 육지      | 발견     | [UNESCO 1081](https://whc.unesco.org/en/list/1081/) |
| `burkhankhaldun`     | 부르한 할둔산                        | MN        | 육지      | 보물     | [UNESCO 1440](https://whc.unesco.org/en/list/1440/) |
| `deerstones`         | 몽골 사슴돌                          | MN        | 육지      | 발견     | [UNESCO 1621](https://whc.unesco.org/en/list/1621/) |
| `sagarmatha`         | 사가르마타 국립공원                  | NP        | 육지      | 불가사의 | [UNESCO 120](https://whc.unesco.org/en/list/120/)   |
| `chitwan`            | 치트완 국립공원                      | NP        | 육지      | 보물     | [UNESCO 284](https://whc.unesco.org/en/list/284/)   |
| `lumbini`            | 룸비니                               | NP        | 육지      | 보물     | [UNESCO 666](https://whc.unesco.org/en/list/666/)   |
| `bahla`              | 발라 요새                            | OM        | 육지      | 보물     | [UNESCO 433](https://whc.unesco.org/en/list/433/)   |
| `bat`                | 바트·알쿠틈·알아인                   | OM        | 육지      | 발견     | [UNESCO 434](https://whc.unesco.org/en/list/434/)   |
| `frankincense`       | 유향의 땅                            | OM        | 육지      | 발견     | [UNESCO 1010](https://whc.unesco.org/en/list/1010/) |
| `aflaj`              | 아플라지 관개시설                    | OM        | 강        | 발견     | [UNESCO 1207](https://whc.unesco.org/en/list/1207/) |
| `moenjodaro`         | 모헨조다로                           | PK        | 육지      | 경이     | [UNESCO 138](https://whc.unesco.org/en/list/138/)   |
| `taxila`             | 탁실라                               | PK        | 육지      | 보물     | [UNESCO 139](https://whc.unesco.org/en/list/139/)   |
| `takhtibahi`         | 타크티바히                           | PK        | 육지      | 발견     | [UNESCO 140](https://whc.unesco.org/en/list/140/)   |
| `rohtas`             | 로타스 요새                          | PK        | 육지      | 보물     | [UNESCO 586](https://whc.unesco.org/en/list/586/)   |
| `krakow`             | 크라쿠프 역사중심지                  | PL        | 육지      | 보물     | [UNESCO 29](https://whc.unesco.org/en/list/29/)     |
| `warsaw`             | 바르샤바 역사중심지                  | PL        | 육지      | 발견     | [UNESCO 30](https://whc.unesco.org/en/list/30/)     |
| `wieliczka`          | 비엘리치카와 보흐니아 소금광산       | PL        | 육지      | 보물     | [UNESCO 32](https://whc.unesco.org/en/list/32/)     |
| `zamosc`             | 자모시치                             | PL        | 육지      | 발견     | [UNESCO 564](https://whc.unesco.org/en/list/564/)   |
| `torun`              | 중세 토룬                            | PL        | 육지      | 발견     | [UNESCO 835](https://whc.unesco.org/en/list/835/)   |
| `malbork`            | 말보르크성                           | PL        | 육지      | 경이     | [UNESCO 847](https://whc.unesco.org/en/list/847/)   |
| `centennialhall`     | 브로츠와프 백주년기념관              | PL        | 육지      | 발견     | [UNESCO 1165](https://whc.unesco.org/en/list/1165/) |
| `danubedelta`        | 다뉴브 삼각주                        | RO        | 강        | 보물     | [UNESCO 588](https://whc.unesco.org/en/list/588/)   |
| `hurezi`             | 후레지 수도원                        | RO        | 육지      | 발견     | [UNESCO 597](https://whc.unesco.org/en/list/597/)   |
| `moldavia`           | 몰다비아 벽화교회                    | RO        | 육지      | 발견     | [UNESCO 598](https://whc.unesco.org/en/list/598/)   |
| `sighisoara`         | 시기쇼아라                           | RO        | 육지      | 발견     | [UNESCO 902](https://whc.unesco.org/en/list/902/)   |
| `maramures`          | 마라무레슈 목조교회                  | RO        | 육지      | 발견     | [UNESCO 904](https://whc.unesco.org/en/list/904/)   |
| `studenica`          | 스투데니차 수도원                    | RS        | 육지      | 발견     | [UNESCO 389](https://whc.unesco.org/en/list/389/)   |
| `gamzigrad`          | 감지그라드 로물리아나                | RS        | 육지      | 발견     | [UNESCO 1253](https://whc.unesco.org/en/list/1253/) |
| `skocjan`            | 슈코치안 동굴                        | SI        | 강        | 경이     | [UNESCO 390](https://whc.unesco.org/en/list/390/)   |
| `spis`               | 스피슈성과 레보차                    | SK        | 육지      | 보물     | [UNESCO 620](https://whc.unesco.org/en/list/620/)   |
| `vlkolinec`          | 블콜리네츠                           | SK        | 육지      | 발견     | [UNESCO 622](https://whc.unesco.org/en/list/622/)   |
| `bardejov`           | 바르데요우                           | SK        | 육지      | 발견     | [UNESCO 973](https://whc.unesco.org/en/list/973/)   |
| `sarazm`             | 사라즘                               | TJ        | 육지      | 발견     | [UNESCO 1141](https://whc.unesco.org/en/list/1141/) |
| `pamirs`             | 타지크 국립공원                      | TJ        | 육지      | 경이     | [UNESCO 1252](https://whc.unesco.org/en/list/1252/) |
| `merv`               | 고대 메르브                          | TM        | 육지      | 보물     | [UNESCO 886](https://whc.unesco.org/en/list/886/)   |
| `kunyaurgench`       | 쿠냐우르겐치                         | TM        | 육지      | 보물     | [UNESCO 1199](https://whc.unesco.org/en/list/1199/) |
| `nisa`               | 니사의 파르티아 요새                 | TM        | 육지      | 발견     | [UNESCO 1242](https://whc.unesco.org/en/list/1242/) |
| `kyivsophia`         | 키이우 성 소피아와 페체르스크 수도원 | UA        | 육지      | 보물     | [UNESCO 527](https://whc.unesco.org/en/list/527/)   |
| `lviv`               | 르비우 역사중심지                    | UA        | 육지      | 발견     | [UNESCO 865](https://whc.unesco.org/en/list/865/)   |
| `itchankala`         | 이찬칼라                             | UZ        | 육지      | 보물     | [UNESCO 543](https://whc.unesco.org/en/list/543/)   |
| `bukhara`            | 부하라 역사도시                      | UZ        | 육지      | 보물     | [UNESCO 602](https://whc.unesco.org/en/list/602/)   |
| `shakhrisyabz`       | 샤흐리사브즈                         | UZ        | 육지      | 발견     | [UNESCO 885](https://whc.unesco.org/en/list/885/)   |
| `abomey`             | 아보메 왕궁                          | BJ        | 육지      | 보물     | [UNESCO 323](https://whc.unesco.org/en/list/323/)   |
| `loropeni`           | 로로페니 유적                        | BF        | 육지      | 발견     | [UNESCO 1225](https://whc.unesco.org/en/list/1225/) |
| `tiebele`            | 티에벨레 왕궁                        | BF        | 육지      | 발견     | [UNESCO 1713](https://whc.unesco.org/en/list/1713/) |
| `virunga`            | 비룽가 국립공원                      | CD        | 육지      | 경이     | [UNESCO 63](https://whc.unesco.org/en/list/63/)     |
| `okapi`              | 오카피 야생동물보호구역              | CD        | 육지      | 보물     | [UNESCO 718](https://whc.unesco.org/en/list/718/)   |
| `odzala`             | 오잘라코쿠아 숲                      | CG        | 육지      | 발견     | [UNESCO 692](https://whc.unesco.org/en/list/692/)   |
| `taiforest`          | 타이 국립공원                        | CI        | 육지      | 발견     | [UNESCO 195](https://whc.unesco.org/en/list/195/)   |
| `grandbassam`        | 그랑바삼                             | CI        | 육지·바다 | 발견     | [UNESCO 1322](https://whc.unesco.org/en/list/1322/) |
| `dja`                | 자 동물보호구역                      | CM        | 육지      | 발견     | [UNESCO 407](https://whc.unesco.org/en/list/407/)   |
| `benihammad`         | 베니하마드 요새                      | DZ        | 육지      | 발견     | [UNESCO 102](https://whc.unesco.org/en/list/102/)   |
| `tassili`            | 타실리나제르                         | DZ        | 육지      | 보물     | [UNESCO 179](https://whc.unesco.org/en/list/179/)   |
| `mzab`               | 므자브 계곡                          | DZ        | 육지      | 발견     | [UNESCO 188](https://whc.unesco.org/en/list/188/)   |
| `djemila`            | 제밀라                               | DZ        | 육지      | 발견     | [UNESCO 191](https://whc.unesco.org/en/list/191/)   |
| `tipasa`             | 티파사                               | DZ        | 육지·바다 | 발견     | [UNESCO 193](https://whc.unesco.org/en/list/193/)   |
| `asmara`             | 아스마라                             | ER        | 육지      | 발견     | [UNESCO 1550](https://whc.unesco.org/en/list/1550/) |
| `fasilghebbi`        | 파실게비                             | ET        | 육지      | 보물     | [UNESCO 19](https://whc.unesco.org/en/list/19/)     |
| `harar`              | 하라르 주골                          | ET        | 육지      | 발견     | [UNESCO 1189](https://whc.unesco.org/en/list/1189/) |
| `balemountains`      | 발레산맥                             | ET        | 육지      | 보물     | [UNESCO 111](https://whc.unesco.org/en/list/111/)   |
| `asante`             | 아샨티 전통건축                      | GH        | 육지      | 발견     | [UNESCO 35](https://whc.unesco.org/en/list/35/)     |
| `mountkenya`         | 케냐산                               | KE        | 육지      | 보물     | [UNESCO 800](https://whc.unesco.org/en/list/800/)   |
| `turkana`            | 투르카나호                           | KE        | 강        | 보물     | [UNESCO 801](https://whc.unesco.org/en/list/801/)   |
| `lamu`               | 라무 구시가지                        | KE        | 육지·바다 | 발견     | [UNESCO 1055](https://whc.unesco.org/en/list/1055/) |
| `fortjesus`          | 포트지저스                           | KE        | 육지·바다 | 발견     | [UNESCO 1295](https://whc.unesco.org/en/list/1295/) |
| `thimlich`           | 팀리치 오힝가                        | KE        | 육지      | 발견     | [UNESCO 1450](https://whc.unesco.org/en/list/1450/) |
| `ambohimanga`        | 암보히망가 왕실언덕                  | MG        | 육지      | 발견     | [UNESCO 950](https://whc.unesco.org/en/list/950/)   |
| `atsinanana`         | 아치나나나 우림                      | MG        | 육지      | 보물     | [UNESCO 1257](https://whc.unesco.org/en/list/1257/) |
| `timbuktu`           | 팀북투                               | ML        | 육지      | 보물     | [UNESCO 119](https://whc.unesco.org/en/list/119/)   |
| `bandiagara`         | 반디아가라 절벽                      | ML        | 육지      | 보물     | [UNESCO 516](https://whc.unesco.org/en/list/516/)   |
| `askia`              | 아스키아 무덤                        | ML        | 육지      | 발견     | [UNESCO 1139](https://whc.unesco.org/en/list/1139/) |
| `bancarguin`         | 방다르갱                             | MR        | 바다      | 보물     | [UNESCO 506](https://whc.unesco.org/en/list/506/)   |
| `lemorne`            | 르모른                               | MU        | 육지      | 보물     | [UNESCO 1259](https://whc.unesco.org/en/list/1259/) |
| `lakemalawi`         | 말라위호 국립공원                    | MW        | 강        | 발견     | [UNESCO 289](https://whc.unesco.org/en/list/289/)   |
| `mozambiqueisland`   | 모잠비크섬                           | MZ        | 육지·바다 | 발견     | [UNESCO 599](https://whc.unesco.org/en/list/599/)   |
| `twyfelfontein`      | 트위펠폰테인                         | NA        | 육지      | 발견     | [UNESCO 1255](https://whc.unesco.org/en/list/1255/) |
| `agadez`             | 아가데즈                             | NE        | 육지      | 발견     | [UNESCO 1268](https://whc.unesco.org/en/list/1268/) |
| `osunosogbo`         | 오순오쇼그보 성림                    | NG        | 육지      | 발견     | [UNESCO 1118](https://whc.unesco.org/en/list/1118/) |
| `aldabra`            | 알다브라 환초                        | SC        | 바다      | 경이     | [UNESCO 185](https://whc.unesco.org/en/list/185/)   |
| `valleedemai`        | 발레드메                             | SC        | 육지      | 발견     | [UNESCO 261](https://whc.unesco.org/en/list/261/)   |
| `sanganeb`           | 산가네브 해양공원                    | SD        | 바다      | 보물     | [UNESCO 262](https://whc.unesco.org/en/list/262/)   |
| `djoudj`             | 주지 조류보호구역                    | SN        | 강        | 발견     | [UNESCO 25](https://whc.unesco.org/en/list/25/)     |
| `saintlouis`         | 생루이섬                             | SN        | 강        | 발견     | [UNESCO 956](https://whc.unesco.org/en/list/956/)   |
| `saloum`             | 살룸 삼각주                          | SN        | 강        | 보물     | [UNESCO 1359](https://whc.unesco.org/en/list/1359/) |
| `ounianga`           | 우니앙가 호수군                      | TD        | 강        | 보물     | [UNESCO 1400](https://whc.unesco.org/en/list/1400/) |
| `ennedi`             | 엔네디 산괴                          | TD        | 육지      | 보물     | [UNESCO 1475](https://whc.unesco.org/en/list/1475/) |
| `ichkeul`            | 이슈켈 국립공원                      | TN        | 강        | 발견     | [UNESCO 8](https://whc.unesco.org/en/list/8/)       |
| `kilwa`              | 킬와키시와니와 송고므나라            | TZ        | 육지·바다 | 발견     | [UNESCO 144](https://whc.unesco.org/en/list/144/)   |
| `bwindi`             | 브윈디 원시림                        | UG        | 육지      | 경이     | [UNESCO 682](https://whc.unesco.org/en/list/682/)   |
| `rwenzori`           | 르웬조리산맥                         | UG        | 육지      | 보물     | [UNESCO 684](https://whc.unesco.org/en/list/684/)   |
| `capefloral`         | 케이프 식물구                        | ZA        | 육지      | 보물     | [UNESCO 1007](https://whc.unesco.org/en/list/1007/) |
| `mapungubwe`         | 마풍구브웨                           | ZA        | 육지      | 발견     | [UNESCO 1099](https://whc.unesco.org/en/list/1099/) |
| `manapools`          | 마나풀스                             | ZW        | 강        | 보물     | [UNESCO 302](https://whc.unesco.org/en/list/302/)   |
| `matobo`             | 마토보 언덕                          | ZW        | 육지      | 발견     | [UNESCO 306](https://whc.unesco.org/en/list/306/)   |
| `khami`              | 카미 유적                            | ZW        | 육지      | 발견     | [UNESCO 365](https://whc.unesco.org/en/list/365/)   |
| `antiguadockyard`    | 앤티가 해군조선소                    | AG        | 육지·바다 | 발견     | [UNESCO 1499](https://whc.unesco.org/en/list/1499/) |
| `bridgetown`         | 브리지타운 역사도시                  | BB        | 육지·바다 | 발견     | [UNESCO 1376](https://whc.unesco.org/en/list/1376/) |
| `potosi`             | 포토시                               | BO        | 육지      | 보물     | [UNESCO 420](https://whc.unesco.org/en/list/420/)   |
| `sucre`              | 수크레 역사도시                      | BO        | 육지      | 발견     | [UNESCO 566](https://whc.unesco.org/en/list/566/)   |
| `samaipata`          | 사마이파타 요새                      | BO        | 육지      | 발견     | [UNESCO 883](https://whc.unesco.org/en/list/883/)   |
| `noelkempff`         | 노엘켐프메르카도                     | BO        | 육지      | 발견     | [UNESCO 967](https://whc.unesco.org/en/list/967/)   |
| `olinda`             | 올린다 역사도시                      | BR        | 육지      | 발견     | [UNESCO 189](https://whc.unesco.org/en/list/189/)   |
| `congonhas`          | 콩고냐스 봉제수스 성역               | BR        | 육지      | 보물     | [UNESCO 334](https://whc.unesco.org/en/list/334/)   |
| `pantanal`           | 판타나우 보호지역                    | BR        | 강        | 보물     | [UNESCO 999](https://whc.unesco.org/en/list/999/)   |
| `fernandonoronha`    | 페르난두지노로냐와 호카스환초        | BR        | 바다      | 보물     | [UNESCO 1000](https://whc.unesco.org/en/list/1000/) |
| `lencois`            | 렌소이스마라녠시스                   | BR        | 강        | 경이     | [UNESCO 1611](https://whc.unesco.org/en/list/1611/) |
| `pampulha`           | 팜풀랴 근대건축단지                  | BR        | 육지      | 발견     | [UNESCO 1493](https://whc.unesco.org/en/list/1493/) |
| `lanseauxmeadows`    | 란세오메도스                         | CA        | 육지      | 보물     | [UNESCO 4](https://whc.unesco.org/en/list/4/)       |
| `sgang`              | 스강과이                             | CA        | 육지·바다 | 발견     | [UNESCO 157](https://whc.unesco.org/en/list/157/)   |
| `woodbuffalo`        | 우드버펄로 국립공원                  | CA        | 육지      | 발견     | [UNESCO 256](https://whc.unesco.org/en/list/256/)   |
| `oldquebec`          | 퀘벡 구시가지                        | CA        | 육지      | 보물     | [UNESCO 300](https://whc.unesco.org/en/list/300/)   |
| `rideau`             | 리도 운하                            | CA        | 강        | 발견     | [UNESCO 1221](https://whc.unesco.org/en/list/1221/) |
| `joggins`            | 조긴스 화석절벽                      | CA        | 육지·바다 | 발견     | [UNESCO 1285](https://whc.unesco.org/en/list/1285/) |
| `humberstone`        | 움베르스톤과 산타라우라              | CL        | 육지      | 발견     | [UNESCO 1178](https://whc.unesco.org/en/list/1178/) |
| `sewell`             | 세웰 광산도시                        | CL        | 육지      | 발견     | [UNESCO 1214](https://whc.unesco.org/en/list/1214/) |
| `mompox`             | 산타크루스데몸포스                   | CO        | 강        | 발견     | [UNESCO 742](https://whc.unesco.org/en/list/742/)   |
| `sanagustin`         | 산아구스틴 고고공원                  | CO        | 육지      | 보물     | [UNESCO 744](https://whc.unesco.org/en/list/744/)   |
| `chiribiquete`       | 치리비케테 국립공원                  | CO        | 육지      | 경이     | [UNESCO 1174](https://whc.unesco.org/en/list/1174/) |
| `cocosisland`        | 코코스섬                             | CR        | 바다      | 보물     | [UNESCO 820](https://whc.unesco.org/en/list/820/)   |
| `diquis`             | 디키스 석구                          | CR        | 육지      | 발견     | [UNESCO 1453](https://whc.unesco.org/en/list/1453/) |
| `havana`             | 아바나 구시가지                      | CU        | 육지·바다 | 보물     | [UNESCO 204](https://whc.unesco.org/en/list/204/)   |
| `vinales`            | 비냘레스 계곡                        | CU        | 육지      | 보물     | [UNESCO 840](https://whc.unesco.org/en/list/840/)   |
| `sanpedroroca`       | 산페드로델라로카성                   | CU        | 육지·바다 | 발견     | [UNESCO 841](https://whc.unesco.org/en/list/841/)   |
| `mornetrois`         | 모른트루아피통                       | DM        | 육지      | 보물     | [UNESCO 814](https://whc.unesco.org/en/list/814/)   |
| `santodomingo`       | 산토도밍고 식민도시                  | DO        | 육지      | 발견     | [UNESCO 526](https://whc.unesco.org/en/list/526/)   |
| `galapagos`          | 갈라파고스제도                       | EC        | 바다      | 불가사의 | [UNESCO 1](https://whc.unesco.org/en/list/1/)       |
| `sangay`             | 상가이 국립공원                      | EC        | 육지      | 보물     | [UNESCO 260](https://whc.unesco.org/en/list/260/)   |
| `antiguaguatemala`   | 안티과과테말라                       | GT        | 육지      | 발견     | [UNESCO 65](https://whc.unesco.org/en/list/65/)     |
| `quirigua`           | 키리과                               | GT        | 육지      | 발견     | [UNESCO 149](https://whc.unesco.org/en/list/149/)   |
| `rioplatano`         | 리오플라타노 생물권보전지역          | HN        | 육지      | 발견     | [UNESCO 196](https://whc.unesco.org/en/list/196/)   |
| `pitons`             | 세인트루시아 피통                    | LC        | 육지·바다 | 보물     | [UNESCO 1161](https://whc.unesco.org/en/list/1161/) |
| `eltajin`            | 엘타힌                               | MX        | 육지      | 보물     | [UNESCO 631](https://whc.unesco.org/en/list/631/)   |
| `paquime`            | 파키메                               | MX        | 육지      | 발견     | [UNESCO 560](https://whc.unesco.org/en/list/560/)   |
| `vizcaino`           | 엘비스카이노 고래보호구역            | MX        | 바다      | 보물     | [UNESCO 554](https://whc.unesco.org/en/list/554/)   |
| `xochicalco`         | 소치칼코                             | MX        | 육지      | 발견     | [UNESCO 939](https://whc.unesco.org/en/list/939/)   |
| `monarch`            | 모나크나비 보호구역                  | MX        | 육지      | 보물     | [UNESCO 1290](https://whc.unesco.org/en/list/1290/) |
| `pinacate`           | 엘피나카테와 그란데시에르토          | MX        | 육지      | 경이     | [UNESCO 1410](https://whc.unesco.org/en/list/1410/) |
| `padretembleque`     | 파드레템블레케 수로교                | MX        | 강        | 발견     | [UNESCO 1463](https://whc.unesco.org/en/list/1463/) |
| `coiba`              | 코이바 국립공원                      | PA        | 바다      | 보물     | [UNESCO 1138](https://whc.unesco.org/en/list/1138/) |
| `chavin`             | 차빈                                 | PE        | 육지      | 보물     | [UNESCO 330](https://whc.unesco.org/en/list/330/)   |
| `huascaran`          | 우아스카란 국립공원                  | PE        | 육지      | 보물     | [UNESCO 333](https://whc.unesco.org/en/list/333/)   |
| `caral`              | 카랄수페 성시                        | PE        | 육지      | 경이     | [UNESCO 1269](https://whc.unesco.org/en/list/1269/) |
| `chankillo`          | 찬키요                               | PE        | 육지      | 보물     | [UNESCO 1624](https://whc.unesco.org/en/list/1624/) |
| `paramaribo`         | 파라마리보 역사중심지                | SR        | 육지      | 발견     | [UNESCO 940](https://whc.unesco.org/en/list/940/)   |
| `redwood`            | 레드우드 국립·주립공원               | US        | 육지      | 보물     | [UNESCO 134](https://whc.unesco.org/en/list/134/)   |
| `olympic`            | 올림픽 국립공원                      | US        | 육지      | 보물     | [UNESCO 151](https://whc.unesco.org/en/list/151/)   |
| `cahokia`            | 카호키아 마운드                      | US        | 육지      | 발견     | [UNESCO 198](https://whc.unesco.org/en/list/198/)   |
| `hawaiivolcanoes`    | 하와이 화산                          | US        | 육지      | 경이     | [UNESCO 409](https://whc.unesco.org/en/list/409/)   |
| `colonia`            | 콜로니아델사크라멘토                 | UY        | 육지·바다 | 발견     | [UNESCO 747](https://whc.unesco.org/en/list/747/)   |
| `canaima`            | 카나이마 국립공원                    | VE        | 강        | 불가사의 | [UNESCO 701](https://whc.unesco.org/en/list/701/)   |
| `kakadu`             | 카카두 국립공원                      | AU        | 강        | 보물     | [UNESCO 147](https://whc.unesco.org/en/list/147/)   |
| `uluru`              | 울루루카타추타                       | AU        | 육지      | 불가사의 | [UNESCO 447](https://whc.unesco.org/en/list/447/)   |
| `sharkbay`           | 샤크만                               | AU        | 바다      | 보물     | [UNESCO 578](https://whc.unesco.org/en/list/578/)   |
| `bluemountains`      | 그레이터블루마운틴스                 | AU        | 육지      | 보물     | [UNESCO 917](https://whc.unesco.org/en/list/917/)   |
| `purnululu`          | 푸르눌룰루                           | AU        | 육지      | 경이     | [UNESCO 1094](https://whc.unesco.org/en/list/1094/) |
| `ningaloo`           | 닝갈루 해안                          | AU        | 바다      | 보물     | [UNESCO 1369](https://whc.unesco.org/en/list/1369/) |
| `tongariro`          | 통가리로 국립공원                    | NZ        | 육지      | 경이     | [UNESCO 421](https://whc.unesco.org/en/list/421/)   |
| `tewahipounamu`      | 테와히포우나무                       | NZ        | 육지·바다 | 보물     | [UNESCO 551](https://whc.unesco.org/en/list/551/)   |
| `levuka`             | 레부카 역사항구도시                  | FJ        | 육지·바다 | 발견     | [UNESCO 1399](https://whc.unesco.org/en/list/1399/) |
| `roimata`            | 로이마타 추장 유적                   | VU        | 육지·바다 | 발견     | [UNESCO 1280](https://whc.unesco.org/en/list/1280/) |
| `eastrennell`        | 동레넬                               | SB        | 바다      | 보물     | [UNESCO 854](https://whc.unesco.org/en/list/854/)   |
| `kuk`                | 쿠크 초기농경유적                    | PG        | 육지      | 발견     | [UNESCO 887](https://whc.unesco.org/en/list/887/)   |
| `bagerhat`           | 바게르하트 모스크도시                | BD        | 육지      | 발견     | [UNESCO 321](https://whc.unesco.org/en/list/321/)   |
| `paharpur`           | 파하르푸르 소마푸라 승원             | BD        | 육지      | 보물     | [UNESCO 322](https://whc.unesco.org/en/list/322/)   |
| `preahvihear`        | 프레아비헤아르 사원                  | KH        | 육지      | 보물     | [UNESCO 1224](https://whc.unesco.org/en/list/1224/) |
| `kohker`             | 코케르                               | KH        | 육지      | 보물     | [UNESCO 1667](https://whc.unesco.org/en/list/1667/) |
| `komodo`             | 코모도 국립공원                      | ID        | 바다      | 경이     | [UNESCO 609](https://whc.unesco.org/en/list/609/)   |
| `prambanan`          | 프람바난 사원군                      | ID        | 육지      | 보물     | [UNESCO 642](https://whc.unesco.org/en/list/642/)   |
| `balisubak`          | 발리 수바크 경관                     | ID        | 강        | 보물     | [UNESCO 1194](https://whc.unesco.org/en/list/1194/) |
| `kinabalu`           | 키나발루 공원                        | MY        | 육지      | 보물     | [UNESCO 1012](https://whc.unesco.org/en/list/1012/) |
| `gunungmulu`         | 구눙물루                             | MY        | 육지      | 경이     | [UNESCO 1013](https://whc.unesco.org/en/list/1013/) |
| `puertoprincesa`     | 푸에르토프린세사 지하강              | PH        | 강        | 보물     | [UNESCO 652](https://whc.unesco.org/en/list/652/)   |
| `tubbataha`          | 투바타하 산호초                      | PH        | 바다      | 경이     | [UNESCO 653](https://whc.unesco.org/en/list/653/)   |
| `cordilleraterraces` | 필리핀 코르디예라 계단식 논          | PH        | 강        | 보물     | [UNESCO 722](https://whc.unesco.org/en/list/722/)   |
| `hue`                | 후에 유적                            | VN        | 육지      | 보물     | [UNESCO 678](https://whc.unesco.org/en/list/678/)   |
| `hoian`              | 호이안                               | VN        | 육지      | 발견     | [UNESCO 948](https://whc.unesco.org/en/list/948/)   |
| `trangan`            | 짱안                                 | VN        | 강        | 경이     | [UNESCO 1438](https://whc.unesco.org/en/list/1438/) |
| `anuradhapura`       | 아누라다푸라                         | LK        | 육지      | 보물     | [UNESCO 200](https://whc.unesco.org/en/list/200/)   |
| `galle`              | 갈레 요새                            | LK        | 육지·바다 | 발견     | [UNESCO 451](https://whc.unesco.org/en/list/451/)   |
| `dambulla`           | 담불라 석굴사원                      | LK        | 육지      | 보물     | [UNESCO 561](https://whc.unesco.org/en/list/561/)   |
| `gyeongju`           | 경주 역사유적지구                    | KR        | 육지      | 보물     | [UNESCO 976](https://whc.unesco.org/en/list/976/)   |
| `hahoeyangdong`      | 하회와 양동마을                      | KR        | 육지      | 발견     | [UNESCO 1324](https://whc.unesco.org/en/list/1324/) |
| `namhansanseong`     | 남한산성                             | KR        | 육지      | 보물     | [UNESCO 1439](https://whc.unesco.org/en/list/1439/) |
| `seowon`             | 한국의 서원                          | KR        | 육지      | 발견     | [UNESCO 1498](https://whc.unesco.org/en/list/1498/) |
| `qinmausoleum`       | 진시황릉                             | CN        | 육지      | 경이     | [UNESCO 441](https://whc.unesco.org/en/list/441/)   |
| `pingyao`            | 핑야오 고성                          | CN        | 육지      | 발견     | [UNESCO 812](https://whc.unesco.org/en/list/812/)   |
| `yungang`            | 윈강 석굴                            | CN        | 육지      | 경이     | [UNESCO 1039](https://whc.unesco.org/en/list/1039/) |
| `westlake`           | 항저우 서호                          | CN        | 강        | 보물     | [UNESCO 1334](https://whc.unesco.org/en/list/1334/) |
| `haniterraces`       | 훙허 하니 계단식 논                  | CN        | 강        | 보물     | [UNESCO 1111](https://whc.unesco.org/en/list/1111/) |
| `pattadakal`         | 파타다칼                             | IN        | 육지      | 발견     | [UNESCO 239](https://whc.unesco.org/en/list/239/)   |
| `shivajiterminus`    | 차트라파티 시바지 터미너스           | IN        | 육지      | 보물     | [UNESCO 945](https://whc.unesco.org/en/list/945/)   |
| `nalanda`            | 날란다 마하비하라                    | IN        | 육지      | 보물     | [UNESCO 1502](https://whc.unesco.org/en/list/1502/) |
| `bam`                | 밤 문화경관                          | IR        | 육지      | 보물     | [UNESCO 1208](https://whc.unesco.org/en/list/1208/) |
| `shushtar`           | 슈슈타르 수리시설                    | IR        | 강        | 보물     | [UNESCO 1315](https://whc.unesco.org/en/list/1315/) |
| `gonbadeqabus`       | 곤바데카부스                         | IR        | 육지      | 발견     | [UNESCO 1398](https://whc.unesco.org/en/list/1398/) |
| `cappadocia`         | 괴레메와 카파도키아                  | TR        | 육지      | 경이     | [UNESCO 357](https://whc.unesco.org/en/list/357/)   |
| `nemrut`             | 넴루트산                             | TR        | 육지      | 보물     | [UNESCO 448](https://whc.unesco.org/en/list/448/)   |
| `pamukkale`          | 히에라폴리스파묵칼레                 | TR        | 강        | 경이     | [UNESCO 485](https://whc.unesco.org/en/list/485/)   |
| `troy`               | 트로이                               | TR        | 육지      | 보물     | [UNESCO 849](https://whc.unesco.org/en/list/849/)   |
| `baalbek`            | 바알베크                             | LB        | 육지      | 경이     | [UNESCO 294](https://whc.unesco.org/en/list/294/)   |
| `byblos`             | 비블로스                             | LB        | 육지·바다 | 보물     | [UNESCO 295](https://whc.unesco.org/en/list/295/)   |
| `quseiramra`         | 쿠세이르암라                         | JO        | 육지      | 발견     | [UNESCO 327](https://whc.unesco.org/en/list/327/)   |
| `wadirum`            | 와디럼                               | JO        | 육지      | 경이     | [UNESCO 1377](https://whc.unesco.org/en/list/1377/) |
| `atturaif`           | 앗투라이프                           | SA        | 육지      | 발견     | [UNESCO 1329](https://whc.unesco.org/en/list/1329/) |
| `alahsa`             | 알아흐사 오아시스                    | SA        | 육지      | 보물     | [UNESCO 1563](https://whc.unesco.org/en/list/1563/) |
| `alzubarah`          | 알주바라                             | QA        | 육지      | 발견     | [UNESCO 1402](https://whc.unesco.org/en/list/1402/) |
| `alain`              | 알아인 문화유적                      | AE        | 육지      | 발견     | [UNESCO 1343](https://whc.unesco.org/en/list/1343/) |
| `shirakami`          | 시라카미산지                         | JP        | 육지      | 발견     | [UNESCO 663](https://whc.unesco.org/en/list/663/)   |
| `ogasawara`          | 오가사와라제도                       | JP        | 바다      | 보물     | [UNESCO 1362](https://whc.unesco.org/en/list/1362/) |
| `tomioka`            | 도미오카 제사장                      | JP        | 육지      | 발견     | [UNESCO 1449](https://whc.unesco.org/en/list/1449/) |
| `salzburg`           | 잘츠부르크 역사도시                  | AT        | 육지      | 보물     | [UNESCO 784](https://whc.unesco.org/en/list/784/)   |
| `hallstatt`          | 할슈타트다흐슈타인                   | AT        | 강        | 보물     | [UNESCO 806](https://whc.unesco.org/en/list/806/)   |
| `berne`              | 베른 구시가지                        | CH        | 육지      | 발견     | [UNESCO 267](https://whc.unesco.org/en/list/267/)   |
| `stgall`             | 장크트갈렌 수도원                    | CH        | 육지      | 보물     | [UNESCO 268](https://whc.unesco.org/en/list/268/)   |
| `wurzburg`           | 뷔르츠부르크 주교궁                  | DE        | 육지      | 보물     | [UNESCO 169](https://whc.unesco.org/en/list/169/)   |
| `trier`              | 트리어 로마유적                      | DE        | 육지      | 발견     | [UNESCO 367](https://whc.unesco.org/en/list/367/)   |
| `speicherstadt`      | 슈파이허슈타트와 콘토어하우스        | DE        | 강        | 발견     | [UNESCO 1467](https://whc.unesco.org/en/list/1467/) |
| `kronborg`           | 크론보르성                           | DK        | 육지·바다 | 보물     | [UNESCO 696](https://whc.unesco.org/en/list/696/)   |
| `ilulissat`          | 일루리사트 아이스피오르              | DK        | 바다      | 경이     | [UNESCO 1149](https://whc.unesco.org/en/list/1149/) |
| `suomenlinna`        | 수오멘린나 요새                      | FI        | 육지·바다 | 보물     | [UNESCO 583](https://whc.unesco.org/en/list/583/)   |
| `rauma`              | 라우마 구시가지                      | FI        | 육지      | 발견     | [UNESCO 582](https://whc.unesco.org/en/list/582/)   |
| `orangetheatre`      | 오랑주 로마극장                      | FR        | 육지      | 보물     | [UNESCO 163](https://whc.unesco.org/en/list/163/)   |
| `cordouan`           | 코르두앙 등대                        | FR        | 바다      | 보물     | [UNESCO 1625](https://whc.unesco.org/en/list/1625/) |
| `maisoncarree`       | 님 메종카레                          | FR        | 육지      | 발견     | [UNESCO 1569](https://whc.unesco.org/en/list/1569/) |
| `edinburgh`          | 에든버러 구·신시가지                 | GB        | 육지      | 보물     | [UNESCO 728](https://whc.unesco.org/en/list/728/)   |
| `pontcysyllte`       | 폰트치실테 수로교                    | GB        | 강        | 보물     | [UNESCO 1303](https://whc.unesco.org/en/list/1303/) |
| `kew`                | 큐 왕립식물원                        | GB        | 육지      | 발견     | [UNESCO 1084](https://whc.unesco.org/en/list/1084/) |
| `delphi`             | 델포이                               | GR        | 육지      | 경이     | [UNESCO 393](https://whc.unesco.org/en/list/393/)   |
| `epidaurus`          | 에피다우로스 아스클레피오스 성역     | GR        | 육지      | 보물     | [UNESCO 491](https://whc.unesco.org/en/list/491/)   |
| `mycenae`            | 미케네와 티린스                      | GR        | 육지      | 보물     | [UNESCO 941](https://whc.unesco.org/en/list/941/)   |
| `brunaboinne`        | 브루나보너                           | IE        | 육지      | 보물     | [UNESCO 659](https://whc.unesco.org/en/list/659/)   |
| `thingvellir`        | 싱벨리르                             | IS        | 육지      | 보물     | [UNESCO 1152](https://whc.unesco.org/en/list/1152/) |
| `agrigento`          | 아그리젠토 신전계곡                  | IT        | 육지      | 보물     | [UNESCO 831](https://whc.unesco.org/en/list/831/)   |
| `cinqueterre`        | 포르토베네레와 친퀘테레              | IT        | 육지·바다 | 보물     | [UNESCO 826](https://whc.unesco.org/en/list/826/)   |
| `bryggen`            | 브뤼겐                               | NO        | 육지·바다 | 발견     | [UNESCO 59](https://whc.unesco.org/en/list/59/)     |
| `tomar`              | 토마르 그리스도 수도원               | PT        | 육지      | 보물     | [UNESCO 265](https://whc.unesco.org/en/list/265/)   |
| `teide`              | 테이데 국립공원                      | ES        | 육지      | 경이     | [UNESCO 1258](https://whc.unesco.org/en/list/1258/) |
