# dnfm Project

## A. Project Overview

- **Stack**: Next.js 15.5.7 (App Router, standalone output) + React 19, Node 20, pnpm workspace
- **Frontend 앱 2개 (친구 사이트, 인증/세션 공유 예정)**
  - `newb/` → `dnfm.kr`, `www.dnfm.kr` (던파 모바일 뉴비 훈련소)
  - `allow/` → `allow.dnfm.kr` (허락님 스트리머 페이지)
- **Backend (Stage 2 예정)**: `api.dnfm.kr` — Hono 단일 백엔드. 인증/세션/DB/R2 presign 공유. 쿠키 도메인 `.dnfm.kr` 로 sibling subdomain 공유.
- **호스팅**: EC2 단일 인스턴스. Nginx 가 host header 로 newb(:3000) / allow(:3001) / api(:4000) 분기. PM2 로 프로세스 관리.
- **CDN**: Cloudflare proxy (orange-cloud). Pages 가 아닌 일반 CDN/WAF. SSL Full strict.
- **R2 버킷**: 사용자 업로드 (스트리머/뉴비 자료). 백엔드 api 가 presigned URL 발급. public 차단.
- **Git**: single repo (https://github.com/guswls3028-art/dnfm)
- **현재 버전**: 0.1.0 (Stage 1 — 정적 사이트 2개 선배포)
- **루트 작업 산출물**: `_artifacts/` (gitignore). `이미지/` 폴더는 자산 위치 결정 전까지 untrack.

## B. Workflow

**inspect → edit → local dev rendering → local E2E → deploy → 검증 → summarize**
- Do NOT: inspect → ask confirmation → wait. 확인 질문은 failure mode.
- **local dev rendering**: build 통과 ≠ 정상. 실제 렌더링 확인 후 E2E 진행.
- **E2E 환경**: (frontend/.env.e2e, playwright.config 등 — 추후 추가)
- **테스트**: 격리 환경, `[E2E-{timestamp}]` 또는 동등 태그, cleanup 필수.

## C. Harness Architecture

역할 분리 아님 — **관심사 계층화.** AI는 모든 관심사를 동시에 적용.

**우선순위 (충돌 시 적용 순서)**:
1. 사용자 즉시 지시 (현 메시지)
2. `anti-avoidance.md` — 회피 방지 메타룰. 모든 정책에 우선.
3. `core.md`
4. 그 외 `.claude/rules/*`
5. `~/.claude/projects/.../memory/` user-scope
6. CLAUDE.md (본 파일)
7. 추론 / 일반 best practice

```
.claude/rules/ (전부 자동 로딩)
  anti-avoidance.md      — 회피 방지 메타룰. 합리화 금지, 검증 fail 3-tier default, 보고 양식 강제
  core.md                — 절대 원칙, 우선순위, 실행 모드, 토큰 효율
  code-quality.md        — 아키텍처, 디버깅, 리팩토링, 성능, 하드닝
  ui-quality.md          — 디자인, UX, 일관성, 상품성, narrow viewport 검증
  completion-criteria.md — E2E 검증, 완료 판단, 금지 패턴, fail 분기
  collaboration-policy.md — Git / 도구 / 보고 / UX 톤 / 메모리 정리 / 백로그 풀어서

.claude/skills/   — (미정. 실행 모드별 skill 추가 예정)
.claude/agents/   — (미정. 별도 컨텍스트 에이전트)
.claude/context/  — (미정. 도메인별 on-demand 참조)
```

## D. Reference System

- **Rules**: `.claude/rules/` — 원칙 + 품질 기준. 자동 로딩.
- **Context (on-demand)**: `.claude/context/` — 필요 시에만. 항상 로드 금지. (현재 비어 있음)
- **Domains**: `.claude/domains/` — 사이트별 비즈니스 mental model. 해당 사이트 작업 시 읽기.
  - `newb.md` — 뉴비 훈련소 (사용자 본인 공식 웹, 봇/이벤트 뿌리, 운영자=개발자)
  - `allow.md` — 허락 페이지 (허락님 self-service, 콘테스트/투표/경품, B급 감성)
  - `shared.md` — 두 사이트 공유 모델 (회원 통합, 권한 분리, cross-link 중간, R2 업로드, TM 회피)
- Ignore: `node_modules/`, `dist/`, `build/`, `__pycache__/`, `.next/`, `.cache/`

## E. 도메인 정책

- 각 앱의 `src/lib/content.js`가 운영 콘텐츠 SSOT. 링크/문구/가이드 카드/체크리스트는 이 파일에서 우선 수정.
- 확정되지 않은 외부 링크는 가짜 URL 대신 `url: null` + `reason`으로 비활성 상태를 명시.
- 두 사이트는 친구 사이트. 인증/세션/유저 데이터는 `api.dnfm.kr` 에서 공유 (쿠키 도메인 `.dnfm.kr`). 화면/콘텐츠 운영은 각자 독립.
- 도메인 라우팅: `docs/domain-routing.md`. EC2 배포 절차: `docs/deploy-ec2.md`.

## F. 단계별 로드맵

- **Stage 1 (현재)**: 정적 사이트 2개를 EC2 standalone + Cloudflare CDN 으로 선배포. 도메인 생존.
- **Stage 2**: `api.dnfm.kr` 추가. 인증(쿠키 도메인 `.dnfm.kr`), R2 presigned URL, 사용자 업로드.
- **Stage 3**: CI quality gate, EC2 자동 배포 webhook.
