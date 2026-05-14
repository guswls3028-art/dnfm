"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { ApiError, auth } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={null}>
      <ChangePasswordInner />
    </Suspense>
  );
}

function ChangePasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const required = params.get("required") === "1";
  const { user, isLoading, isAuthed, logout } = useCurrentUser();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthed) {
      router.replace(`/login?next=${encodeURIComponent("/profile/password")}`);
    }
  }, [isLoading, isAuthed, router]);

  const match = useMemo(() => {
    if (!newPassword || !newPassword2) return null;
    return newPassword === newPassword2 ? "ok" : "mismatch";
  }, [newPassword, newPassword2]);

  const canSubmit = useMemo(() => {
    if (!currentPassword || !newPassword || !newPassword2) return false;
    if (newPassword.length < 4) return false;
    if (newPassword !== newPassword2) return false;
    if (newPassword === currentPassword) return false;
    return true;
  }, [currentPassword, newPassword, newPassword2]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || !canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await auth.changePassword({ currentPassword, newPassword });
      // backend 가 tokenVersion bump + cookie clear — client 도 비웁니다.
      try {
        await logout();
      } catch {
        /* 무시 */
      }
      setDone(true);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : err?.message || "비밀번호 변경 실패";
      setError(msg);
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <section className="page-hero">
          <div className="content-wrap page-hero__inner">
            <h1 className="page-hero__title">비밀번호 변경</h1>
          </div>
        </section>
        <section className="section">
          <div className="content-wrap">
            <p className="auth-msg auth-msg--info">불러오는 중…</p>
          </div>
        </section>
      </>
    );
  }

  if (done) {
    return (
      <>
        <section className="page-hero">
          <div className="content-wrap page-hero__inner">
            <div>
              <h1 className="page-hero__title">비밀번호 변경 완료</h1>
              <p className="page-hero__sub">보안을 위해 모든 디바이스에서 자동 로그아웃됐습니다.</p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="content-wrap">
            <div className="auth-card">
              <p className="auth-msg auth-msg--info" style={{ marginTop: 0 }}>
                새 비밀번호로 다시 로그인해 주세요.
              </p>
              <Link href="/login" className="btn btn--primary btn--lg">
                로그인 페이지로
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">
              {required ? "새 비밀번호 설정 (필수)" : "비밀번호 변경"}
            </h1>
            <p className="page-hero__sub">
              {required
                ? "운영자가 임시 비밀번호를 발급했습니다. 새 비밀번호를 설정해 주세요."
                : "변경 즉시 모든 디바이스에서 자동 로그아웃됩니다."}
            </p>
          </div>
          {required ? null : (
            <Link href="/profile" className="btn btn--secondary btn--sm">
              ← 마이페이지
            </Link>
          )}
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ display: "grid", gap: "var(--sp-6)" }}>
          {required ? (
            <p className="auth-msg auth-msg--error" role="alert" style={{ margin: 0 }}>
              임시 비밀번호로 로그인됨 — 새 비밀번호를 설정하기 전에는 다른 페이지로 이동할 수 없습니다.
            </p>
          ) : null}
          <div className="auth-card" style={{ maxWidth: "none" }}>
            <form
              className="signup-steps"
              aria-label="비밀번호 변경 폼"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="field">
                <label className="field__label" htmlFor="pw-current">
                  현재 비밀번호 <span className="field__req">*</span>
                </label>
                <input
                  id="pw-current"
                  type="password"
                  className="input"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="field">
                <label className="field__label" htmlFor="pw-new">
                  새 비밀번호 <span className="field__req">*</span>
                </label>
                <input
                  id="pw-new"
                  type="password"
                  className="input"
                  placeholder="4자 이상"
                  minLength={4}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span className="field__hint">최소 4자. 현재 비밀번호와 다르게.</span>
                {newPassword && newPassword.length < 4 ? (
                  <span className="field__status field__status--bad">
                    <span aria-hidden="true">✗</span> 4자 이상 입력해 주세요
                  </span>
                ) : newPassword && newPassword === currentPassword ? (
                  <span className="field__status field__status--bad">
                    <span aria-hidden="true">✗</span> 현재 비밀번호와 같습니다
                  </span>
                ) : newPassword && newPassword.length >= 4 ? (
                  <span className="field__status field__status--ok">
                    <span aria-hidden="true">✓</span> 길이 충족
                  </span>
                ) : null}
              </div>

              <div className="field">
                <label className="field__label" htmlFor="pw-new2">
                  새 비밀번호 확인 <span className="field__req">*</span>
                </label>
                <input
                  id="pw-new2"
                  type="password"
                  className="input"
                  autoComplete="new-password"
                  value={newPassword2}
                  onChange={(e) => setNewPassword2(e.target.value)}
                />
                {match === "ok" ? (
                  <span className="field__status field__status--ok">
                    <span aria-hidden="true">✓</span> 일치합니다
                  </span>
                ) : match === "mismatch" ? (
                  <span className="field__status field__status--bad">
                    <span aria-hidden="true">✗</span> 비밀번호가 다릅니다
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
                className="btn btn--primary btn--lg"
                disabled={!canSubmit || submitting}
              >
                {submitting ? "변경 중…" : "비밀번호 변경"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
