"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";
import { site } from "@/lib/content";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,32}$/;

function classifyAvailability(state) {
  if (state.status === "checking")
    return { cls: "field__status--checking", icon: "⏳", text: "확인 중…" };
  if (state.status === "ok")
    return { cls: "field__status--ok", icon: "✓", text: "사용 가능합니다" };
  if (state.status === "taken")
    return { cls: "field__status--bad", icon: "✗", text: "이미 사용 중입니다" };
  if (state.status === "invalid")
    return { cls: "field__status--bad", icon: "✗", text: state.message || "형식이 올바르지 않습니다" };
  if (state.status === "error")
    return { cls: "field__status--bad", icon: "!", text: state.message || "확인 실패" };
  return null;
}

function useDebouncedAvailability(value, paramName, validator) {
  const [state, setState] = useState({ status: "idle" });
  const timerRef = useRef(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value) {
      setState({ status: "idle" });
      return;
    }

    const validationError = validator ? validator(value) : null;
    if (validationError) {
      setState({ status: "invalid", message: validationError });
      return;
    }

    setState({ status: "checking" });
    const myReqId = ++reqIdRef.current;

    timerRef.current = setTimeout(async () => {
      try {
        const data = await apiFetch(
          `/auth/check-availability?${paramName}=${encodeURIComponent(value)}`,
        );
        if (reqIdRef.current !== myReqId) return;
        if (data && data.available === true) {
          setState({ status: "ok" });
        } else {
          setState({ status: "taken" });
        }
      } catch (err) {
        if (reqIdRef.current !== myReqId) return;
        setState({
          status: "error",
          message: err && err.message ? err.message : "확인 실패",
        });
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, paramName, validator]);

  return state;
}

function validateUsername(v) {
  if (!USERNAME_PATTERN.test(v)) return "영문/숫자/언더스코어 3~32자";
  return null;
}

function validateDisplayName(v) {
  const trimmed = v.trim();
  if (trimmed.length < 1) return "닉네임을 입력해주세요";
  if (trimmed.length > 32) return "32자 이하로 입력해주세요";
  return null;
}

export default function SignupPage() {
  const router = useRouter();
  const { setUser, refresh } = useCurrentUser();
  const basics = site.signupBasics;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  const passwordMatch = useMemo(() => {
    if (!password || !password2) return null;
    return password === password2 ? "ok" : "mismatch";
  }, [password, password2]);

  const usernameState = useDebouncedAvailability(username, "username", validateUsername);
  const displayNameState = useDebouncedAvailability(
    displayName,
    "displayName",
    validateDisplayName,
  );

  const canSubmit = useMemo(() => {
    if (!username || !password || !password2 || !displayName) return false;
    if (password.length < 4) return false;
    if (password !== password2) return false;
    if (usernameState.status !== "ok") return false;
    if (displayNameState.status !== "ok") return false;
    if (!acceptedTerms) return false;
    return true;
  }, [
    username,
    password,
    password2,
    displayName,
    usernameState.status,
    displayNameState.status,
    acceptedTerms,
  ]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setGlobalError(null);

    if (!canSubmit) {
      setGlobalError("입력값을 확인해주세요. (아이디·닉네임 중복 확인 + 비밀번호 4자 이상)");
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiFetch("/auth/signup/local", {
        method: "POST",
        json: {
          username: username.trim(),
          password,
          displayName: displayName.trim(),
          acceptedTerms: true,
        },
      });

      if (data?.user) {
        setUser(data.user);
      }
      // 응답 cookie 가 브라우저에 박힌 직후, useCurrentUser context 를 강제 동기화.
      // 이게 없으면 다음 페이지(/profile/verify)가 isAuthed=false 로 오판해 /login 재유도됨.
      await refresh();

      // 가입 완료 → 모험단 인증 페이지로 유도 (선택, skip 가능).
      router.push("/profile/verify?welcome=1");
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message || "가입 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setGlobalError(msg);
      setSubmitting(false);
    }
  }

  const usernameMsg = classifyAvailability(usernameState);
  const displayNameMsg = classifyAvailability(displayNameState);

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">훈련소 입소 신청</h1>
            <p className="page-hero__sub">
              아이디 · 비밀번호 · 닉네임만 입력하면 가입 완료. 모험단 인증은 가입 후 선택.
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
            <h2 className="auth-card__title" style={{ fontSize: "var(--fs-2xl)" }}>
              {basics?.title || "간단 가입"}
            </h2>
            <p className="auth-card__sub">{basics?.body}</p>

            <form
              className="signup-steps"
              aria-label="가입 기본정보"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="field">
                <label className="field__label" htmlFor="su-username">
                  아이디 <span className="field__req">*</span>
                </label>
                <input
                  id="su-username"
                  name="username"
                  className="input"
                  placeholder="영문/숫자/언더스코어 3~32자"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <span className="field__hint">로그인 ID. 가입 후 변경 불가.</span>
                {usernameMsg ? (
                  <span className={`field__status ${usernameMsg.cls}`}>
                    <span aria-hidden="true">{usernameMsg.icon}</span> {usernameMsg.text}
                  </span>
                ) : null}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="su-pw">
                  비밀번호 <span className="field__req">*</span>
                </label>
                <input
                  id="su-pw"
                  name="password"
                  type="password"
                  className="input"
                  placeholder="4자 이상"
                  minLength={4}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="field__hint">최소 4자. 너무 까다롭지 않게.</span>
                {password && password.length < 4 ? (
                  <span className="field__status field__status--bad">
                    <span aria-hidden="true">✗</span> 4자 이상 입력해주세요
                  </span>
                ) : password && password.length >= 4 ? (
                  <span className="field__status field__status--ok">
                    <span aria-hidden="true">✓</span> 길이 충족
                  </span>
                ) : null}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="su-pw2">
                  비밀번호 확인 <span className="field__req">*</span>
                </label>
                <input
                  id="su-pw2"
                  name="password2"
                  type="password"
                  className="input"
                  placeholder="비밀번호 다시 입력"
                  autoComplete="new-password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
                <span className="field__hint">오타 방지용.</span>
                {passwordMatch === "ok" ? (
                  <span className="field__status field__status--ok">
                    <span aria-hidden="true">✓</span> 일치합니다
                  </span>
                ) : passwordMatch === "mismatch" ? (
                  <span className="field__status field__status--bad">
                    <span aria-hidden="true">✗</span> 비밀번호가 다릅니다
                  </span>
                ) : null}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="su-nick">
                  닉네임 <span className="field__req">*</span>
                </label>
                <input
                  id="su-nick"
                  name="displayName"
                  className="input"
                  placeholder="예: 시너지통 / (뉴비)지금간다"
                  maxLength={32}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <span className="field__hint">사이트·톡방에서 보일 이름. 자유.</span>
                {displayNameMsg ? (
                  <span className={`field__status ${displayNameMsg.cls}`}>
                    <span aria-hidden="true">{displayNameMsg.icon}</span> {displayNameMsg.text}
                  </span>
                ) : null}
              </div>

              <div className="field">
                <label
                  className="field__label"
                  htmlFor="su-terms"
                  style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}
                >
                  <input
                    id="su-terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    style={{ marginTop: 4 }}
                  />
                  <span>
                    <strong>(필수)</strong>{" "}
                    <Link href="/terms" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                      이용약관
                    </Link>{" "}
                    및{" "}
                    <Link href="/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>
                      개인정보처리방침
                    </Link>
                    에 동의합니다
                  </span>
                </label>
              </div>

              {globalError ? (
                <p className="auth-msg auth-msg--error" role="alert">
                  {globalError}
                </p>
              ) : null}

              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={!canSubmit || submitting}
              >
                {submitting ? "가입 처리 중…" : "가입 완료"}
              </button>

              <p className="auth-card__foot" style={{ marginTop: "var(--sp-4)" }}>
                가입 후 모험단 인증 페이지로 안내됩니다. 인증은 선택이며 언제든 나중에 진행 가능.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
