# dnfm Project

> **TODO**: 프로젝트 도메인이 정해지면 A·B·C·D 섹션을 채워주세요. 현재는 .claude/rules/ 7개 파일만 활성. 도메인 정보 채우기 전에는 rules가 universal AI 협업 메타룰로만 작동.

## A. Project Overview

- **Stack**: Next.js App Router, React, Node.js/pnpm workspace
- **Git**: single repo 예정
- **현재 버전**: 0.1.0
- **루트 작업 산출물**: `dist/` (build output), `_artifacts/` (gitignore 권장)
- **도메인**: `newb/` = `dnfm.kr` 던파 모바일 뉴비 훈련소, `allow/` = `allow.dnfm.kr` 허락님 스트리머 페이지

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
- **Context (on-demand)**: `.claude/context/` — 필요 시에만. 항상 로드 금지. (도메인 결정 후 채움)
- **Domains**: `.claude/domains/` — 도메인별 비즈니스 규칙. (도메인 결정 후 채움)
- Ignore: `node_modules/`, `dist/`, `build/`, `__pycache__/`, `.next/`, `.cache/`

## E. 도메인 정책 (TBD)

- 각 앱의 `src/lib/content.js`가 운영 콘텐츠 SSOT. 링크/문구/가이드 카드/체크리스트는 이 파일에서 우선 수정.
- 확정되지 않은 외부 링크는 가짜 URL 대신 `url: null` + `reason`으로 비활성 상태를 명시.
- `dnfm.kr`, `www.dnfm.kr`는 `newb/` 앱, `allow.dnfm.kr`는 `allow/` 앱으로 별도 배포.
- 도메인 및 배포 흐름은 `docs/domain-routing.md` 참조.
