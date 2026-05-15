import Link from "next/link";
import { friendlyGuilds, host } from "@/lib/content";

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
              운영자가 확인한 길드 정보만 표시합니다.
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            <a
              className="btn btn--primary btn--sm"
              href="https://open.kakao.com/o/gbsjsZ5g"
              target="_blank"
              rel="noreferrer"
            >
              카톡방에서 추천 받기 →
            </a>
            <Link href="/about" className="btn btn--secondary btn--sm">
              톡방 소개
            </Link>
          </div>
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
            <span className="section__more" aria-hidden="true">
              총 {friendlyGuilds.length}개
            </span>
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

            <article className="guild-card guild-card--invite">
              <header>
                <strong>길드 정보 입력 예정</strong>
                <small>운영자 확인 후 등록</small>
              </header>
              <p>
                길드명, 길마, 가입 조건, 공식 페이지 링크는 운영자가 확인한 내용만 채웁니다.
              </p>
              <ul className="guild-invite__list">
                <li>확인되지 않은 길드 조건은 표시하지 않습니다.</li>
                <li>신청/수정은 톡방에서 운영자에게 전달합니다.</li>
              </ul>
              <a
                className="btn btn--primary btn--sm"
                href="https://open.kakao.com/o/gbsjsZ5g"
                target="_blank"
                rel="noreferrer"
              >
                {host.nickname} 운영자에게 신청 →
              </a>
            </article>

            {Array.from({ length: 3 }).map((_, i) => (
              <article className="guild-card guild-card--slot" key={`slot-${i}`} aria-hidden="true">
                <header>
                  <strong>비어있는 자리</strong>
                  <small>운영자 입력 예정</small>
                </header>
                <p>확인된 길드만 이 자리에 표시됩니다.</p>
                <span className="action-disabled" aria-disabled="true">입력 예정</span>
              </article>
            ))}
          </div>

          <article className="guild-policy">
            <h3 className="guild-policy__title">운영 정책</h3>
            <ul>
              <li><strong>등록 기준</strong> — 운영자가 확인한 정보만 등록</li>
              <li><strong>수정 기준</strong> — 길드 조건이 바뀌면 운영자 확인 후 수정</li>
              <li><strong>미확인 정보</strong> — 추측으로 채우지 않음</li>
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}
