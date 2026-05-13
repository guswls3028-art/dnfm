"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BoardRow from "@/components/BoardRow";
import { posts as postsApi } from "@/lib/api-client";

function normalize(p) {
  return {
    id: p.id || p.postId,
    label: p.categoryLabel || p.label || (p.category ? p.category : "글"),
    title: p.title || "(제목 없음)",
    author: p.authorName || p.author || p.user?.displayName || "익명",
    time: p.timeAgo || p.time || p.createdAtLabel || p.createdAt || "",
    views: typeof p.views === "number" ? p.views : (p.viewCount ?? 0),
    likes: typeof p.likes === "number" ? p.likes : (p.likeCount ?? 0),
    comments:
      typeof p.comments === "number"
        ? p.comments
        : (p.commentCount ?? (Array.isArray(p.comments) ? p.comments.length : 0)),
  };
}

export default function HomeCommunityBoard() {
  const [state, setState] = useState({ status: "loading", items: [] });

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
        setState({ status: "ready", items: list.map(normalize) });
      } catch {
        if (alive) setState({ status: "error", items: [] });
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
      {state.items.map((post) => (
        <BoardRow key={post.id || post.title} post={post} />
      ))}
    </div>
  );
}
