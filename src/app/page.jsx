import Link from "next/link";
import HeroStage from "@/components/HeroStage";
import BoardRow from "@/components/BoardRow";
import EventCard from "@/components/EventCard";
import { site } from "@/lib/content";

const DISCOVER_CARDS = [
  {
    href: "/about",
    kicker: "ABOUT",
    title: "톡방 소개와 규칙",
    body: "방장이 직접 쓴 운영 철학과 7가지 기본 규칙, 인원 분포까지.",
  },
  {
    href: "/guide",
    kicker: "GUIDE",
    title: "톡방 가이드 명령어",
    body: "채팅창에 명령어 하나면 자동으로 가이드 카드가 떠요.",
  },
  {
    href: "/guilds",
    kicker: "GUILD",
    title: "뉴비 친화 길드",
    body: "버프 요리부터 즉시가입까지 — 뉴비 환영 길드만 추렸어요.",
  },
];

export default function HomePage() {
  const latestNotices = site.notices.slice(0, 3);
  const ongoingEvent = site.eventCards.find((e) => e.status !== "종료");

  return (
    <>
      <HeroStage site={site} />

      <section className="section" id="news-board" aria-labelledby="notice-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">NOTICE</span>
              <h2 id="notice-title" className="section__title">
                최신 공지
              </h2>
            </div>
            <Link className="section__more" href="/board">
              모든 글 →
            </Link>
          </header>

          <div className="board" aria-label="공지 목록">
            <div className="board__head">
              <h2>공식·운영 공지</h2>
              <a
                className="card__action"
                href={site.noticesMoreUrl}
                target="_blank"
                rel="noreferrer"
              >
                공식 공지 →
              </a>
            </div>
            <div className="board__rows">
              {latestNotices.map((notice) => (
                <BoardRow key={notice.id || notice.title} post={notice} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {ongoingEvent ? (
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
              <EventCard event={ongoingEvent} />
            </div>
          </div>
        </section>
      ) : null}

      <section className="section" aria-labelledby="discover-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">DISCOVER</span>
              <h2 id="discover-title" className="section__title">
                더 알아보기
              </h2>
            </div>
          </header>

          <div className="events-grid">
            {DISCOVER_CARDS.map((card) => (
              <Link key={card.href} href={card.href} className="event-card discover-card">
                <span className="event-card__badge">{card.kicker}</span>
                <h3 className="event-card__title">{card.title}</h3>
                <p className="event-card__body">{card.body}</p>
                <span className="event-card__cta">바로 가기 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="sister-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">SISTER SITE</span>
              <h2 id="sister-title" className="section__title">
                자매 사이트
              </h2>
            </div>
          </header>

          <a
            className="sister-card"
            href={site.siblingSite.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`${site.siblingSite.label} — 새 창에서 열기`}
          >
            <div className="sister-card__visual" aria-hidden="true">
              <span className="sister-card__placeholder">이미지 곧 받아 올림</span>
            </div>
            <div className="sister-card__body">
              <strong className="sister-card__title">{site.siblingSite.label}</strong>
              <p className="sister-card__desc">{site.siblingSite.description}</p>
              <span className="sister-card__cta">방문하기 →</span>
            </div>
          </a>
        </div>
      </section>
    </>
  );
}
