import Link from "next/link";
import HomeCommunityBoard from "@/components/HomeCommunityBoard";
import HomeNoticeBoard from "@/components/HomeNoticeBoard";

function isExternal(href) {
  return Boolean(href) && /^https?:\/\//i.test(href);
}

function SmartLink({ href, className, children, label }) {
  if (!href) return null;
  if (isExternal(href)) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer" aria-label={label}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href} aria-label={label}>
      {children}
    </Link>
  );
}

export default function HomeInfoHub({ site }) {
  return (
    <section className="section section--home-hub" id="news-board" aria-labelledby="home-hub-title">
      <div className="content-wrap">
        <div className="home-hub__layout">
          <div className="home-hub__boards" aria-label="훈련소 게시판">
            <article className="board home-board" aria-label="운영 공지">
              <div className="board__head">
                <div>
                  <span className="home-board__eyebrow">운영자가 올린 글</span>
                  <h2>공지</h2>
                </div>
                <Link className="card__action" href="/board?category=notice">
                  공지 전체 →
                </Link>
              </div>
              <HomeNoticeBoard />
            </article>

            <article className="board home-board" aria-label="커뮤니티 최신글">
              <div className="board__head">
                <div>
                  <span className="home-board__eyebrow">질문 · 팁 · 잡담</span>
                  <h2>커뮤니티 게시판</h2>
                </div>
                <Link className="card__action" href="/board">
                  게시판 →
                </Link>
              </div>
              <HomeCommunityBoard />
            </article>
          </div>

          <aside className="official-rail" aria-labelledby="official-rail-title">
            <div className="home-cta-panel" aria-label="주요 행동">
              {site.homeCtas.map((action, index) => (
                <SmartLink
                  key={action.label}
                  href={action.href}
                  className={`home-cta-panel__item${index === 0 ? " is-primary" : ""}`}
                  label={action.label}
                >
                  <span className="home-cta-panel__label">{action.label}</span>
                  <span className="home-cta-panel__note">{action.note}</span>
                </SmartLink>
              ))}
            </div>

            <div className="official-rail__head">
              <span className="section__kicker">OFFICIAL FEED</span>
              <h3 id="official-rail-title">공식 정보 바로가기</h3>
            </div>
            <div className="official-rail__grid">
              {site.officialChannels.map((item) => (
                <SmartLink
                  key={item.id}
                  href={item.href}
                  className="official-card"
                  label={`${item.label} 바로가기`}
                >
                  <span className="official-card__tag">{item.tag}</span>
                  <strong>{item.label}</strong>
                  <span>{item.body}</span>
                </SmartLink>
              ))}
            </div>

            <div className="community-shortcuts" aria-label="게시판 빠른 이동">
              <span className="community-shortcuts__label">게시판 카테고리</span>
              <div className="community-shortcuts__links">
                {site.communityShortcuts.map((item) => (
                  <Link key={item.label} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
