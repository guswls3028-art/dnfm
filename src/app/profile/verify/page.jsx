"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "@/lib/use-current-user";
import { apiFetch, ApiError, auth } from "@/lib/api-client";
import { site } from "@/lib/content";
import { DNF_CLASSES_GROUPED, findFirstClassIcon } from "@/lib/dnf-classes";

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
  const [editedCharacters, setEditedCharacters] = useState([]); // [{name, klass}]
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [recognized, setRecognized] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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

  function handleDragOver(e) {
    e.preventDefault();
    if (!dragOver) setDragOver(true);
  }
  function handleDragLeave(e) {
    e.preventDefault();
    setDragOver(false);
  }
  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer?.files;
    if (dropped && dropped.length) addFiles(dropped);
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
      setEditedCharacters(
        (m?.characters || []).map((c) => ({ name: c.name || "", klass: c.klass || "" }))
      );
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
    const adventurerName = edited.adventurerName?.trim();
    const mainCharacterName = edited.mainCharacterName?.trim();
    if (!adventurerName || !mainCharacterName) {
      setError("모험단 기본정보 화면에서 모험단명과 대표 캐릭터명을 확인해야 저장할 수 있습니다. 인식값이 비어 있으면 직접 입력해 주세요.");
      return;
    }
    setSaving(true);
    try {
      const characterSelectNames = perImage
        .filter((p) => p.screenType === "character_select")
        .flatMap((p) => (p.characters || []).map((c) => c.name))
        .filter(Boolean);
      const cleanedCharacters = editedCharacters
        .map((c) => ({ name: (c.name || "").trim(), klass: (c.klass || "").trim() }))
        .filter((c) => c.name);
      await auth.confirmDnfProfile({
        adventurerName,
        mainCharacterName,
        mainCharacterClass: edited.mainCharacterClass?.trim() || undefined,
        characters: cleanedCharacters.length ? cleanedCharacters : undefined,
        characterSelectNames: characterSelectNames.length ? characterSelectNames : undefined,
      });
      await refresh();
      setSaved(true);
      setTimeout(() => router.push("/profile?verified=1"), 1200);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : err?.message || "저장 실패";
      setError(msg);
      setSaving(false);
    }
  }

  function updateCharacter(idx, patch) {
    setEditedCharacters((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }
  function removeCharacter(idx) {
    setEditedCharacters((prev) => prev.filter((_, i) => i !== idx));
  }
  function addEmptyCharacter() {
    setEditedCharacters((prev) => [...prev, { name: "", klass: "" }]);
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

            <ul
              className="verify-captures"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "var(--sp-2)",
                listStyle: "none",
                padding: 0,
                margin: "0 0 var(--sp-4)",
              }}
            >
              {(guide?.captures || []).map((cap) => (
                <li
                  key={cap.id}
                  className="verify-captures__item"
                  style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}
                >
                  {cap.imagePath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cap.imagePath}
                      alt={`${cap.label} 예시`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        aspectRatio: "16 / 9",
                        objectFit: "cover",
                        borderRadius: 6,
                        border: "1px solid var(--ink-line, #ddd)",
                        background: "rgba(0,0,0,0.04)",
                        display: "block",
                      }}
                    />
                  ) : null}
                  <strong style={{ fontSize: "0.82rem", lineHeight: 1.25 }}>{cap.label}</strong>
                  <span style={{ fontSize: "0.74rem", color: "var(--ink-muted, #888)", lineHeight: 1.3 }}>
                    {cap.hint}
                  </span>
                </li>
              ))}
            </ul>

            {guide?.classGrid ? (
              <details
                style={{
                  background: "rgba(0,0,0,0.04)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  margin: "0 0 var(--sp-4)",
                  border: "1px solid var(--ink-line, #ddd)",
                }}
              >
                <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: "0.92rem" }}>
                  {guide.classGrid.label}
                </summary>
                <p style={{ fontSize: "0.82rem", color: "var(--ink-muted, #888)", margin: "8px 0 10px" }}>
                  {guide.classGrid.hint}
                </p>
                <div style={{ display: "grid", gap: 10 }}>
                  {(guide.classGrid.images || []).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt="직업 변경 화면"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: 6,
                        border: "1px solid var(--ink-line, #ddd)",
                        display: "block",
                      }}
                    />
                  ))}
                </div>
              </details>
            ) : null}

            <label
              className="verify-dropzone"
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              data-drag={dragOver ? "true" : undefined}
              style={dragOver ? { background: "rgba(99,102,241,0.08)" } : undefined}
            >
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
                캡처 묶어서 한 번에 올리기 (각 10MB)
              </span>
              <span className="verify-dropzone__hint">
                클릭하거나 드래그해서 올리세요 · 한 번에 골라 올리면 자동 분류
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
                  ✓ 캐릭터 선택창과 매칭 — 인증 마크가 부여됩니다
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

              <div className="field">
                <label className="field__label">
                  캐릭터 목록 ({editedCharacters.length}) · 잘못 인식된 이름·직업은 직접 고쳐주세요
                </label>
                <div style={{ display: "grid", gap: 6 }}>
                  {editedCharacters.map((c, i) => {
                    const iconSrc = findFirstClassIcon(c.klass);
                    return (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "36px minmax(0,1fr) minmax(0,1.4fr) auto",
                          gap: 6,
                          alignItems: "center",
                        }}
                      >
                        {iconSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={iconSrc}
                            alt={c.klass}
                            width={36}
                            height={36}
                            style={{ borderRadius: "50%", objectFit: "cover", border: "1px solid var(--ink-line, #ddd)" }}
                          />
                        ) : (
                          <div
                            aria-hidden="true"
                            style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.08)" }}
                          />
                        )}
                        <input
                          className="input"
                          value={c.name}
                          onChange={(e) => updateCharacter(i, { name: e.target.value })}
                          placeholder="캐릭명"
                          aria-label={`캐릭터 ${i + 1} 이름`}
                        />
                        <select
                          className="input"
                          value={c.klass || ""}
                          onChange={(e) => updateCharacter(i, { klass: e.target.value })}
                          aria-label={`캐릭터 ${i + 1} 직업`}
                        >
                          <option value="">직업 선택</option>
                          {DNF_CLASSES_GROUPED.map((g) => (
                            <optgroup key={g.group} label={g.group}>
                              {g.classes.map((kls) => (
                                <option key={`${g.group}::${kls.baseClass}`} value={kls.baseClass}>
                                  {g.group} · {kls.baseClass}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => removeCharacter(i)}
                          aria-label="제거"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={addEmptyCharacter}
                    style={{ justifySelf: "start" }}
                  >
                    + 캐릭터 추가
                  </button>
                </div>
              </div>

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

              {saved ? (
                <p className="auth-msg auth-msg--success" role="status" style={{ marginTop: "var(--sp-3)" }}>
                  ✓ 저장 완료 — 프로필로 이동합니다…
                </p>
              ) : null}

              {error ? (
                <p className="auth-msg auth-msg--error" role="alert" style={{ marginTop: "var(--sp-3)" }}>
                  {error}
                </p>
              ) : null}

              <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-5)" }}>
                <Link href="/profile" className="btn btn--ghost">
                  나중에 / 건너뛰기
                </Link>
                <button
                  type="button"
                  className="btn btn--primary btn--lg"
                  onClick={handleSaveAuth}
                  disabled={saving || saved}
                >
                  {saved ? "✓ 저장 완료" : saving ? "저장 중…" : "이 정보로 인증 저장"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
