# soksak-plugin-editor-format-json — JSON 포메터

`.json` 파일을 정리하는 soksak 플러그인입니다.
`JSON.parse` 후 `JSON.stringify(value, null, 2)` + 마지막 개행 1개로 재출력합니다.

## 무엇을 하나

- `soksak-plugin-editor-codemirror` 에 의존하고, 에디터의 확장 프로토콜(`editor.ext.register` 버스
  토픽)로 JSON 포매터를 등록합니다. 에디터 엔진은 에디터 플러그인이 소유하며(엔진 중립,
  계약 A13), 이 플러그인은 포맷 함수만 제공합니다.
- 정상 JSON → 2칸 들여쓰기로 정리된 텍스트 반환.
- 깨진 JSON → 텍스트를 절대 바꾸지 않고 `JSON 파싱 실패: …` 에러를 던집니다.
  엔진이 위치(`at position N`)를 주면 `N행 M열` 로 환산해 보여줍니다.

## 의존성

`soksak-plugin-editor-codemirror` — 에디터와 그 확장 프로토콜을 제공합니다. 이 플러그인을 켜면 스켈레톤이
의존성을 해소·설치합니다.

## 권한

없음. 에디터 확장 프로토콜은 `app.bus`(플러그인 간 pub/sub)를 타며 권한이 필요 없습니다.

## 사용법

1. `soksak-plugin-editor-codemirror`(의존성으로 자동 해소)와 이 플러그인을 활성화합니다.
2. `.json` 파일을 에디터에서 엽니다.
3. `editor.format`(에디터 플러그인 명령)을 실행합니다. 결과:
   - 정상 JSON: 2칸 들여쓰기로 정리 + 파일 끝 개행. 마음에 안 들면 undo(⌘Z) 1회로 원복.
   - 깨진 JSON: `JSON 파싱 실패: 3행 7열 — …` 같은 명확한 에러. 버퍼는 변경되지 않습니다.
