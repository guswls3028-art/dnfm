"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiError, auth } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";

function shortAgent(ua) {
  if (!ua) return "디바이스 정보 없음";
  const v = String(ua);
  if (/iPhone|iPad/i.test(v)) return "iPhone / iPad";
  if (/Android/i.test(v)) return "Android";
  if (/Macintosh/i.test(v)) return "Mac";
  if (/Windows/i.test(v)) return "Windows";
  if (/Linux/i.test(v)) return "Linux";
  return v.slice(0, 60);
}

function browserHint(ua) {
  if (!ua) return null;
  const v = String(ua);
  if (/CriOS|Chrome/i.test(v)) return "Chrome";
  if (/FxiOS|Firefox/i.test(v)) return "Firefox";
  if (/Edg/i.test(v)) return "Edge";
  if (/Safari/i.test(v)) return "Safari";
  return null;
}

function formatDate(s) {
  if (!s) return "-";
  try {
    const d = new Date(s);
    return d.toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return String(s).slice(0, 16);
  }
}

export default function SessionsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthed } = useCurrentUser();

  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [revoking, setRevoking] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await auth.sessions();
      setSessions(Array.isArray(data?.sessions) ? data.sessions : []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err?.message || "불러오기 실패");
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthed) {
      router.replace(`/login?next=${encodeURIComponent("/profile/sessions")}`);
      return;
    }
    if (user) load();
  }, [isLoading, isAuthed, user, router, load]);

  async function handleRevoke(id, isCurrent) {
    if (busyId) return;
    setBusyId(id);
    try {
      await auth.revokeSession(id);
      if (isCurrent) {
        router.push("/login");
        router.refresh();
        return;
      }
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err?.message || "로그아웃 실패");
    } finally {
      setBusyId(null);
    }
  }

  async function handleRevokeOthers() {
    if (revoking) return;
    setRevoking(true);
    try {
      await auth.revokeOtherSessions();
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err?.message || "처리 실패");
    } finally {
      setRevoking(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <section className="page-hero">
          <div className="content-wrap page-hero__inner">
            <h1 className="page-hero__title">로그인 디바이스</h1>
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

  const otherCount = sessions ? sessions.filter((s) => !s.current).length : 0;

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">로그인 디바이스</h1>
            <p className="page-hero__sub">지금 내 계정으로 로그인된 디바이스 목록.</p>
          </div>
          <Link href="/profile" className="btn btn--secondary btn--sm">
            ← 마이페이지
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ display: "grid", gap: "var(--sp-3)" }}>
          {error ? (
            <p className="auth-msg auth-msg--error" role="alert">
              {error}
            </p>
          ) : null}

          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleRevokeOthers}
              disabled={revoking || otherCount === 0}
              title={otherCount === 0 ? "다른 디바이스 없음" : ""}
            >
              {revoking ? "처리 중…" : `다른 디바이스 모두 로그아웃 (${otherCount})`}
            </button>
          </div>

          {sessions === null ? (
            <p className="auth-msg auth-msg--info">불러오는 중…</p>
          ) : sessions.length === 0 ? (
            <p className="auth-msg auth-msg--info">활성 세션이 없습니다.</p>
          ) : (
            sessions.map((s) => (
              <article
                key={s.id}
                className="profile-card"
                style={{
                  display: "flex",
                  gap: "var(--sp-3)",
                  alignItems: "center",
                  flexWrap: "wrap",
                  borderColor: s.current ? "var(--color-gold, #d4af37)" : undefined,
                  borderWidth: s.current ? 2 : 1,
                  borderStyle: "solid",
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-2)", fontWeight: 800 }}>
                    {shortAgent(s.userAgent)}
                    {browserHint(s.userAgent) ? (
                      <span style={{ fontSize: "0.84rem", color: "var(--ink-muted, #888)" }}>
                        · {browserHint(s.userAgent)}
                      </span>
                    ) : null}
                    {s.current ? (
                      <span
                        style={{
                          fontSize: "0.78rem",
                          padding: "2px 8px",
                          background: "var(--color-gold, #d4af37)",
                          color: "#000",
                          borderRadius: 4,
                          fontWeight: 800,
                        }}
                      >
                        현재
                      </span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: "0.86rem", color: "var(--ink-muted, #888)", marginTop: 4 }}>
                    IP {s.ipAddress || "?"} · 로그인 {formatDate(s.createdAt)} · 만료 {formatDate(s.expiresAt)}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => handleRevoke(s.id, s.current)}
                  disabled={busyId === s.id}
                >
                  {busyId === s.id
                    ? "처리 중…"
                    : s.current
                    ? "이 디바이스 로그아웃"
                    : "로그아웃"}
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </>
  );
}
