"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import BoardRow from "@/components/BoardRow";
import Pagination from "@/components/Pagination";
import { apiFetch, ApiError } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";
import { site } from "@/lib/content";

const PAGE_SIZE = 20;

function normalizePost(p) {
  // 백엔드 응답 모양이 확정되기 전까지 방어적으로 매핑.
  if (!p) return null;
  return {
    id: p.id || p.postId || p.slug,
    label: p.categoryName || p.categoryLabel || p.label || (p.category ? p.category : "글"),
    categoryId: p.categorySlug || p.categoryId || p.category || "talk",
    title: p.title || "(제목 없음)",
    author: p.authorName || p.author || p.user?.displayName || "익명",
    time: p.timeAgo || p.time || p.createdAtLabel || p.createdAt || "",
    views: typeof p.views === "number" ? p.views : (p.viewCount ?? 0),
    likes: typeof p.likes === "number" ? p.likes : (p.likeCount ?? 0),
    comments:
      typeof p.comments === "number"
        ? p.comments
        : (p.commentCount ?? (Array.isArray(p.comments) ? p.comments.length : 0)),
    pinned: Boolean(p.pinned),
    hot: Boolean(p.hot),
    body: p.body || p.content || "",
  };
}

export default function BoardPage() {
  return (
    <Suspense fallback={<BoardLoading />}>
      <BoardInner />
    </Suspense>
  );
}

function BoardLoading() {
  return (
    <section className="section">
      <div className="content-wrap">
        <p>게시판을 불러오는 중…</p>
      </div>
    </section>
  );
}

function BoardInner() {
  const params = useSearchParams();
  const activeCat = params.get("category") || "all";
  const pageParam = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  const { isAuthed } = useCurrentUser();

  const [posts, setPosts] = useState(null); // null = loading
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setPosts(null);
    setError(null);

    const qs = new URLSearchParams({
      page: String(pageParam),
      pageSize: String(PAGE_SIZE),
      sort: "recent",
    });
    if (activeCat !== "all") qs.set("category", activeCat);

    (async () => {
      try {
        const data = await apiFetch(`/sites/newb/posts?${qs.toString()}`);
        if (cancelled) return;
        const list = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.posts)
            ? data.posts
            : Array.isArray(data)
              ? data
              : [];
        setPosts(list.map(normalizePost).filter(Boolean));
        const t =
          typeof data?.total === "number"
            ? data.total
            : Array.isArray(list)
              ? list.length
              : 0;
        setTotal(t);
      } catch (err) {
        if (cancelled) return;
        if (typeof console !== "undefined") {
          // 실제 에러 사항은 콘솔로. 사용자에겐 친근한 카피만.
          console.warn("[board] posts fetch failed:", err);
        }
        const friendly =
          err instanceof ApiError && err.status >= 500
            ? "게시판 서버가 잠시 응답하지 않아요. 잠시 후 새로고침 해주세요."
            : "지금은 게시글을 가져올 수 없어요. 잠시 후 다시 시도해 주세요.";
        setError(friendly);
        setPosts([]);
        setTotal(0);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeCat, pageParam]);

  const sorted = useMemo(() => {
    if (!posts) return null;
    // pinned 우선 정렬은 같은 페이지 안에서만. (서버가 이미 pinned DESC + createdAt DESC)
    return [...posts].sort(
      (a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)),
    );
  }, [posts]);

  const catLabel = site.boardCategories.find((c) => c.id === activeCat)?.label || "전체";

  const buildPageHref = (n) => {
    const qs = new URLSearchParams();
    if (activeCat !== "all") qs.set("category", activeCat);
    if (n > 1) qs.set("page", String(n));
    const s = qs.toString();
    return s ? `/board?${s}` : "/board";
  };

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">훈련소 커뮤니티</h1>
            <p className="page-hero__sub">
              질문·팁·잡담을 한 게시판에서. 카톡방 톤 그대로.
            </p>
          </div>
          {isAuthed ? (
            <Link href="/board/new" className="btn btn--primary">
              글쓰기
            </Link>
          ) : (
            <Link
              href="/login?next=/board/new"
              className="btn btn--secondary"
              title="로그인 후 글쓰기 가능"
            >
              로그인 후 글쓰기
            </Link>
          )}
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="tabs" role="tablist" aria-label="게시판 카테고리">
            {site.boardCategories.map((cat) => {
              const isActive = cat.id === activeCat;
              const href = cat.id === "all" ? "/board" : `/board?category=${cat.id}`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`tab${isActive ? " is-active" : ""}`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          <div className="board" style={{ marginTop: "var(--sp-5)" }}>
            <div className="board__head">
              <h2>
                {catLabel} ·{" "}
                {sorted
                  ? total > 0
                    ? `총 ${total}건${total > PAGE_SIZE ? ` · ${pageParam} 페이지` : ""}`
                    : `${sorted.length}건`
                  : "불러오는 중…"}
              </h2>
              {isAuthed ? (
                <Link className="card__action" href="/board/new">
                  글쓰기 →
                </Link>
              ) : (
                <Link className="card__action" href="/login?next=/board/new">
                  로그인 →
                </Link>
              )}
            </div>

            {error ? (
              <p className="auth-msg auth-msg--error" role="alert" style={{ margin: "var(--sp-3)" }}>
                {error}
              </p>
            ) : null}

            <div className="board__rows">
              {sorted === null ? (
                <div className="board-row">
                  <span className="board-row__label">…</span>
                  <span className="board-row__title">
                    <strong>게시글을 불러오는 중입니다.</strong>
                  </span>
                  <span className="board-row__meta">잠시만 기다려주세요</span>
                </div>
              ) : sorted.length === 0 && !error ? (
                <div className="board-row">
                  <span className="board-row__label">안내</span>
                  <span className="board-row__title">
                    <strong>이 카테고리에는 아직 글이 없습니다.</strong>
                  </span>
                  <span className="board-row__meta">
                    <span>첫 글의 주인이 되어보세요</span>
                  </span>
                </div>
              ) : (
                sorted.map((post) => (
                  <BoardRow key={post.id} post={post} />
                ))
              )}
            </div>

            <Pagination
              current={pageParam}
              total={total}
              pageSize={PAGE_SIZE}
              buildHref={buildPageHref}
            />
          </div>
        </div>
      </section>
    </>
  );
}
