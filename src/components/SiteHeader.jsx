"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/use-current-user";

export default function SiteHeader({ site }) {
  const { user, isAuthed, isLoading, logout } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push("/");
    router.refresh();
  }

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

          {isLoading ? (
            <span className="user-menu__trigger" aria-busy="true">…</span>
          ) : isAuthed && user ? (
            <div className="user-menu" ref={menuRef}>
              <button
                type="button"
                className="user-menu__trigger"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {user.displayName || user.username} <span aria-hidden="true">▾</span>
              </button>
              {open ? (
                <div className="user-menu__panel" role="menu">
                  <Link href="/profile" className="user-menu__item" role="menuitem" onClick={() => setOpen(false)}>
                    마이페이지
                  </Link>
                  <Link href="/board/new" className="user-menu__item" role="menuitem" onClick={() => setOpen(false)}>
                    글쓰기
                  </Link>
                  <button
                    type="button"
                    className="user-menu__item user-menu__item--danger"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <>
              <Link className="btn btn--sm btn--secondary" href="/login">
                로그인
              </Link>
              <Link className="btn btn--sm btn--primary site-actions__signup" href="/signup">
                가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
