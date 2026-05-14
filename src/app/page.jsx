import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import HeroVideoStage from "@/components/HeroVideoStage";
import BoardRow from "@/components/BoardRow";
import EventCard from "@/components/EventCard";
import GuideCard from "@/components/GuideCard";
import Checklist from "@/components/Checklist";
import HomeCommunityBoard from "@/components/HomeCommunityBoard";
import LinkGroup from "@/components/LinkGroup";
import {
  site,
  philosophy,
  demographics,
  rules,
  guideCommand,
  friendlyGuilds,
} from "@/lib/content";

export default function HomePage() {
  const ongoingEvents = site.eventCards.filter((e) => e.status !== "종료").slice(0, 2);

  return (
    <>
      <HeroVideoStage site={site} />
      <HeroSlider />

      <section className="section section--about" id="about" aria-labelledby="about-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">PHILOSOPHY</span>
              <h2 id="about-title" className="section__title">
                톡방 철학
              </h2>
            </div>
            <span className="section__more" aria-hidden="true">
              운영자 직접 명시
            </span>
          </header>

          <p className="about__one-liner">
            “{philosophy.oneLiner}”
          </p>
          <ul className="about__bullets">
            {philosophy.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          <div className="demographics" aria-label={`톡방 인원 분포 (${demographics.asOf} 기준)`}>
            <div className="demographics__head">
              <strong>인원 분포</strong>
              <small>{demographics.asOf} 대화 기준 추정</small>
            </div>
            {demographics.bars.map((bar) => (
              <div className="demographics__row" key={bar.label}>
                <span className="demographics__label">{bar.label}</span>
                <span className="demographics__bar" data-accent={bar.accent}>
                  <span style={{ width: `${bar.pct * 2}%` }} />
                </span>
                <span className="demographics__pct">{bar.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="rules" aria-labelledby="rules-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">RULES</span>
              <h2 id="rules-title" className="section__title">
                기본 규칙
              </h2>
            </div>
          </header>
          <ol className="rules-grid">
            {rules.map((r, i) => (
              <li className="rules-grid__item" key={r.title}>
                <span className="rules-grid__num">{String(i + 1).padStart(2, "0")}</span>
                <strong>{r.title}</strong>
                <p>{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--compact-row" aria-label="가이드 명령어와 친화 길드">
        <div className="content-wrap compact-row">
          <div className="compact-row__col" id="guide-cmd-col" aria-labelledby="cmd-title">
            <header className="section__head section__head--compact">
              <div>
                <span className="section__kicker">GUIDE COMMAND</span>
                <h2 id="cmd-title" className="section__title">
                  톡방 가이드 명령어
                </h2>
              </div>
            </header>
            <div className="guide-cmd guide-cmd--rich">
              <div className="guide-cmd__demo" aria-hidden="true">
                <span className="guide-cmd__demo-label">톡방 입력</span>
                <code className="guide-cmd__code">{guideCommand.trigger}</code>
              </div>
              <p className="guide-cmd__note">{guideCommand.note}</p>
              <ul className="guide-cmd__examples">
                <li>
                  <span className="guide-cmd__example-key">/가이드ㅡ시작</span>
                  <span>처음 시작 루트</span>
                </li>
                <li>
                  <span className="guide-cmd__example-key">/가이드ㅡ직업</span>
                  <span>직업 선택 기준</span>
                </li>
                <li>
                  <span className="guide-cmd__example-key">/가이드ㅡ파티</span>
                  <span>파티 예절 / 준비물</span>
                </li>
              </ul>
              <small className="guide-cmd__author">작성: {guideCommand.author}</small>
            </div>
          </div>

          <div className="compact-row__col" id="friendly-guilds" aria-labelledby="guild-title">
            <header className="section__head section__head--compact">
              <div>
                <span className="section__kicker">GUILD</span>
                <h2 id="guild-title" className="section__title">
                  뉴비 친화 길드
                </h2>
              </div>
              <Link className="section__more" href="/guilds">
                전체 길드 →
              </Link>
            </header>
            <div className="guild-grid guild-grid--home">
              {friendlyGuilds.map((g) => (
                <article className="guild-card" key={g.name}>
                  <header>
                    <strong>{g.name}</strong>
                    <small>길마 · {g.leader}</small>
                  </header>
                  <p>{g.description}</p>
                  <a className="btn btn--secondary" href={g.url} target="_blank" rel="noreferrer">
                    공식 길드 페이지 →
                  </a>
                </article>
              ))}
              <article className="guild-card guild-card--invite">
                <header>
                  <strong>여기에 길드를 걸어보세요</strong>
                  <small>뉴비/복귀 환영 길드 · 운영자 검토 1~2일</small>
                </header>
                <p>
                  아지트 만렙·버프 가능 / 뉴비 무시·갈취 정책 없음. 길드명·길마·소개·공식 페이지 링크를 운영자에게 보내주세요.
                </p>
                <Link className="btn btn--primary btn--sm" href="/guilds">
                  등록 안내 보기 →
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>

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
              <HomeCommunityBoard />
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
