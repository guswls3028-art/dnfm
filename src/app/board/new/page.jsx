"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, ApiError, posts as postsApi } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";
import { site } from "@/lib/content";
import ImageUploader from "@/components/ImageUploader";
import PostComposerEditor from "@/components/PostComposerEditor";

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
const QUESTION_GOALS = ["스토리", "레이드", "재해", "직업 추천", "세팅", "과금 효율", "기타"];
const QUESTION_SCREENSHOT_OPTIONS = ["미첨부", "첨부 예정", "첨부 완료"];

function compactText(value) {
  return String(value || "").trim();
}

function profileQuestionDefaults(user) {
  const dnf = user?.dnfProfile || {};
  const mainClass = [dnf.mainCharacterClassGroup, dnf.mainCharacterClass]
    .map(compactText)
    .filter(Boolean)
    .join(" / ");
  return {
    server: compactText(dnf.mainCharacterServer || dnf.serverName || dnf.server),
    job: mainClass || compactText(dnf.mainCharacterClass),
    characterCount: Array.isArray(dnf.characters) ? String(dnf.characters.length) : "",
  };
}

function buildQuestionBody(draft) {
  const lines = [
    "[질문]",
    `서버: ${compactText(draft.server)}`,
    `직업: ${compactText(draft.job)}`,
    `레벨: ${compactText(draft.level)}`,
    `항마력: ${compactText(draft.power)}`,
    `보유 캐릭 수: ${compactText(draft.characterCount)}`,
    `현재 막힌 곳: ${compactText(draft.blockedAt)}`,
    `목표: ${compactText(draft.goal)}`,
    `스크린샷: ${compactText(draft.screenshot)}`,
    `현재 상황: ${compactText(draft.situation)}`,
    `질문 내용: ${compactText(draft.question)}`,
  ];
  return lines.join("\n");
}

function hasQuestionDraftContent(draft) {
  return Object.values(draft || {}).some((value) => {
    const text = compactText(value);
    return text && text !== "미첨부";
  });
}

function buildQuestionTitle(draft) {
  const question = compactText(draft.question).replace(/\s+/g, " ");
  if (question) return `질문: ${question.slice(0, 56)}`;
  const blockedAt = compactText(draft.blockedAt);
  if (blockedAt) return `질문: ${blockedAt}`;
  const job = compactText(draft.job);
  return job ? `${job} 질문` : "질문 남깁니다";
}

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
  const { isAuthed, isLoading, user } = useCurrentUser();

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
  const [attachmentR2Keys, setAttachmentR2Keys] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [profileDefaultsApplied, setProfileDefaultsApplied] = useState(false);
  const [questionCopyMsg, setQuestionCopyMsg] = useState("");
  const [questionDraft, setQuestionDraft] = useState({
    server: "",
    job: "",
    level: "",
    power: "",
    characterCount: "",
    blockedAt: "",
    goal: "",
    screenshot: "미첨부",
    situation: "",
    question: "",
  });

  function updateQuestionField(key, value) {
    setQuestionCopyMsg("");
    setQuestionDraft((current) => ({ ...current, [key]: value }));
  }

  function applyQuestionTemplate() {
    const next = buildQuestionBody(questionDraft);
    setBody((current) => {
      const trimmed = current.trim();
      return trimmed ? `${current}\n\n${next}` : next;
    });
  }

  async function copyQuestionTemplate() {
    const next = buildQuestionBody(questionDraft);
    try {
      await navigator.clipboard.writeText(next);
      setQuestionCopyMsg("카톡에 붙여넣을 질문 양식을 복사했습니다.");
    } catch {
      applyQuestionTemplate();
      setQuestionCopyMsg("복사 권한이 없어 본문에 넣었습니다.");
    }
  }

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

  useEffect(() => {
    if (!isAuthed || profileDefaultsApplied) return;
    const defaults = profileQuestionDefaults(user);
    if (!Object.values(defaults).some(Boolean)) return;
    setQuestionDraft((current) => ({
      ...current,
      server: current.server || defaults.server,
      job: current.job || defaults.job,
      characterCount: current.characterCount || defaults.characterCount,
    }));
    setProfileDefaultsApplied(true);
  }, [isAuthed, profileDefaultsApplied, user]);

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

    const isQuestion = categorySlug === "question";
    const draftHasContent = isQuestion && hasQuestionDraftContent(questionDraft);
    const t = title.trim() || (draftHasContent ? buildQuestionTitle(questionDraft) : "");
    const b = body.trim() || (draftHasContent ? buildQuestionBody(questionDraft) : "");
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
      if (attachmentR2Keys.length > 0) payload.attachmentR2Keys = attachmentR2Keys;
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
            <span className="page-hero__kicker">NEW POST</span>
            <h1 className="page-hero__title">글쓰기</h1>
            <p className="page-hero__sub">
              {isAuthed
                ? "말머리를 고르고 본문을 자유롭게 작성해주세요."
                : "비회원도 글을 남길 수 있어요. 닉네임은 비워두면 'ㅇㅇ'이 됩니다."}
            </p>
          </div>
          <Link href="/board" className="btn btn--secondary btn--sm">
            ← 게시판
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap composer-wrap">
          <article className="composer card card--parchment">
            <form
              aria-label="글쓰기 폼"
              className="composer__form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="composer__row composer__row--cats">
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
              </div>

              {mustLogin ? (
                <p className="auth-msg auth-msg--info" role="note">
                  이 카테고리는 회원만 작성 가능합니다.{" "}
                  <Link href="/login?next=/board/new">로그인 →</Link>
                </p>
              ) : null}

              {!isAuthed && !mustLogin ? (
                <div className="composer__row composer__row--guest">
                  <div className="field">
                    <label className="field__label" htmlFor="guest-nick">
                      닉네임 <small>(선택)</small>
                    </label>
                    <input
                      id="guest-nick"
                      className="input"
                      placeholder="ㅇㅇ"
                      maxLength={32}
                      value={guestNickname}
                      onChange={(e) => setGuestNickname(e.target.value)}
                    />
                    <span className="field__hint">비우면 'ㅇㅇ' + IP 앞자리로 표시</span>
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="guest-pw">
                      비밀번호 <small>(선택)</small>
                    </label>
                    <input
                      id="guest-pw"
                      className="input"
                      type="password"
                      placeholder="4자 이상"
                      maxLength={128}
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
                    />
                    <span className="field__hint">본인 수정·삭제용. 비우면 수정 불가</span>
                  </div>
                </div>
              ) : null}

              {categorySlug === "question" ? (
                <section className="question-builder" aria-labelledby="question-builder-title">
                  <div className="question-builder__head">
                    <div>
                      <span>QUESTION TEMPLATE</span>
                      <h2 id="question-builder-title">질문 양식 생성기</h2>
                    </div>
                    <p>
                      카톡에 붙여넣거나 본문에 넣어두면 방장이 답변하기 쉽습니다.
                    </p>
                  </div>

                  <div className="question-builder__grid">
                    <div className="field">
                      <label className="field__label" htmlFor="q-server">서버</label>
                      <input
                        id="q-server"
                        className="input"
                        value={questionDraft.server}
                        onChange={(e) => updateQuestionField("server", e.target.value)}
                        placeholder="모르면 비워두기"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="q-job">직업</label>
                      <input
                        id="q-job"
                        className="input"
                        value={questionDraft.job}
                        onChange={(e) => updateQuestionField("job", e.target.value)}
                        placeholder="예: 웨펀마스터"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="q-level">레벨</label>
                      <input
                        id="q-level"
                        className="input"
                        inputMode="numeric"
                        value={questionDraft.level}
                        onChange={(e) => updateQuestionField("level", e.target.value)}
                        placeholder="예: 65"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="q-power">항마력</label>
                      <input
                        id="q-power"
                        className="input"
                        inputMode="numeric"
                        value={questionDraft.power}
                        onChange={(e) => updateQuestionField("power", e.target.value)}
                        placeholder="예: 38,000"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="q-count">보유 캐릭 수</label>
                      <input
                        id="q-count"
                        className="input"
                        inputMode="numeric"
                        value={questionDraft.characterCount}
                        onChange={(e) => updateQuestionField("characterCount", e.target.value)}
                        placeholder="예: 3"
                      />
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="q-goal">목표</label>
                      <select
                        id="q-goal"
                        className="select"
                        value={questionDraft.goal}
                        onChange={(e) => updateQuestionField("goal", e.target.value)}
                      >
                        <option value="">선택</option>
                        {QUESTION_GOALS.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="field__label" htmlFor="q-shot">스크린샷</label>
                      <select
                        id="q-shot"
                        className="select"
                        value={questionDraft.screenshot}
                        onChange={(e) => updateQuestionField("screenshot", e.target.value)}
                      >
                        {QUESTION_SCREENSHOT_OPTIONS.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field question-builder__field--wide">
                      <label className="field__label" htmlFor="q-blocked">현재 막힌 곳</label>
                      <input
                        id="q-blocked"
                        className="input"
                        value={questionDraft.blockedAt}
                        onChange={(e) => updateQuestionField("blockedAt", e.target.value)}
                        placeholder="예: 재해 입장, 에픽 세팅, 레이드 컷"
                      />
                    </div>
                    <div className="field question-builder__field--wide">
                      <label className="field__label" htmlFor="q-situation">현재 상황</label>
                      <textarea
                        id="q-situation"
                        className="textarea"
                        rows={3}
                        value={questionDraft.situation}
                        onChange={(e) => updateQuestionField("situation", e.target.value)}
                        placeholder="지금 어디까지 했고, 무엇을 시도했는지 짧게 적어주세요."
                      />
                    </div>
                    <div className="field question-builder__field--wide">
                      <label className="field__label" htmlFor="q-question">질문 내용</label>
                      <textarea
                        id="q-question"
                        className="textarea"
                        rows={3}
                        value={questionDraft.question}
                        onChange={(e) => updateQuestionField("question", e.target.value)}
                        placeholder="가장 궁금한 걸 한 문장으로 적어주세요."
                      />
                    </div>
                  </div>

                  <div className="question-builder__actions">
                    <button type="button" className="btn btn--secondary" onClick={applyQuestionTemplate}>
                      본문에 넣기
                    </button>
                    <button type="button" className="btn btn--ghost" onClick={copyQuestionTemplate}>
                      카톡용 복사
                    </button>
                  </div>
                  <div className="question-builder__foot">
                    <span>
                      {isAuthed
                        ? "인증 정보가 있는 필드는 자동 입력됩니다. 비어 있으면 직접 적어주세요."
                        : "비회원도 질문을 남길 수 있습니다. 닉네임은 선택입니다."}
                    </span>
                    {questionCopyMsg ? <strong>{questionCopyMsg}</strong> : null}
                  </div>
                </section>
              ) : null}

              <div className="field">
                <label className="field__label" htmlFor="post-title">
                  제목
                </label>
                <input
                  id="post-title"
                  className="input composer__title"
                  placeholder="한 줄로 요점을 적어주세요"
                  maxLength={200}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="composer__meter" aria-live="polite">
                  <span className="field__hint">최대 200자</span>
                  <span className={`composer__count${title.length > 180 ? " is-warn" : ""}`}>
                    {title.length} / 200
                  </span>
                </div>
              </div>

              <PostComposerEditor
                id="post-body"
                label="본문"
                value={body}
                onChange={setBody}
                placeholder={
                  "본문을 자유롭게 작성해주세요.\n\n질문이면 위 양식 생성기를 쓰면 답변이 빠릅니다.\n\n줄바꿈은 그대로 반영됩니다."
                }
                rows={16}
                templates={[
                  { label: "질문 양식", getText: () => buildQuestionBody(questionDraft) },
                  {
                    label: "장비 양식",
                    text: "캐릭터/직업:\n현재 장비:\n목표 콘텐츠:\n보유 재화/재료:\n고민 중인 선택지:",
                  },
                ]}
              />

              {isAuthed ? (
                <div className="field">
                  <label className="field__label">첨부 이미지 <small>(선택, 최대 5장)</small></label>
                  <ImageUploader
                    value={attachmentR2Keys}
                    onChange={setAttachmentR2Keys}
                    max={5}
                  />
                </div>
              ) : (
                !mustLogin ? (
                  <div className="composer__attach-note">
                    <strong>이미지 첨부는 회원만</strong>
                    <span>
                      비회원도 글은 자유롭게. 사진 첨부가 필요하면{" "}
                      <Link href={`/login?next=${encodeURIComponent("/board/new")}`}>
                        로그인 →
                      </Link>
                    </span>
                  </div>
                ) : null
              )}

              {error ? (
                <p className="auth-msg auth-msg--error" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="composer__actions">
                <Link href="/board" className="btn btn--ghost">
                  취소
                </Link>
                <button
                  type="submit"
                  className="btn btn--primary btn--lg"
                  disabled={submitting || isLoading || mustLogin}
                >
                  {submitting ? "등록 중…" : "등록"}
                </button>
              </div>
            </form>
          </article>

          <aside className="composer__side" aria-label="작성 가이드">
            <section className="composer-side-card">
              <h2 className="composer-side-card__title">작성 팁</h2>
              <ul className="composer-side-card__list">
                <li>질문은 톡방에서 묻힌 뒤에도 찾을 수 있게 남깁니다.</li>
                <li><strong>레벨·직업·항마력·막힌 곳</strong>이 있으면 답변이 빨라집니다.</li>
                <li>운영자는 댓글로 답하고, 반복 질문은 가이드 후보로 회수합니다.</li>
                <li>도배/광고/외부 거래 글은 즉시 삭제됩니다.</li>
              </ul>
            </section>

            <section className="composer-side-card">
              <h2 className="composer-side-card__title">카테고리 안내</h2>
              <dl className="composer-side-card__dl">
                <div>
                  <dt>질문</dt>
                  <dd>막혔거나 모르는 것 — 부담 X</dd>
                </div>
                <div>
                  <dt>팁</dt>
                  <dd>방장이 가이드 후보로 회수</dd>
                </div>
                <div>
                  <dt>파티·장비</dt>
                  <dd>실전 도움 글. 스크린샷 권장</dd>
                </div>
                <div>
                  <dt>잡담</dt>
                  <dd>인사·근황·환영 인사 환영</dd>
                </div>
              </dl>
            </section>

            <section className="composer-side-card composer-side-card--cta">
              <h2 className="composer-side-card__title">실시간 도움</h2>
              <p>본문 적기 어려우면 카톡방에 먼저 던져보세요. 보통 누군가 답합니다.</p>
              <a
                className="btn btn--secondary btn--sm"
                href="https://open.kakao.com/o/gbsjsZ5g"
                target="_blank"
                rel="noreferrer"
              >
                카톡방 입장 →
              </a>
            </section>
          </aside>
        </div>
      </section>
    </>
  );
}
