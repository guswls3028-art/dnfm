import Link from "next/link";
import { friendlyGuilds } from "@/lib/content";

export const metadata = {
  title: "뉴비 친화 길드",
};

export default function GuildsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">뉴비 친화 길드</h1>
            <p className="page-hero__sub">
              뉴비/복귀 환영. 길드 아지트 버프부터 즉시가입까지.
            </p>
          </div>
          <Link href="/about" className="btn btn--secondary btn--sm">
            톡방 소개 →
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="guilds-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">GUILD</span>
              <h2 id="guilds-title" className="section__title">
                길드 목록
              </h2>
            </div>
          </header>

          <div className="guild-grid">
            {friendlyGuilds.map((g) => (
              <article className="guild-card" key={g.name}>
                <header>
                  <strong>{g.name}</strong>
                  <small>길마 · {g.leader}</small>
                </header>
                <p>{g.description}</p>
                <a
                  className="btn btn--secondary"
                  href={g.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  공식 길드 페이지 →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
