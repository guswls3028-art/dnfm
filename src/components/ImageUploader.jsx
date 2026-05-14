"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/upload";
import { buildApiUrl } from "@/lib/api-client";

/**
 * ImageUploader — 다중 이미지 첨부.
 *
 * props:
 *   - value: string[] — 현재 attachmentR2Keys
 *   - onChange: (string[]) => void
 *   - max?: number — 기본 5장
 *
 * 동작:
 *   - 파일 input change → 각 파일 R2 presigned PUT 업로드 → r2Key 추가
 *   - 각 항목 미리보기 + 삭제
 *   - 회원만 (backend uploads.presignedPut requireAuth)
 *
 * 보안:
 *   - jpg/png/webp/gif 허용. svg 금지.
 *   - 10MB 이상 차단.
 */

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({ value = [], onChange, max = 5 }) {
  const [busy, setBusy] = useState(false);
  const [errs, setErrs] = useState([]);

  async function onPick(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = ""; // 다시 같은 파일 선택 가능하게 reset
    if (files.length === 0) return;
    const remaining = max - value.length;
    if (remaining <= 0) {
      setErrs([`최대 ${max}장까지만 첨부할 수 있습니다.`]);
      return;
    }
    const toUpload = files.slice(0, remaining);
    setBusy(true);
    setErrs([]);
    const newErrs = [];
    const newKeys = [];
    for (const f of toUpload) {
      if (!ALLOWED_MIME.has(f.type)) {
        newErrs.push(`${f.name}: 지원하지 않는 형식 (jpg/png/webp/gif만)`);
        continue;
      }
      if (f.size > MAX_SIZE) {
        newErrs.push(`${f.name}: 10MB 초과`);
        continue;
      }
      try {
        const { r2Key } = await uploadFile(f, { purpose: "post_attachment" });
        newKeys.push(r2Key);
      } catch (err) {
        newErrs.push(`${f.name}: 업로드 실패 (${err?.message || "오류"})`);
      }
    }
    setBusy(false);
    if (newKeys.length > 0) onChange([...value, ...newKeys]);
    if (newErrs.length > 0) setErrs(newErrs);
  }

  function remove(idx) {
    const next = value.slice();
    next.splice(idx, 1);
    onChange(next);
  }

  return (
    <div style={{ display: "grid", gap: "var(--sp-2)" }}>
      <div
        style={{
          display: "flex",
          gap: "var(--sp-2)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label
          className="btn btn--secondary btn--sm"
          style={{ cursor: busy ? "wait" : "pointer" }}
        >
          {busy ? "업로드 중…" : "📷 이미지 추가"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={busy || value.length >= max}
            onChange={onPick}
            style={{ display: "none" }}
          />
        </label>
        <span style={{ fontSize: "var(--fs-sm)", color: "var(--muted)" }}>
          {value.length}/{max} · jpg/png/webp/gif · 10MB 이하
        </span>
      </div>

      {value.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "var(--sp-2)",
          }}
        >
          {value.map((key, i) => (
            <div
              key={`${key}-${i}`}
              style={{
                position: "relative",
                aspectRatio: "1",
                border: "1px solid var(--muted, #8a7e60)",
                borderRadius: 6,
                overflow: "hidden",
                background: "rgba(0,0,0,0.1)",
              }}
            >
              <img
                src={buildApiUrl(`/uploads/r2/${encodeURIComponent(key)}`)}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  border: "none",
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  cursor: "pointer",
                  fontSize: 14,
                }}
                aria-label="첨부 삭제"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {errs.length > 0 ? (
        <ul
          className="auth-msg auth-msg--error"
          role="alert"
          style={{ margin: 0, paddingLeft: "var(--sp-4)" }}
        >
          {errs.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
