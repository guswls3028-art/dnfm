"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, ApiError, posts as postsApi } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";
import { site } from "@/lib/content";

export default function NewPostPage() {
  const router = useRouter();
  const { isAuthed, isLoading } = useCurrentUser();

  // backend 카테고리 fetch — 회원 글 작성 가능 카테고리만 표시. fetch 실패 시 mock fallback.
  const [categories, setCategories] = useState(
    site.boardCategories.filter((c) => c.id !== "all" && c.id !== "notice"),
  );
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || categories[0]?.id || "talk");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await postsApi.categories();
        const items = Array.isArray(data) ? data : data?.items || [];
        if (!alive || items.length === 0) return;
        const writable = items
          .filter((c) => c.writeRoleMin !== "admin")
          .map((c) => ({ id: c.slug, slug: c.slug, label: c.name }));
        if (writable.length > 0) {
          setCategories(writable);
          setCategorySlug(writable[0].slug);
        }
      } catch {
        /* mock fallback */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthed) {
      router.replace("/login?next=/board/new");
    }
  }, [isLoading, isAuthed, router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    const t = title.trim();
    const b = body.trim();
    if (!t) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (!b) {
      setError("본문을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await apiFetch("/sites/newb/posts", {
        method: "POST",
        json: {
          // backend 가 slug 또는 UUID 둘 다 받음. mock fallback 도 slug 사용.
          categorySlug,
          title: t,
          body: b,
        },
      });
      const newId = data?.post?.id || data?.id || data?.postId;
      if (newId) {
        router.push(`/board/${encodeURIComponent(newId)}`);
      } else {
        router.push("/board");
      }
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message || "글 등록에 실패했습니다.";
      setError(msg);
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <section className="section">
        <div className="content-wrap">
          <p>불러오는 중…</p>
        </div>
      </section>
    );
  }

  if (!isAuthed) {
    return (
      <section className="section">
        <div className="content-wrap">
          <p className="auth-msg auth-msg--info">
            로그인이 필요합니다. <Link href="/login?next=/board/new">로그인 →</Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">글쓰기</h1>
            <p className="page-hero__sub">
              말머리를 선택하고 본문을 작성해주세요. 광고·외부 거래는 즉시 삭제됩니다.
            </p>
          </div>
          <Link href="/board" className="btn btn--secondary btn--sm">
            ← 게시판
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ maxWidth: 820 }}>
          <form
            aria-label="글쓰기 폼"
            style={{ display: "grid", gap: "var(--sp-4)" }}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="field">
              <label className="field__label" htmlFor="post-cat">
                말머리
              </label>
              <select
                id="post-cat"
                name="category"
                className="select"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.slug || c.id} value={c.slug || c.id}>
                    [{c.label || c.name}]
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="post-title">
                제목
              </label>
              <input
                id="post-title"
                name="title"
                className="input"
                placeholder="제목을 입력하세요"
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className="field__hint">최대 80자</span>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="post-body">
                본문
              </label>
              <textarea
                id="post-body"
                name="body"
                className="textarea"
                placeholder="질문일 경우 본인 레벨·직업·항마력·막힌 콘텐츠를 함께 적어주세요."
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            {error ? (
              <p className="auth-msg auth-msg--error" role="alert">
                {error}
              </p>
            ) : null}

            <div
              style={{
                display: "flex",
                gap: "var(--sp-2)",
                justifyContent: "flex-end",
              }}
            >
              <Link href="/board" className="btn btn--ghost">
                취소
              </Link>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
              >
                {submitting ? "등록 중…" : "등록"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
