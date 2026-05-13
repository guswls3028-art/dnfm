"use client";

import { useEffect } from "react";

/**
 * 루트 라우트 에러 boundary.
 *
 * 주된 트리거: 신규 배포 직후 사용자의 옛 manifest 가 옛 청크 해시 (예: page-OLDHASH.js) 를
 * 요청해 404 → "Loading chunk N failed". 자동 reload 로 새 manifest 받아서 회복.
 *
 * `digest` 가 chunk-load 류일 때만 reload, 일반 런타임 에러는 그대로 노출 (개발 디버깅 보존).
 */
export default function RootError({ error, reset }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const name = String(error?.name || "");
    const msg = String(error?.message || "");
    const isChunk =
      name === "ChunkLoadError" ||
      /Loading chunk \d+ failed/i.test(msg) ||
      /Loading CSS chunk/i.test(msg) ||
      /Importing a module script failed/i.test(msg);
    if (!isChunk) return;
    const key = "dnfm:last-chunk-reload";
    const last = Number(sessionStorage.getItem(key) || 0);
    const now = Date.now();
    // 5초 이내 중복 reload 방지 (무한 루프 차단)
    if (now - last < 5000) return;
    sessionStorage.setItem(key, String(now));
    window.location.reload();
  }, [error]);

  return (
    <section className="section" aria-labelledby="error-title">
      <div className="content-wrap" style={{ textAlign: "center", padding: "var(--sp-9) 0" }}>
        <h1 id="error-title" className="page-hero__title">잠깐만요</h1>
        <p className="page-hero__sub" style={{ marginBottom: "var(--sp-5)" }}>
          페이지를 불러오는 데 문제가 생겼어요. 한 번 더 시도해 주세요.
        </p>
        <button type="button" className="btn btn--primary" onClick={() => reset()}>
          다시 시도
        </button>
      </div>
    </section>
  );
}
