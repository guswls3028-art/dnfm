import Link from "next/link";

function isExternal(url) {
  return Boolean(url) && /^https?:/.test(url);
}

function badgeTone(badge) {
  if (badge === "HOT") return "badge badge--crimson";
  if (badge === "END") return "badge badge--end";
  if (badge === "NEW") return "badge badge--gold";
  return "badge badge--soft";
}

export default function EventCard({ event }) {
  const ended = event.status === "종료" || event.badge === "END";
  const className = `event-card${ended ? " event-card--ended" : ""}`;

  const head = (
    <div className="event-card__head">
      {event.badge ? <span className={badgeTone(event.badge)}>{event.badge}</span> : null}
      <span className="badge badge--outline">{event.category}</span>
    </div>
  );

  const categorySlug =
    event.category === "공식" ? "official"
    : event.category === "톡방" || event.category === "운영" ? "talk"
    : "other";

  return (
    <article className={className} data-category={categorySlug}>
      <div className="event-card__banner" data-category={categorySlug} aria-hidden="true">
        {event.bannerLabel || event.category}
      </div>
      {head}
      <h3 className="event-card__title">{event.title}</h3>
      <span className="event-card__period">{event.period}</span>
      <p className="event-card__body">{event.body}</p>
      <div className="event-card__foot">
        <span className="badge badge--outline">{event.status}</span>
        {event.url ? (
          isExternal(event.url) ? (
            <a className="card__action" href={event.url} target="_blank" rel="noreferrer">
              자세히 →
            </a>
          ) : (
            <Link className="card__action" href={event.url}>
              자세히 →
            </Link>
          )
        ) : (
          <span className="action-disabled" aria-disabled="true">
            상세 없음
          </span>
        )}
      </div>
    </article>
  );
}
