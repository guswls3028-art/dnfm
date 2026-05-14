import Link from "next/link";
import { formatRelativeKo } from "@/lib/format-time";

function guessCat(label) {
  switch (label) {
    case "공지": return "notice";
    case "질문": return "question";
    case "팁": return "tip";
    case "파티": return "party";
    case "장비": return "equip";
    case "잡담": return "talk";
    default: return "other";
  }
}

function isExternal(url) {
  return Boolean(url) && /^https?:/.test(url);
}

export default function BoardRow({ post }) {
  const href = post.href || `/board/${post.id}`;
  const cat = post.categoryId || post.categorySlug || guessCat(post.label);
  const labelClass = `board-row__label${post.pinned ? " is-pinned" : ""}`;
  const rowClass = `board-row${post.pinned ? " board-row--pinned" : ""}`;
  const timeDisplay = post.time ? formatRelativeKo(post.time) : "";

  const content = (
    <>
      <span className={labelClass}>{post.label}</span>
      <span className="board-row__title">
        <strong>{post.title}</strong>
        {post.hot ? <span className="board-row__hot">HOT</span> : null}
        {typeof post.comments === "number" && post.comments > 0 ? (
          <span className="board-row__comments">[{post.comments}]</span>
        ) : null}
      </span>
      <span className="board-row__meta">
        {post.author ? <span>{post.author}</span> : null}
        {timeDisplay ? <span>{timeDisplay}</span> : null}
        {typeof post.views === "number" ? <span>조회 {post.views}</span> : null}
        {typeof post.likes === "number" ? <span>추천 {post.likes}</span> : null}
      </span>
    </>
  );

  if (post.url === null || (!post.url && !post.id && !post.href)) {
    return (
      <div className={rowClass} data-category={cat} aria-disabled="true">
        {content}
      </div>
    );
  }

  if (isExternal(post.url || href)) {
    return (
      <a className={rowClass} data-category={cat} href={post.url || href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link className={rowClass} data-category={cat} href={post.url || href}>
      {content}
    </Link>
  );
}
