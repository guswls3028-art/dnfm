"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { heroBanners as bannersApi, uploads as uploadsApi, ApiError } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";

/**
 * Hero 영역의 admin 배너 rail + 관리자 톱니.
 *
 * Public 사용자: active 배너 리스트만 표시 (이미지 + label, 클릭 시 linkUrl).
 * Admin (super 또는 newb admin): 톱니 클릭 시 modal 열림 — 배너 add/edit/delete/숨김.
 */
export default function HeroAdminBanners() {
  const { isNewbAdmin } = useCurrentUser();
  const [banners, setBanners] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await bannersApi.list({ includeInactive: isNewbAdmin });
      const list = Array.isArray(data?.items) ? data.items : [];
      setBanners(list);
      setLoadError(null);
    } catch (err) {
      if (typeof console !== "undefined") {
        console.warn("[hero-banners] fetch failed:", err);
      }
      setLoadError(err);
      setBanners([]);
    }
  }, [isNewbAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const visibleBanners = (banners ?? []).filter((b) => b.active || isNewbAdmin);

  if (!isNewbAdmin && visibleBanners.length === 0) {
    // public 이면서 배너 0개 — rail 자체 숨김
    return null;
  }

  return (
    <>
      <section className="hero-banner-rail" aria-label="훈련소 추천 배너">
        <header className="hero-banner-rail__head">
          <span className="hero-banner-rail__title">추천 배너</span>
          {isNewbAdmin ? (
            <button
              type="button"
              className="hero-banner-rail__gear"
              aria-label="배너 관리"
              onClick={() => setEditorOpen(true)}
              title="배너 관리 (관리자)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M19.43 12.98a7.83 7.83 0 0 0 0-1.96l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.66 7.66 0 0 0-1.69-.98l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65a7.83 7.83 0 0 0 0 1.96L2.46 14.6a.5.5 0 0 0-.12.64l2 3.46c.14.24.43.34.69.24l2.42-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.43.5.43h4c.25 0 .46-.19.5-.43l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.42 1a.5.5 0 0 0 .61-.24l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          ) : null}
        </header>

        {loadError && !visibleBanners.length ? (
          <p className="auth-msg auth-msg--info" style={{ margin: 0 }}>
            배너를 가져올 수 없습니다.
          </p>
        ) : visibleBanners.length === 0 ? (
          <p className="hero-banner-rail__empty">
            아직 추천 배너가 없어요. 톱니로 추가해 주세요.
          </p>
        ) : (
          <ul className="hero-banner-rail__list" role="list">
            {visibleBanners.map((b) => (
              <li key={b.id} className={`hero-banner-card${b.active ? "" : " hero-banner-card--inactive"}`}>
                <a
                  href={b.linkUrl || "#"}
                  target={b.linkUrl && b.linkUrl.startsWith("http") ? "_blank" : undefined}
                  rel={b.linkUrl && b.linkUrl.startsWith("http") ? "noreferrer" : undefined}
                  className="hero-banner-card__link"
                >
                  <img
                    className="hero-banner-card__img"
                    src={b.imageUrl}
                    alt={b.label || "배너"}
                    loading="lazy"
                  />
                  {b.label ? <span className="hero-banner-card__label">{b.label}</span> : null}
                  {!b.active && isNewbAdmin ? (
                    <span className="hero-banner-card__hidden-mark">숨김</span>
                  ) : null}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editorOpen && isNewbAdmin ? (
        <BannerEditorModal
          banners={banners ?? []}
          onClose={() => setEditorOpen(false)}
          onChanged={load}
        />
      ) : null}
    </>
  );
}

function BannerEditorModal({ banners, onClose, onChanged }) {
  const [draft, setDraft] = useState({ imageUrl: "", linkUrl: "", label: "", sortOrder: 0, active: true });
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
            <p className="banner-modal__hint">아직 등록된 배너가 없어요.</p>
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
