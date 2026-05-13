# 도메인 라우팅

## 호스트 ↔ 앱

- `dnfm.kr`, `www.dnfm.kr` → `newb/` (던파 모바일 뉴비 훈련소)
- `allow.dnfm.kr` → `allow/` (허락님 스트리머 페이지)
- `api.dnfm.kr` → 공용 백엔드 (Stage 2 에서 추가, 현재 미배포)

두 사이트는 한 앱에서 호스트 분기하지 않고 독립 Next.js 앱으로 나눕니다. 인증/세션/유저 데이터는 `api.dnfm.kr` 에서 공유합니다 (쿠키 도메인 `.dnfm.kr`).

## 인프라 구성

```
사용자
  │
Cloudflare (proxy, orange-cloud)
  │   DNS · TLS · 캐시 · WAF
  ▼
EC2 단일 인스턴스 (Nginx host 분기)
  ├─ :3000  newb  (Next.js standalone)
  ├─ :3001  allow (Next.js standalone)
  └─ :4000  api   (Stage 2 — Hono, 인증/R2 presign)

R2 버킷
  사용자 업로드 자료 (스트리머/뉴비). api 가 presigned URL 발급.
```

## Cloudflare DNS

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `dnfm.kr` | `<EC2 public IP>` | ON (orange) |
| A | `www` | `<EC2 public IP>` | ON |
| A | `allow` | `<EC2 public IP>` | ON |
| A | `api` | `<EC2 public IP>` | ON (Stage 2) |

- SSL/TLS 모드: **Full (strict)**. EC2 에 Let's Encrypt 또는 Cloudflare Origin Certificate.
- Always Use HTTPS: ON. Automatic HTTPS Rewrites: ON.
- Cache rules: `/_next/static/*`, `/_next/image/*`, `/*.{jpg,png,svg,webp,woff2}` 장기 캐싱. HTML 은 bypass.

## 배포 흐름

1. 로컬에서 `pnpm install && pnpm run check && pnpm run build` 로 두 앱 빌드 통과 확인.
2. `git push origin main`.
3. EC2 에서 `git pull` → `pnpm install --frozen-lockfile` → `pnpm run build` → PM2 reload.
4. Nginx 가 host header 로 newb/allow 분기 (`/etc/nginx/sites-available/dnfm.conf`).
5. Cloudflare 콘솔에서 DNS proxied 상태 + 캐시 purge 확인.

EC2 셋업 절차 전체는 `docs/deploy-ec2.md` 참조.

## 추후 분리 기준

각 사이트가 자체 관리자/게시판/방송 API 연동을 갖게 되어도 `newb/`, `allow/` 안에서 화면을 확장하고, 백엔드 로직은 `api.dnfm.kr` 에 모읍니다. 친구 사이트가 추가될 때도 EC2 안에 Next.js 앱을 한 디렉터리 더 두고 같은 `api.dnfm.kr` 를 호출합니다.
