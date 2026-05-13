# dnfm-newb

`dnfm.kr` / `www.dnfm.kr` — 던파 모바일 뉴비 훈련소 카톡방 공식 웹.

## 구조

- `src/app/` — Next.js App Router (페이지)
- `src/components/` — 컴포넌트
- `src/lib/content.js` — 정적 콘텐츠 SSOT (hero / 가이드 / 체크리스트 / 링크 그룹)
- `public/` — 정적 자산
- `docs/` — 도메인 라우팅 / 배포 / 운영 가이드

자매 사이트 `allow.dnfm.kr` 는 **별도 repo** [`guswls3028-art/dnfm-allow`](https://github.com/guswls3028-art/dnfm-allow) 에서 독립 운영. 한쪽 작업이 다른쪽에 영향 0.

## 실행

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # standalone output (배포 산출물)
pnpm start    # production preview
```

## 배포

EC2 단일 인스턴스 + Cloudflare CDN. 절차는 `docs/deploy-ec2.md`.

## 운영 메모

- 외부 링크 placeholder 는 `src/lib/content.js` 에서 `url: null` + `reason` 패턴 유지. 확정되면 URL 만 채움.
- 공식 nexon/dnfm wordmark / 공식 게시판 카테고리 directly copy 금지. 자체 브랜드 표기.
