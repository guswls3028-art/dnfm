import Link from "next/link";
import {
  aboutHighlights,
  demographics,
  operatingLoop,
  philosophy,
  rules,
} from "@/lib/content";

export const metadata = {
  title: "뉴비 훈련소 소개",
  description: "던파 모바일 뉴비 훈련소 톡방의 운영 철학, 인원 분포, 기본 규칙.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero about-hero">
        <div className="content-wrap about-hero__inner">
          <div className="about-hero__copy">
            <span className="page-hero__kicker">ABOUT TRAINING CAMP</span>
            <h1 className="page-hero__title">뉴비 훈련소 소개</h1>
            <p className="page-hero__sub">
              홈은 바로 입장하고 질문하는 곳, 이 페이지는 톡방의 분위기와 운영 기준을
              확인하는 곳입니다.
            </p>
            <div className="about-hero__actions">
              <a
                href="https://open.kakao.com/o/gbsjsZ5g"
                className="btn btn--primary btn--lg"
                target="_blank"
                rel="noreferrer"
              >
                카톡방 입장 →
              </a>
              <Link href="/board/new?category=question" className="btn btn--secondary btn--lg">
                질문 남기기 →
              </Link>
            </div>
          </div>

          <dl className="about-hero__highlights" aria-label="훈련소 핵심 역할">
            {aboutHighlights.map((item) => (
              <div className="about-hero__highlight" key={item.label}>
                <dt>{item.value}</dt>
                <dd>
                  <strong>{item.label}</strong>
                  <span>{item.body}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section--about" aria-labelledby="about-title">
        <div className="content-wrap about-layout">
          <div className="about-layout__main">
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

            <p className="about__one-liner">“{philosophy.oneLiner}”</p>
            <ul className="about__bullets">
              {philosophy.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <aside className="about-layout__side" aria-labelledby="about-loop-title">
            <span className="section__kicker">OPERATING LOOP</span>
            <h2 id="about-loop-title" className="about-mini-title">
              질문이 기록으로 남는 흐름
            </h2>
            <ol className="about-loop">
              {operatingLoop.map((item, index) => (
                <li className="about-loop__item" key={item.title}>
                  <span className="about-loop__num">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="section section--demographics" aria-labelledby="demographics-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">ROOM SNAPSHOT</span>
              <h2 id="demographics-title" className="section__title">
                톡방 인원 분포
              </h2>
            </div>
            <span className="section__more">{demographics.asOf}</span>
          </header>

          <div className="demographics" aria-label={`톡방 정보 (${demographics.asOf})`}>
            <div className="demographics__head">
              <strong>신규 유입 중심의 방</strong>
              <small>{demographics.asOf}</small>
            </div>
            {demographics.bars.length ? (
              demographics.bars.map((bar) => (
                <div className="demographics__row" key={bar.label}>
                  <span className="demographics__label">{bar.label}</span>
                  <span className="demographics__bar" data-accent={bar.accent}>
                    <span style={{ width: `${Math.min(bar.pct * 2, 100)}%` }} />
                  </span>
                  <span className="demographics__pct">{bar.pct}%</span>
                </div>
              ))
            ) : (
              <p className="md-empty" style={{ margin: 0 }}>
                운영자가 직접 확인한 뒤 채웁니다.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="rules-title">
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
            {rules.map((r, index) => (
              <li className="rules-grid__item" key={r.title}>
                <span className="rules-grid__num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <strong>{r.title}</strong>
                <p>{r.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="about-join-title">
        <div className="content-wrap">
          <article className="card card--parchment about-join">
            <header className="about-join__head">
              <span className="section__kicker">JOIN</span>
              <h2 id="about-join-title" className="about-join__title">
                톡방에 들어와 직접 보세요
              </h2>
            </header>
            <p className="about-join__body">
              읽는 것만으로 안 와 닿으면 오픈채팅에 잠깐 들어와 분위기를 보고 가셔도 됩니다.
              질문이 부담스러우면 인사만 남기고 있어도 괜찮습니다.
            </p>
            <div className="about-join__cta">
              <a
                className="btn btn--primary btn--lg"
                href="https://open.kakao.com/o/gbsjsZ5g"
                target="_blank"
                rel="noreferrer"
              >
                카톡방 입장 →
              </a>
              <Link href="/signup" className="btn btn--secondary btn--lg">
                훈련소 회원 가입
              </Link>
              <Link href="/guide" className="btn btn--ghost btn--lg">
                가이드 먼저 보기
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
