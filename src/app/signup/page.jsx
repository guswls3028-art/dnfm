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
              기본 정보 → 던파 캐릭터 캡처 → 톡방 입장. 3단계로 끝납니다.
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
            <p className="auth-card__sub">이메일은 가입 알림과 비밀번호 재설정에만 사용합니다.</p>
            <form action="#" className="signup-steps" aria-label="가입 기본정보">
              <div className="field">
                <label className="field__label" htmlFor="su-nick">닉네임</label>
                <input id="su-nick" name="nickname" className="input" placeholder="톡방에서 사용할 이름" />
                <span className="field__hint">2~12자, 운영자 확인 후 톡방 닉네임으로 동기화됩니다.</span>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="su-email">이메일</label>
                <input id="su-email" name="email" type="email" className="input" placeholder="you@example.com" />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="su-pw">비밀번호</label>
                <input id="su-pw" name="password" type="password" className="input" placeholder="4자 이상" />
                <span className="field__hint">최소 4자. 학생/뉴비 사용 고려.</span>
              </div>
              <button type="submit" className="btn btn--primary btn--lg" disabled title="백엔드 연동 전">
                다음 단계 (준비중)
              </button>
            </form>
          </div>

          <div>
            <header className="section__head">
              <div>
                <span className="section__kicker">STEP 2 & 3</span>
                <h2 className="section__title">던파 인증 + 톡방 입장</h2>
              </div>
            </header>
            <DnfProfileForm steps={site.signupSteps} />
          </div>
        </div>
      </section>
    </>
  );
}
