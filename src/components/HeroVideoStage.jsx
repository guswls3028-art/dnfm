"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { host, heroThemes } from "@/lib/content";

const STORAGE_KEY = "dnfm.hero.theme";
const DEFAULT_THEME = "moonlight";

function isExternal(url) {
  return Boolean(url) && /^https?:/.test(url);
}

function readStoredTheme() {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v && heroThemes.some((t) => t.id === v)) return v;
  } catch {}
  return DEFAULT_THEME;
}

function applyDocumentTheme(themeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-hero-theme", themeId);
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

export default function HeroVideoStage({ site }) {
  const [themeId, setThemeId] = useState(DEFAULT_THEME);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [slideMenuOpen, setSlideMenuOpen] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const videoRef = useRef(null);
  const slideItems = site.heroSlides?.length ? site.heroSlides : site.eventSlides;
  const slideCount = slideItems.length;

  const syncSlide = useCallback((index, { syncTheme = true } = {}) => {
    if (!slideCount) return;
    const nextIndex = (index + slideCount) % slideCount;
    const nextSlide = slideItems[nextIndex];
    setActiveSlideIndex(nextIndex);
    if (syncTheme && nextSlide?.themeId && heroThemes.some((t) => t.id === nextSlide.themeId)) {
      setThemeId(nextSlide.themeId);
    }
  }, [slideCount, slideItems]);

  useEffect(() => {
    setHydrated(true);
    const stored = readStoredTheme();
    setThemeId(stored);
    applyDocumentTheme(stored);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e) => setReduced(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    applyDocumentTheme(themeId);
    try {
      window.localStorage.setItem(STORAGE_KEY, themeId);
    } catch {}
    const v = videoRef.current;
    if (v && !reduced) {
      v.load();
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }
  }, [themeId, reduced]);

  useEffect(() => {
    if (reduced || paused || slideCount < 2) return undefined;
    const timer = window.setInterval(() => {
      syncSlide(activeSlideIndex + 1);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [activeSlideIndex, paused, reduced, slideCount, syncSlide]);

  const theme = heroThemes.find((t) => t.id === themeId) ?? heroThemes[0];
  const hero = site.hero;
  const primaryAction = site.actions?.find((a) => a.label === "카톡방 입장") ?? site.actions?.[0];
  const activeSlide = slideItems[activeSlideIndex] ?? slideItems[0] ?? {};
  const headlineLines = activeSlide.headlineLines?.length
    ? activeSlide.headlineLines
    : hero.headlineLines;
  const heroKicker = activeSlide.kicker || theme.kicker;
  const heroTagline = activeSlide.tagline || theme.tagline;
  const heroBody = activeSlide.body || hero.body;
  const secondaryAction = activeSlide.cta?.href || activeSlide.cta?.url
    ? activeSlide.cta
    : { label: "질문하기", href: "/board/new?category=question" };
  const handlePrev = () => {
    setPaused(true);
    syncSlide(activeSlideIndex - 1);
  };
  const handleNext = () => {
    setPaused(true);
    syncSlide(activeSlideIndex + 1);
  };
  const handleSelectSlide = (index) => {
    setPaused(true);
    syncSlide(index);
    setSlideMenuOpen(false);
  };

  return (
    <section
      className="hero-video"
      aria-labelledby="hero-video-title"
      data-theme={themeId}
    >
      <div className="hero-video__media" aria-hidden="true">
        {!reduced ? (
          <video
            ref={videoRef}
            className="hero-video__video"
            key={theme.id}
            src={theme.videoSrc}
            poster={theme.posterSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            className="hero-video__poster"
            src={theme.posterSrc}
            alt=""
            loading="eager"
          />
        )}
        <div className="hero-video__veil" />
        <div className="hero-video__grain" />
      </div>

      <div className="content-wrap hero-video__inner">
        <div className="hero-video__copy">
          <div className="hero-video__host" aria-label={`방장 ${host.nickname}`}>
            <img
              className="hero-video__host-avatar"
              src={host.avatarSrc}
              alt={`${host.nickname} 프사`}
              loading="lazy"
            />
            <span className="hero-video__host-meta">
              <small>방장</small>
              <strong>{host.nickname}</strong>
            </span>
            <span className="hero-video__host-dot" aria-hidden="true" />
            <span className="hero-video__host-role">{host.role}</span>
          </div>

          <span className="hero-video__kicker">{heroKicker}</span>
          <h1 id="hero-video-title" className="hero-video__title">
            {headlineLines.map((line, index) => (
              <span key={line}>{line}{index < headlineLines.length - 1 ? " " : ""}</span>
            ))}
          </h1>
          <p className="hero-video__tagline">{heroTagline}</p>
          {heroBody ? <p className="hero-video__subtitle">{heroBody}</p> : null}

          <div className="hero-video__cta">
            {primaryAction?.url ? (
              <a
                className="btn btn--primary btn--lg hero-video__cta-kakao"
                href={primaryAction.url}
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="hero-video__cta-kakao-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 3C6.48 3 2 6.58 2 11c0 2.86 1.88 5.36 4.7 6.78-.2.7-.74 2.6-.84 3-.13.5.18.5.39.36.16-.1 2.55-1.74 3.58-2.45.7.1 1.43.16 2.17.16 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
                </svg>
                <span>{primaryAction.label}</span>
              </a>
            ) : (
              <HeroCta action={primaryAction} primary />
            )}
            <HeroCta action={secondaryAction} />
          </div>

          {hero.bullets?.length ? (
            <ul className="hero-video__principles" aria-label="운영 원칙">
              {hero.bullets.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}

          {hero.hashtags?.length ? (
            <ul className="hero-video__hashtags" aria-label="키워드">
              {hero.hashtags.slice(0, 8).map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </div>

        <fieldset
          className="hero-video__themes"
          aria-label="배경 테마 선택"
          suppressHydrationWarning
        >
          <legend className="hero-video__themes-legend">
            <span className="hero-video__themes-eyebrow">SCENE</span>
            <span className="hero-video__themes-help">배경을 골라보세요</span>
          </legend>
          <div className="hero-video__themes-row" role="radiogroup">
            {heroThemes.map((t) => {
              const active = hydrated && t.id === themeId;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  className={`hero-video__chip${active ? " is-active" : ""}`}
                  data-theme={t.id}
                  onClick={(e) => {
                    setThemeId(t.id);
                    e.currentTarget.blur();
                  }}
                  title={t.tagline}
                >
                  <span className="hero-video__chip-glow" aria-hidden="true" />
                  <span className="hero-video__chip-poster" aria-hidden="true">
                    <img src={t.posterSrc} alt="" loading="lazy" />
                  </span>
                  <span className="hero-video__chip-meta">
                    <strong>{t.label}</strong>
                    <small>{t.subLabel}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div className={`hero-video__carousel${slideMenuOpen ? " is-menu-open" : ""}`} aria-label="히어로 배너">
        <div className="hero-video__carousel-controls">
          <button type="button" aria-label="이전 배너" onClick={handlePrev}>‹</button>
          <button type="button" aria-label="다음 배너" onClick={handleNext}>›</button>
          <button
            type="button"
            aria-label={paused ? "배너 자동 넘김 재생" : "배너 자동 넘김 정지"}
            aria-pressed={paused}
            onClick={() => setPaused((v) => !v)}
          >
            {paused ? "▶" : "Ⅱ"}
          </button>
          <button
            type="button"
            aria-label="배너 목록"
            aria-expanded={slideMenuOpen}
            onClick={() => setSlideMenuOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
        {slideMenuOpen ? (
          <div className="hero-video__slide-menu" aria-label="전체 배너 목록">
            {slideItems.map((item, index) => (
              <button
                key={`menu-${item.id || item.index || item.title}`}
                type="button"
                className={index === activeSlideIndex ? "is-active" : ""}
                onClick={() => handleSelectSlide(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
        ) : null}
        <ol className="hero-video__carousel-list">
          {slideItems.slice(0, 5).map((item, index) => (
            <li
              key={item.id || item.index || item.title}
              className={index === activeSlideIndex ? "is-active" : ""}
            >
              <button type="button" onClick={() => handleSelectSlide(index)}>
                <span>{index + 1}</span>
                <strong>{item.navTitle || item.title}</strong>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
