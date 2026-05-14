"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useCurrentUser } from "@/lib/use-current-user";
import { apiFetch, ApiError, auth } from "@/lib/api-client";

function validateDisplayName(v) {
  const trimmed = v.trim();
  if (trimmed.length < 1) return "닉네임을 입력해주세요";
  if (trimmed.length > 32) return "32자 이하로 입력해주세요";
  return null;
}

function classify(state) {
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

function useDebouncedAvailability(value, validator) {
  const [state, setState] = useState({ status: "idle" });
  const timerRef = useRef(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!value) {
      setState({ status: "idle" });
      return;
    }
    const validationError = validator(value);
    if (validationError) {
      setState({ status: "invalid", message: validationError });
      return;
    }
    setState({ status: "checking" });
    const myReqId = ++reqIdRef.current;
    timerRef.current = setTimeout(async () => {
      try {
        const data = await apiFetch(
          `/auth/check-availability?displayName=${encodeURIComponent(value)}`,
        );
        if (reqIdRef.current !== myReqId) return;
        setState({ status: data?.available === true ? "ok" : "taken" });
      } catch (err) {
        if (reqIdRef.current !== myReqId) return;
        setState({ status: "error", message: err?.message || "확인 실패" });
      }
    }, 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, validator]);

  return state;
}

export default function SetupPage() {
  return (
    <Suspense fallback={<div className="auth-shell"><p>불러오는 중…</p></div>}>
      <SetupInner />
    </Suspense>
  );
}

function SetupInner() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = useMemo(() => {
    const r = params.get("returnTo");
    if (!r || !r.startsWith("/") || r.startsWith("//")) return "/profile/verify?welcome=1";
    return r;
  }, [params]);

  const { user, isAuthed, isLoading, refresh } = useCurrentUser();
  const suggested = params.get("suggested") || "";
  const [displayName, setDisplayName] = useState(suggested);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthed) router.replace("/login");
  }, [isAuthed, isLoading, router]);

  const state = useDebouncedAvailability(displayName, validateDisplayName);
  const msg = classify(state);
  const canSubmit = state.status === "ok" && !submitting;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await auth.updateMe({ displayName: displayName.trim() });
      await refresh();
      // 닉네임 저장 후 모험단 인증 페이지로 안내 (또는 returnTo).
      router.push("/profile/verify?welcome=1");
      router.refresh();
    } catch (err) {
      const m = err instanceof ApiError ? err.message : err?.message || "저장 실패";
      setError(m);
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="auth-shell"><p>불러오는 중…</p></div>;
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="auth-card__title">환영합니다 — 닉네임 정하기</h1>
        <p className="auth-card__sub">
          소셜 로그인으로 가입하셨습니다. 사이트·톡방에서 보일 닉네임을 정해주세요. 가입 후 변경 가능.
        </p>

        <form onSubmit={handleSubmit} className="signup-steps" noValidate>
          <div className="field">
            <label className="field__label" htmlFor="setup-nick">
              닉네임 <span className="field__req">*</span>
            </label>
            <input
              id="setup-nick"
              name="displayName"
              className="input"
              placeholder="예: 시너지통 / (뉴비)지금간다"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={32}
              autoFocus
            />
            <span className="field__hint">중복 불가. 1~32자.</span>
            {msg ? (
              <span className={`field__status ${msg.cls}`}>
                <span aria-hidden="true">{msg.icon}</span> {msg.text}
              </span>
            ) : null}
          </div>

          {error ? (
            <p className="auth-msg auth-msg--error" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="btn btn--primary btn--block btn--lg"
            disabled={!canSubmit}
          >
            {submitting ? "저장 중…" : "닉네임 저장하고 다음 →"}
          </button>
        </form>

        <p className="auth-card__foot">
          가입 후 모험단 인증 페이지로 이동합니다. 인증은 선택이며 언제든 진행 가능.
          <br />
          <Link href={returnTo}>건너뛰기 →</Link>
        </p>
      </div>
    </div>
  );
}
