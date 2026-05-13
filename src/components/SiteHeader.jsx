"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteHeader({ site }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`site-header${open ? " is-open" : ""}`} aria-label="사이트 헤더">
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

        <button
          type="button"
          className="site-burger"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="site-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="site-burger__bars" aria-hidden="true">
            <span />
          </span>
        </button>
      </div>

      <div id="site-drawer" className="site-drawer" role="navigation" aria-label="모바일 메뉴">
        <div className="site-drawer__group">
          {site.navItems.map((item) => (
            <Link className="site-drawer__link" key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="site-drawer__group">
          <Link className="site-drawer__link site-drawer__link--primary" href="/login">
            로그인 / 입소 신청
          </Link>
          {site.siblingSite ? (
            <a
              className="site-drawer__link"
              href={site.siblingSite.href}
              target="_blank"
              rel="noreferrer"
            >
              {site.siblingSite.label} ↗
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
