function isExternal(url) {
  return Boolean(url) && /^https?:/.test(url);
}

export default function LinkGroup({ group }) {
  return (
    <article className="link-group">
      <h3 className="link-group__title">{group.title}</h3>
      <div className="link-group__list">
        {group.links.map((link) =>
          link.url ? (
            <a
              className="link-group__item"
              href={link.url}
              key={link.label}
              target={isExternal(link.url) ? "_blank" : undefined}
              rel={isExternal(link.url) ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ) : (
            <button
              className="link-group__item"
              type="button"
              aria-disabled="true"
              disabled
              title={link.reason}
              key={link.label}
            >
              {link.label}
            </button>
          )
        )}
      </div>
    </article>
  );
}
