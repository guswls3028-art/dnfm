"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  apiFetch,
  ApiError,
  buildApiUrl,
  comments as commentsApi,
  posts as postsApi,
} from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";
import { isSiteAdmin } from "@/lib/permissions";
import AdminPostMenu from "@/components/AdminPostMenu";
import AuthorCard from "@/components/AuthorCard";
import BoardFab from "@/components/BoardFab";
import ReportButton from "@/components/ReportButton";
import MarkdownBody from "@/components/MarkdownBody";
import BoardActionIcon from "@/components/BoardActionIcon";

/**
 * 게시글 상세.
 *
 * 동작:
 *  - GET /sites/newb/posts/:id     → 글 + meta
 *  - GET /sites/newb/posts/:id/comments → 댓글
 *  - POST 댓글 (회원/비회원)
 *  - 추천 (회원만)
 *  - 신고 (회원/비회원)
 *  - 본인 글/댓글 수정·삭제 (회원: 인증 / 비회원: 비번 일치)
 *  - 관리자 도구 (pin / delete)
 *
 * 비회원 마커: authorNickname + anonymousMarker(IP 앞자리) 결합.
 */

function normalizePost(p) {
  if (!p) return null;
  return {
    id: p.id || p.postId,
    categoryName: p.categoryName || p.categoryLabel || p.label || p.category || "글",
    categorySlug: p.categorySlug || null,
    title: p.title || "(제목 없음)",
    body: p.body || p.content || "",
    bodyFormat: p.bodyFormat || "markdown",
    flair: p.flair || null,
    authorId: p.authorId || null,
    authorName:
      p.authorName ||
      p.user?.displayName ||
      p.author?.displayName ||
      (p.authorId
        ? "회원"
        : `${p.authorNickname || "ㅇㅇ"}${p.anonymousMarker ? `(${p.anonymousMarker})` : ""}`),
    createdAt: p.createdAt || p.time || "",
    viewCount: p.viewCount ?? p.views ?? 0,
    recommendCount: p.recommendCount ?? p.likes ?? 0,
    commentCount: p.commentCount ?? p.commentsCount ?? 0,
    pinned: Boolean(p.pinned),
    locked: Boolean(p.locked),
    postType: p.postType || "normal",
    attachmentR2Keys: Array.isArray(p.attachmentR2Keys) ? p.attachmentR2Keys : [],
    // backend 가 회원 게시글에 author 객체를 leftJoin 으로 enrichment — AuthorCard 가 사용.
    author: p.author || null,
  };
}

function normalizeComment(c, i) {
  return {
    id: c.id || c.commentId || `c-${i}`,
    parentId: c.parentId || null,
    body: c.body || c.content || "",
    authorId: c.authorId || null,
    authorName: c.authorId
      ? c.authorName || c.user?.displayName || "회원"
      : `${c.authorNickname || "ㅇㅇ"}${c.anonymousMarker ? `(${c.anonymousMarker})` : ""}`,
    createdAt: c.createdAt || c.time || "",
  };
}

function toList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.comments)) return payload.comments;
  return [];
}

function formatTime(iso) {
  if (!iso) return "";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return iso;
  const diffSec = Math.floor((Date.now() - t.getTime()) / 1000);
  if (diffSec < 60) return "방금";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}분 전`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}시간 전`;
  if (diffSec < 86400 * 7) return `${Math.floor(diffSec / 86400)}일 전`;
  return t.toLocaleDateString("ko-KR");
}

export default function PostDetailClient({
  initialPost = null,
  initialComments = [],
  initialNextPosts = [],
  initialError = null,
} = {}) {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;
  const { isAuthed, user } = useCurrentUser();
  const isAdmin = isSiteAdmin(user, "newb");

  const [post, setPost] = useState(() => normalizePost(initialPost));
  const [comments, setComments] = useState(() => initialComments.map(normalizeComment));
  const [nextPosts, setNextPosts] = useState(() => initialNextPosts);
  const [loading, setLoading] = useState(() => !initialPost && !initialError);
  const [error, setError] = useState(initialError);

  const [commentBody, setCommentBody] = useState("");
  const [commentNickname, setCommentNickname] = useState("");
  const [commentPassword, setCommentPassword] = useState("");
  const [commentBusy, setCommentBusy] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);
  const [voteBusy, setVoteBusy] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingBody, setEditingBody] = useState("");
  const [replyParentId, setReplyParentId] = useState(null);
  const [replyBody, setReplyBody] = useState("");
  const [replyNickname, setReplyNickname] = useState("");
  const [replyPassword, setReplyPassword] = useState("");
  const [replyBusy, setReplyBusy] = useState(false);

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const [pData, cData] = await Promise.all([
        apiFetch(`/sites/newb/posts/${encodeURIComponent(postId)}`),
        apiFetch(`/sites/newb/posts/${encodeURIComponent(postId)}/comments`).catch(() => null),
      ]);
      const np = normalizePost(pData?.post || pData);
      setPost(np);
      const list = toList(cData);
      setComments(list.map(normalizeComment));
      // 같은 카테고리 다음 글 stream — 현재 글 제외, 최근 10건.
      if (np?.categorySlug) {
        const qs = new URLSearchParams({
          categorySlug: np.categorySlug,
          sort: "recent",
          pageSize: "11", // 11건 fetch → 현재 글 1건 빼고 10건 노출.
          page: "1",
        });
        try {
          const nx = await apiFetch(`/sites/newb/posts?${qs.toString()}`);
          const arr = toList(nx);
          setNextPosts(arr.filter((p) => p.id !== np.id).slice(0, 10));
        } catch {
          setNextPosts([]);
        }
      } else {
        setNextPosts([]);
      }
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
    if (!initialPost && !initialError) load();
  }, [load, initialError, initialPost]);

  async function handleVote() {
    if (voteBusy || !post) return;
    if (!isAuthed) {
      router.push(`/login?next=/board/${encodeURIComponent(post.id)}`);
      return;
    }
    setVoteBusy(true);
    setActionMsg(null);
    try {
      await postsApi.vote(post.id, "recommend");
      setActionMsg({ ok: true, text: "추천 반영됨" });
      await load();
    } catch (err) {
      setActionMsg({ ok: false, text: err?.message || "추천 실패" });
    } finally {
      setVoteBusy(false);
    }
  }

  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (commentBusy || !post) return;
    const body = commentBody.trim();
    if (!body) return;
    setCommentBusy(true);
    setActionMsg(null);
    try {
      const payload = { body };
      if (!isAuthed) {
        if (commentNickname.trim()) payload.guestNickname = commentNickname.trim();
        if (commentPassword) {
          if (commentPassword.length < 4) {
            setActionMsg({ ok: false, text: "비밀번호는 4자 이상이어야 합니다." });
            setCommentBusy(false);
            return;
          }
          payload.guestPassword = commentPassword;
        }
      }
      await commentsApi.create(post.id, payload);
      setCommentBody("");
      setCommentPassword("");
      await load();
    } catch (err) {
      setActionMsg({ ok: false, text: err?.message || "댓글 등록 실패" });
    } finally {
      setCommentBusy(false);
    }
  }

  // 댓글을 tree로 그룹화 — top-level 댓글 + 그 자식 답글.
  const commentsTree = useMemo(() => {
    const tops = [];
    const childMap = new Map();
    for (const c of comments) {
      if (c.parentId) {
        if (!childMap.has(c.parentId)) childMap.set(c.parentId, []);
        childMap.get(c.parentId).push(c);
      } else {
        tops.push(c);
      }
    }
    return tops.map((t) => ({ ...t, replies: childMap.get(t.id) || [] }));
  }, [comments]);

  const canDeletePostAsAuthor = useMemo(() => {
    if (!post) return false;
    if (isAdmin) return true;
    if (post.authorId && user?.id === post.authorId) return true;
    if (!post.authorId) return true;
    return false;
  }, [post, user, isAdmin]);

  async function handleDeletePost() {
    if (!post) return;
    const isOwnMember = post.authorId && user?.id === post.authorId;
    let guestPassword;
    if (!isAdmin && !isOwnMember && !post.authorId) {
      const pw = window.prompt("비회원 글 — 작성 시 비밀번호를 입력하세요.");
      if (!pw) return;
      guestPassword = pw;
    }
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await postsApi.remove(post.id, { guestPassword });
      router.push("/board");
    } catch (err) {
      setActionMsg({ ok: false, text: err?.message || "삭제 실패" });
    }
  }

  function startReply(c) {
    setReplyParentId(c.id);
    setReplyBody("");
    setReplyNickname("");
    setReplyPassword("");
  }

  function cancelReply() {
    setReplyParentId(null);
    setReplyBody("");
  }

  async function submitReply() {
    if (!replyParentId || replyBusy) return;
    const body = replyBody.trim();
    if (!body) return;
    setReplyBusy(true);
    try {
      const payload = { body, parentId: replyParentId };
      if (!isAuthed) {
        if (replyNickname.trim()) payload.guestNickname = replyNickname.trim();
        if (replyPassword) {
          if (replyPassword.length < 4) {
            setActionMsg({ ok: false, text: "비밀번호는 4자 이상이어야 합니다." });
            setReplyBusy(false);
            return;
          }
          payload.guestPassword = replyPassword;
        }
      }
      await commentsApi.create(post.id, payload);
      cancelReply();
      await load();
    } catch (err) {
      setActionMsg({ ok: false, text: err?.message || "답글 등록 실패" });
    } finally {
      setReplyBusy(false);
    }
  }

  function startEditComment(c) {
    setEditingCommentId(c.id);
    setEditingBody(c.body || "");
  }

  function cancelEditComment() {
    setEditingCommentId(null);
    setEditingBody("");
  }

  async function saveEditComment(c) {
    const body = editingBody.trim();
    if (!body) return;
    const isOwnMember = c.authorId && user?.id === c.authorId;
    let guestPassword;
    if (!isAdmin && !isOwnMember && !c.authorId) {
      const pw = window.prompt("비회원 댓글 — 작성 시 비밀번호를 입력하세요.");
      if (!pw) return;
      guestPassword = pw;
    }
    try {
      await commentsApi.update(c.id, { body, guestPassword });
      cancelEditComment();
      await load();
    } catch (err) {
      setActionMsg({ ok: false, text: err?.message || "댓글 수정 실패" });
    }
  }

  async function handleDeleteComment(c) {
    const isOwnMember = c.authorId && user?.id === c.authorId;
    let guestPassword;
    if (!isAdmin && !isOwnMember && !c.authorId) {
      const pw = window.prompt("비회원 댓글 — 작성 시 비밀번호를 입력하세요.");
      if (!pw) return;
      guestPassword = pw;
    }
    if (!window.confirm("정말 삭제할까요?")) return;
    try {
      await commentsApi.remove(c.id, { guestPassword });
      await load();
    } catch (err) {
      setActionMsg({ ok: false, text: err?.message || "댓글 삭제 실패" });
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
        <section className="page-hero page-hero--board">
          <div className="content-wrap page-hero__inner">
            <div>
              <h1 className="page-hero__title">게시글</h1>
              <p className="page-hero__sub">
                <Link href="/board" style={{ color: "var(--color-gold)", fontWeight: 800 }}>
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
            {postId ? (
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={load}
                style={{ marginTop: "var(--sp-3)" }}
              >
                다시 불러오기
              </button>
            ) : null}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-hero page-hero--board">
        <div className="content-wrap page-hero__inner">
          <div>
            <span className="page-hero__kicker">뉴비 훈련소 · 게시판</span>
            <h1 className="page-hero__title">게시글</h1>
            <p className="page-hero__sub">
              <Link href="/board" style={{ color: "var(--color-gold)", fontWeight: 800 }}>
                ← 게시판 목록
              </Link>
            </p>
          </div>
          <Link href="/board/new" className="btn btn--secondary btn--sm">
            글쓰기
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap thread-wrap thread-wrap--newb">
          <article className="thread-card thread-card--post">
            <div className="thread-label">게시물</div>
            <header className="post-head thread-post-head" style={{ minWidth: 0 }}>
              <div
                className="post-head__top thread-post-top"
              >
                <span className="badge badge--soft">{post.categoryName}</span>
                {post.flair ? <span className="badge badge--soft">[{post.flair}]</span> : null}
                {post.postType === "best" ? <span className="badge badge--solid">BEST</span> : null}
                <div
                  className="thread-post-tools"
                >
                  {isAdmin ? (
                    <AdminPostMenu
                      postId={post.id}
                      pinned={post.pinned}
                      locked={post.locked}
                      onChange={load}
                    />
                  ) : null}
                  <ReportButton targetType="post" targetId={post.id} />
                  {canDeletePostAsAuthor ? (
                    <Link
                      href={`/board/${encodeURIComponent(post.id)}/edit`}
                      className="btn btn--ghost btn--sm thread-tool"
                    >
                      <BoardActionIcon name="edit" />
                      수정
                    </Link>
                  ) : null}
                  {canDeletePostAsAuthor ? (
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm thread-tool"
                      onClick={handleDeletePost}
                    >
                      <BoardActionIcon name="trash" />
                      삭제
                    </button>
                  ) : null}
                </div>
              </div>
              <h1
                className="post-head__title"
                style={{
                  marginTop: "var(--sp-2)",
                  wordBreak: "keep-all",
                  overflowWrap: "anywhere",
                }}
              >
                {post.pinned ? (
                  <BoardActionIcon name="pin" className="post-pin-icon" />
                ) : null}
                {post.title}
              </h1>
              <div
                className="post-head__meta"
                style={{
                  display: "flex",
                  gap: "var(--sp-3)",
                  color: "var(--muted)",
                  fontSize: "var(--fs-sm)",
                  flexWrap: "wrap",
                  rowGap: "var(--sp-1)",
                }}
              >
                <span>{post.authorName}</span>
                <span>{formatTime(post.createdAt)}</span>
                <span>조회 {post.viewCount}</span>
                <span>추천 {post.recommendCount}</span>
                <span>댓글 {post.commentCount}</span>
              </div>
            </header>
            <div
              className="post-body thread-post-body"
              style={{ marginTop: "var(--sp-4)" }}
            >
              <MarkdownBody source={post.body} format={post.bodyFormat} />
            </div>

            {post.attachmentR2Keys && post.attachmentR2Keys.length > 0 ? (
              <div className="thread-attachments">
                {post.attachmentR2Keys.map((key, i) => (
                  <a
                    key={`${key}-${i}`}
                    href={buildApiUrl(`/uploads/r2/${encodeURIComponent(key)}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="thread-attachment"
                  >
                    <img
                      src={buildApiUrl(`/uploads/r2/${encodeURIComponent(key)}`)}
                      alt=""
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            ) : null}
            <div
              className="post-actions thread-post-actions"
              style={{
                display: "flex",
                gap: "var(--sp-2)",
                marginTop: "var(--sp-5)",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="btn btn--primary btn--sm"
                onClick={handleVote}
                disabled={voteBusy}
                title={isAuthed ? "추천" : "로그인 후 추천 가능"}
              >
                {voteBusy ? (
                  "처리 중…"
                ) : (
                  <>
                    <BoardActionIcon name="recommend" />
                    추천 {post.recommendCount}
                  </>
                )}
              </button>
              <Link href="/board" className="btn btn--ghost btn--sm">
                목록으로
              </Link>
              {actionMsg ? (
                <span
                  className={
                    actionMsg.ok ? "auth-msg auth-msg--info" : "auth-msg auth-msg--error"
                  }
                  style={{ alignSelf: "center" }}
                  role="status"
                >
                  {actionMsg.text}
                </span>
              ) : null}
            </div>

            {post.author ? (
              <div className="thread-author-slot">
                <div className="thread-subsection-label">작성자</div>
                <AuthorCard
                  author={{
                    displayName: post.author.displayName || post.authorName,
                    avatarR2Key: post.author.avatarR2Key,
                    dnfProfile: post.author.dnfProfile,
                  }}
                />
              </div>
            ) : null}
          </article>

          <section className="thread-card thread-card--comments" aria-labelledby="comments-title" id="comments">
            <div className="thread-label thread-label--comments">댓글</div>
            <header className="section__head">
              <div>
                <span className="section__kicker">COMMENTS</span>
                <h2 id="comments-title" className="section__title">
                  댓글 {comments.length}
                </h2>
              </div>
            </header>

            <div
              className="comments thread-comment-list"
              style={{ display: "grid", gap: "var(--sp-3)", marginTop: "var(--sp-3)" }}
            >
              {commentsTree.length === 0 ? (
                <div className="comment thread-comment-empty">
                  <p className="comment__body">
                    아직 댓글이 없습니다. 첫 댓글을 남겨주세요.
                  </p>
                </div>
              ) : (
                commentsTree.flatMap((top) => {
                  const rows = [renderCommentRow(top, false)];
                  for (const reply of top.replies) {
                    rows.push(renderCommentRow(reply, true));
                  }
                  if (replyParentId === top.id) {
                    rows.push(
                      <div
                        key={`reply-form-${top.id}`}
                        className="comment thread-reply-form"
                        style={{
                          marginLeft: "var(--sp-6)",
                          borderLeft: "2px solid var(--color-gold, #ccaa55)",
                          paddingLeft: "var(--sp-3)",
                        }}
                      >
                        <strong style={{ fontSize: "var(--fs-sm)" }}>
                          <BoardActionIcon name="reply" className="thread-comment-reply-mark" />
                          {top.authorName} 에게 답글
                        </strong>
                        {!isAuthed ? (
                          <div
                            className="thread-comment-guest-fields"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "var(--sp-2)",
                              marginTop: "var(--sp-2)",
                            }}
                          >
                            <input
                              className="input"
                              placeholder="닉네임 (선택)"
                              value={replyNickname}
                              maxLength={32}
                              onChange={(e) => setReplyNickname(e.target.value)}
                            />
                            <input
                              className="input"
                              type="password"
                              placeholder="비번 (선택, 4자+)"
                              value={replyPassword}
                              maxLength={128}
                              onChange={(e) => setReplyPassword(e.target.value)}
                            />
                          </div>
                        ) : null}
                        <textarea
                          className="textarea"
                          rows={2}
                          value={replyBody}
                          onChange={(e) => setReplyBody(e.target.value)}
                          placeholder="답글 작성…"
                          style={{ marginTop: "var(--sp-2)" }}
                        />
                        <div
                          style={{
                            display: "flex",
                            gap: "var(--sp-2)",
                            justifyContent: "flex-end",
                            marginTop: "var(--sp-2)",
                          }}
                        >
                          <button
                            type="button"
                            className="btn btn--ghost btn--xs"
                            onClick={cancelReply}
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            className="btn btn--primary btn--xs"
                            onClick={submitReply}
                            disabled={replyBusy || !replyBody.trim()}
                          >
                            {replyBusy ? "등록 중…" : "답글 등록"}
                          </button>
                        </div>
                      </div>,
                    );
                  }
                  return rows;
                })
              )}
            </div>

            {post.locked ? (
              <p
                className="auth-msg auth-msg--info"
                role="note"
                style={{ marginTop: "var(--sp-3)" }}
              >
                잠긴 글입니다. 댓글을 달 수 없습니다.
              </p>
            ) : (
              <form
                className="comment-form thread-comment-form"
                aria-label="댓글 작성"
                onSubmit={handleCommentSubmit}
                style={{ display: "grid", gap: "var(--sp-2)", marginTop: "var(--sp-4)" }}
              >
                <p
                  className="comment-form__hint"
                  style={{
                    color: "var(--color-text-muted, var(--muted))",
                    fontSize: "var(--fs-xs)",
                    margin: 0,
                  }}
                >
                  정책 위반 댓글은 삭제될 수 있습니다.
                </p>
                {!isAuthed ? (
                  <div
                    className="thread-comment-guest-fields"
                    style={{
                      display: "grid",
                      gap: "var(--sp-2)",
                      gridTemplateColumns: "1fr 1fr",
                    }}
                  >
                    <input
                      className="input"
                      placeholder="닉네임 (선택, 기본 ㅇㅇ)"
                      maxLength={32}
                      value={commentNickname}
                      onChange={(e) => setCommentNickname(e.target.value)}
                    />
                    <input
                      className="input"
                      type="password"
                      placeholder="비밀번호 (선택, 4자+)"
                      maxLength={128}
                      value={commentPassword}
                      onChange={(e) => setCommentPassword(e.target.value)}
                    />
                  </div>
                ) : null}
                <textarea
                  className="textarea"
                  placeholder={
                    isAuthed
                      ? "댓글을 입력하세요."
                      : "댓글을 입력하세요. 비회원도 작성 가능합니다."
                  }
                  rows={3}
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  disabled={commentBusy}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="submit"
                    className="btn btn--primary btn--sm"
                    disabled={commentBusy || !commentBody.trim()}
                  >
                    {commentBusy ? "등록 중…" : "댓글 등록"}
                  </button>
                </div>
              </form>
            )}
          </section>

          {nextPosts.length > 0 ? (
            <section
              className="next-posts"
              aria-labelledby="next-posts-title"
              style={{ marginTop: "var(--sp-6)" }}
            >
              <header className="section__head">
                <div>
                  <span className="section__kicker">{post.categoryName} · 다음 글</span>
                  <h2 id="next-posts-title" className="section__title">
                    다음 글 이어보기
                  </h2>
                </div>
                <Link href={`/board?category=${encodeURIComponent(post.categorySlug || "")}`} className="btn btn--ghost btn--sm">
                  {post.categoryName} 전체
                </Link>
              </header>
              <ul className="next-posts__list" style={{ display: "grid", gap: "var(--sp-2)", marginTop: "var(--sp-3)", listStyle: "none", padding: 0 }}>
                {nextPosts.map((np) => (
                  <li key={np.id} className="next-posts__row">
                    <Link
                      href={`/board/${encodeURIComponent(np.id)}`}
                      className="next-posts__link"
                      style={{
                        display: "flex",
                        gap: "var(--sp-2)",
                        alignItems: "baseline",
                        padding: "var(--sp-2) var(--sp-3)",
                        border: "1px solid var(--color-border, rgba(255,255,255,0.08))",
                        borderRadius: 8,
                        textDecoration: "none",
                        color: "inherit",
                        minWidth: 0,
                      }}
                    >
                      <span className="badge badge--soft" style={{ flexShrink: 0 }}>
                        {np.categoryName || post.categoryName}
                      </span>
                      <span style={{ flex: 1, minWidth: 0, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {np.title || "(제목 없음)"}
                      </span>
                      <span className="next-posts__stat" style={{ color: "var(--muted)", fontSize: "var(--fs-xs)", flexShrink: 0 }}>
                        <BoardActionIcon name="message" />
                        {np.commentCount ?? 0}
                      </span>
                      <span className="next-posts__stat" style={{ color: "var(--muted)", fontSize: "var(--fs-xs)", flexShrink: 0 }}>
                        <BoardActionIcon name="eye" />
                        {np.viewCount ?? 0}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </section>

      <BoardFab />
    </>
  );

  function renderCommentRow(c, isReply) {
    return (
      <CommentRow
        key={c.id}
        c={c}
        isReply={isReply}
        user={user}
        isAdmin={isAdmin}
        editingCommentId={editingCommentId}
        editingBody={editingBody}
        setEditingBody={setEditingBody}
        startEditComment={startEditComment}
        cancelEditComment={cancelEditComment}
        saveEditComment={saveEditComment}
        startReply={startReply}
        handleDeleteComment={handleDeleteComment}
        formatTime={formatTime}
      />
    );
  }
}

function CommentRow({
  c,
  isReply,
  user,
  isAdmin,
  editingCommentId,
  editingBody,
  setEditingBody,
  startEditComment,
  cancelEditComment,
  saveEditComment,
  startReply,
  handleDeleteComment,
  formatTime,
}) {
  const isOwn = c.authorId && user?.id === c.authorId;
  const canEditDelete = isAdmin || isOwn || !c.authorId;
  const isEditing = editingCommentId === c.id;
  return (
    <div
      className={`comment thread-comment${isReply ? " thread-comment--reply" : ""}`}
      style={
        isReply
          ? {
              marginLeft: "var(--sp-6)",
              borderLeft: "2px solid var(--color-gold, #ccaa55)",
              paddingLeft: "var(--sp-3)",
            }
          : undefined
      }
    >
      <div className="thread-comment-header">
        <div className="comment__meta thread-comment-meta">
          {isReply ? (
            <BoardActionIcon name="reply" className="thread-comment-reply-mark" />
          ) : null}
          <strong>{c.authorName}</strong>
          <span className="thread-comment-time">
            {formatTime(c.createdAt)}
          </span>
        </div>
        <div className="thread-comment-actions" aria-label="댓글 도구">
          <ReportButton targetType="comment" targetId={c.id} small compact />
          {!isReply && !isEditing ? (
            <button
              type="button"
              className="btn btn--ghost btn--xs thread-tool thread-tool--icon"
              onClick={() => startReply(c)}
              title="답글"
              aria-label="답글"
            >
              <BoardActionIcon name="reply" />
            </button>
          ) : null}
          {canEditDelete && !isEditing ? (
            <button
              type="button"
              className="btn btn--ghost btn--xs thread-tool thread-tool--icon"
              onClick={() => startEditComment(c)}
              title="댓글 수정"
              aria-label="댓글 수정"
            >
              <BoardActionIcon name="edit" />
            </button>
          ) : null}
          {canEditDelete ? (
            <button
              type="button"
              className="btn btn--ghost btn--xs thread-tool thread-tool--icon"
              onClick={() => handleDeleteComment(c)}
              title="댓글 삭제"
              aria-label="댓글 삭제"
            >
              <BoardActionIcon name="trash" />
            </button>
          ) : null}
        </div>
      </div>
      {isEditing ? (
        <div style={{ display: "grid", gap: "var(--sp-2)" }}>
          <textarea
            className="textarea"
            rows={3}
            value={editingBody}
            onChange={(e) => setEditingBody(e.target.value)}
          />
          <div
            style={{ display: "flex", gap: "var(--sp-2)", justifyContent: "flex-end" }}
          >
            <button
              type="button"
              className="btn btn--ghost btn--xs"
              onClick={cancelEditComment}
            >
              취소
            </button>
            <button
              type="button"
              className="btn btn--primary btn--xs"
              onClick={() => saveEditComment(c)}
              disabled={!editingBody.trim()}
            >
              저장
            </button>
          </div>
        </div>
      ) : (
        <p className="comment__body" style={{ whiteSpace: "pre-wrap" }}>
          {c.body}
        </p>
      )}
    </div>
  );
}
