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
              뉴비·복귀 환영. 길드 아지트 버프부터 즉시가입까지.
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
                <strong>여기에 길드를 걸어보세요</strong>
                <small>길드장 · 직접 신청</small>
              </header>
              <p>
                뉴비/복귀를 환영하는 길드라면 누구나 가능. 길드명·길마·간단한 소개·공식 페이지 링크를 운영자에게 보내주세요.
              </p>
              <ul className="guild-invite__list">
                <li>아지트 만렙·버프 가능 길드 우선</li>
                <li>가입 조건은 자유, 단 뉴비 무시·갈취 정책 길드는 제외</li>
                <li>운영자 검토 후 등록 (보통 1~2일)</li>
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
                  <small>검토중인 길드가 채워집니다</small>
                </header>
                <p>운영자 검토를 통과한 뉴비 친화 길드가 이 자리에 표시됩니다.</p>
                <span className="action-disabled" aria-disabled="true">접수 대기</span>
              </article>
            ))}
          </div>

          <article className="guild-policy">
            <h3 className="guild-policy__title">운영 정책</h3>
            <ul>
              <li><strong>등록 기준</strong> — 뉴비 무시·갈취 정책 0건, 가입 조건 명시</li>
              <li><strong>심사 기간</strong> — 보통 1~2일 (사용자가 톡방에 신청)</li>
              <li><strong>해제 기준</strong> — 운영 방침 위반 시 사전 안내 후 해제</li>
            </ul>
          </article>
        </div>
      </section>
    </>
  );
}
