"use client";

import { useRef, useState } from "react";
import { heroBanners as bannersApi, uploads as uploadsApi, ApiError } from "@/lib/api-client";

/**
 * Hero 배너 어드민 편집 modal (운영자만).
 * banners 배열은 backend 원본 row 형태 (id / imageUrl / linkUrl / label / sortOrder / active).
 */
export default function BannerEditorModal({ banners, onClose, onChanged }) {
  const [draft, setDraft] = useState({
    imageUrl: "",
    linkUrl: "",
    label: "",
    sortOrder: 0,
    active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadHint, setUploadHint] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드할 수 있어요.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("이미지는 10MB 이하만 업로드할 수 있어요.");
      return;
    }
    setUploading(true);
    setError(null);
    setUploadHint(null);
    try {
      const result = await uploadsApi.uploadFile({ file, purpose: "hero_banner" });
      const finalUrl = result?.publicUrl || "";
      if (finalUrl) {
        setDraft((d) => ({ ...d, imageUrl: finalUrl }));
        setUploadHint(`업로드 완료 — ${file.name}`);
      } else {
        setUploadHint("업로드 완료 — URL 수신 실패. 운영자에게 보고.");
      }
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : err?.message || "업로드 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const reset = () => {
    setDraft({ imageUrl: "", linkUrl: "", label: "", sortOrder: 0, active: true });
    setEditingId(null);
    setError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    if (!draft.imageUrl.trim()) {
      setError("이미지 URL은 필수예요.");
      return;
    }
    setBusy(true);
    try {
      const payload = {
        imageUrl: draft.imageUrl.trim(),
        linkUrl: draft.linkUrl.trim() || null,
        label: draft.label.trim() || null,
        sortOrder: Number(draft.sortOrder) || 0,
        active: draft.active,
      };
      if (editingId) {
        await bannersApi.update(editingId, payload);
      } else {
        await bannersApi.create(payload);
      }
      await onChanged();
      reset();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : err?.message || "저장 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("이 배너를 삭제할까요? (되돌릴 수 없음)")) return;
    setBusy(true);
    setError(null);
    try {
      await bannersApi.remove(id);
      await onChanged();
      if (editingId === id) reset();
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : err?.message || "삭제 중 오류가 발생했습니다.";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  const edit = (b) => {
    setEditingId(b.id);
    setDraft({
      imageUrl: b.imageUrl || "",
      linkUrl: b.linkUrl || "",
      label: b.label || "",
      sortOrder: b.sortOrder || 0,
      active: b.active !== false,
    });
    setError(null);
  };

  return (
    <div
      className="banner-modal-backdrop"
      onClick={(e) => {
        if (e.target.classList.contains("banner-modal-backdrop")) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="추천 배너 관리"
    >
      <div className="banner-modal">
        <header className="banner-modal__head">
          <h2 className="banner-modal__title">추천 배너 관리</h2>
          <button type="button" className="banner-modal__close" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </header>

        <section className="banner-modal__section">
          <h3 className="banner-modal__subtitle">{editingId ? "배너 수정" : "새 배너"}</h3>
          <form className="banner-modal__form" onSubmit={submit}>
            <div className="field">
              <label className="field__label" htmlFor="bnr-img">이미지</label>
              <input
                id="bnr-img"
                className="input"
                placeholder="https://… 또는 /asset.jpg"
                value={draft.imageUrl}
                onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
              />
              <div style={{ display: "flex", gap: "var(--sp-2)", alignItems: "center", marginTop: 6 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => uploadFile(e.target.files?.[0])}
                  disabled={uploading}
                  style={{ flex: 1, minWidth: 0 }}
                />
                {uploading ? <span className="field__hint">업로드 중…</span> : null}
              </div>
              {uploadHint ? (
                <span className="field__hint" style={{ color: "var(--color-gold-deep)" }}>{uploadHint}</span>
              ) : null}
            </div>
            <div className="field">
              <label className="field__label" htmlFor="bnr-link">클릭 이동 URL (선택)</label>
              <input
                id="bnr-link"
                className="input"
                placeholder="https://…"
                value={draft.linkUrl}
                onChange={(e) => setDraft({ ...draft, linkUrl: e.target.value })}
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="bnr-label">표시 라벨 (선택)</label>
              <input
                id="bnr-label"
                className="input"
                placeholder="예: 허락 공대"
                maxLength={80}
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              />
            </div>
            <div style={{ display: "flex", gap: "var(--sp-4)", alignItems: "flex-end" }}>
              <div className="field" style={{ width: 96 }}>
                <label className="field__label" htmlFor="bnr-sort">정렬</label>
                <input
                  id="bnr-sort"
                  className="input"
                  type="number"
                  value={draft.sortOrder}
                  onChange={(e) => setDraft({ ...draft, sortOrder: e.target.value })}
                />
              </div>
              <label className="banner-modal__checkbox">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                />
                노출
              </label>
            </div>

            {error ? (
              <p className="auth-msg auth-msg--error" role="alert">{error}</p>
            ) : null}

            <div style={{ display: "flex", gap: "var(--sp-2)", justifyContent: "flex-end" }}>
              {editingId ? (
                <button type="button" className="btn btn--ghost btn--sm" onClick={reset}>
                  새로 추가로 전환
                </button>
              ) : null}
              <button type="submit" className="btn btn--primary btn--sm" disabled={busy}>
                {busy ? "저장 중…" : editingId ? "수정 저장" : "추가"}
              </button>
            </div>
          </form>
        </section>

        <section className="banner-modal__section">
          <h3 className="banner-modal__subtitle">현재 배너 ({banners.length}개)</h3>
          {banners.length === 0 ? (
            <p className="banner-modal__hint">아직 등록된 배너가 없어요. 등록 전에는 fallback 슬라이드가 보입니다.</p>
          ) : (
            <ul className="banner-modal__list" role="list">
              {banners.map((b) => (
                <li key={b.id} className="banner-modal__item">
                  <img className="banner-modal__thumb" src={b.imageUrl} alt={b.label || "배너"} />
                  <div className="banner-modal__meta">
                    <strong>{b.label || "(라벨 없음)"}</strong>
                    <small>{b.linkUrl || "(링크 없음)"}</small>
                    <small>정렬 {b.sortOrder} · {b.active ? "노출" : "숨김"}</small>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-1)" }}>
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm"
                      onClick={() => edit(b)}
                      disabled={busy}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="btn btn--danger btn--sm"
                      onClick={() => remove(b.id)}
                      disabled={busy}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
