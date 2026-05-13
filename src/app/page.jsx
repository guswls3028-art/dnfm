import Link from "next/link";
import HeroStage from "@/components/HeroStage";
import BoardRow from "@/components/BoardRow";
import EventCard from "@/components/EventCard";
import GuideCard from "@/components/GuideCard";
import Checklist from "@/components/Checklist";
import LinkGroup from "@/components/LinkGroup";
import { site } from "@/lib/content";

export default function HomePage() {
  const ongoingEvents = site.eventCards.filter((e) => e.status !== "종료").slice(0, 2);

  return (
    <>
      <HeroStage site={site} />

      <section className="section" id="news-board" aria-labelledby="notice-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">NOTICE</span>
              <h2 id="notice-title" className="section__title">
                새소식
              </h2>
            </div>
            <Link className="section__more" href="/board">
              모든 글 →
            </Link>
          </header>

          <div className="home-grid">
            <div className="board" aria-label="공지 목록">
              <div className="board__head">
                <h2>공식·운영 공지</h2>
                <a className="card__action" href={site.noticesMoreUrl} target="_blank" rel="noreferrer">
                  공식 공지 →
                </a>
              </div>
              <div className="board__rows">
                {site.notices.map((notice) => (
                  <BoardRow key={notice.id || notice.title} post={notice} />
                ))}
              </div>
            </div>

            <div className="board" aria-label="커뮤니티 목록">
              <div className="board__head">
                <h2>커뮤니티 최신글</h2>
                <Link className="card__action" href="/board">
                  더 보기 →
                </Link>
              </div>
              <div className="board__rows">
                {site.communityPosts.map((post) => (
                  <BoardRow key={post.id || post.title} post={post} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="event-board" aria-labelledby="event-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">EVENT</span>
              <h2 id="event-title" className="section__title">
                진행중 이벤트
              </h2>
            </div>
            <Link className="section__more" href="/events">
              전체 이벤트 →
            </Link>
          </header>

          <div className="events-grid">
            {ongoingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="training-guide" aria-labelledby="guide-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">GUIDE</span>
              <h2 id="guide-title" className="section__title">
                가이드 보드
              </h2>
            </div>
            <Link className="section__more" href="/board?category=tip">
              팁 모음 →
            </Link>
          </header>

          <div className="events-grid">
            {site.guideCards.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="quick-title">
        <div className="content-wrap home-grid">
          <div>
            <header className="section__head">
              <div>
                <span className="section__kicker">QUICK</span>
                <h2 id="quick-title" className="section__title">
                  바로가기
                </h2>
              </div>
            </header>
            <div className="home-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {site.linkGroups.map((group) => (
                <LinkGroup key={group.title} group={group} />
              ))}
            </div>
          </div>

          <Checklist site={site} />
        </div>
      </section>
    </>
  );
}
