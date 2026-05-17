import Link from "next/link";
import HeroVideoStage from "@/components/HeroVideoStage";
import EventCard from "@/components/EventCard";
import GuideCard from "@/components/GuideCard";
import Checklist from "@/components/Checklist";
import HomeInfoHub from "@/components/HomeInfoHub";
import LinkGroup from "@/components/LinkGroup";
import TrainingFlow from "@/components/TrainingFlow";
import {
  site,
  guideCommand,
  friendlyGuilds,
} from "@/lib/content";

export default function HomePage() {
  const ongoingEvents = site.eventCards.filter((e) => e.status !== "종료").slice(0, 2);

  return (
    <>
      <HeroVideoStage site={site} />
      <HomeInfoHub site={site} />

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

      <TrainingFlow steps={site.trainingFlow} />

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
                  <span className="guide-cmd__example-key">/가이드</span>
                  <span>역할별 가이드 목록</span>
                </li>
                <li>
                  <span className="guide-cmd__example-key">/시로코 레이드 공략</span>
                  <span>시로코 종합 가이드</span>
                </li>
                <li>
                  <span className="guide-cmd__example-key">/블레이드 와플 공략</span>
                  <span>직업 공략 포탈</span>
                </li>
              </ul>
              <small className="guide-cmd__author">작성: {guideCommand.author}</small>
              <div className="guide-cmd__actions">
                <Link className="btn btn--primary btn--sm" href="/guide">
                  가이드 전체 보기 →
                </Link>
                <Link className="btn btn--secondary btn--sm" href="/board/new?category=question">
                  질문 남기기 →
                </Link>
              </div>
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
                  <strong>길드 정보 입력 예정</strong>
                  <small>운영자가 확인한 길드만 표시</small>
                </header>
                <p>
                  길드명, 길마, 가입 조건, 공식 페이지 링크는 운영자가 확인한 뒤 채웁니다.
                </p>
                <Link className="btn btn--primary btn--sm" href="/guilds">
                  길드 페이지 →
                </Link>
              </article>
            </div>
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
            <div className="link-groups">
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
