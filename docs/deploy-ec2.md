# EC2 + Cloudflare 배포 가이드 (dnfm-newb)

이 repo (`dnfm-newb`, `dnfm.kr` / `www.dnfm.kr`) 를 EC2 + Cloudflare proxy 로 띄우는 절차.

친구들 `dnfm-allow` 는 같은 EC2 인스턴스 안에 다른 디렉토리·다른 포트로 동거. 단, 본 repo 작업으로 흔들 일 없음.

## 0. 사전

- EC2 인스턴스 (Ubuntu 22.04 LTS, t3.small 이상)
- Cloudflare zone `dnfm.kr`
- 도메인 2건: `dnfm.kr`, `www.dnfm.kr`

## 1. EC2 초기 셋업 (최초 1회)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pnpm@9 pm2

sudo mkdir -p /var/www/dnfm-newb
sudo chown -R ubuntu:ubuntu /var/www/dnfm-newb
```

보안그룹: 22 (관리자 IP), 80/443 (Cloudflare IP 또는 0.0.0.0/0 + Authenticated Origin Pulls).

## 2. 레포 클론 + 빌드

```bash
cd /var/www/dnfm-newb
git clone https://github.com/guswls3028-art/dnfm.git .
pnpm install --frozen-lockfile
pnpm build
```

standalone 산출물:
- `.next/standalone/server.js` (실행)
- `.next/standalone/.next/static` ← static 자산 복사 필요
- `.next/standalone/public` ← public 자산 복사 필요

```bash
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/ 2>/dev/null || true
```

## 3. PM2

`/var/www/dnfm-newb/ecosystem.config.cjs`:
```js
module.exports = {
  apps: [{
    name: "dnfm-newb",
    script: ".next/standalone/server.js",
    cwd: __dirname,
    env: { PORT: 3000, HOSTNAME: "127.0.0.1", NODE_ENV: "production" }
  }]
};
```

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd  # 출력 명령 sudo 실행
```

## 4. Nginx server block

`/etc/nginx/sites-available/dnfm-newb.conf`:
```nginx
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
```

```bash
sudo ln -s /etc/nginx/sites-available/dnfm-newb.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Cloudflare 콘솔

- DNS A 레코드 2건 (`dnfm.kr`, `www`) → EC2 public IP, **proxy ON (orange)**
- SSL/TLS = Full (strict). Origin Certificate 발급 후 EC2 Nginx 에 설치 (또는 Let's Encrypt).
- Always Use HTTPS / Automatic HTTPS Rewrites: ON.
- Cache Rules:
  - `/_next/static/*` → cache, edge TTL 1y
  - `/_next/image/*` → cache, edge TTL 1d
  - `*.{jpg,png,svg,webp,woff2}` → cache, edge TTL 1mo
  - HTML → bypass

## 6. 재배포 스크립트

`/var/www/dnfm-newb/scripts/deploy.sh`:
```bash
#!/bin/bash
set -e
cd /var/www/dnfm-newb
git pull origin main
pnpm install --frozen-lockfile
pnpm build
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/ 2>/dev/null || true
pm2 reload ecosystem.config.cjs
```

## 7. 검증

```bash
curl -I https://dnfm.kr
curl -I https://www.dnfm.kr
# 200 + cf-ray 헤더 + HTML 응답
```

브라우저 실제 렌더링 확인까지 완료해야 배포 끝.
