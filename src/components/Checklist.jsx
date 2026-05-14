"use client";

import { useEffect, useState } from "react";

export default function Checklist({ site }) {
  const [checked, setChecked] = useState({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(site.checklistKey);
      setChecked(stored ? JSON.parse(stored) : {});
    } catch (_e) {
      setChecked({});
    }
    setHydrated(true);
  }, [site.checklistKey]);

  function toggle(index, value) {
    const next = { ...checked, [index]: value };
    setChecked(next);
    try {
      window.localStorage.setItem(site.checklistKey, JSON.stringify(next));
    } catch (_e) {
      // localStorage 미사용 환경 무시
    }
  }

  const total = site.checklist.length;
  const done = hydrated
    ? site.checklist.reduce((n, _, i) => n + (checked[i] ? 1 : 0), 0)
    : 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <section aria-labelledby="checklist-title">
      <header className="section__head">
        <div>
          <span className="section__kicker">DAILY ROUTINE</span>
          <h2 id="checklist-title" className="section__title">
            {site.checklistTitle}
          </h2>
        </div>
        <span className="checklist__count" aria-live="polite">
          {done} / {total}
        </span>
      </header>
      <div
        className="checklist__progress"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="오늘 훈련소 체크 진행도"
      >
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="checklist">
        {site.checklist.map((item, index) => {
          const id = `${site.id}-check-${index}`;
          const isChecked = hydrated ? Boolean(checked[index]) : false;
          return (
            <label
              className={`checklist__row${isChecked ? " is-checked" : ""}`}
              htmlFor={id}
              key={item}
            >
              <input
                id={id}
                type="checkbox"
                checked={isChecked}
                onChange={(event) => toggle(index, event.target.checked)}
              />
              <span>{item}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
