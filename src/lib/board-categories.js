export const BOARD_ALL_CATEGORY = "all";

const CATEGORY_LABEL_BY_SLUG = {
  equip: "장비",
  notice: "공지·이벤트",
  party: "파티/모집",
  question: "질문",
  talk: "자유게시판",
  tip: "팁/정보",
};

export function buildBoardHref({ categorySlug, sort, q, page } = {}) {
  const qs = new URLSearchParams();
  if (categorySlug && categorySlug !== BOARD_ALL_CATEGORY) {
    qs.set("category", categorySlug);
  }
  if (sort && sort !== "recent") qs.set("sort", sort);
  if (q) qs.set("q", q);
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `/board?${s}` : "/board";
}

export function buildBoardNewHref(categorySlug) {
  if (!categorySlug || categorySlug === BOARD_ALL_CATEGORY) return "/board/new";
  return `/board/new?category=${encodeURIComponent(categorySlug)}`;
}

export function resolveBoardCategoryLabel(post, fallback = "글") {
  if (post?.categorySlug && CATEGORY_LABEL_BY_SLUG[post.categorySlug]) {
    return CATEGORY_LABEL_BY_SLUG[post.categorySlug];
  }
  if (post?.categoryId && CATEGORY_LABEL_BY_SLUG[post.categoryId]) {
    return CATEGORY_LABEL_BY_SLUG[post.categoryId];
  }
  if (post?.categoryName && post.categoryName !== "글") return post.categoryName;
  if (post?.categoryLabel && post.categoryLabel !== "글") return post.categoryLabel;
  if (post?.label && post.label !== "글") return post.label;
  if (post?.category && post.category !== "글") return post.category;
  return fallback;
}
