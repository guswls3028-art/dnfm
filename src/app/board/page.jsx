import Link from "next/link";
import BoardRow from "@/components/BoardRow";
import { site } from "@/lib/content";

export const metadata = {
  title: "게시판"
};

export default async function BoardPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const activeCat = params.category || "all";

  const posts = site.boardPosts.filter(
    (p) => activeCat === "all" || p.categoryId === activeCat
  );

  // pinned 위로
  const sorted = [...posts].sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">훈련소 커뮤니티</h1>
            <p className="page-hero__sub">질문·팁·잡담을 한 게시판에서. 카톡방 톤 그대로.</p>
          </div>
          <Link href="/board/new" className="btn btn--primary">
            글쓰기
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="tabs" role="tablist" aria-label="게시판 카테고리">
            {site.boardCategories.map((cat) => {
              const isActive = cat.id === activeCat;
              const href = cat.id === "all" ? "/board" : `/board?category=${cat.id}`;
              return (
                <Link
                  key={cat.id}
                  href={href}
                  className={`tab${isActive ? " is-active" : ""}`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>

          <div className="board" style={{ marginTop: "var(--sp-5)" }}>
            <div className="board__head">
              <h2>
                {site.boardCategories.find((c) => c.id === activeCat)?.label || "전체"} ·{" "}
                {sorted.length}건
              </h2>
              <Link className="card__action" href="/board/new">
                글쓰기 →
              </Link>
            </div>
            <div className="board__rows">
              {sorted.length === 0 ? (
                <div className="board-row">
                  <span className="board-row__label">안내</span>
                  <span className="board-row__title">
                    <strong>이 카테고리에는 아직 글이 없습니다.</strong>
                  </span>
                  <span className="board-row__meta">
                    <span>첫 글의 주인이 되어보세요</span>
                  </span>
                </div>
              ) : (
                sorted.map((post) => <BoardRow key={post.id} post={post} />)
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
