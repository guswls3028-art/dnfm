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
    : event.category === "톡방" || event.category === "운영" || event.category === "뉴비훈련소" ? "talk"
    : "other";

  const content = (
    <>
      <div className="event-card__banner" data-category={categorySlug} aria-hidden="true">
        {event.thumbnailSrc ? (
          <img
            className="event-card__thumb"
            src={event.thumbnailSrc}
            alt=""
            loading="lazy"
            decoding="async"
          />
        ) : (
          event.bannerLabel || event.category
        )}
      </div>
      {head}
      <h3 className="event-card__title">{event.title}</h3>
      <span className="event-card__period">{event.period}</span>
      <p className="event-card__body">{event.body}</p>
      <div className="event-card__foot">
        <span className="badge badge--outline">{event.status}</span>
        {event.url ? (
          <span className="card__action" aria-hidden="true">
            자세히 →
          </span>
        ) : (
          <span className="action-disabled" aria-disabled="true">
            상세 없음
          </span>
        )}
      </div>
    </>
  );

  if (!event.url) {
    return (
      <article className={className} data-category={categorySlug}>
        {content}
      </article>
    );
  }

  const label = `${event.title} 자세히 보기`;
  if (isExternal(event.url)) {
    return (
      <a className={className} data-category={categorySlug} href={event.url} target="_blank" rel="noreferrer" aria-label={label}>
        {content}
      </a>
    );
  }

  return (
    <Link className={className} data-category={categorySlug} href={event.url} aria-label={label}>
      {content}
    </Link>
  );
}
