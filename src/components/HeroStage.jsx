import Link from "next/link";
import { host } from "@/lib/content";

function isExternal(url) {
  return Boolean(url) && /^https?:/.test(url);
}

function HeroCta({ action }) {
  if (!action) return null;
  if (action.url === null) {
    return (
      <button type="button" className="btn btn--secondary" disabled title={action.reason}>
        {action.label}
      </button>
    );
  }
  const className = action.primary ? "btn btn--primary btn--lg" : "btn btn--secondary btn--lg";
  if (isExternal(action.url || action.href)) {
    return (
      <a className={className} href={action.url || action.href} target="_blank" rel="noreferrer">
        {action.label}
      </a>
    );
  }
  return (
    <Link className={className} href={action.url || action.href}>
      {action.label}
    </Link>
  );
}

export default function HeroStage({ site }) {
  const primary = site.heroSlides?.[0];
  const secondary = site.heroSlides?.[1];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="content-wrap hero__inner">
        <div>
          <span className="hero__kicker">{primary?.kicker || site.hero.kicker}</span>
          <h1 id="hero-title" className="hero__title">
            {site.hero.headlineLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero__body">{site.hero.body}</p>
          <div className="hero__cta">
            <HeroCta action={{ ...primary?.cta, primary: true }} />
            <HeroCta action={secondary?.cta} />
            <Link href="/board" className="btn btn--ghost btn--lg">
              훈련소 둘러보기
            </Link>
          </div>
        </div>
        <div className="hero__visual">
          {host.bannerSrc ? (
            <img
              className="hero__visual-banner"
              src={host.bannerSrc}
              alt="뉴비 훈련소 배너"
              loading="eager"
              fetchPriority="high"
            />
          ) : (
            <div className="hero__visual-seal" aria-hidden="true">DNFM</div>
          )}
          <div className="hero__host">
            <img
              className="hero__host-avatar"
              src={host.avatarSrc}
              alt={`${host.nickname} 프사`}
              loading="lazy"
            />
            <div className="hero__host-meta">
              <span className="hero__host-label">방장</span>
              <strong className="hero__host-name">{host.nickname}</strong>
              <small className="hero__host-note">{host.role}</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
