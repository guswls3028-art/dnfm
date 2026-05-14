"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BoardRow from "@/components/BoardRow";
import { posts as postsApi } from "@/lib/api-client";
import { site } from "@/lib/content";

function normalize(p) {
  // backend list 응답에서 회원 글 = author: {id, displayName, dnfProfile}, 비회원 글 = author: null + authorNickname + anonymousMarker.
  const memberName = typeof p.author === "object" && p.author?.displayName;
  const anonName = p.authorNickname
    ? `${p.authorNickname}${p.anonymousMarker ? `(${p.anonymousMarker})` : ""}`
    : null;
  return {
    id: p.id || p.postId,
    label: p.categoryLabel || p.label || (p.category ? p.category : "글"),
    title: p.title || "(제목 없음)",
    author: p.authorName || memberName || anonName || p.user?.displayName || "익명",
    // BoardRow 가 ISO/epoch 면 자동 포맷, 사람 친화 문자열이면 그대로 통과 (format-time.js).
    time: p.timeAgo || p.createdAtLabel || p.time || p.createdAt || "",
    views: typeof p.views === "number" ? p.views : (p.viewCount ?? 0),
    likes: typeof p.likes === "number" ? p.likes : (p.likeCount ?? 0),
    comments:
      typeof p.comments === "number"
        ? p.comments
        : (p.commentCount ?? (Array.isArray(p.comments) ? p.comments.length : 0)),
  };
}

// API 실패 / 빈 응답 시 보여줄 정적 fallback (content.js 의 communityPosts).
const FALLBACK_POSTS = (site.communityPosts || []).slice(0, 5);

export default function HomeCommunityBoard() {
  const [state, setState] = useState({ status: "loading", items: [], source: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await postsApi.list({ page: 1, pageSize: 5, sort: "recent" });
        if (!alive) return;
        const list = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.posts)
            ? data.posts
            : Array.isArray(data)
              ? data
              : [];
        if (list.length === 0) {
          setState({ status: "fallback", items: FALLBACK_POSTS, source: "empty" });
        } else {
          setState({ status: "ready", items: list.map(normalize), source: "api" });
        }
      } catch {
        if (alive) setState({ status: "fallback", items: FALLBACK_POSTS, source: "error" });
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="board__rows">
        <p className="board__empty">불러오는 중…</p>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="board__rows">
        <p className="board__empty">
          아직 등록된 글이 없습니다. <Link href="/board/new">첫 글 작성하기 →</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="board__rows">
      {state.source !== "api" ? (
        <p className="board__preview-hint" role="note">
          미리보기 글입니다 — 게시판이 열리면 실제 글로 교체돼요.
        </p>
      ) : null}
      {state.items.map((post) => (
        <BoardRow key={post.id || post.title} post={post} />
      ))}
    </div>
  );
}
