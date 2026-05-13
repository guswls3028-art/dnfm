# dnfm-newb Project

## A. Project Overview

- **Stack**: Next.js 15.5.7 (App Router, standalone output) + React 19, Node 20.
- **사이트**: `dnfm.kr`, `www.dnfm.kr` — 던파 모바일 뉴비 훈련소 카톡방 공식 웹.
- **운영자 = 사용자(=방장=개발자) 본인**. 비개발자 UX 강도 약함. 코드/DB 직접 수정 OK.
- **친구들**: `hurock.dnfm.kr` — 허락님 페이지. **별도 git repo (`guswls3028-art/dnfm-hurock`)** 로 운영. 같은 백엔드(`api.dnfm.kr`, Stage 2)·같은 회원/세션(쿠키 도메인 `.dnfm.kr`)을 공유하지만 **frontend 코드·디자인 시스템은 완전 독립**. 한쪽 작업이 다른쪽에 영향 0.
- **호스팅**: EC2 단일 인스턴스(Nginx host 분기) + Cloudflare proxy (orange-cloud). SSL Full strict.
- **R2 버킷**: 사용자 업로드. 백엔드 api 가 presigned URL 발급. public 차단.
- **Git**: `https://github.com/guswls3028-art/dnfm` (이 repo = newb 전용).
- **현재 버전**: 0.1.0 (Stage 1 — 정적 사이트 선배포).
- **루트 작업 산출물**: `_artifacts/` (gitignore). `이미지/` 폴더는 자산 위치 결정 전까지 untrack.

## B. Workflow

**inspect → edit → local dev rendering → local E2E → deploy → 검증 → summarize**
- Do NOT: inspect → ask confirmation → wait. 확인 질문은 failure mode.
- **local dev rendering**: build 통과 ≠ 정상. 실제 렌더링 확인 후 E2E 진행.
- **E2E**: 격리 환경, `[E2E-{timestamp}]` 태그, cleanup 필수.

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
  anti-avoidance.md       — 회피 방지 메타룰
  core.md                 — 절대 원칙, 우선순위, 실행 모드, 토큰 효율
  code-quality.md         — 아키텍처, 디버깅, 리팩토링, 성능, 하드닝
  ui-quality.md           — 디자인, UX, 일관성, 상품성, narrow viewport 검증
  completion-criteria.md  — E2E 검증, 완료 판단, 금지 패턴, fail 분기
  collaboration-policy.md — Git / 도구 / 보고 / UX 톤 / 메모리 정리 / 백로그
  codex-delegation.md     — Codex 위임 패턴
```

## D. Reference System

- **Rules**: `.claude/rules/` — 원칙 + 품질 기준. 자동 로딩.
- **Domains**: `.claude/domains/` — 비즈니스 mental model.
  - `newb.md` — 본 사이트 본업·운영·콘텐츠 정책
- **Context (on-demand)**: `.claude/context/` — 비어 있음. 필요 시 추가.
- Ignore: `node_modules/`, `.next/`, `dist/`, `build/`, `.cache/`, `_artifacts/`, `이미지/`

## E. 친구들 격리 정책 (절대)

- `allow.dnfm.kr` 작업 시 이 repo 와 무관. **별도 repo / 별도 세션 / 별도 디자인 시스템.**
- 두 사이트가 공유하는 건 backend api (Stage 2 의 `api.dnfm.kr`) + 회원/세션/R2 뿐. frontend 측 공유 코드 0.
- 이 repo 에서 allow 코드를 읽거나 참고하거나 import 하면 안 됨.
- cross-link 표시 (footer 의 "허락 페이지" 같은) 는 hardcoded URL 만. allow 의 컴포넌트/타입 import X.

## F. 도메인 정책

- `src/lib/content.js` 가 정적 콘텐츠 SSOT (hero/가이드/체크리스트/링크 그룹).
- 동적 콘텐츠 (공지/이벤트/봇 데이터/사용자 글) 는 Stage 2 이후 `api.dnfm.kr` backend.
- 외부 링크 placeholder = `url: null` + `reason`. 비활성 버튼.
- 공식 wordmark / 공식 게시판 카테고리 directly copy 금지. 자체 브랜드 = `DNFM.KR / 던파 모바일 뉴비 훈련소`.
- 도메인 라우팅: `docs/domain-routing.md`. EC2 배포: `docs/deploy-ec2.md`.

## G. 단계별 로드맵

- **Stage 1 (현재)**: 정적 사이트 EC2 standalone + Cloudflare CDN 선배포. 도메인 생존.
- **Stage 2**: `api.dnfm.kr` 백엔드 (별도 repo). 인증, R2 presign, 게시판/댓글/좋아요 등 커뮤니티 코어.
- **Stage 3**: 커뮤니티 풀 UI (회원/게시판/댓글/좋아요/검색/알림/마이페이지/어드민).
- **Stage 4**: 챗봇 / 이벤트 페이지 / 자동 알림 (운영자 = 개발자 본인의 봇 뿌리).
- **Stage 5**: CI quality gate, EC2 자동 배포 webhook.

---

## 📌 Next Session Entry — 필독 (이 줄을 무시하지 말 것)

**자격증명·배포·인프라 좌표 SSOT** → `C:\academy\dnfm\api\docs\deployment-credentials.md`

해당 파일 한 곳에 정리됨:
- 라이브 EC2 IP / SSH key / .env 경로 / PM2 / Nginx / R2 / Cloudflare zone
- 자격증명 현황표 (✅ 주입 완료 / ❌ empty / 🟡 미확인) — EC2 `.env` 실측 기준
- 새로 발급해야 할 cred 절차 (Kakao OAuth / Cloudflare Origin Cert / Vision API)
- 다음 세션 진입 조건 A/B/C
- 흩어진 자료 인덱스

newb 단독 작업이라도 backend `.env` / EC2 / Cloudflare 관련 신호 마주치면 그 파일부터 확인.

**같은 그룹 sibling repo (별도 git remote, frontend 코드는 완전 독립):**
- `C:\academy\dnfm\hurock\` — 친구들 페이지 (hurock.dnfm.kr)
- `C:\academy\dnfm\api\` — 공용 backend (api.dnfm.kr)
