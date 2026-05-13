import Link from "next/link";
import { host } from "@/lib/content";
import HeroAdminBanners from "./HeroAdminBanners";

function isExternal(url) {
  return Boolean(url) && /^https?:/.test(url);
}

function HeroCta({ action, primary }) {
  if (!action) return null;
  if (action.url === null) {
    return (
      <button type="button" className="btn btn--secondary" disabled title={action.reason}>
        {action.label}
      </button>
    );
  }
  const cls = primary ? "btn btn--primary btn--lg" : "btn btn--secondary btn--lg";
  if (isExternal(action.url || action.href)) {
    return (
      <a className={cls} href={action.url || action.href} target="_blank" rel="noreferrer">
        {action.label}
      </a>
    );
  }
  return (
    <Link className={cls} href={action.url || action.href}>
      {action.label}
    </Link>
  );
}

/**
 * 커뮤니티 감성 hero —
 *   배너 배경 좌 / 환영 카피 우 / 액션 + 해시태그 chips
 *   "공원 정자" 톤 — 격식 X, 따뜻한 환영.
 */
export default function HeroStage({ site }) {
  const hero = site.hero;
  const primaryAction = site.actions?.find((a) => a.label === "카톡방 입장") ?? site.actions?.[0];

  return (
    <section className="hero hero--community" aria-labelledby="hero-title">
      <div className="content-wrap hero__inner">
        <div className="hero__copy">
          <span className="hero__kicker">{hero.kicker}</span>
          <h1 id="hero-title" className="hero__title">
            {hero.headlineLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          {hero.subtitle ? <p className="hero__subtitle">{hero.subtitle}</p> : null}

          {hero.bullets?.length ? (
            <ul className="hero__bullets">
              {hero.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : null}

          <p className="hero__body">{hero.body}</p>

          <div className="hero__cta">
            <HeroCta action={primaryAction} primary />
            <Link href="/board" className="btn btn--secondary btn--lg">
              훈련소 둘러보기
            </Link>
            <Link href="/about" className="btn btn--ghost btn--lg">
              톡방 안내 →
            </Link>
          </div>

          {hero.hashtags?.length ? (
            <ul className="hero__hashtags" aria-label="키워드">
              {hero.hashtags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}

          <HeroAdminBanners />
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
