import Link from "next/link";
import DnfProfileForm from "@/components/DnfProfileForm";
import { site, nicknameGuide } from "@/lib/content";

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
            <p className="auth-card__sub">
              닉네임은 자유. <strong>본캐 캐릭터명 + 모험단명</strong> 도 함께 입력.
              2단계 던파 캡처 OCR 으로 자동 채움도 가능합니다.
            </p>
            <form action="#" className="signup-steps" aria-label="가입 기본정보">
              <div className="field">
                <label className="field__label" htmlFor="su-nick">닉네임 <small>(자유)</small></label>
                <input id="su-nick" name="nickname" className="input" placeholder="예: (뉴비)지금간다/엘마" />
                <span className="field__hint">{nicknameGuide.format} — 중복 회피.</span>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="su-main">본캐 캐릭터명 <span className="field__req">*</span></label>
                <input id="su-main" name="mainCharacter" className="input" placeholder="예: 지금간다" />
                <span className="field__hint">2단계 던파 캡처 OCR 으로 자동 채움 가능.</span>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="su-adv">모험단명 <span className="field__req">*</span></label>
                <input id="su-adv" name="adventurer" className="input" placeholder="예: 광기의 파도" />
                <span className="field__hint">기본정보 캡처에서 자동 인식.</span>
              </div>
              <div className="field">
                <label className="field__label" htmlFor="su-email">이메일 <small>(선택)</small></label>
                <input id="su-email" name="email" type="email" className="input" placeholder="you@example.com" />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="su-pw">비밀번호 <span className="field__req">*</span></label>
                <input id="su-pw" name="password" type="password" className="input" placeholder="4자 이상" />
                <span className="field__hint">최소 4자. 학생/뉴비 사용 고려.</span>
              </div>
              <details className="nickname-examples">
                <summary>닉네임 예시 보기</summary>
                <div>
                  <strong>좋은 예 ⭕</strong>
                  <ul>
                    {nicknameGuide.examples.good.map((e) => <li key={e}>{e}</li>)}
                  </ul>
                  <strong>중복 회피 ❌</strong>
                  <ul>
                    {nicknameGuide.examples.bad.map((e) => <li key={e}>{e}</li>)}
                  </ul>
                </div>
              </details>
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
