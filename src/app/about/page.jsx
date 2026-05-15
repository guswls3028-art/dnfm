import Link from "next/link";
import { philosophy, demographics, rules } from "@/lib/content";

export const metadata = {
  title: "톡방 소개와 규칙",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">톡방 소개와 규칙</h1>
            <p className="page-hero__sub">
              방장이 확인한 운영 철학과 기본 안내만 표시합니다.
            </p>
          </div>
          <Link href="/signup" className="btn btn--primary btn--sm">
            입소 신청 →
          </Link>
        </div>
      </section>

      <section className="section section--about" aria-labelledby="about-title">
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

          <p className="about__one-liner">“{philosophy.oneLiner}”</p>
          <ul className="about__bullets">
            {philosophy.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          <div className="demographics" aria-label={`톡방 정보 (${demographics.asOf})`}>
            <div className="demographics__head">
              <strong>인원 분포</strong>
              <small>{demographics.asOf}</small>
            </div>
            {demographics.bars.length ? (
              demographics.bars.map((bar) => (
                <div className="demographics__row" key={bar.label}>
                  <span className="demographics__label">{bar.label}</span>
                  <span className="demographics__bar" data-accent={bar.accent}>
                    <span style={{ width: `${bar.pct * 2}%` }} />
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
            {rules.map((r, i) => (
              <li className="rules-grid__item" key={r.title}>
                <span className="rules-grid__num">
                  {String(i + 1).padStart(2, "0")}
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
              질문이 부담스러우면 그냥 인사만 남기고 가셔도 환영합니다.
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
