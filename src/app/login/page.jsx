"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useCurrentUser } from "@/lib/use-current-user";
import { API_BASE } from "@/lib/api-client";
import { site } from "@/lib/content";

function providerClass(brand) {
  if (brand === "kakao") return "btn btn--kakao btn--block btn--lg";
  if (brand === "google") return "btn btn--google btn--block btn--lg";
  return "btn btn--primary btn--block btn--lg";
}

function safeRedirect(to) {
  if (!to) return "/";
  if (typeof to !== "string") return "/";
  // 외부 redirect 차단 — 내부 path 만 허용
  if (!to.startsWith("/") || to.startsWith("//")) return "/";
  return to;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginShell loading />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginShell({ loading }) {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-card__title">훈련소 입장</h1>
        <p className="auth-card__sub">
          {site.brandMark} · {site.shortTitle}
        </p>
        {loading ? <p>불러오는 중…</p> : null}
      </div>
    </div>
  );
}

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeRedirect(params.get("next"));
  const { login } = useCurrentUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (!username.trim() || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ username: username.trim(), password });
      router.push(next);
      router.refresh();
    } catch (err) {
      const msg =
        err && err.message
          ? err.message
          : "로그인에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setError(msg);
      setSubmitting(false);
    }
  }

  async function handleOAuth(provider) {
    const back = encodeURIComponent(next);
    const url = `${API_BASE}/auth/oauth/${provider}/start?next=${back}`;
    setError(null);
    try {
      const res = await fetch(url, { method: "GET", redirect: "manual" });
      if (res.status === 503) {
        const label = provider === "kakao" ? "카카오" : "구글";
        setError(`${label} 로그인은 아직 준비 중입니다. 잠시만 기다려 주세요.`);
        return;
      }
    } catch {
      /* network/CORS 무시 — redirect 시도 */
    }
    window.location.href = url;
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-card__title">훈련소 입장</h1>
        <p className="auth-card__sub">
          {site.brandMark} · {site.shortTitle}
        </p>

        <form
          className="signup-steps"
          aria-label="로그인 폼"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="field">
            <label className="field__label" htmlFor="login-username">
              아이디
            </label>
            <input
              id="login-username"
              name="username"
              className="input"
              placeholder="가입한 아이디"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="login-pw">
              비밀번호
            </label>
            <input
              id="login-pw"
              name="password"
              type="password"
              className="input"
              placeholder="비밀번호"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error ? (
            <p className="auth-msg auth-msg--error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="btn btn--primary btn--block btn--lg"
            disabled={submitting}
          >
            {submitting ? "로그인 중…" : "로그인"}
          </button>
        </form>

        <div className="auth-card__divider">또는</div>

        <div className="auth-card__providers">
          {site.loginProviders
            .filter((p) => p.id !== "local")
            .map((p) => (
              <button
                key={p.id}
                type="button"
                className={providerClass(p.brand)}
                onClick={() => handleOAuth(p.id)}
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
