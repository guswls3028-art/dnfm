"use client";

import { useState } from "react";

export default function DnfProfileForm({ steps }) {
  // mock: backend 미연동 — 사용자가 클릭 시 슬롯에 상태 표시만
  const [captured, setCaptured] = useState({});

  function toggleSlot(slotId) {
    setCaptured((prev) => ({ ...prev, [slotId]: !prev[slotId] }));
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
              {step.captures.map((slot) => (
                <button
                  type="button"
                  className="capture-slot"
                  key={slot.id}
                  onClick={() => toggleSlot(slot.id)}
                  aria-pressed={Boolean(captured[slot.id])}
                  title={slot.hint}
                >
                  <span className="capture-slot__icon" aria-hidden="true">
                    {captured[slot.id] ? "✓" : "+"}
                  </span>
                  <span className="capture-slot__label">{slot.label}</span>
                  <span className="capture-slot__hint">{slot.hint}</span>
                </button>
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
