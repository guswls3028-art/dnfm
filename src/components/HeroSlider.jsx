"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { heroBanners as bannersApi, API_BASE } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";
import { site } from "@/lib/content";
import BannerEditorModal from "./BannerEditorModal";

const ROTATE_MS = 6000;

/**
 * imageUrl 이 절대 URL 이면 그대로, /uploads/* 면 API_BASE prefix, 그 외엔 그대로.
 */
function resolveImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/uploads/")) return `${API_BASE}${url}`;
  return url;
}

/**
 * backend hero_banners row → slide.
 */
function apiToSlide(b) {
  return {
    id: `api-${b.id}`,
    kind: "image",
    src: resolveImageUrl(b.imageUrl),
    href: b.linkUrl || null,
    label: b.label || "",
    active: b.active !== false,
    _api: b,
  };
}

/**
 * content.js fallback → slide (text-only, no image).
 */
function fallbackToSlide(b) {
  return {
    id: b.id,
    kind: "text",
    accent: b.accent,
    kicker: b.kicker,
    title: b.title,
    body: b.body,
    href: b.href || null,
    cta: b.cta || "자세히 보기",
  };
}

function isExternal(href) {
  return Boolean(href) && /^https?:\/\//i.test(href);
}

/**
 * HeroSlider — 홈 상단 슬라이딩 배너.
 *
 *  - backend hero_banners 가 있으면 그게 우선 (이미지 슬라이드).
 *  - 비어있으면 content.js heroSliderFallback (텍스트 카드) 표시.
 *  - 자동 6초 회전. hover/focus 시 pause.
 *  - 좌우 화살표 + 도트 + N/total 카운터.
 *  - 어드민(newbAdmin)이면 우상단 톱니 → 편집 모달.
 *
 *  공원 정자 톤: 양피지 배경에 따뜻한 골드 액센트.
 */
export default function HeroSlider() {
  const { isNewbAdmin } = useCurrentUser();
  const [apiBanners, setApiBanners] = useState(null); // null=로딩, []=비어있음
  const [reloadTick, setReloadTick] = useState(0);
  const [editorOpen, setEditorOpen] = useState(false);

  // backend fetch
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await bannersApi.list({ includeInactive: isNewbAdmin });
        if (!alive) return;
        const items = Array.isArray(res?.items) ? res.items : [];
        setApiBanners(items);
      } catch {
        if (!alive) return;
        setApiBanners([]);
      }
    })();
    return () => { alive = false; };
  }, [isNewbAdmin, reloadTick]);

  // 활성 슬라이드 결정
  const activeApi = (apiBanners ?? [])
    .filter((b) => b.active || isNewbAdmin)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(apiToSlide)
    .filter((s) => !!s.src);

  const fallbackSlides = (site.heroSliderFallback || []).map(fallbackToSlide);
  const slides = activeApi.length > 0 ? activeApi : fallbackSlides;

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback(
    (next) => {
      const n = slides.length;
      if (!n) return;
      setIdx(((next % n) + n) % n);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    timerRef.current = setTimeout(
      () => setIdx((p) => (p + 1) % slides.length),
      ROTATE_MS
    );
    return () => clearTimeout(timerRef.current);
  }, [idx, paused, slides.length]);

  useEffect(() => {
    if (idx >= slides.length && slides.length > 0) {
      setIdx(slides.length - 1);
    }
  }, [slides.length, idx]);

  // 한 장도 없고 어드민도 아니면 아예 안 보임 (fallback 있으니까 실제로는 거의 안 일어남)
  if (!slides.length && !isNewbAdmin) {
    return null;
  }

  const total = slides.length;
  const isApiBanners = activeApi.length > 0;

  return (
    <>
      <section
        className="hero-slider"
        aria-label="추천 배너"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="content-wrap hero-slider__wrap">
          <div className="hero-slider__track" aria-live="polite">
            {slides.map((s, i) => {
              const isActive = i === idx;
              const slideClass = `hero-slider__slide hero-slider__slide--${s.kind}${isActive ? " is-active" : ""}${s.accent ? ` accent-${s.accent}` : ""}`;
              const inner =
                s.kind === "image" ? (
                  <>
                    <img
                      className="hero-slider__img"
                      src={s.src}
                      alt={s.label || "배너"}
                      loading={i === 0 ? "eager" : "lazy"}
                      fetchPriority={i === 0 ? "high" : "auto"}
                    />
                    {s.label ? (
                      <span className="hero-slider__overlay">
                        <span className="hero-slider__overlay-label">{s.label}</span>
                      </span>
                    ) : null}
                    {s._api && !s._api.active && isNewbAdmin ? (
                      <span className="hero-slider__hidden-mark">숨김</span>
                    ) : null}
                  </>
                ) : (
                  <div className="hero-slider__text">
                    <span className="hero-slider__kicker">{s.kicker}</span>
                    <strong className="hero-slider__title">{s.title}</strong>
                    {s.body ? <p className="hero-slider__body">{s.body}</p> : null}
                    {s.cta ? (
                      <span className="hero-slider__cta-hint">{s.cta} →</span>
                    ) : null}
                  </div>
                );

              if (!s.href) {
                return (
                  <div
                    key={s.id}
                    className={slideClass}
                    aria-hidden={isActive ? undefined : true}
                  >
                    {inner}
                  </div>
                );
              }
              if (isExternal(s.href)) {
                return (
                  <a
                    key={s.id}
                    className={slideClass}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-hidden={isActive ? undefined : true}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {inner}
                  </a>
                );
              }
              return (
                <Link
                  key={s.id}
                  className={slideClass}
                  href={s.href}
                  aria-hidden={isActive ? undefined : true}
                  tabIndex={isActive ? 0 : -1}
                >
                  {inner}
                </Link>
              );
            })}
          </div>

          {!isApiBanners ? (
            <span className="hero-slider__source-tag" aria-hidden="true">
              미리보기 · 어드민이 배너를 등록하면 자동 교체
            </span>
          ) : null}

          <span className="hero-slider__counter" aria-hidden="true">
            <strong>{String(idx + 1).padStart(2, "0")}</strong>
            <span>/</span>
            <span>{String(total).padStart(2, "0")}</span>
          </span>

          {total > 1 ? (
            <>
              <button
                type="button"
                className="hero-slider__nav hero-slider__nav--prev"
                onClick={prev}
                aria-label={`이전 배너 — 현재 ${idx + 1}/${total}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                type="button"
                className="hero-slider__nav hero-slider__nav--next"
                onClick={next}
                aria-label={`다음 배너 — 현재 ${idx + 1}/${total}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div
                className="hero-slider__dots"
                role="tablist"
                aria-label="배너 선택"
              >
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === idx}
                    aria-label={`${i + 1}번 배너`}
                    className={`hero-slider__dot${i === idx ? " is-active" : ""}`}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
            </>
          ) : null}

          {isNewbAdmin ? (
            <button
              type="button"
              className="hero-slider__gear"
              aria-label="배너 관리 (운영자)"
              title="배너 관리"
              onClick={() => setEditorOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M19.43 12.98a7.83 7.83 0 0 0 0-1.96l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.66 7.66 0 0 0-1.69-.98l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65a7.83 7.83 0 0 0 0 1.96L2.46 14.6a.5.5 0 0 0-.12.64l2 3.46c.14.24.43.34.69.24l2.42-1c.52.4 1.08.73 1.69.98l.38 2.65c.04.24.25.43.5.43h4c.25 0 .46-.19.5-.43l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.42 1a.5.5 0 0 0 .61-.24l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </section>

      {editorOpen && isNewbAdmin ? (
        <BannerEditorModal
          banners={apiBanners ?? []}
          onClose={() => setEditorOpen(false)}
          onChanged={() => setReloadTick((t) => t + 1)}
        />
      ) : null}
    </>
  );
}
