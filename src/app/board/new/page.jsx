"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, ApiError, posts as postsApi } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";
import { site } from "@/lib/content";

/**
 * 글쓰기 — 회원/비회원 모두 작성 가능 (2026-05-14 정책).
 *
 * 동작:
 *  1) 카테고리 fetch — `allowAnonymous=true` 항목은 비회원도 작성 가능.
 *  2) 비회원이면 닉네임/비밀번호 입력 영역 표시. 비번 4자 이상.
 *  3) 회원이면 닉네임/비번 숨김.
 *  4) 회원 전용 카테고리 선택 시 비회원이면 안내 + 로그인 유도.
 */

const MIN_GUEST_PW = 4;

export default function NewPostPage() {
  // useSearchParams 는 Suspense boundary 안에서만 prerender 통과 (Next.js 15).
  // dev hydration 안정성을 위해 fallback={null} (hurock 패턴과 통일).
  return (
    <Suspense fallback={null}>
      <NewPostInner />
    </Suspense>
  );
}

function NewPostInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetSlug = searchParams.get("category");
  const { isAuthed, isLoading } = useCurrentUser();

  const fallbackCats = useMemo(
    () =>
      (site.boardCategories || [])
        .filter((c) => c.id && c.id !== "all" && c.id !== "notice")
        .map((c) => ({
          slug: c.id,
          name: c.label || c.name || c.id,
          writeRoleMin: "anonymous",
          allowAnonymous: true,
          flairs: c.flairs || [],
        })),
    [],
  );

  const [categories, setCategories] = useState(fallbackCats);
  const [categorySlug, setCategorySlug] = useState(presetSlug || fallbackCats[0]?.slug || "talk");
  const [flair, setFlair] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [guestNickname, setGuestNickname] = useState("");
  const [guestPassword, setGuestPassword] = useState("");
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
          .map((c) => ({
            slug: c.slug,
            name: c.name,
            writeRoleMin: c.writeRoleMin,
            allowAnonymous: Boolean(c.allowAnonymous),
            flairs: Array.isArray(c.flairs) ? c.flairs : [],
          }));
        if (writable.length > 0) {
          setCategories(writable);
          const init = presetSlug && writable.find((c) => c.slug === presetSlug);
          setCategorySlug(init ? init.slug : writable[0].slug);
        }
      } catch {
        /* fallback 사용 */
      }
    })();
    return () => {
      alive = false;
    };
  }, [presetSlug]);

  const selected = useMemo(
    () => categories.find((c) => c.slug === categorySlug) || null,
    [categories, categorySlug],
  );
  const guestAllowedHere = Boolean(selected?.allowAnonymous);
  const mustLogin = !isAuthed && !guestAllowedHere;

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
    if (mustLogin) {
      setError("이 카테고리는 회원만 작성할 수 있습니다.");
      return;
    }
    if (!isAuthed && guestPassword && guestPassword.length < MIN_GUEST_PW) {
      setError(`비밀번호는 ${MIN_GUEST_PW}자 이상이어야 합니다.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = { categorySlug, title: t, body: b };
      if (flair) payload.flair = flair;
      if (!isAuthed) {
        if (guestNickname.trim()) payload.guestNickname = guestNickname.trim();
        if (guestPassword) payload.guestPassword = guestPassword;
      }
      const data = await apiFetch("/sites/newb/posts", { method: "POST", json: payload });
      const newId = data?.post?.id || data?.id || data?.postId;
      if (newId) router.push(`/board/${encodeURIComponent(newId)}`);
      else router.push("/board");
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : err?.message || "글 등록에 실패했습니다.";
      setError(msg);
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">글쓰기</h1>
            <p className="page-hero__sub">
              {isAuthed
                ? "말머리를 고르고 본문을 작성해주세요."
                : "비회원도 글을 남길 수 있어요. 닉네임은 비워두면 'ㅇㅇ'이 됩니다."}
            </p>
          </div>
          <Link href="/board" className="btn btn--secondary btn--sm">
            ← 게시판
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ maxWidth: 820 }}>
          <article className="card card--parchment" style={{ padding: "var(--sp-6)" }}>
            <form
              aria-label="글쓰기 폼"
              style={{ display: "grid", gap: "var(--sp-4)" }}
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="field">
                <label className="field__label" htmlFor="post-cat">
                  카테고리
                </label>
                <select
                  id="post-cat"
                  className="select"
                  value={categorySlug}
                  onChange={(e) => {
                    setCategorySlug(e.target.value);
                    setFlair("");
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                      {!c.allowAnonymous ? " · 회원 전용" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {selected && selected.flairs && selected.flairs.length > 0 ? (
                <div className="field">
                  <label className="field__label" htmlFor="post-flair">
                    말머리 (선택)
                  </label>
                  <select
                    id="post-flair"
                    className="select"
                    value={flair}
                    onChange={(e) => setFlair(e.target.value)}
                  >
                    <option value="">없음</option>
                    {selected.flairs.map((f) => (
                      <option key={f} value={f}>
                        [{f}]
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              {mustLogin ? (
                <p className="auth-msg auth-msg--info" role="note">
                  이 카테고리는 회원만 작성 가능합니다.{" "}
                  <Link href="/login?next=/board/new">로그인 →</Link>
                </p>
              ) : null}

              {!isAuthed && !mustLogin ? (
                <div
                  style={{
                    display: "grid",
                    gap: "var(--sp-3)",
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  <div className="field">
                    <label className="field__label" htmlFor="guest-nick">
                      닉네임 (선택)
                    </label>
                    <input
                      id="guest-nick"
                      className="input"
                      placeholder="ㅇㅇ"
                      maxLength={32}
                      value={guestNickname}
                      onChange={(e) => setGuestNickname(e.target.value)}
                    />
                    <span className="field__hint">비우면 'ㅇㅇ' + IP 앞자리</span>
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="guest-pw">
                      비밀번호 (선택)
                    </label>
                    <input
                      id="guest-pw"
                      className="input"
                      type="password"
                      placeholder="4자 이상 — 본인 수정·삭제용"
                      maxLength={128}
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
                    />
                    <span className="field__hint">비우면 본인 수정·삭제 불가</span>
                  </div>
                </div>
              ) : null}

              <div className="field">
                <label className="field__label" htmlFor="post-title">
                  제목
                </label>
                <input
                  id="post-title"
                  className="input"
                  placeholder="제목을 입력하세요"
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="field__hint">최대 200자</span>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="post-body">
                  본문
                </label>
                <textarea
                  id="post-body"
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
                  disabled={submitting || isLoading || mustLogin}
                >
                  {submitting ? "등록 중…" : "등록"}
                </button>
              </div>
            </form>
          </article>
        </div>
      </section>
    </>
  );
}
