function isExternal(url) {
  return Boolean(url) && /^https?:/.test(url);
}

/** 카테고리별 작은 SVG 픽토그램 — emoji 보다 SSOT 디자인 토큰 친화 */
function CategoryIcon({ category }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };
  switch (category) {
    case "시작":
      return (
        <svg {...common}>
          <path d="M5 21V7a4 4 0 0 1 4-4h2v18" />
          <path d="M11 5h6l-2 3 2 3h-6" />
        </svg>
      );
    case "성장":
      return (
        <svg {...common}>
          <path d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.4 6.7 19.1l1-5.8L3.5 9.2l5.9-.9z" />
        </svg>
      );
    case "장비":
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "파티":
      return (
        <svg {...common}>
          <circle cx="8" cy="9" r="3" />
          <circle cx="16" cy="9" r="3" />
          <path d="M3 20c1-3.4 3.4-5 5-5s2 1 5 1 3-1 5-1 4 1.6 5 5" />
        </svg>
      );
    case "공식":
      return (
        <svg {...common}>
          <path d="M14 3h7v7" />
          <path d="M21 3l-9 9" />
          <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
  }
}

export default function GuideCard({ guide }) {
  const hasUrl = Boolean(guide.url);
  const action = hasUrl ? (
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
    <span className="guide-card__pending" aria-disabled="true">
      <span className="guide-card__pending-dot" aria-hidden="true" />
      운영자가 채울 자리예요
    </span>
  );

  return (
    <article
      className={`guide-card${hasUrl ? "" : " guide-card--pending"}`}
      data-category={guide.category}
    >
      <div className="guide-card__top">
        <span className="guide-card__icon" aria-hidden="true">
          <CategoryIcon category={guide.category} />
        </span>
        <span className="badge badge--soft guide-card__cat">{guide.category}</span>
      </div>
      <h3 className="guide-card__title">{guide.title}</h3>
      <p className="guide-card__body">{guide.body}</p>
      <div className="guide-card__action">{action}</div>
    </article>
  );
}
