import Link from "next/link";

export default function SiteHeader({ site }) {
  return (
    <header className="site-header" aria-label="사이트 헤더">
      <div className="site-header__inner content-wrap">
        <Link href="/" className="site-brand" aria-label={`${site.title} 홈`}>
          <span className="site-brand__seal" aria-hidden="true">D</span>
          <span className="site-brand__wordmark">
            <strong>{site.brandMark}</strong>
            <small>{site.shortTitle}</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="주 메뉴">
          {site.navItems.map((item) => (
            <Link className="site-nav__link" key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-actions">
          {site.siblingSite ? (
            <a
              className="site-actions__sibling"
              href={site.siblingSite.href}
              target="_blank"
              rel="noreferrer"
              title={site.siblingSite.description}
            >
              {site.siblingSite.label}
            </a>
          ) : null}
          <Link className="btn btn--sm btn--secondary" href="/login">
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}
