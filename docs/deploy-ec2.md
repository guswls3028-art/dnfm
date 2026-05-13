# EC2 + Cloudflare 배포 가이드

dnfm-hub 두 앱(newb, allow) 을 EC2 단일 인스턴스에서 Next.js standalone 으로 서빙하고, Cloudflare proxy(orange-cloud) 를 통해 공개하는 절차.

## 0. 사전 준비

- EC2 인스턴스 1대 (권장: Ubuntu 22.04 LTS, t3.small 이상)
- Cloudflare 에 `dnfm.kr` zone 등록
- R2 버킷 1개 (Stage 2 에서 연결)
- 도메인 3건: `dnfm.kr`, `www.dnfm.kr`, `allow.dnfm.kr`

## 1. EC2 초기 셋업

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl

# Node.js 20 (Next.js 15.5.7 권장)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# pnpm + pm2 (전역)
sudo npm install -g pnpm@9 pm2

# 배포 디렉토리
sudo mkdir -p /var/www/dnfm
sudo chown -R ubuntu:ubuntu /var/www/dnfm
```

## 2. 보안 그룹

| Port | Source | 용도 |
|------|--------|------|
| 22 | `<관리자 IP>/32` | SSH |
| 80 | Cloudflare IP ranges | HTTP (HTTPS redirect 만) |
| 443 | Cloudflare IP ranges | HTTPS |

Cloudflare IP 목록: https://www.cloudflare.com/ips/ — 정기 갱신 필요. 또는 일단 `0.0.0.0/0` 로 열어두고 Cloudflare WAF / Authenticated Origin Pulls 로 보호.

## 3. 레포 클론 + 빌드

```bash
cd /var/www/dnfm
git clone https://github.com/guswls3028-art/dnfm.git .
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
```

빌드 산출물 (Next.js standalone):
- `newb/.next/standalone/server.js` (실행 엔트리)
- `newb/.next/standalone/.next/static` ← 정적 자산
- `newb/public` ← 공개 자산
- allow/ 동일

standalone 실행 시 `.next/static` 과 `public` 을 standalone 루트로 복사해야 함:
```bash
cp -r newb/.next/static newb/.next/standalone/.next/
cp -r newb/public newb/.next/standalone/ 2>/dev/null || true
cp -r allow/.next/static allow/.next/standalone/.next/
cp -r allow/public allow/.next/standalone/ 2>/dev/null || true
```

## 4. PM2 프로세스

`/var/www/dnfm/ecosystem.config.cjs`:
```js
module.exports = {
  apps: [
    {
      name: "newb",
      script: "newb/.next/standalone/server.js",
      env: { PORT: 3000, HOSTNAME: "127.0.0.1", NODE_ENV: "production" }
    },
    {
      name: "allow",
      script: "allow/.next/standalone/server.js",
      env: { PORT: 3001, HOSTNAME: "127.0.0.1", NODE_ENV: "production" }
    }
  ]
};
```

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd  # 출력 명령 그대로 sudo 실행
```

## 5. Nginx host 분기

`/etc/nginx/sites-available/dnfm.conf`:
```nginx
# newb — dnfm.kr / www.dnfm.kr
server {
    listen 80;
    server_name dnfm.kr www.dnfm.kr;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
}

# allow — allow.dnfm.kr
server {
    listen 80;
    server_name allow.dnfm.kr;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/dnfm.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 6. Cloudflare 콘솔 체크리스트

- [ ] DNS A 레코드 3건 (`dnfm.kr`, `www`, `allow`) → EC2 public IP, **proxy ON (orange)**
- [ ] SSL/TLS 모드 = **Full (strict)**
- [ ] Edge Certificates → Always Use HTTPS = ON
- [ ] Edge Certificates → Automatic HTTPS Rewrites = ON
- [ ] Cache Rules:
  - `/_next/static/*` → cache everything, edge TTL 1y
  - `/_next/image/*` → cache everything, edge TTL 1d
  - `*.{jpg,png,svg,webp,woff2}` → cache everything, edge TTL 1mo
  - HTML (`/`, `/*` 마지막 fallback) → bypass cache (SSR 결과 fresh)
- [ ] Authenticated Origin Pulls (선택) → EC2 Nginx 가 Cloudflare 인증서만 받게

## 7. TLS — EC2 ↔ Cloudflare

권장: Cloudflare 콘솔에서 Origin Certificate 발급 (15년 유효) → EC2 Nginx 에 설치 → 443 server block 추가.

또는 Let's Encrypt:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d dnfm.kr -d www.dnfm.kr -d allow.dnfm.kr
```

## 8. 무중단 재배포 스크립트

`/var/www/dnfm/scripts/deploy.sh`:
```bash
#!/bin/bash
set -e
cd /var/www/dnfm
git pull origin main
pnpm install --frozen-lockfile
pnpm run build
cp -r newb/.next/static newb/.next/standalone/.next/
cp -r allow/.next/static allow/.next/standalone/.next/
pm2 reload ecosystem.config.cjs
```

GitHub webhook 또는 GitHub Actions ssh-action 으로 자동화는 Stage 3 에서.

## 9. 검증

```bash
# 로컬 (EC2 안에서)
curl -H "Host: dnfm.kr" http://127.0.0.1:3000 | head -20
curl -H "Host: allow.dnfm.kr" http://127.0.0.1:3001 | head -20

# 외부
curl -I https://dnfm.kr
curl -I https://allow.dnfm.kr
# 두 호스트 모두 200 + cf-ray 헤더 + 다른 콘텐츠 확인
```

브라우저 실제 렌더링 확인 (모바일/데스크톱 둘 다) 까지 완료해야 배포 끝.
