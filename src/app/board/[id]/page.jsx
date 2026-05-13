import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/content";

export async function generateMetadata({ params }) {
  const p = await params;
  const post = site.boardPosts.find((it) => it.id === p.id);
  return { title: post ? post.title : "글" };
}

export default async function PostDetailPage({ params }) {
  const p = await params;
  const post = site.boardPosts.find((it) => it.id === p.id);
  if (!post) {
    notFound();
  }

  const comments = site.postComments.filter((c) => c.postId === post.id);

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">게시글</h1>
            <p className="page-hero__sub">
              <Link href="/board" style={{ color: "var(--color-gold)", fontWeight: 800 }}>
                ← 게시판 목록
              </Link>
            </p>
          </div>
          <Link href="/board/new" className="btn btn--secondary btn--sm">
            글쓰기
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ display: "grid", gap: "var(--sp-4)" }}>
          <article>
            <header className="post-head">
              <span className="badge badge--soft">{post.label}</span>
              <h1 className="post-head__title">
                {post.pinned ? "📌 " : ""}
                {post.title}
                {post.hot ? " · HOT" : ""}
              </h1>
              <div className="post-head__meta">
                <span>{post.author}</span>
                <span>{post.time}</span>
                {typeof post.views === "number" ? <span>조회 {post.views}</span> : null}
                {typeof post.likes === "number" ? <span>추천 {post.likes}</span> : null}
                {typeof post.comments === "number" ? <span>댓글 {post.comments}</span> : null}
              </div>
            </header>
            <div className="post-body">{post.body || "본문이 없습니다."}</div>
            <div className="post-actions">
              <button type="button" className="btn btn--secondary btn--sm" disabled title="백엔드 연동 전">
                추천
              </button>
              <button type="button" className="btn btn--secondary btn--sm" disabled title="백엔드 연동 전">
                공유
              </button>
              <Link href="/board" className="btn btn--ghost btn--sm">
                목록으로
              </Link>
            </div>
          </article>

          <section aria-labelledby="comments-title">
            <header className="section__head">
              <div>
                <span className="section__kicker">COMMENTS</span>
                <h2 id="comments-title" className="section__title">
                  댓글 {comments.length}
                </h2>
              </div>
            </header>

            <div className="comments">
              {comments.length === 0 ? (
                <div className="comment">
                  <p className="comment__body">아직 댓글이 없습니다. 첫 댓글을 남겨주세요.</p>
                </div>
              ) : (
                comments.map((c, i) => (
                  <div className="comment" key={i}>
                    <div className="comment__meta">
                      <strong>{c.author}</strong>
                      <span>{c.time}</span>
                    </div>
                    <p className="comment__body">{c.body}</p>
                  </div>
                ))
              )}
            </div>

            <form className="comment-form" action="#" aria-label="댓글 작성">
              <textarea
                className="textarea"
                placeholder="댓글을 입력하세요. 운영 규칙을 지켜주세요."
                rows={3}
                disabled
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" className="btn btn--primary btn--sm" disabled title="백엔드 연동 전">
                  댓글 등록 (준비중)
                </button>
              </div>
            </form>
          </section>
        </div>
      </section>
    </>
  );
}
