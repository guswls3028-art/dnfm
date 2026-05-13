"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";

function normalizePost(p) {
  if (!p) return null;
  return {
    id: p.id || p.postId,
    label: p.categoryLabel || p.label || p.category || "글",
    title: p.title || "(제목 없음)",
    author: p.authorName || p.author || p.user?.displayName || "익명",
    time: p.timeAgo || p.time || p.createdAt || "",
    views: typeof p.views === "number" ? p.views : (p.viewCount ?? 0),
    likes: typeof p.likes === "number" ? p.likes : (p.likeCount ?? 0),
    commentsCount:
      typeof p.commentsCount === "number"
        ? p.commentsCount
        : (p.commentCount ?? (Array.isArray(p.comments) ? p.comments.length : 0)),
    body: p.body || p.content || "",
    pinned: Boolean(p.pinned),
    hot: Boolean(p.hot),
  };
}

function normalizeComment(c, i) {
  return {
    id: c.id || c.commentId || `c-${i}`,
    author: c.authorName || c.author || c.user?.displayName || "익명",
    time: c.timeAgo || c.time || c.createdAt || "",
    body: c.body || c.content || "",
  };
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;
  const { isAuthed } = useCurrentUser();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentText, setCommentText] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [voteBusy, setVoteBusy] = useState(false);
  const [voteMsg, setVoteMsg] = useState(null);

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/sites/newb/posts/${encodeURIComponent(postId)}`);
      const p = normalizePost(data?.post || data);
      setPost(p);
      const rawComments = data?.comments || data?.post?.comments || [];
      setComments(rawComments.map(normalizeComment));
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? `${err.message} (${err.status})`
          : err?.message || "게시글을 불러오지 못했습니다.";
      setError(msg);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleVote() {
    if (voteBusy || !post) return;
    if (!isAuthed) {
      router.push(`/login?next=/board/${encodeURIComponent(post.id)}`);
      return;
    }
    setVoteBusy(true);
    setVoteMsg(null);
    try {
      await apiFetch(`/sites/newb/posts/${encodeURIComponent(post.id)}/vote`, {
        method: "POST",
        json: { value: 1 },
      });
      setVoteMsg("추천했어요!");
      await load();
    } catch (err) {
      setVoteMsg(err?.message || "추천 처리에 실패했습니다.");
    } finally {
      setVoteBusy(false);
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (commentSubmitting || !post) return;
    const body = commentText.trim();
    if (!body) return;
    if (!isAuthed) {
      router.push(`/login?next=/board/${encodeURIComponent(post.id)}`);
      return;
    }
    setCommentSubmitting(true);
    try {
      await apiFetch(`/sites/newb/posts/${encodeURIComponent(post.id)}/comments`, {
        method: "POST",
        json: { body },
      });
      setCommentText("");
      await load();
    } catch (err) {
      setVoteMsg(err?.message || "댓글 등록에 실패했습니다.");
    } finally {
      setCommentSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="section">
        <div className="content-wrap">
          <p>불러오는 중…</p>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <>
        <section className="page-hero">
          <div className="content-wrap page-hero__inner">
            <div>
              <h1 className="page-hero__title">게시글</h1>
              <p className="page-hero__sub">
                <Link
                  href="/board"
                  style={{ color: "var(--color-gold)", fontWeight: 800 }}
                >
                  ← 게시판 목록
                </Link>
              </p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="content-wrap">
            <p className="auth-msg auth-msg--error" role="alert">
              {error || "게시글을 찾을 수 없습니다."}
            </p>
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
            <h1 className="page-hero__title">게시글</h1>
            <p className="page-hero__sub">
              <Link
                href="/board"
                style={{ color: "var(--color-gold)", fontWeight: 800 }}
              >
                ← 게시판 목록
              </Link>
            </p>
          </div>
          {isAuthed ? (
            <Link href="/board/new" className="btn btn--secondary btn--sm">
              글쓰기
            </Link>
          ) : (
            <Link href="/login?next=/board/new" className="btn btn--secondary btn--sm">
              로그인 후 글쓰기
            </Link>
          )}
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <article>
            <header className="post-head">
              <span className="badge badge--soft">{post.label}</span>
              <h1 className="post-head__title">
                {post.pinned ? "📌 " : ""}
                {post.title}
                {post.hot ? " · HOT" : ""}
              </h1>
              <div className="post-head__meta">
                <span>{post.author}</span>
                {post.time ? <span>{post.time}</span> : null}
                <span>조회 {post.views}</span>
                <span>추천 {post.likes}</span>
                <span>댓글 {post.commentsCount}</span>
              </div>
            </header>
            <div className="post-body">{post.body || "본문이 없습니다."}</div>
            <div className="post-actions">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                onClick={handleVote}
                disabled={voteBusy}
                title={isAuthed ? "추천" : "로그인 후 추천 가능"}
              >
                {voteBusy ? "처리 중…" : `추천 (${post.likes})`}
              </button>
              <Link href="/board" className="btn btn--ghost btn--sm">
                목록으로
              </Link>
              {voteMsg ? <span style={{ alignSelf: "center", fontSize: "var(--fs-sm)" }}>{voteMsg}</span> : null}
            </div>
          </article>

          <section aria-labelledby="comments-title">
            <header className="section__head">
              <div>
                <span className="section__kicker">COMMENTS</span>
                <h2 id="comments-title" className="section__title">
                  댓글 {comments.length}
                </h2>
              </div>
            </header>

            <div className="comments">
              {comments.length === 0 ? (
                <div className="comment">
                  <p className="comment__body">
                    아직 댓글이 없습니다. 첫 댓글을 남겨주세요.
                  </p>
                </div>
              ) : (
                comments.map((c) => (
                  <div className="comment" key={c.id}>
                    <div className="comment__meta">
                      <strong>{c.author}</strong>
                      {c.time ? <span>{c.time}</span> : null}
                    </div>
                    <p className="comment__body">{c.body}</p>
                  </div>
                ))
              )}
            </div>

            <form
              className="comment-form"
              aria-label="댓글 작성"
              onSubmit={handleCommentSubmit}
            >
              <textarea
                className="textarea"
                placeholder={
                  isAuthed
                    ? "댓글을 입력하세요. 운영 규칙을 지켜주세요."
                    : "댓글은 로그인 후 작성 가능합니다."
                }
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!isAuthed || commentSubmitting}
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--sp-2)" }}>
                {!isAuthed ? (
                  <Link
                    href={`/login?next=/board/${encodeURIComponent(post.id)}`}
                    className="btn btn--secondary btn--sm"
                  >
                    로그인 후 댓글 →
                  </Link>
                ) : (
                  <button
                    type="submit"
                    className="btn btn--primary btn--sm"
                    disabled={commentSubmitting || !commentText.trim()}
                  >
                    {commentSubmitting ? "등록 중…" : "댓글 등록"}
                  </button>
                )}
              </div>
            </form>
          </section>
        </div>
      </section>
    </>
  );
}
