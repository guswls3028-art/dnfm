"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/lib/use-current-user";

function isExternalHref(href = "") {
  return /^https?:\/\//i.test(href);
}

function HeaderMegaLink({ item }) {
  const content = (
    <>
      <span className="site-mega-menu__link-main">
        <span>{item.label}</span>
        {item.badge ? <small>{item.badge}</small> : null}
      </span>
      {item.note ? <span className="site-mega-menu__note">{item.note}</span> : null}
    </>
  );

  if (isExternalHref(item.href)) {
    return (
      <a
        className={`site-mega-menu__link${item.featured ? " is-featured" : ""}`}
        href={item.href}
        target="_blank"
        rel="noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      className={`site-mega-menu__link${item.featured ? " is-featured" : ""}`}
      href={item.href}
    >
      {content}
    </Link>
  );
}

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
  const officialLink = (id, fallback = {}) => {
    const channel = site.officialChannels?.find((item) => item.id === id);
    if (!channel) return null;
    return {
      label: channel.label,
      href: channel.href,
      badge: channel.tag,
      note: channel.body,
      ...fallback,
    };
  };
  const guideLinks = (site.guideCards || site.guides || [])
    .filter((guide) => guide.url)
    .slice(0, 3)
    .map((guide) => ({
      label: guide.shortTitle || guide.title,
      href: guide.url,
      badge: guide.category,
      note: guide.author ? `${guide.author} 자료` : guide.body,
    }));
  const megaGroups = [
    {
      title: "새소식",
      kicker: "공식 원문 + 훈련소 공지",
      links: [
        {
          label: "훈련소 공지",
          href: "/board?category=notice",
          badge: "운영",
          note: "방장 공지와 답변 정리",
          featured: true,
        },
        officialLink("notice"),
        officialLink("update"),
        officialLink("devnote"),
        officialLink("event"),
      ].filter(Boolean),
    },
    {
      title: "커뮤니티",
      kicker: "질문 저장소와 게시판",
      links: [
        {
          label: "질문하기",
          href: "/board/new?category=question",
          badge: "CTA",
          note: "회원·비회원 모두 작성",
          featured: true,
        },
        { label: "질문 저장소", href: "/board?category=question", badge: "질문", note: "운영자 답변 회수" },
        { label: "팁 게시판", href: "/board?category=tip", badge: "팁", note: "확인된 팁 정리" },
        { label: "파티 게시판", href: "/board?category=party", badge: "파티", note: "레이드·재해 모집" },
        { label: "장비 게시판", href: "/board?category=equip", badge: "장비", note: "세팅 질문 분리" },
      ],
    },
    {
      title: "가이드",
      kicker: "검증된 링크 중심",
      links: [
        { label: "가이드 홈", href: "/guide", badge: "허브", note: "공식/커뮤니티 링크 모음", featured: true },
        ...guideLinks,
        {
          label: "공식 추천 가이드",
          href: "https://dnfm.nexon.com/Guide/Recommand",
          badge: "공식",
          note: "공식 홈페이지 자료",
        },
      ],
    },
    {
      title: "훈련소",
      kicker: "톡방 운영 도구",
      links: [
        {
          label: "카톡방 입장",
          href: site.actions?.[0]?.url || "https://open.kakao.com/o/gbsjsZ5g",
          badge: "OPEN",
          note: "실시간 질문과 소통",
          featured: true,
        },
        { label: "톡방 이벤트", href: "/events", badge: "이벤트", note: "참가 안내와 기록" },
        { label: "길드 / 멘토", href: "/guilds", badge: "동의", note: "도움 가능 분야 기준" },
        { label: "훈련소 소개", href: "/about", badge: "철학", note: "운영 원칙과 방 안내" },
        { label: "내 정보", href: "/profile", badge: "계정", note: "작성자 정보와 인증 관리" },
      ],
    },
  ];

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

          <div className="site-desktop-header__nav-wrap">
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

            <div className="site-mega-menu" aria-label="빠른 메뉴">
              <div className="site-mega-menu__inner">
                {megaGroups.map((group) => (
                  <section className="site-mega-menu__group" key={group.title}>
                    <div className="site-mega-menu__head">
                      <strong>{group.title}</strong>
                      <span>{group.kicker}</span>
                    </div>
                    <div className="site-mega-menu__links">
                      {group.links.map((item) => (
                        <HeaderMegaLink key={`${group.title}-${item.label}`} item={item} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>

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
            <Link href="/login" className="site-topbar__login">
              로그인
            </Link>
          )}
        </div>
      </header>

      <nav className="site-mobile-tabs" aria-label="모바일 빠른 메뉴">
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
                회원가입
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
