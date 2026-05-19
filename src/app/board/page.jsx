"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BoardFab from "@/components/BoardFab";
import BoardRow from "@/components/BoardRow";
import Pagination from "@/components/Pagination";
import { apiFetch, ApiError, posts as postsApi } from "@/lib/api-client";
import {
  BOARD_ALL_CATEGORY,
  buildBoardHref,
  buildBoardNewHref,
  resolveBoardCategoryLabel,
} from "@/lib/board-categories";
import { site } from "@/lib/content";

const PAGE_SIZE = 20;
const ALL = BOARD_ALL_CATEGORY;

const SORTS = [
  { value: "recent", label: "최신순" },
  { value: "best", label: "추천순" },
  { value: "views", label: "조회순" },
];

function normalizePost(p) {
  if (!p) return null;
  const author = p.authorId
    ? p.authorName || p.user?.displayName || "회원"
    : `${p.authorNickname || "ㅇㅇ"}${p.anonymousMarker ? `(${p.anonymousMarker})` : ""}`;
  return {
    id: p.id || p.postId,
    label: resolveBoardCategoryLabel(p),
    categoryId: p.categorySlug || p.categoryId || "talk",
    title: p.title || "(제목 없음)",
    author,
    time: p.createdAt || p.time || "",
    views: typeof p.views === "number" ? p.views : (p.viewCount ?? 0),
    likes: typeof p.likes === "number" ? p.likes : (p.recommendCount ?? p.likeCount ?? 0),
    comments:
      typeof p.comments === "number"
        ? p.comments
        : (p.commentCount ?? (Array.isArray(p.comments) ? p.comments.length : 0)),
    pinned: Boolean(p.pinned),
    hot: p.postType === "best" || Boolean(p.hot),
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
  const router = useRouter();
  const params = useSearchParams();
  const activeCat = params.get("category") || ALL;
  const pageParam = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  const sortParam = params.get("sort") || "recent";
  const qParam = params.get("q") || "";

  const [searchText, setSearchText] = useState(qParam);
  useEffect(() => setSearchText(qParam), [qParam]);

  const fallbackCats = useMemo(() => site.boardCategories || [], []);
  const [categories, setCategories] = useState(fallbackCats);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await postsApi.categories();
        const items = Array.isArray(data) ? data : data?.items || [];
        if (!alive || items.length === 0) return;
        const cats = [
          { id: "all", label: "전체" },
          ...items.map((c) => ({ id: c.slug, label: c.name })),
        ];
        setCategories(cats);
      } catch {
        /* fallback */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const [posts, setPosts] = useState(null);
  const [total, setTotal] = useState(0);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setPosts(null);
    setLoadError(null);

    const qs = new URLSearchParams({
      page: String(pageParam),
      pageSize: String(PAGE_SIZE),
      sort: sortParam,
    });
    if (activeCat !== ALL) qs.set("categorySlug", activeCat);
    if (qParam) qs.set("q", qParam);

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
        setPosts([]);
        setTotal(0);
        setLoadError(err instanceof ApiError ? err.message : err?.message || "네트워크 오류");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeCat, pageParam, sortParam, qParam]);

  const sorted = useMemo(() => {
    if (!posts) return null;
    return [...posts].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));
  }, [posts]);

  const catLabel =
    categories.find((c) => c.id === activeCat)?.label ||
    fallbackCats.find((c) => c.id === activeCat)?.label ||
    "전체";

  function pushQuery(next) {
    router.push(
      buildBoardHref({
        categorySlug: next.category ?? activeCat,
        sort: next.sort ?? sortParam,
        q: next.q ?? qParam,
        page: next.page ?? 1,
      }),
    );
  }

  const buildPageHref = (n) =>
    buildBoardHref({ categorySlug: activeCat, sort: sortParam, q: qParam, page: n });
  const writeHref = buildBoardNewHref(activeCat);

  function handleSearchSubmit(e) {
    e.preventDefault();
    pushQuery({ q: searchText.trim(), page: 1 });
  }

  return (
    <>
      <section className="page-hero page-hero--board">
        <div className="content-wrap page-hero__inner">
          <div>
            <span className="page-hero__kicker">뉴비 훈련소 · 게시판</span>
            <h1 className="page-hero__title">훈련소 커뮤니티</h1>
            <p className="page-hero__sub">
              질문·팁·잡담을 한 게시판에서. 비회원도 글 쓸 수 있어요.
            </p>
          </div>
          <Link href={writeHref} className="btn btn--primary">
            글쓰기
          </Link>
        </div>
      </section>

      <section className="section board-page board-page--newb">
        <div className="content-wrap">
          <div className="tabs" role="tablist" aria-label="게시판 카테고리">
            {categories.map((cat) => {
              const isActive = cat.id === activeCat;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`tab${isActive ? " is-active" : ""}`}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => pushQuery({ category: cat.id, page: 1 })}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div
            className="board-toolbar"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="board-toolbar__search"
            >
              <input
                type="search"
                className="input"
                placeholder="제목·본문 검색"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit" className="btn btn--secondary btn--sm">
                검색
              </button>
              {qParam ? (
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => pushQuery({ q: "", page: 1 })}
                >
                  지우기
                </button>
              ) : null}
            </form>
            <div className="board-toolbar__sort" aria-label="정렬">
              {SORTS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`btn btn--sm ${sortParam === s.value ? "btn--primary" : "btn--ghost"}`}
                  onClick={() => pushQuery({ sort: s.value, page: 1 })}
                  aria-pressed={sortParam === s.value}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {loadError ? (
            <div className="card card--parchment" style={{ marginTop: "var(--sp-4)", padding: "var(--sp-4)" }}>
              <strong style={{ color: "var(--color-gold)" }}>게시글을 불러오지 못했어요</strong>
              <p style={{ margin: "var(--sp-2) 0 0", opacity: 0.86 }}>
                잠시 후 다시 시도해 주세요. ({loadError})
              </p>
            </div>
          ) : null}

          <div className="board" style={{ marginTop: "var(--sp-4)" }}>
            <div className="board__head">
              <h2>
                {catLabel}
                {qParam ? ` · 검색 "${qParam}"` : ""}
              </h2>
              <span className="board__head-meta" aria-live="polite">
                {sorted
                  ? total > 0
                    ? `총 ${total}건${total > PAGE_SIZE ? ` · ${pageParam} 페이지` : ""}`
                    : "0건 · 첫 글을 남겨주세요"
                  : "불러오는 중…"}
              </span>
            </div>

            <div className="board__rows">
              {sorted === null ? (
                <div className="board-row">
                  <span className="board-row__label">…</span>
                  <span className="board-row__title">
                    <strong>게시글을 불러오는 중입니다.</strong>
                  </span>
                  <span className="board-row__meta">잠시만 기다려주세요</span>
                </div>
              ) : sorted.length === 0 ? (
                <div className="board-row">
                  <span className="board-row__label">안내</span>
                  <span className="board-row__title">
                    <strong>
                      {qParam ? "검색 결과가 없습니다." : "이 카테고리에는 아직 글이 없습니다."}
                    </strong>
                  </span>
                  <span className="board-row__meta">
                    <Link href={writeHref}>첫 글 쓰기 →</Link>
                  </span>
                </div>
              ) : (
                sorted.map((post) => <BoardRow key={post.id} post={post} />)
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

      <BoardFab href={writeHref} />
    </>
  );
}
