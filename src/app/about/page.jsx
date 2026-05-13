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
              방장이 직접 쓴 운영 철학, 인원 분포, 7가지 기본 규칙.
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

          <div
            className="demographics"
            aria-label={`톡방 인원 분포 (${demographics.asOf} 기준)`}
          >
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
    </>
  );
}
