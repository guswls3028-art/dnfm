import Link from "next/link";
import { site } from "@/lib/content";

export const metadata = {
  title: "로그인"
};

function providerClass(brand) {
  if (brand === "kakao") return "btn btn--kakao btn--block btn--lg";
  if (brand === "google") return "btn btn--google btn--block btn--lg";
  return "btn btn--primary btn--block btn--lg";
}

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-card__title">훈련소 입장</h1>
        <p className="auth-card__sub">{site.brandMark} · {site.shortTitle}</p>

        <form className="signup-steps" action="#" aria-label="로그인 폼">
          <div className="field">
            <label className="field__label" htmlFor="login-email">이메일</label>
            <input id="login-email" name="email" type="email" className="input" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="login-pw">비밀번호</label>
            <input id="login-pw" name="password" type="password" className="input" placeholder="비밀번호" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled title="백엔드 연동 전">
            로그인 (준비중)
          </button>
        </form>

        <div className="auth-card__divider">또는</div>

        <div className="auth-card__providers">
          {site.loginProviders.filter((p) => p.id !== "local").map((p) => (
            <button
              key={p.id}
              type="button"
              className={providerClass(p.brand)}
              disabled
              title="소셜 로그인 준비중"
            >
              {p.label}
            </button>
          ))}
        </div>

        <p className="auth-card__foot">
          아직 회원이 아니신가요? <Link href="/signup">입소 신청 →</Link>
        </p>
      </div>
    </div>
  );
}
