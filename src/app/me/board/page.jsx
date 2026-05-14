"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ApiError, apiFetch, comments as commentsApi } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";

/**
 * 마이페이지 — 내 글 / 내 댓글.
 *
 * 회원만 (비회원 글은 별도 추적 X — 비번 기반 자기 글은 본인 책임).
 */

const TABS = [
  { value: "posts", label: "내 글" },
  { value: "comments", label: "내 댓글" },
];

function formatTime(iso) {
  if (!iso) return "";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return iso;
  return t.toLocaleString("ko-KR", { hour12: false });
}

export default function MyBoardPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const sp = useSearchParams();
  const tab = sp.get("tab") || "posts";
  const { user, isAuthed, isLoading } = useCurrentUser();
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    setErr(null);
    try {
      if (tab === "comments") {
        const res = await commentsApi.mine({ pageSize: 100 });
        setRows(Array.isArray(res?.items) ? res.items : []);
        setTotal(res?.total ?? 0);
      } else {
        const res = await apiFetch("/sites/newb/posts?author=me&pageSize=50&sort=recent");
        setRows(Array.isArray(res?.items) ? res.items : []);
        setTotal(res?.total ?? 0);
      }
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "불러오기 실패");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, isAuthed]);

  useEffect(() => {
    load();
  }, [load]);

  if (!isLoading && !isAuthed) {
    return (
      <section className="section">
        <div className="content-wrap">
          <h1 className="page-hero__title">로그인이 필요합니다</h1>
          <Link href="/login?next=/me/board" className="btn btn--primary">
            로그인 →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">내 활동</h1>
            <p className="page-hero__sub">
              {user?.displayName || user?.username || "회원"} 님이 남긴 글과 댓글
            </p>
          </div>
          <Link href="/board" className="btn btn--ghost btn--sm">
            ← 게시판
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="tabs" role="tablist" aria-label="내 활동">
            {TABS.map((t) => (
              <Link
                key={t.value}
                href={`/me/board?tab=${t.value}`}
                className={`tab${tab === t.value ? " is-active" : ""}`}
                role="tab"
                aria-selected={tab === t.value}
              >
                {t.label}
              </Link>
            ))}
          </div>

          {err ? (
            <p className="auth-msg auth-msg--error" role="alert" style={{ marginTop: "var(--sp-4)" }}>
              {err}
            </p>
          ) : null}

          <div style={{ display: "grid", gap: "var(--sp-3)", marginTop: "var(--sp-4)" }}>
            {loading ? (
              <article className="card card--parchment" style={{ padding: "var(--sp-4)" }}>
                <p>불러오는 중…</p>
              </article>
            ) : rows.length === 0 ? (
              <article className="card card--parchment" style={{ padding: "var(--sp-4)" }}>
                <p>아직 {tab === "comments" ? "댓글" : "글"}이 없습니다.</p>
                <Link href="/board/new" className="btn btn--primary btn--sm">
                  글쓰기 →
                </Link>
              </article>
            ) : tab === "comments" ? (
              rows.map((c) => (
                <article
                  key={c.id}
                  className="card card--parchment"
                  style={{ padding: "var(--sp-4)", display: "grid", gap: "var(--sp-1)" }}
                >
                  <Link
                    href={`/board/${encodeURIComponent(c.postId)}`}
                    style={{ fontWeight: 700 }}
                  >
                    📄 {c.postTitle}
                  </Link>
                  <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{c.body}</p>
                  <span style={{ color: "var(--muted)", fontSize: "var(--fs-xs)" }}>
                    {formatTime(c.createdAt)}
                  </span>
                </article>
              ))
            ) : (
              rows.map((p) => (
                <article
                  key={p.id}
                  className="card card--parchment"
                  style={{
                    padding: "var(--sp-4)",
                    display: "flex",
                    gap: "var(--sp-3)",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <Link
                      href={`/board/${encodeURIComponent(p.id)}`}
                      style={{ fontWeight: 700 }}
                    >
                      {p.title}
                    </Link>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--sp-2)",
                        color: "var(--muted)",
                        fontSize: "var(--fs-xs)",
                        marginTop: 4,
                      }}
                    >
                      <span>{p.categoryName || p.categorySlug || "글"}</span>
                      <span>{formatTime(p.createdAt)}</span>
                      <span>조회 {p.viewCount ?? 0}</span>
                      <span>추천 {p.recommendCount ?? 0}</span>
                      <span>댓글 {p.commentCount ?? 0}</span>
                    </div>
                  </div>
                  <Link
                    href={`/board/${encodeURIComponent(p.id)}/edit`}
                    className="btn btn--ghost btn--sm"
                  >
                    수정
                  </Link>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}
