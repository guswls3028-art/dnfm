"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * 모바일 우측 하단 floating action — 글쓰기 + 맨 위로.
 * desktop 에서도 표시 (헤더 글쓰기 버튼과 중복이지만 긴 글 스크롤 시 유용).
 *
 * 공홈 ref: dnfm.nexon.com 상세 페이지 우측 하단 (✏️ + ↑).
 */
export default function BoardFab({ href = "/board/new" }) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="board-fab" aria-label="게시판 빠른 액션">
      {showTop ? (
        <button
          type="button"
          className="board-fab__btn board-fab__btn--top"
          onClick={scrollTop}
          aria-label="맨 위로"
          title="맨 위로"
        >
          <span className="glyph">↑</span>
        </button>
      ) : null}
      <Link
        href={href}
        className="board-fab__btn board-fab__btn--write"
        aria-label="글쓰기"
        title="글쓰기"
      >
        <span className="glyph">✏</span>
      </Link>
    </div>
  );
}
