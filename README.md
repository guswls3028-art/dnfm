# dnfm.kr

던파 모바일 뉴비 훈련소와 허락님 스트리머 페이지를 각각 독립 Next.js 앱으로 관리하는 레포입니다.

## 구조

- `newb/` - `dnfm.kr`, 던파 모바일 뉴비 훈련소
- `allow/` - `allow.dnfm.kr`, 허락님 스트리머 페이지
- `scripts/` - 레포 구조 점검
- `docs/` - 도메인, 배포, 운영 가이드

## 실행

```bash
pnpm install
pnpm run check
pnpm run build
```

개별 개발 서버:

```bash
pnpm run dev:newb
pnpm run dev:allow
```

## 운영 메모

실제 카카오톡 오픈채팅 URL과 허락님 채널 URL은 아직 제공되지 않았으므로 각 앱의 `src/lib/content.js`에 `url: null`로 두었습니다. 사이트에서는 비활성 버튼으로 표시되어 잘못된 링크를 내보내지 않습니다.
