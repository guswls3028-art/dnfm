export default function SiteFooter({ site }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner content-wrap">
        <p className="site-footer__note">{site.footerNote}</p>
        {site.siblingSite ? (
          <a
            className="site-footer__sibling"
            href={site.siblingSite.href}
            target="_blank"
            rel="noreferrer"
          >
            <span className="site-footer__sibling-label">{site.siblingSite.label} →</span>
            <small>{site.siblingSite.description}</small>
            <small>{site.siblingSite.href}</small>
          </a>
        ) : null}
      </div>
    </footer>
  );
}
