import Link from "next/link";
import EventCard from "@/components/EventCard";
import { site } from "@/lib/content";

export const metadata = {
  title: "이벤트"
};

const TABS = [
  { id: "all", label: "전체" },
  { id: "ongoing", label: "진행중" },
  { id: "ended", label: "종료" }
];

export default async function EventsPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const tab = params.tab || "ongoing";
  const q = (params.q || "").toString().trim().toLowerCase();

  let list = site.eventCards;
  if (tab === "ongoing") list = list.filter((e) => e.status !== "종료");
  if (tab === "ended") list = list.filter((e) => e.status === "종료");
  if (q) {
    list = list.filter((e) => e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q));
  }

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">이벤트</h1>
            <p className="page-hero__sub">
              공식 이벤트와 톡방 자체 이벤트를 한 보드에서 확인합니다.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap">
          <div className="events-toolbar">
            <div className="tabs" role="tablist" aria-label="이벤트 분류">
              {TABS.map((t) => {
                const isActive = t.id === tab;
                const href = t.id === "ongoing" ? "/events" : `/events?tab=${t.id}`;
                return (
                  <Link
                    key={t.id}
                    href={href}
                    className={`tab${isActive ? " is-active" : ""}`}
                    role="tab"
                    aria-selected={isActive}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </div>

            <form className="events-search" action="/events" method="get" role="search">
              <input type="hidden" name="tab" value={tab} />
              <input type="search" name="q" placeholder="이벤트 검색" defaultValue={q} aria-label="이벤트 검색" />
              <button type="submit" className="btn btn--ghost btn--sm" aria-label="검색">
                🔍
              </button>
            </form>
          </div>

          {list.length === 0 ? (
            <div className="card" style={{ padding: "var(--sp-7)", textAlign: "center" }}>
              <p style={{ margin: 0 }}>일치하는 이벤트가 없습니다.</p>
            </div>
          ) : (
            <div className="events-grid">
              {list.map((event) => (
                <EventCard key={event.id} event={{ ...event, url: event.url || `/events/${event.id}` }} />
              ))}
            </div>
          )}

          <article
            className="card card--parchment"
            style={{
              marginTop: "var(--sp-6)",
              padding: "var(--sp-5)",
              display: "grid",
              gap: "var(--sp-2)",
            }}
          >
            <strong style={{ color: "var(--color-gold)" }}>톡방 자체 이벤트는 카톡방에서</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              운영자가 진행하는 깜짝 이벤트·경품 추첨은 오픈채팅에서 공지합니다. 사이트에는 종료 후 결과만 정리.
            </p>
            <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
              <a
                className="btn btn--secondary btn--sm"
                href="https://open.kakao.com/o/gbsjsZ5g"
                target="_blank"
                rel="noreferrer"
              >
                카톡방 입장 →
              </a>
              <Link href="/board?category=notice" className="btn btn--ghost btn--sm">
                공지 보기
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
