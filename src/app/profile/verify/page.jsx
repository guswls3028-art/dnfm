"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/lib/use-current-user";
import { apiFetch, ApiError, auth } from "@/lib/api-client";
import { site } from "@/lib/content";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function formatBytes(n) {
  if (!n) return "0 B";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function screenTypeLabel(t) {
  if (t === "basic_info") return "모험단 기본정보";
  if (t === "character_list") return "보유 캐릭터";
  if (t === "character_select") return "캐릭터 선택창";
  return "분류 불명";
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="auth-shell"><p>불러오는 중…</p></div>}>
      <VerifyInner />
    </Suspense>
  );
}

function VerifyInner() {
  const router = useRouter();
  const params = useSearchParams();
  const isWelcome = params.get("welcome") === "1";
  const { user, isAuthed, isLoading, refresh } = useCurrentUser();
  const guide = site.verifyGuide;

  const [files, setFiles] = useState([]); // {file, url}
  const [recognizing, setRecognizing] = useState(false);
  const [merged, setMerged] = useState(null);
  const [perImage, setPerImage] = useState([]);
  const [edited, setEdited] = useState({}); // overrides
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [recognized, setRecognized] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthed) router.replace("/login?next=/profile/verify");
  }, [isAuthed, isLoading, router]);

  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(list) {
    if (!list || list.length === 0) return;
    setError(null);
    const next = [...files];
    for (const file of list) {
      if (next.length >= MAX_FILES) {
        setError(`한 번에 최대 ${MAX_FILES}장까지 업로드 가능합니다.`);
        break;
      }
      if (!file.type?.startsWith("image/")) {
        setError("이미지 파일만 업로드 가능합니다.");
        continue;
      }
      if (file.size > MAX_FILE_BYTES) {
        setError(`파일 크기가 10MB를 초과합니다 (${file.name}).`);
        continue;
      }
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setFiles(next);
  }

  function removeFile(index) {
    setFiles((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return next;
    });
  }

  async function handleRecognize() {
    if (recognizing || files.length === 0) return;
    setError(null);
    setRecognizing(true);
    try {
      const data = await auth.ocrAuto(files.map((f) => f.file));
      const m = data?.merged || data?.data?.merged || null;
      const pi = data?.perImage || data?.data?.perImage || [];
      setMerged(m);
      setPerImage(pi);
      setEdited({
        adventurerName: m?.adventurerName ?? "",
        mainCharacterName: m?.mainCharacterName ?? "",
        mainCharacterClass: m?.mainCharacterClass ?? "",
      });
      setRecognized(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err?.message || "인식에 실패했습니다.";
      setError(msg);
    } finally {
      setRecognizing(false);
    }
  }

  async function handleSaveAuth() {
    if (saving || !merged) return;
    setError(null);
    setSaving(true);
    try {
      const characterSelectNames = perImage
        .filter((p) => p.screenType === "character_select")
        .flatMap((p) => (p.characters || []).map((c) => c.name))
        .filter(Boolean);
      await auth.confirmDnfProfile({
        adventurerName: edited.adventurerName?.trim() || undefined,
        mainCharacterName: edited.mainCharacterName?.trim() || undefined,
        mainCharacterClass: edited.mainCharacterClass?.trim() || undefined,
        characters: merged.characters?.length ? merged.characters : undefined,
        characterSelectNames: characterSelectNames.length ? characterSelectNames : undefined,
      });
      await refresh();
      router.push("/profile?verified=1");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err?.message || "저장 실패";
      setError(msg);
      setSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="auth-shell">
        <p>불러오는 중…</p>
      </div>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">
              {isWelcome ? "가입 완료 · 모험단 인증" : "모험단 인증"}
            </h1>
            <p className="page-hero__sub">
              {isWelcome
                ? `${user?.displayName || "모험가"}님, 가입 완료! 모험단 인증으로 인증 마크를 받을 수 있습니다 (선택).`
                : guide?.body}
            </p>
          </div>
          <Link href="/profile" className="btn btn--secondary btn--sm">
            나중에 / 건너뛰기 →
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ display: "grid", gap: "var(--sp-6)" }}>
          <div className="auth-card" style={{ maxWidth: "none" }}>
            <h2 className="auth-card__title" style={{ fontSize: "var(--fs-2xl)" }}>
              {guide?.title}
            </h2>
            <p className="auth-card__sub">{guide?.body}</p>

            <ul className="verify-captures">
              {(guide?.captures || []).map((cap) => (
                <li key={cap.id} className="verify-captures__item">
                  <strong>{cap.label}</strong>
                  <span>{cap.hint}</span>
                </li>
              ))}
            </ul>

            <ul className="verify-rules">
              {(guide?.rules || []).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>

            <label className="verify-dropzone">
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <span className="verify-dropzone__icon" aria-hidden="true">＋</span>
              <span className="verify-dropzone__text">
                캡처 묶어서 한 번에 올리기 (최대 {MAX_FILES}장 · 각 10MB)
              </span>
              <span className="verify-dropzone__hint">
                기본정보·보유캐릭터·캐릭터 선택창 — 한 번에 골라 올리면 자동 분류
              </span>
            </label>

            {files.length > 0 ? (
              <div className="verify-previews">
                {files.map((f, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <div key={i} className="verify-preview">
                    <img src={f.url} alt={f.file.name} />
                    <div className="verify-preview__meta">
                      <span title={f.file.name}>{f.file.name}</span>
                      <small>{formatBytes(f.file.size)}</small>
                    </div>
                    <button
                      type="button"
                      className="verify-preview__remove"
                      onClick={() => removeFile(i)}
                      aria-label="제거"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {error ? (
              <p className="auth-msg auth-msg--error" role="alert">
                {error}
              </p>
            ) : null}

            <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-4)" }}>
              <button
                type="button"
                className="btn btn--primary btn--lg"
                onClick={handleRecognize}
                disabled={files.length === 0 || recognizing}
              >
                {recognizing ? "인식 중…" : "인식 시작"}
              </button>
              {recognized ? (
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setMerged(null);
                    setPerImage([]);
                    setEdited({});
                    setRecognized(false);
                  }}
                  disabled={recognizing}
                >
                  결과 초기화
                </button>
              ) : null}
            </div>
          </div>

          {recognized && merged ? (
            <div className="auth-card" style={{ maxWidth: "none" }}>
              <h2 className="auth-card__title" style={{ fontSize: "var(--fs-2xl)" }}>
                인식 결과 (수정 가능)
              </h2>
              <p className="auth-card__sub">
                자동 인식 결과입니다. 다르면 직접 수정하고 인증 저장을 눌러주세요.
              </p>

              {merged.verifiedBySelectScreen ? (
                <p className="auth-msg auth-msg--success">
                  ✓ 캐릭터 선택창과 매칭 — 인증 마크 부여 예정
                </p>
              ) : (
                <p className="auth-msg auth-msg--info">
                  대표 캐릭이 캐릭터 선택창 목록에 없어 인증 마크는 미부여. 본 정보는 저장됩니다.
                </p>
              )}

              <div className="field">
                <label className="field__label" htmlFor="vf-adv">모험단명</label>
                <input
                  id="vf-adv"
                  className="input"
                  value={edited.adventurerName ?? ""}
                  onChange={(e) => setEdited((p) => ({ ...p, adventurerName: e.target.value }))}
                  placeholder="예: 소비에트연맹"
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="vf-main">대표 캐릭터 이름</label>
                <input
                  id="vf-main"
                  className="input"
                  value={edited.mainCharacterName ?? ""}
                  onChange={(e) => setEdited((p) => ({ ...p, mainCharacterName: e.target.value }))}
                  placeholder="예: 지금간다"
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="vf-cls">대표 캐릭터 직업</label>
                <input
                  id="vf-cls"
                  className="input"
                  value={edited.mainCharacterClass ?? ""}
                  onChange={(e) => setEdited((p) => ({ ...p, mainCharacterClass: e.target.value }))}
                  placeholder="예: 엘레멘탈마스터"
                />
              </div>

              {merged.characters?.length ? (
                <div className="field">
                  <label className="field__label">캐릭터 목록 ({merged.characters.length})</label>
                  <ul className="verify-characters">
                    {merged.characters.map((c, i) => (
                      <li key={i}>
                        <strong>{c.name}</strong>
                        {c.klass ? <span> · {c.klass}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <details className="verify-details">
                <summary>이미지별 분류 결과 ({perImage.length})</summary>
                <ul className="verify-per-image">
                  {perImage.map((p, i) => (
                    <li key={i}>
                      <code>#{p.index + 1}</code> {p.fileName} —{" "}
                      <strong>{screenTypeLabel(p.screenType)}</strong>
                      {p.error ? <span style={{ color: "var(--color-danger)" }}> ({p.error})</span> : null}
                    </li>
                  ))}
                </ul>
              </details>

              <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-5)" }}>
                <Link href="/profile" className="btn btn--ghost">
                  나중에 / 건너뛰기
                </Link>
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={handleSaveAuth}
                  disabled={saving}
                >
                  {saving ? "저장 중…" : "이 정보로 인증 저장"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
