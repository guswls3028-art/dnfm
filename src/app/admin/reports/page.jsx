"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { reports as reportsApi, ApiError } from "@/lib/api-client";
import { isSiteAdmin } from "@/lib/permissions";
import { useCurrentUser } from "@/lib/use-current-user";

/**
 * 신고함 (운영자 전용) — newb.
 *
 * 동작:
 *  - GET /sites/newb/reports?status=...  → 신고 목록
 *  - PATCH /sites/newb/reports/:id       → status / resolution / 메모
 *
 * status enum: pending / in_review / resolved / dismissed
 */

const STATUS_TABS = [
  { value: "pending", label: "접수" },
  { value: "in_review", label: "검토중" },
  { value: "resolved", label: "처리완료" },
  { value: "dismissed", label: "기각" },
];

const REASON_LABEL = {
  spam: "도배/광고",
  abuse: "욕설/비방",
  porn: "음란물",
  hate: "혐오",
  privacy: "개인정보",
  copyright: "저작권",
  advertise: "외부 거래/광고",
  malicious_link: "악성 링크",
  other: "기타",
};

const RESOLUTIONS = [
  { value: "", label: "조치 미선택" },
  { value: "hidden", label: "글 숨김" },
  { value: "deleted", label: "글 삭제" },
  { value: "comment_hidden", label: "댓글 숨김" },
  { value: "comment_deleted", label: "댓글 삭제" },
  { value: "warned_user", label: "유저 경고" },
  { value: "ip_banned", label: "IP 차단" },
  { value: "dismissed_invalid", label: "기각 — 정당한 글" },
  { value: "other", label: "기타" },
];

function formatTime(iso) {
  if (!iso) return "";
  const t = new Date(iso);
  if (Number.isNaN(t.getTime())) return iso;
  return t.toLocaleString("ko-KR", { hour12: false });
}

export default function AdminReportsPage() {
  const { user, isLoading } = useCurrentUser();
  const userIsAdmin = isSiteAdmin(user, "newb");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, in_review: 0, resolved: 0, dismissed: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await reportsApi.list({ status: statusFilter, pageSize: 100 });
      const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
      setRows(items);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "목록 불러오기 실패");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const reloadCounts = useCallback(async () => {
    try {
      const out = await Promise.all(
        STATUS_TABS.map((s) =>
          reportsApi.list({ status: s.value, pageSize: 1 }).then(
            (r) => [s.value, typeof r?.total === "number" ? r.total : (Array.isArray(r?.items) ? r.items.length : 0)],
            () => [s.value, 0]
          )
        )
      );
      setCounts(Object.fromEntries(out));
    } catch {
      /* 통계는 부수적 — 실패해도 본 목록은 살아 있음 */
    }
  }, []);

  useEffect(() => {
    if (!isLoading && user && userIsAdmin) {
      reload();
      reloadCounts();
    }
  }, [isLoading, user, userIsAdmin, reload, reloadCounts]);

  async function applyAction(row, next) {
    if (busyId) return;
    setBusyId(row.id);
    try {
      await reportsApi.update(row.id, {
        status: next.status,
        resolution: next.resolution || undefined,
        resolutionNote: next.resolutionNote?.trim() || undefined,
        moderatorMemo: next.moderatorMemo?.trim() || undefined,
      });
      await reload();
    } catch (e) {
      window.alert(e instanceof ApiError ? e.message : "처리 실패");
    } finally {
      setBusyId(null);
    }
  }

  if (!isLoading && !user) {
    return (
      <section className="section">
        <div className="content-wrap">
          <h1 className="page-hero__title">로그인이 필요합니다</h1>
          <p>신고함은 운영자 전용입니다.</p>
          <Link
            href={`/login?next=${encodeURIComponent("/admin/reports")}`}
            className="btn btn--primary"
          >
            로그인 →
          </Link>
        </div>
      </section>
    );
  }

  if (!isLoading && user && !userIsAdmin) {
    return (
      <section className="section">
        <div className="content-wrap">
          <h1 className="page-hero__title">접근 권한이 없습니다</h1>
          <p>운영자 권한이 필요합니다.</p>
          <Link href="/" className="btn btn--ghost">
            홈으로
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">🚩 신고함</h1>
            <p className="page-hero__sub">
              접수된 신고를 검토하고 조치 사유를 기록하세요.
            </p>
          </div>
          <Link href="/board" className="btn btn--ghost btn--sm">
            ← 게시판
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="tabs" role="tablist" aria-label="신고 상태">
            {STATUS_TABS.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`tab${statusFilter === s.value ? " is-active" : ""}`}
                onClick={() => setStatusFilter(s.value)}
                aria-selected={statusFilter === s.value}
              >
                {s.label}
                <span style={{ marginLeft: 6, opacity: 0.72, fontWeight: 600 }}>
                  {counts[s.value] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {err ? (
            <p className="auth-msg auth-msg--error" role="alert" style={{ marginTop: "var(--sp-4)" }}>
              {err}
            </p>
          ) : null}

          <div style={{ display: "grid", gap: "var(--sp-3)", marginTop: "var(--sp-4)" }}>
            {loading ? (
              <article className="card card--parchment" style={{ padding: "var(--sp-4)" }}>
                <p>불러오는 중…</p>
              </article>
            ) : rows.length === 0 ? (
              <article className="card card--parchment" style={{ padding: "var(--sp-4)" }}>
                <p>해당 상태의 신고가 없습니다.</p>
              </article>
            ) : (
              rows.map((r) => (
                <ReportRow
                  key={r.id}
                  row={r}
                  busy={busyId === r.id}
                  onApply={(next) => applyAction(r, next)}
                />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function ReportRow({ row, busy, onApply }) {
  const [resolution, setResolution] = useState(row.resolution || "");
  const [resolutionNote, setResolutionNote] = useState(row.resolutionNote || "");
  const [moderatorMemo, setModeratorMemo] = useState(row.moderatorMemo || "");

  const targetLink = row.targetType === "post" ? `/board/${row.targetId}` : null;

  return (
    <article
      className="card card--parchment"
      style={{ padding: "var(--sp-4)", display: "grid", gap: "var(--sp-2)" }}
    >
      <header
        style={{
          display: "flex",
          gap: "var(--sp-2)",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span className="badge badge--soft">{row.targetType === "post" ? "글" : "댓글"}</span>
        <span className="badge badge--soft">
          {REASON_LABEL[row.reason] || row.reason}
        </span>
        <span style={{ color: "var(--muted)", fontSize: "var(--fs-sm)" }}>
          {formatTime(row.createdAt)}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "var(--fs-sm)",
            color: "var(--muted)",
          }}
        >
          상태: <strong>{row.status}</strong>
        </span>
      </header>

      {row.detail ? (
        <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
          <strong>신고 상세:</strong> {row.detail}
        </p>
      ) : null}

      <div
        style={{
          display: "flex",
          gap: "var(--sp-2)",
          flexWrap: "wrap",
          fontSize: "var(--fs-sm)",
        }}
      >
        <span>
          <strong>대상 ID</strong>: <code>{row.targetId}</code>
        </span>
        {targetLink ? (
          <Link href={targetLink} target="_blank" className="btn btn--ghost btn--xs">
            글 보러가기 ↗
          </Link>
        ) : null}
        <span>
          <strong>신고자</strong>:{" "}
          {row.reporterId ? `회원 ${String(row.reporterId).slice(0, 8)}…` : "비회원"}
        </span>
      </div>

      <div style={{ display: "grid", gap: "var(--sp-2)" }}>
        <label className="field" style={{ display: "grid", gap: 4 }}>
          <span className="field__label">조치 (resolution)</span>
          <select
            className="select"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          >
            {RESOLUTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field" style={{ display: "grid", gap: 4 }}>
          <span className="field__label">조치 사유 (공식 기록)</span>
          <textarea
            className="textarea"
            rows={2}
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            placeholder="처리 결과 사유 — 분쟁 시 공개 가능"
          />
        </label>
        <label className="field" style={{ display: "grid", gap: 4 }}>
          <span className="field__label">운영 메모 (비공개)</span>
          <textarea
            className="textarea"
            rows={2}
            value={moderatorMemo}
            onChange={(e) => setModeratorMemo(e.target.value)}
            placeholder="운영자만 볼 수 있음."
          />
        </label>
      </div>

      <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          disabled={busy}
          onClick={() =>
            onApply({ status: "in_review", resolution, resolutionNote, moderatorMemo })
          }
        >
          🔍 검토중
        </button>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          disabled={busy}
          onClick={() =>
            onApply({ status: "resolved", resolution, resolutionNote, moderatorMemo })
          }
        >
          ✅ 처리완료
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          disabled={busy}
          onClick={() =>
            onApply({ status: "dismissed", resolution, resolutionNote, moderatorMemo })
          }
        >
          ✖ 기각
        </button>
      </div>
    </article>
  );
}
