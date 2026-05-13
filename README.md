# dnfm.kr

던파 모바일 뉴비 훈련소 운영 허브와 스트리머 서브도메인을 함께 관리하는 정적 웹 프로젝트입니다.

## 구조

- `src/` - 실제 사이트 소스
- `src/content.js` - 카톡방, 공식 링크, 가이드, 이벤트, 스트리머 링크 등 운영 데이터
- `src/app.js` - `dnfm.kr` / `allow.dnfm.kr` 라우팅과 화면 렌더링
- `scripts/` - 의존성 없는 로컬 서버, 빌드, 정적 점검
- `docs/` - 도메인, 배포, 운영 가이드

## 실행

```bash
pnpm run dev
pnpm run check
pnpm run build
pnpm run preview
```

로컬에서 허락님 사이트를 미리 보려면 아래 주소를 사용합니다.

```text
http://localhost:4173/?site=allow
```

## 운영 메모

실제 카카오톡 오픈채팅 URL과 허락님 채널 URL은 아직 제공되지 않았으므로 `src/content.js`에 `url: null`로 두었습니다. 사이트에서는 비활성 버튼으로 표시되어 잘못된 링크를 내보내지 않습니다.
