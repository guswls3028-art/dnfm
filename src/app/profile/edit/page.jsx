"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ApiError, apiFetch, auth, uploads } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";

const MAX_AVATAR_BYTES = 3 * 1024 * 1024;

function validateDisplayName(v) {
  const t = v.trim();
  if (t.length < 1) return "닉네임을 입력해 주세요";
  if (t.length > 32) return "32자 이하";
  return null;
}

function useAvailability(value, originalValue) {
  const [state, setState] = useState({ status: "idle" });
  const timer = useRef(null);
  const reqId = useRef(0);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!value) {
      setState({ status: "idle" });
      return;
    }
    if (value === originalValue) {
      setState({ status: "ok" });
      return;
    }
    const err = validateDisplayName(value);
    if (err) {
      setState({ status: "invalid", message: err });
      return;
    }
    setState({ status: "checking" });
    const me = ++reqId.current;
    timer.current = setTimeout(async () => {
      try {
        const data = await apiFetch(
          `/auth/check-availability?displayName=${encodeURIComponent(value)}`,
        );
        if (reqId.current !== me) return;
        setState({ status: data?.available === true ? "ok" : "taken" });
      } catch (err) {
        if (reqId.current !== me) return;
        setState({ status: "error", message: err?.message || "확인 실패" });
      }
    }, 500);
    return () => timer.current && clearTimeout(timer.current);
  }, [value, originalValue]);
  return state;
}

function avatarPublicUrl(r2Key) {
  if (!r2Key) return null;
  if (/^https?:\/\//i.test(r2Key)) return r2Key;
  return `https://api.dnfm.kr/uploads/r2/${encodeURIComponent(r2Key)}`;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { user, isLoading, isAuthed, refresh } = useCurrentUser();

  const [displayName, setDisplayName] = useState("");
  const [avatarR2Key, setAvatarR2Key] = useState(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (!isLoading && !isAuthed) {
      router.replace(`/login?next=${encodeURIComponent("/profile/edit")}`);
      return;
    }
    if (user) {
      setDisplayName(user.displayName || "");
      setAvatarR2Key(user.avatarR2Key || null);
    }
  }, [isLoading, isAuthed, user, router]);

  const original = useMemo(
    () => ({
      displayName: user?.displayName || "",
      avatarR2Key: user?.avatarR2Key || null,
    }),
    [user],
  );

  const dnState = useAvailability(displayName.trim(), original.displayName);

  const dirty = useMemo(() => {
    if (displayName.trim() !== original.displayName) return true;
    if ((avatarR2Key || null) !== original.avatarR2Key) return true;
    return false;
  }, [displayName, avatarR2Key, original]);

  const canSubmit =
    dirty &&
    displayName.trim().length > 0 &&
    (dnState.status === "ok" || dnState.status === "idle");

  async function handleAvatarChange(e) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (avatarBusy) return;
    setError(null);
    if (!f.type?.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }
    if (f.size > MAX_AVATAR_BYTES) {
      setError(`아바타는 ${Math.round(MAX_AVATAR_BYTES / 1024 / 1024)}MB 이하만 가능합니다.`);
      return;
    }
    setAvatarBusy(true);
    try {
      const data = await uploads.uploadFile({ purpose: "avatar", file: f });
      const key = data?.upload?.r2Key || data?.r2Key;
      if (!key) throw new Error("아바타 업로드 응답이 비어있습니다.");
      setAvatarR2Key(key);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err?.message || "아바타 업로드 실패");
    } finally {
      setAvatarBusy(false);
    }
  }

  function handleAvatarClear() {
    setAvatarR2Key(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting || !canSubmit) return;
    setError(null);
    setSubmitting(true);
    try {
      const patch = {};
      if (displayName.trim() !== original.displayName) {
        patch.displayName = displayName.trim();
      }
      if ((avatarR2Key || null) !== original.avatarR2Key) {
        patch.avatarR2Key = avatarR2Key || null;
      }
      await auth.updateMe(patch);
      await refresh();
      setSavedAt(new Date().toLocaleTimeString("ko-KR"));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err?.message || "저장 실패");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <section className="page-hero">
          <div className="content-wrap page-hero__inner">
            <h1 className="page-hero__title">프로필 편집</h1>
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

  const avatarUrl = avatarPublicUrl(avatarR2Key);

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">프로필 편집</h1>
            <p className="page-hero__sub">닉네임과 아바타.</p>
          </div>
          <Link href="/profile" className="btn btn--secondary btn--sm">
            ← 마이페이지
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <div className="auth-card" style={{ maxWidth: "none" }}>
            <form className="signup-steps" onSubmit={handleSubmit} aria-label="프로필 편집 폼" noValidate>
              <div className="field">
                <span className="field__label">아바타</span>
                <div style={{ display: "flex", gap: "var(--sp-3)", alignItems: "center" }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.06)",
                      border: "2px dashed var(--ink-line, #ccc)",
                      overflow: "hidden",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 24,
                      fontWeight: 800,
                      color: "var(--ink-muted, #888)",
                      flexShrink: 0,
                    }}
                  >
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="아바타" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      (displayName?.[0] || "·").toUpperCase()
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
                    <label className="btn btn--ghost btn--sm" style={{ cursor: avatarBusy ? "default" : "pointer" }}>
                      {avatarBusy ? "업로드 중…" : avatarR2Key ? "다른 사진 선택" : "아바타 업로드"}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                        disabled={avatarBusy}
                      />
                    </label>
                    {avatarR2Key ? (
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={handleAvatarClear}
                        disabled={avatarBusy}
                      >
                        제거
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="ed-nick">
                  닉네임 <span className="field__req">*</span>
                </label>
                <input
                  id="ed-nick"
                  type="text"
                  className="input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={32}
                />
                {dnState.status === "checking" ? (
                  <span className="field__status field__status--checking">
                    <span aria-hidden="true">⏳</span> 확인 중…
                  </span>
                ) : dnState.status === "ok" && displayName.trim() !== original.displayName ? (
                  <span className="field__status field__status--ok">
                    <span aria-hidden="true">✓</span> 사용 가능
                  </span>
                ) : dnState.status === "taken" ? (
                  <span className="field__status field__status--bad">
                    <span aria-hidden="true">✗</span> 이미 사용 중
                  </span>
                ) : dnState.status === "invalid" ? (
                  <span className="field__status field__status--bad">
                    <span aria-hidden="true">✗</span> {dnState.message}
                  </span>
                ) : dnState.status === "error" ? (
                  <span className="field__status field__status--bad">
                    <span aria-hidden="true">!</span> {dnState.message}
                  </span>
                ) : null}
              </div>

              {error ? (
                <p className="auth-msg auth-msg--error" role="alert">
                  {error}
                </p>
              ) : savedAt ? (
                <p className="auth-msg auth-msg--info" role="status">
                  ✓ {savedAt} 에 저장됨
                </p>
              ) : null}

              <button
                type="submit"
                className="btn btn--primary btn--lg"
                disabled={!canSubmit || submitting}
              >
                {submitting ? "저장 중…" : "저장"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
