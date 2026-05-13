import Link from "next/link";
import EventCard from "@/components/EventCard";
import { site } from "@/lib/content";

export const metadata = {
  title: "이벤트"
};

const TABS = [
  { id: "all", label: "전체" },
  { id: "ongoing", label: "진행중" },
  { id: "ended", label: "종료" },
  { id: "winners", label: "당첨안내" }
];

export default async function EventsPage({ searchParams }) {
  const params = (await searchParams) ?? {};
  const tab = params.tab || "ongoing";
  const q = (params.q || "").toString().trim().toLowerCase();

  let list = site.eventCards;
  if (tab === "ongoing") list = list.filter((e) => e.status !== "종료");
  if (tab === "ended") list = list.filter((e) => e.status === "종료");
  if (tab === "winners") list = []; // 추후 backend 연동
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

          {tab === "winners" ? (
            <div className="card card--ornate" style={{ padding: "var(--sp-7)", textAlign: "center" }}>
              <p style={{ margin: 0, color: "var(--color-gold)", fontWeight: 800 }}>
                당첨안내는 백엔드 연동 이후 공개됩니다.
              </p>
            </div>
          ) : list.length === 0 ? (
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
        </div>
      </section>
    </>
  );
}
