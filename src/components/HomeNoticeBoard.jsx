"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BoardRow from "@/components/BoardRow";
import { posts as postsApi } from "@/lib/api-client";

function normalize(post) {
  const memberName = typeof post.author === "object" && post.author?.displayName;
  const anonName = post.authorNickname
    ? `${post.authorNickname}${post.anonymousMarker ? `(${post.anonymousMarker})` : ""}`
    : null;

  return {
    id: post.id || post.postId,
    label: post.flair || post.categoryLabel || post.categoryName || "공지",
    categorySlug: post.categorySlug || "notice",
    title: post.title || "(제목 없음)",
    author: post.authorName || memberName || anonName || "익명",
    time: post.timeAgo || post.createdAtLabel || post.createdAt || "",
    views: typeof post.views === "number" ? post.views : (post.viewCount ?? 0),
    likes: typeof post.likes === "number" ? post.likes : (post.likeCount ?? 0),
    comments:
      typeof post.comments === "number"
        ? post.comments
        : (post.commentCount ?? (Array.isArray(post.comments) ? post.comments.length : 0)),
  };
}

export default function HomeNoticeBoard() {
  const [state, setState] = useState({ status: "loading", items: [] });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await postsApi.list({
          categorySlug: "notice",
          page: 1,
          pageSize: 5,
          sort: "recent",
        });
        const list = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.posts)
            ? data.posts
            : Array.isArray(data)
              ? data
              : [];
        if (alive) setState({ status: "ready", items: list.map(normalize) });
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
        <p className="board__empty">불러오는 중...</p>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="board__rows">
        <p className="board__empty">
          {state.status === "error" ? "공지 목록을 불러오지 못했어요." : "아직 등록된 공지가 없습니다."}{" "}
          <Link href="/board/new">공지 작성하기 →</Link>
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
