"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, auth } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";

export default function DeleteAccountPage() {
  const router = useRouter();
  const { user, isLoading, isAuthed, refresh } = useCurrentUser();

  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // 탈퇴 진행 중/완료 시 redirect 차단 — handler 가 직접 router.push 처리.
  useEffect(() => {
    if (submitting) return;
    if (!isLoading && !isAuthed) {
      router.replace(`/login?next=${encodeURIComponent("/profile/delete")}`);
    }
  }, [isLoading, isAuthed, router, submitting]);

  const isLocal = Boolean(user?.username);
  const requiredConfirm = "탈퇴합니다";

  const canSubmit =
    acknowledged &&
    confirmText === requiredConfirm &&
    (isLocal ? Boolean(password) : true);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || !canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      await auth.deleteAccount({ password: isLocal ? password : undefined });
      // refresh() 호출 시 context isAuthed=false 가 되어 useEffect 가 /login 으로 redirect 함.
      // 직접 / 로 redirect 후 router.refresh — context 는 다음 페이지에서 재초기화.
      router.push("/?bye=1");
      router.refresh();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err?.message || "탈퇴 실패";
      setError(msg);
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <section className="page-hero">
          <div className="content-wrap page-hero__inner">
            <h1 className="page-hero__title">회원 탈퇴</h1>
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

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">회원 탈퇴</h1>
            <p className="page-hero__sub">아래 안내를 확인하고 진행해 주세요.</p>
          </div>
          <Link href="/profile" className="btn btn--secondary btn--sm">
            ← 마이페이지
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <article className="profile-card">
            <h2 className="profile-card__title">탈퇴 시 처리 내용</h2>
            <ul style={{ lineHeight: 1.8 }}>
              <li>아이디·비밀번호·OAuth 연동·세션 정보가 즉시 삭제됩니다.</li>
              <li>닉네임·던파 모험단 정보는 익명화됩니다.</li>
              <li>
                작성한 글·댓글은 게시판 맥락 보존을 위해{" "}
                <strong>익명 표시(탈퇴 회원)</strong>로 유지됩니다.
              </li>
              <li>모든 디바이스에서 즉시 로그아웃됩니다.</li>
              <li>탈퇴 후 같은 아이디로 신규 가입은 가능합니다.</li>
            </ul>
          </article>

          <article className="auth-card" style={{ maxWidth: "none" }}>
            <form className="signup-steps" onSubmit={handleSubmit} aria-label="회원 탈퇴 폼" noValidate>
              {isLocal ? (
                <div className="field">
                  <label className="field__label" htmlFor="del-pw">
                    비밀번호 재입력 <span className="field__req">*</span>
                  </label>
                  <input
                    id="del-pw"
                    type="password"
                    className="input"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="현재 비밀번호"
                  />
                  <span className="field__hint">실수 방지용. OAuth 가입자는 비밀번호 없이 진행됩니다.</span>
                </div>
              ) : (
                <p className="auth-msg auth-msg--info">
                  <strong>OAuth 가입 계정</strong> — 비밀번호 없이 탈퇴 진행됩니다.
                </p>
              )}

              <div className="field">
                <label className="field__label" htmlFor="del-confirm">
                  확인 문구 — <strong>&ldquo;{requiredConfirm}&rdquo;</strong> 을 입력하세요{" "}
                  <span className="field__req">*</span>
                </label>
                <input
                  id="del-confirm"
                  type="text"
                  className="input"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={requiredConfirm}
                />
              </div>

              <div className="field">
                <label
                  htmlFor="del-ack"
                  style={{ display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer" }}
                >
                  <input
                    id="del-ack"
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(e) => setAcknowledged(e.target.checked)}
                    style={{ marginTop: 4 }}
                  />
                  <span>위 처리 내용을 확인했으며, 탈퇴를 진행합니다.</span>
                </label>
              </div>

              {error ? (
                <p className="auth-msg auth-msg--error" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="btn btn--lg"
                disabled={!canSubmit || submitting}
                style={{
                  background: "var(--color-danger, #d44)",
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                {submitting ? "탈퇴 처리 중…" : "탈퇴하기"}
              </button>
            </form>
          </article>
        </div>
      </section>
    </>
  );
}
