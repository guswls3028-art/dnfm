import PostDetailClient from "./PostDetailClient";

export const dynamic = "force-dynamic";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "https://api.dnfm.kr").replace(/\/+$/, "");

function unwrap(payload) {
  return payload && Object.prototype.hasOwnProperty.call(payload, "data")
    ? payload.data
    : payload;
}

function toList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.comments)) return payload.comments;
  return [];
}

async function apiGet(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload?.error?.message || `API 요청 실패 (${response.status})`;
    throw new Error(message);
  }
  return unwrap(payload);
}

async function loadInitialData(postId) {
  try {
    const postData = await apiGet(`/sites/newb/posts/${encodeURIComponent(postId)}`);
    const post = postData?.post || postData;
    const commentsData = await apiGet(`/sites/newb/posts/${encodeURIComponent(postId)}/comments`).catch(() => null);
    const comments = toList(commentsData);
    let nextPosts = [];

    if (post?.categorySlug) {
      const qs = new URLSearchParams({
        categorySlug: post.categorySlug,
        sort: "recent",
        pageSize: "11",
        page: "1",
      });
      const nextData = await apiGet(`/sites/newb/posts?${qs.toString()}`).catch(() => null);
      const items = toList(nextData);
      nextPosts = items.filter((item) => item.id !== post.id).slice(0, 10);
    }

    return { post, comments, nextPosts, error: null };
  } catch (error) {
    return {
      post: null,
      comments: [],
      nextPosts: [],
      error: error?.message || "게시글을 불러오지 못했습니다.",
    };
  }
}

export default async function PostDetailPage({ params }) {
  const resolvedParams = await params;
  const postId = resolvedParams?.id;
  const initial = postId
    ? await loadInitialData(postId)
    : { post: null, comments: [], nextPosts: [], error: "게시글을 찾을 수 없습니다." };

  return (
    <PostDetailClient
      initialPost={initial.post}
      initialComments={initial.comments}
      initialNextPosts={initial.nextPosts}
      initialError={initial.error}
    />
  );
}
