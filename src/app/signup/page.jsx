import Link from "next/link";
import DnfProfileForm from "@/components/DnfProfileForm";
import { site } from "@/lib/content";

export const metadata = {
  title: "회원 가입"
};

export default function SignupPage() {
  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">훈련소 입소 신청</h1>
            <p className="page-hero__sub">
              1단계 기본 정보 → 2단계 던파 캡처 3장 (자동 인식) → 3단계 톡방 입장.
            </p>
          </div>
          <Link href="/login" className="btn btn--secondary btn--sm">
            이미 회원이면 로그인 →
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ display: "grid", gap: "var(--sp-6)" }}>
          <div className="auth-card" style={{ maxWidth: "none" }}>
            <h2 className="auth-card__title" style={{ fontSize: "var(--fs-2xl)" }}>1단계 · 기본 정보</h2>
            <p className="auth-card__sub">
              아이디 · 비밀번호 · 닉네임. 그게 전부입니다. 던파 정보(모험단/캐릭터)는 2단계 캡처에서 자동 인식.
            </p>
            <form action="#" className="signup-steps" aria-label="가입 기본정보">
              <div className="field">
                <label className="field__label" htmlFor="su-username">아이디 <span className="field__req">*</span></label>
                <input
                  id="su-username"
                  name="username"
                  className="input"
                  placeholder="영문/숫자/언더스코어 3~32자"
                  pattern="[a-zA-Z0-9_]{3,32}"
                  autoComplete="username"
                />
                <span className="field__hint">로그인 ID. 가입 후 변경 불가. 중복 시 알려드립니다.</span>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="su-pw">비밀번호 <span className="field__req">*</span></label>
                <input
                  id="su-pw"
                  name="password"
                  type="password"
                  className="input"
                  placeholder="4자 이상"
                  minLength={4}
                  autoComplete="new-password"
                />
                <span className="field__hint">최소 4자. 학생/뉴비 사용 고려해 너무 까다롭지 않게.</span>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="su-nick">닉네임 <span className="field__req">*</span></label>
                <input
                  id="su-nick"
                  name="displayName"
                  className="input"
                  placeholder="예: 시너지통 / (뉴비)지금간다"
                  maxLength={32}
                />
                <span className="field__hint">사이트·톡방에서 보일 이름. 자유. 중복 시 알려드립니다.</span>
              </div>
              <button type="submit" className="btn btn--primary btn--lg" disabled title="백엔드 연동 전 — 다음 cycle">
                다음 단계 (준비중)
              </button>
            </form>
          </div>

          <div>
            <header className="section__head">
              <div>
                <span className="section__kicker">STEP 2</span>
                <h2 className="section__title">던파 인증 — 캡처 3장 자동 인식</h2>
              </div>
            </header>
            <p className="auth-card__sub" style={{ marginBottom: "var(--sp-4)" }}>
              ① <strong>기본정보 캡처</strong> → 모험단명 + 대표 캐릭터 자동 추출
              <br />
              ② <strong>보유캐릭터 캡처</strong> → 캐릭터 목록 자동 추출
              <br />
              ③ <strong>캐릭터 선택창 캡처</strong> → 본인 인증 (② 캐릭과 cross-check)
            </p>
            <DnfProfileForm steps={site.signupSteps} />
          </div>
        </div>
      </section>
    </>
  );
}
