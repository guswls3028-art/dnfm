"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ApiError, posts as postsApi } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";
import { isSiteAdmin } from "@/lib/permissions";
import ImageUploader from "@/components/ImageUploader";
import PostComposerEditor from "@/components/PostComposerEditor";

/**
 * 글 수정 — 작성자 본인 / 비회원(비번) / admin.
 *
 * Backend PATCH /sites/newb/posts/:id 는:
 *   - 회원: 본인 authorId 일치
 *   - 비회원: guestPassword 일치
 *   - admin: 무조건 OK
 *
 * UI:
 *   - 회원: 본인 글이면 제목/본문/말머리 편집 + 저장
 *   - 비회원: 비번 입력 + 편집 + 저장
 *   - admin: pinned/locked 토글도 노출 (글 상세 AdminPostMenu 에 이미 pin 있지만 여기선 inline)
 */

export default function PostEditPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;
  const { user, isAuthed } = useCurrentUser();
  const isAdmin = isSiteAdmin(user, "newb");

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [flair, setFlair] = useState("");
  const [pinned, setPinned] = useState(false);
  const [locked, setLocked] = useState(false);
  const [guestPassword, setGuestPassword] = useState("");
  const [attachmentR2Keys, setAttachmentR2Keys] = useState([]);

  const [categoryFlairs, setCategoryFlairs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await postsApi.detail(postId);
      const p = data?.post || data;
      setPost(p);
      setTitle(p.title || "");
      setBody(p.body || "");
      setFlair(p.flair || "");
      setPinned(Boolean(p.pinned));
      setLocked(Boolean(p.locked));
      setAttachmentR2Keys(Array.isArray(p.attachmentR2Keys) ? p.attachmentR2Keys : []);
      // 카테고리 flair 목록 fetch — 말머리 select 옵션용
      try {
        const cats = await postsApi.categories();
        const items = Array.isArray(cats) ? cats : cats?.items || [];
        const found = items.find((c) => c.slug === p.categorySlug || c.id === p.categoryId);
        setCategoryFlairs(Array.isArray(found?.flairs) ? found.flairs : []);
      } catch {
        setCategoryFlairs([]);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : err?.message || "글 불러오기 실패");
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  const isOwnMember = post?.authorId && user?.id === post.authorId;
  const isGuestPost = post && !post.authorId;
  const canEdit = isAdmin || isOwnMember || isGuestPost;
  const needsGuestPw = isGuestPost && !isAdmin;

  async function handleSave(e) {
    e.preventDefault();
    if (saving || !post) return;
    if (!title.trim() || !body.trim()) {
      setActionMsg({ ok: false, text: "제목·본문을 입력하세요." });
      return;
    }
    if (needsGuestPw && !guestPassword) {
      setActionMsg({ ok: false, text: "비밀번호를 입력하세요." });
      return;
    }
    setSaving(true);
    setActionMsg(null);
    try {
      const payload = {
        title: title.trim(),
        body: body.trim(),
        flair: flair || null,
        attachmentR2Keys,
      };
      if (isAdmin) {
        payload.pinned = pinned;
        payload.locked = locked;
      }
      if (needsGuestPw) payload.guestPassword = guestPassword;
      await postsApi.update(post.id, payload);
      router.push(`/board/${encodeURIComponent(post.id)}`);
      router.refresh();
    } catch (err) {
      setActionMsg({
        ok: false,
        text: err instanceof ApiError ? err.message : err?.message || "저장 실패",
      });
      setSaving(false);
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
      <section className="section">
        <div className="content-wrap">
          <p className="auth-msg auth-msg--error" role="alert">
            {error || "글을 찾을 수 없습니다."}
          </p>
          <Link href="/board" className="btn btn--ghost btn--sm">
            ← 게시판
          </Link>
        </div>
      </section>
    );
  }

  if (!canEdit) {
    return (
      <section className="section">
        <div className="content-wrap">
          <h1 className="page-hero__title">수정 권한이 없습니다</h1>
          <p>본인 글이거나 운영자만 수정할 수 있습니다.</p>
          <Link href={`/board/${encodeURIComponent(post.id)}`} className="btn btn--ghost btn--sm">
            ← 글로 돌아가기
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
            <h1 className="page-hero__title">글 수정</h1>
            <p className="page-hero__sub">{post.title}</p>
          </div>
          <Link href={`/board/${encodeURIComponent(post.id)}`} className="btn btn--ghost btn--sm">
            ← 취소
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ maxWidth: 820 }}>
          <article className="card card--parchment" style={{ padding: "var(--sp-6)" }}>
            <form
              aria-label="글 수정"
              onSubmit={handleSave}
              style={{ display: "grid", gap: "var(--sp-4)" }}
              noValidate
            >
              {categoryFlairs.length > 0 ? (
                <div className="field">
                  <label className="field__label" htmlFor="edit-flair">
                    말머리
                  </label>
                  <select
                    id="edit-flair"
                    className="select"
                    value={flair || ""}
                    onChange={(e) => setFlair(e.target.value)}
                  >
                    <option value="">없음</option>
                    {categoryFlairs.map((f) => (
                      <option key={f} value={f}>
                        [{f}]
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="field">
                <label className="field__label" htmlFor="edit-title">
                  제목
                </label>
                <input
                  id="edit-title"
                  className="input"
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <PostComposerEditor
                id="edit-body"
                label="본문"
                value={body}
                onChange={setBody}
                textareaClassName="textarea composer__body"
                rows={14}
                placeholder="본문을 수정해주세요."
                templates={[
                  {
                    label: "장비 양식",
                    text: "캐릭터/직업:\n현재 장비:\n목표 콘텐츠:\n보유 재화/재료:\n고민 중인 선택지:",
                  },
                ]}
              />

              {isAuthed || isOwnMember || isAdmin ? (
                <div className="field">
                  <label className="field__label">첨부 이미지</label>
                  <ImageUploader
                    value={attachmentR2Keys}
                    onChange={setAttachmentR2Keys}
                    max={5}
                  />
                </div>
              ) : null}

              {needsGuestPw ? (
                <div className="field">
                  <label className="field__label" htmlFor="guest-pw">
                    비회원 비밀번호
                  </label>
                  <input
                    id="guest-pw"
                    type="password"
                    className="input"
                    placeholder="작성 시 입력한 비밀번호"
                    value={guestPassword}
                    onChange={(e) => setGuestPassword(e.target.value)}
                  />
                  <span className="field__hint">본인 확인용 — 일치해야 저장됩니다.</span>
                </div>
              ) : null}

              {isAdmin ? (
                <div
                  style={{
                    display: "flex",
                    gap: "var(--sp-4)",
                    padding: "var(--sp-2) var(--sp-3)",
                    border: "1px dashed var(--muted)",
                    borderRadius: 8,
                    fontSize: "var(--fs-sm)",
                  }}
                >
                  <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={pinned}
                      onChange={(e) => setPinned(e.target.checked)}
                    />
                    📌 상단 고정
                  </label>
                  <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={locked}
                      onChange={(e) => setLocked(e.target.checked)}
                    />
                    🔒 잠금 (댓글 차단)
                  </label>
                  <span style={{ color: "var(--muted)" }}>운영자 전용</span>
                </div>
              ) : null}

              {actionMsg && !actionMsg.ok ? (
                <p className="auth-msg auth-msg--error" role="alert">
                  {actionMsg.text}
                </p>
              ) : null}

              <div
                style={{
                  display: "flex",
                  gap: "var(--sp-2)",
                  justifyContent: "flex-end",
                }}
              >
                <Link
                  href={`/board/${encodeURIComponent(post.id)}`}
                  className="btn btn--ghost"
                >
                  취소
                </Link>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? "저장 중…" : "저장"}
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>
    </>
  );
}
