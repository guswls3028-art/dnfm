"use client";

import { useState } from "react";
import { reports as reportsApi, ApiError } from "@/lib/api-client";
import BoardActionIcon from "@/components/BoardActionIcon";

const REASONS = [
  { value: "spam", label: "도배/광고" },
  { value: "abuse", label: "욕설/비방" },
  { value: "porn", label: "음란물" },
  { value: "hate", label: "혐오 표현" },
  { value: "privacy", label: "개인정보 노출" },
  { value: "copyright", label: "저작권 침해" },
  { value: "advertise", label: "외부 거래/광고" },
  { value: "malicious_link", label: "악성 링크" },
  { value: "other", label: "기타" },
];

/**
 * 신고 버튼 + 사유 모달.
 * 비회원도 신고 가능 (backend optionalAuth + IP fingerprint dedup).
 *
 * props:
 *   - targetType: "post" | "comment"
 *   - targetId: string
 *   - small?: boolean
 */
export default function ReportButton({ targetType, targetId, small, compact = false }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0].value);
  const [detail, setDetail] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function submit() {
    if (busy) return;
    setBusy(true);
    setMsg(null);
    try {
      await reportsApi.create({
        targetType,
        targetId,
        reason,
        detail: detail.trim() || undefined,
      });
      setMsg({ ok: true, text: "신고가 접수되었습니다." });
      setTimeout(() => {
        setOpen(false);
        setMsg(null);
        setDetail("");
      }, 1200);
    } catch (err) {
      const text =
        err instanceof ApiError && err.code === "already_reported"
          ? "이미 신고하셨습니다."
          : err?.message || "신고에 실패했습니다.";
      setMsg({ ok: false, text });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className={[
          small ? "btn btn--ghost btn--xs" : "btn btn--ghost btn--sm",
          "thread-tool report-button",
          compact ? "thread-tool--icon" : "",
        ].filter(Boolean).join(" ")}
        onClick={() => setOpen(true)}
        title="신고하기"
        aria-label={compact ? "신고하기" : undefined}
      >
        <BoardActionIcon name="report" />
        {compact ? <span className="sr-only">신고</span> : "신고"}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="신고하기"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,18,12,0.55)",
            display: "grid",
            placeItems: "center",
            zIndex: 200,
            padding: "var(--sp-4)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            className="card card--parchment"
            style={{
              maxWidth: 480,
              width: "100%",
              padding: "var(--sp-5)",
              display: "grid",
              gap: "var(--sp-3)",
            }}
          >
            <header
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <strong style={{ fontSize: "var(--fs-lg, 18px)" }}>신고하기</strong>
              <button
                type="button"
                className="btn btn--ghost btn--xs"
                onClick={() => setOpen(false)}
                aria-label="닫기"
              >
                ✕
              </button>
            </header>
            <p
              style={{
                fontSize: "var(--fs-sm)",
                color: "var(--muted, #8a7e60)",
                margin: 0,
              }}
            >
              허위 신고는 운영 정책에 따라 제재될 수 있습니다.
            </p>
            <div className="field">
              <label className="field__label" htmlFor="report-reason">
                사유
              </label>
              <select
                id="report-reason"
                className="select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="report-detail">
                상세 (선택)
              </label>
              <textarea
                id="report-detail"
                className="textarea"
                rows={3}
                maxLength={2000}
                placeholder="추가 설명이 필요하면 적어주세요."
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
            {msg ? (
              <p
                className={
                  msg.ok ? "auth-msg auth-msg--info" : "auth-msg auth-msg--error"
                }
                role="status"
              >
                {msg.text}
              </p>
            ) : null}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--sp-2)" }}>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setOpen(false)}
                disabled={busy}
              >
                취소
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={submit}
                disabled={busy}
              >
                {busy ? "전송 중…" : "신고"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
