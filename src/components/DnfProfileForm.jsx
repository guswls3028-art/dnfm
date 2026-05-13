"use client";

import { useState } from "react";
import { apiFetch, ApiError } from "@/lib/api-client";

// slot.id ↔ backend OCR type 매핑
// content.js 의 signupSteps[1].captures = [
//   { id: "char",  label: "캐릭터 정보", ... },   → basic_info
//   { id: "gear",  label: "장비 상세",   ... },   → character_list
//   { id: "guild", label: "모험단/서버", ... },   → character_select
// ]
const SLOT_TO_OCR_TYPE = {
  char: "basic_info",
  gear: "character_list",
  guild: "character_select",
};

const SLOT_RESULT_FIELDS = {
  char: [
    { key: "adventurerName", label: "모험단" },
    { key: "mainCharacterName", label: "대표 캐릭터" },
  ],
  gear: [
    { key: "charactersCount", label: "추출 캐릭터 수" },
  ],
  guild: [
    { key: "selectedCharacterName", label: "선택된 캐릭터" },
  ],
};

function pickField(result, key) {
  if (!result) return "";
  if (Object.prototype.hasOwnProperty.call(result, key)) return result[key] || "";
  if (key === "charactersCount" && Array.isArray(result.characters)) {
    return String(result.characters.length);
  }
  if (key === "selectedCharacterName") {
    return result.selectedCharacterName || result.mainCharacterName || "";
  }
  return "";
}

export default function DnfProfileForm({
  steps,
  onResultsChange,
  initialResults = {},
}) {
  // results: slot.id → { result, source, editedFields? }
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  function emit(next) {
    if (typeof onResultsChange === "function") onResultsChange(next);
  }

  async function handleFile(slotId, file) {
    if (!file) return;
    const type = SLOT_TO_OCR_TYPE[slotId];
    if (!type) {
      setErrors((prev) => ({ ...prev, [slotId]: "이 슬롯은 자동 인식을 지원하지 않습니다." }));
      return;
    }

    setLoading((prev) => ({ ...prev, [slotId]: true }));
    setErrors((prev) => ({ ...prev, [slotId]: null }));

    const form = new FormData();
    form.append("file", file);

    try {
      const data = await apiFetch(`/auth/dnf-profile/ocr/${type}`, {
        method: "POST",
        form,
        timeoutMs: 60000, // OCR 은 길게
      });
      const entry = {
        result: data?.result || {},
        source: data?.source || null,
        ocrType: type,
        editedFields: {},
      };
      const next = { ...results, [slotId]: entry };
      setResults(next);
      emit(next);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message || "OCR 인식에 실패했습니다. 캡처를 다시 올려주세요.";
      setErrors((prev) => ({ ...prev, [slotId]: msg }));
    } finally {
      setLoading((prev) => ({ ...prev, [slotId]: false }));
    }
  }

  function handleEdit(slotId, fieldKey, value) {
    const current = results[slotId];
    if (!current) return;
    const next = {
      ...results,
      [slotId]: {
        ...current,
        editedFields: { ...current.editedFields, [fieldKey]: value },
      },
    };
    setResults(next);
    emit(next);
  }

  return (
    <div className="signup-steps">
      {steps.map((step) => (
        <article className="signup-step" key={step.step}>
          <span className="signup-step__num">{step.step}</span>
          <h3 className="signup-step__title">{step.title}</h3>
          <p className="signup-step__body">{step.body}</p>

          {step.captures ? (
            <div className="capture-grid">
              {step.captures.map((slot) => {
                const entry = results[slot.id];
                const filled = Boolean(entry);
                const busy = Boolean(loading[slot.id]);
                const errMsg = errors[slot.id];
                const fields = SLOT_RESULT_FIELDS[slot.id] || [];
                const inputId = `capture-input-${slot.id}`;

                return (
                  <div className="capture-slot-wrap" key={slot.id}>
                    <label
                      htmlFor={inputId}
                      className={[
                        "capture-slot",
                        filled ? "capture-slot--filled" : "",
                        busy ? "capture-slot--loading" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      title={slot.hint}
                    >
                      <span className="capture-slot__icon" aria-hidden="true">
                        {busy ? "…" : filled ? "✓" : "+"}
                      </span>
                      <span className="capture-slot__label">{slot.label}</span>
                      <span className="capture-slot__hint">{slot.hint}</span>
                      {busy ? (
                        <span className="capture-slot__progress">인식 중…</span>
                      ) : null}
                      <input
                        id={inputId}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        disabled={busy}
                        onChange={(e) => {
                          const f = e.target.files && e.target.files[0];
                          if (f) handleFile(slot.id, f);
                          // 같은 파일 재선택 가능하도록 reset
                          e.target.value = "";
                        }}
                      />
                    </label>

                    {errMsg ? (
                      <p className="auth-msg auth-msg--error" role="alert" style={{ marginTop: "var(--sp-2)" }}>
                        {errMsg}
                      </p>
                    ) : null}

                    {entry ? (
                      <div className="capture-result" aria-label={`${slot.label} 인식 결과`}>
                        {fields.map((f) => {
                          const original = pickField(entry.result, f.key);
                          const edited = entry.editedFields?.[f.key];
                          const value = edited !== undefined ? edited : original;
                          return (
                            <div className="capture-result__row" key={f.key}>
                              <span className="capture-result__label">{f.label}</span>
                              <input
                                className="input"
                                value={value || ""}
                                placeholder="자동 인식 결과 (수정 가능)"
                                onChange={(e) => handleEdit(slot.id, f.key, e.target.value)}
                              />
                            </div>
                          );
                        })}
                        {entry.source ? (
                          <small style={{ color: "var(--color-text-muted)", fontSize: "var(--fs-xs)" }}>
                            source: {entry.source}
                          </small>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
