"use client";

import { useEffect, useRef, useState } from "react";
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
  const [reduced, setReduced] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const videoRef = useRef(null);

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

  const theme = heroThemes.find((t) => t.id === themeId) ?? heroThemes[0];
  const hero = site.hero;
  const primaryAction = site.actions?.find((a) => a.label === "카톡방 입장") ?? site.actions?.[0];
  const slideItems = site.heroSlides?.length ? site.heroSlides : site.eventSlides;

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

          <span className="hero-video__kicker">{theme.kicker}</span>
          <h1 id="hero-video-title" className="hero-video__title">
            {hero.headlineLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero-video__tagline">{theme.tagline}</p>

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
            <Link href="/board" className="btn btn--secondary btn--lg hero-video__cta-secondary">
              훈련소 둘러보기
            </Link>
            <Link href="/about" className="btn btn--ghost btn--lg hero-video__cta-secondary">
              톡방 안내 →
            </Link>
          </div>

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

      <div className="hero-video__carousel" aria-label="주요 배너">
        <div className="hero-video__carousel-controls" aria-hidden="true">
          <button type="button" tabIndex={-1}>‹</button>
          <button type="button" tabIndex={-1}>›</button>
          <button type="button" tabIndex={-1}>Ⅱ</button>
          <button type="button" tabIndex={-1}>☰</button>
        </div>
        <ol className="hero-video__carousel-list">
          {slideItems.slice(0, 5).map((item, index) => (
            <li
              key={item.id || item.index || item.title}
              className={index === 0 ? "is-active" : ""}
            >
              <span>{index + 1}</span>
              <strong>{item.title}</strong>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
