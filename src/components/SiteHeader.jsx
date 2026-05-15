"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/lib/use-current-user";

/**
 * SiteHeader — 좌측 사이드바 + 모바일 상단바.
 *  - PC (≥1024px): 좌측 사이드바 항상 열림. 상단바 숨김. main 은 sidebar 폭만큼 우측 이동.
 *  - Mobile (<1024px): 상단바 가시. 햄버거 클릭 시 사이드바 슬라이드인 (좌→우) + 백드롭.
 */
export default function SiteHeader({ site }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthed, isLoading, logout } = useCurrentUser();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  async function handleLogout() {
    await logout();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const displayName = user?.displayName || user?.username || "";
  const isActive = (href) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header className="site-desktop-header" aria-label="상단 메뉴">
        <div className="site-desktop-header__inner">
          <Link href="/" className="site-desktop-header__brand" aria-label={`${site.title} 홈`}>
            <span className="site-brand__seal" aria-hidden="true">D</span>
            <span>
              <strong>{site.shortTitle}</strong>
              <small>{site.brandMark}</small>
            </span>
          </Link>

          <nav className="site-desktop-header__nav" aria-label="주 메뉴">
            {site.navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={isActive(item.href) ? "is-active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="site-desktop-header__actions">
            <a
              className="site-desktop-header__start"
              href={site.actions?.[0]?.url}
              target="_blank"
              rel="noreferrer"
            >
              카톡방 입장
            </a>
            {isLoading ? (
              <span className="site-desktop-header__auth" aria-hidden="true">…</span>
            ) : isAuthed ? (
              <Link className="site-desktop-header__auth" href="/profile" title={displayName}>
                {displayName}
              </Link>
            ) : (
              <Link className="site-desktop-header__auth" href="/login">
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 모바일 전용 상단바 */}
      <header className="site-topbar" aria-label="모바일 헤더">
        <button
          type="button"
          className="site-burger"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="site-sidebar"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="site-burger__bars" aria-hidden="true">
            <span />
          </span>
        </button>
        <Link href="/" className="site-topbar__brand" aria-label={`${site.title} 홈`}>
          <span className="site-brand__seal" aria-hidden="true">D</span>
          <strong>{site.shortTitle}</strong>
        </Link>
        <div className="site-topbar__spacer" aria-hidden="true" />
        <div className="site-topbar__user-zone">
          {isLoading ? (
            <span className="site-topbar__loading" aria-hidden="true">…</span>
          ) : isAuthed ? (
            <Link
              href="/profile"
              className="site-topbar__user-chip"
              aria-label="내 페이지"
              title={displayName}
            >
              <span className="site-topbar__user-avatar" aria-hidden="true">
                {displayName?.[0] || "?"}
              </span>
              <span className="site-topbar__user-name">{displayName}</span>
            </Link>
          ) : (
            <>
              <Link href="/login" className="site-topbar__login">
                로그인
              </Link>
              <Link
                href="/signup"
                className="site-topbar__signup"
                aria-label="입소 신청"
              >
                입소
              </Link>
            </>
          )}
        </div>
      </header>

      {/* 백드롭 (모바일 슬라이드 인 상태) */}
      <button
        type="button"
        className={`site-sidebar__backdrop${open ? " is-open" : ""}`}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />

      {/* 사이드바 */}
      <aside
        id="site-sidebar"
        className={`site-sidebar${open ? " is-open" : ""}`}
        aria-label="주 메뉴"
      >
        <div className="site-sidebar__head">
          <Link href="/" className="site-brand" aria-label={`${site.title} 홈`}>
            <span className="site-brand__seal" aria-hidden="true">D</span>
            <span className="site-brand__wordmark">
              <strong>{site.shortTitle}</strong>
              <small>{site.brandMark}</small>
            </span>
          </Link>
        </div>

        <nav className="site-sidebar__nav" aria-label="주 메뉴 항목">
          {site.navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`site-sidebar__link${isActive(item.href) ? " is-active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {site.communityShortcuts?.length ? (
          <div className="site-sidebar__section" aria-label="게시판 바로가기">
            <span className="site-sidebar__section-title">게시판</span>
            <div className="site-sidebar__quicklinks">
              {site.communityShortcuts.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="site-sidebar__quicklink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="site-sidebar__foot">
          {isLoading ? (
            <span className="site-sidebar__user-loading" aria-hidden="true">…</span>
          ) : isAuthed ? (
            <>
              <Link
                className="site-sidebar__user"
                href="/profile"
                title="내 페이지"
                onClick={() => setOpen(false)}
              >
                <span className="site-sidebar__user-avatar" aria-hidden="true">
                  {displayName?.[0] || "?"}
                </span>
                <span className="site-sidebar__user-name">{displayName}</span>
              </Link>
              <button
                type="button"
                className="site-sidebar__logout"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <div className="site-sidebar__auth">
              <Link
                className="site-sidebar__cta"
                href="/signup"
                onClick={() => setOpen(false)}
              >
                입소 신청
              </Link>
              <Link
                className="site-sidebar__login-link"
                href="/login"
                onClick={() => setOpen(false)}
              >
                이미 회원이면 로그인 →
              </Link>
            </div>
          )}

          {site.siblingSite ? (
            <a
              className="site-sidebar__sibling"
              href={site.siblingSite.href}
              target="_blank"
              rel="noreferrer"
              title={site.siblingSite.description}
            >
              <small className="site-sidebar__sibling-tag">FRIENDS</small>
              <span>{site.siblingSite.label} ↗</span>
            </a>
          ) : null}
        </div>
      </aside>
    </>
  );
}
