function isExternal(url) {
  return Boolean(url) && /^https?:/.test(url);
}

export default function GuideCard({ guide }) {
  const action = guide.url ? (
    isExternal(guide.url) ? (
      <a className="btn btn--secondary btn--sm" href={guide.url} target="_blank" rel="noreferrer">
        {guide.linkLabel || "바로가기"} →
      </a>
    ) : (
      <a className="btn btn--secondary btn--sm" href={guide.url}>
        {guide.linkLabel || "바로가기"} →
      </a>
    )
  ) : (
    <span className="action-disabled" aria-disabled="true">
      {guide.linkLabel || "준비중"}
    </span>
  );

  return (
    <article className="guide-card" data-category={guide.category}>
      <span className="badge badge--soft guide-card__cat">{guide.category}</span>
      <h3 className="guide-card__title">{guide.title}</h3>
      <p className="guide-card__body">{guide.body}</p>
      <div className="guide-card__action">{action}</div>
    </article>
  );
}
