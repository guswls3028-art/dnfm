import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/content";

export async function generateMetadata({ params }) {
  const p = await params;
  const event = site.eventCards.find((e) => e.id === p.id);
  return { title: event ? event.title : "이벤트" };
}

function isExternal(url) {
  return Boolean(url) && /^https?:/.test(url);
}

export default async function EventDetailPage({ params }) {
  const p = await params;
  const event = site.eventCards.find((e) => e.id === p.id);
  if (!event) {
    notFound();
  }

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">{event.title}</h1>
            <p className="page-hero__sub">
              {event.category} · {event.period} · {event.status}
            </p>
          </div>
          <Link href="/events" className="btn btn--secondary btn--sm">
            ← 이벤트 목록
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ display: "grid", gap: "var(--sp-5)", maxWidth: 820 }}>
          <div className="card card--ornate">
            <div className="event-card__banner" aria-hidden="true" style={{ height: 180 }}>
              {event.title}
            </div>
            <div className="card__body" style={{ display: "grid", gap: "var(--sp-3)" }}>
              <div style={{ display: "flex", gap: "var(--sp-2)" }}>
                {event.badge ? (
                  <span className={`badge ${event.badge === "HOT" ? "badge--crimson" : "badge--end"}`}>
                    {event.badge}
                  </span>
                ) : null}
                <span className="badge badge--outline">{event.category}</span>
                <span className="badge badge--soft">{event.status}</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{event.body}</p>
              <p style={{ margin: 0, color: "var(--color-gold)", fontWeight: 800 }}>
                기간: {event.period}
              </p>
            </div>
          </div>

          <div className="post-actions">
            {event.url ? (
              isExternal(event.url) ? (
                <a className="btn btn--primary" href={event.url} target="_blank" rel="noreferrer">
                  공식 안내 보러가기 →
                </a>
              ) : (
                <Link className="btn btn--primary" href={event.url}>
                  자세히 →
                </Link>
              )
            ) : (
              <button type="button" className="btn btn--secondary" disabled title="링크 등록 전">
                준비중
              </button>
            )}
            <Link href="/events" className="btn btn--ghost">
              목록으로
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
