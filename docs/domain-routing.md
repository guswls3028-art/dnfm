# 도메인 라우팅

## 호스트

- `dnfm.kr`, `www.dnfm.kr` → 이 사이트 (newb, dnfm-newb repo)
- `allow.dnfm.kr` → 별도 repo (`guswls3028-art/dnfm-allow`)
- `api.dnfm.kr` → 별도 repo (Stage 2 — `dnfm-api`)

## 인프라

```
사용자
  │
Cloudflare (proxy, orange-cloud)
  │   DNS · TLS · 캐시 · WAF
  ▼
EC2 (Nginx host 분기)
  ├─ :3000  dnfm-newb  (이 사이트, Next.js standalone)
  ├─ :3001  dnfm-allow (자매 사이트, 별도 deploy)
  └─ :4000  api        (Stage 2)
```

## Cloudflare DNS

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| A | `dnfm.kr` | `<EC2 IP>` | ON (orange) |
| A | `www` | `<EC2 IP>` | ON |

`allow`, `api` 레코드는 각자 repo 가 책임. SSL/TLS = Full (strict).

Cache rules: `/_next/static/*`, `/_next/image/*`, `*.{jpg,png,svg,webp,woff2}` 장기. HTML bypass.

## 배포 흐름

1. 로컬: `pnpm install && pnpm build` 통과 확인.
2. `git push origin main`.
3. EC2 에서 `git pull` → `pnpm install --frozen-lockfile` → `pnpm build` → PM2 reload.
4. Nginx 가 `Host: dnfm.kr` / `www.dnfm.kr` → 127.0.0.1:3000 proxy.

상세 절차: `docs/deploy-ec2.md`.
