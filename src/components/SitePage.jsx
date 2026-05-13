"use client";

import { useEffect, useMemo, useState } from "react";

function isExternal(url) {
  return url?.startsWith("http");
}

function Action({ action, className = "action-button" }) {
  if (!action.url) {
    return (
      <button
        className={`${className} is-disabled`}
        type="button"
        disabled
        title={action.reason}
        aria-label={`${action.label}: ${action.reason}`}
      >
        {action.label}
      </button>
    );
  }

  return (
    <a
      className={className}
      href={action.url}
      target={isExternal(action.url) ? "_blank" : undefined}
      rel={isExternal(action.url) ? "noreferrer" : undefined}
      data-note={action.note || undefined}
    >
      {action.label}
    </a>
  );
}

function SiteHeader({ site }) {
  return (
    <header className="official-header" aria-label="사이트 헤더">
      <div className="utility-bar">
        <a className="menu-button" href="#main-content" aria-label="본문으로 이동">
          <span aria-hidden="true" />
          메뉴
        </a>
        <a className="publisher-wordmark" href="/" aria-label="dnfm.kr 홈">
          DNFM.KR
        </a>
        <div className="utility-actions" aria-label="회원 메뉴">
          <button type="button" disabled aria-disabled="true">로그인 (준비 중)</button>
        </div>
      </div>

      <div className="game-nav">
        <a className="game-brand" href="/" aria-label={`${site.title} 홈`}>
          <span className="game-emblem" aria-hidden="true">D</span>
          <span>
            <strong>{site.title}</strong>
            <small>{site.eyebrow}</small>
          </span>
        </a>
        <nav className="primary-nav" aria-label="주 메뉴">
          <a href="#news-board">공지</a>
          <a href="#community-board">커뮤니티</a>
          <a href="#training-guide">가이드</a>
          <a href="#quick-links">체크리스트</a>
        </nav>
        <a className="start-button" href="#news-board">
          소식 보기
        </a>
      </div>
    </header>
  );
}

function HeroStage({ site }) {
  return (
    <section className="hero-stage" aria-labelledby="hero-title">
      <div className="hero-visual">
        <img src="/abstract-arad.svg" alt="" aria-hidden="true" />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">{site.hero.kicker}</p>
        <h1 id="hero-title" aria-label={site.hero.headline}>
          {site.hero.headlineLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="hero-body">{site.hero.body}</p>
        <div className="action-row">
          {site.actions.map((action) => (
            <Action action={action} key={action.label} />
          ))}
        </div>
      </div>
    </section>
  );
}

function EventRail({ slides }) {
  return (
    <section className="event-rail" aria-label="주요 안내">
      <div className="event-controls" aria-hidden="true">
        <span>‹</span>
        <strong>1/{slides.length}</strong>
        <span>›</span>
      </div>
      {slides.map((slide) => (
        <article className="event-tab" key={slide.index}>
          <span>{slide.index}</span>
          <strong>{slide.title}</strong>
          <small>{slide.body}</small>
        </article>
      ))}
    </section>
  );
}

function BoardList({ title, id, items, moreUrl }) {
  return (
    <section className="board-panel" id={id} aria-labelledby={`${id}-title`}>
      <div className="board-heading">
        <h2 id={`${id}-title`}>{title}</h2>
        {moreUrl ? (
          <a href={moreUrl} target="_blank" rel="noreferrer">
            더보기
          </a>
        ) : null}
      </div>
      <ul className="board-list">
        {items.map((item) => {
          const content = (
            <>
              <span className="board-label">{item.label}</span>
              <strong>{item.title}</strong>
              <small>{item.meta || "공식 연결"}</small>
            </>
          );

          return (
            <li key={item.title}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer">
                  {content}
                </a>
              ) : (
                <span>{content}</span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Checklist({ site }) {
  const [checked, setChecked] = useState({});

  useEffect(() => {
    const stored = window.localStorage.getItem(site.checklistKey);
    setChecked(stored ? JSON.parse(stored) : {});
  }, [site.checklistKey]);

  function toggle(index, value) {
    const next = { ...checked, [index]: value };
    setChecked(next);
    window.localStorage.setItem(site.checklistKey, JSON.stringify(next));
  }

  return (
    <section className="work-panel checklist-panel" aria-labelledby="checklist-title">
      <div className="section-heading">
        <div>
          <p>{site.eyebrow}</p>
          <h2 id="checklist-title">{site.checklistTitle}</h2>
        </div>
      </div>
      <div className="checklist">
        {site.checklist.map((item, index) => {
          const id = `${site.id}-check-${index}`;

          return (
            <label className="check-row" htmlFor={id} key={item}>
              <input
                id={id}
                type="checkbox"
                checked={Boolean(checked[index])}
                onChange={(event) => toggle(index, event.target.checked)}
              />
              <span>{item}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}

function LinkGroups({ groups }) {
  return groups.map((group) => (
    <article className="link-group" key={group.title}>
      <h3>{group.title}</h3>
      <div className="link-list">
        {group.links.map((link) =>
          link.url ? (
            <a
              href={link.url}
              key={link.label}
              target={isExternal(link.url) ? "_blank" : undefined}
              rel={isExternal(link.url) ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ) : (
            <button type="button" disabled title={link.reason} key={link.label}>
              {link.label}
              <small>{link.reason}</small>
            </button>
          )
        )}
      </div>
    </article>
  ));
}

function Guides({ site }) {
  const [filter, setFilter] = useState("전체");
  const visibleGuides = useMemo(
    () => site.guides.filter((guide) => filter === "전체" || guide.category === filter),
    [filter, site.guides]
  );

  return (
    <section className="guide-zone" id="training-guide" aria-labelledby="guide-title">
      <div className="section-heading">
        <div>
          <p>GUIDE STACK</p>
          <h2 id="guide-title">가이드 보드</h2>
        </div>
      </div>
      <div className="filter-row" role="tablist" aria-label="가이드 필터">
        {site.guideFilters.map((item) => (
          <button
            className={`filter-chip ${filter === item ? "is-active" : ""}`}
            type="button"
            data-filter={item}
            onClick={() => setFilter(item)}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="guide-grid">
        {visibleGuides.map((guide) => (
          <article className="guide-card" data-category={guide.category} key={guide.title}>
            <span>{guide.category}</span>
            <h3>{guide.title}</h3>
            <p>{guide.body}</p>
            <div className="card-action">
              <Action action={{ label: guide.linkLabel, url: guide.url, reason: "링크 등록 전" }} className="text-link" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function SitePage({ site }) {
  return (
    <div className="site-frame" data-theme={site.theme}>
      <SiteHeader site={site} />

      <main id="main-content" tabIndex={-1}>
        <HeroStage site={site} />
        <EventRail slides={site.eventSlides} />

        <div className="content-shell">
          <div className="main-column">
            <div className="board-grid">
              <BoardList
                title="새소식"
                id="news-board"
                items={site.notices}
                moreUrl={site.noticesMoreUrl}
              />
              <BoardList
                title="커뮤니티"
                id="community-board"
                items={site.communityPosts}
                moreUrl={site.communityMoreUrl}
              />
            </div>

            <section className="feature-section" id="today-dnfm" aria-labelledby="feature-title">
              <div className="board-heading">
                <h2 id="feature-title">오늘의 훈련소</h2>
                <span>공식 정보와 톡방 운영을 이어주는 자리</span>
              </div>
              <div className="feature-grid">
                {site.featureCards.map((card) => (
                  <article className="feature-card" data-accent={card.accent} key={card.title}>
                    <h3>{card.title}</h3>
                    <p>{card.body}</p>
                  </article>
                ))}
              </div>
            </section>

            <Guides site={site} />
          </div>

          <aside className="side-column" id="quick-links" aria-label="빠른 메뉴">
            <section className="login-card">
              <div className="login-art" aria-hidden="true">DNF</div>
              <button type="button" disabled aria-disabled="true">로그인 (준비 중)</button>
              <p>로그인은 곧 열립니다. 지금은 톡방에서 운영자에게 문의해 주세요.</p>
            </section>

            <section className="quick-panel" aria-labelledby="quick-title">
              <h2 id="quick-title">바로가기</h2>
              <div className="link-groups">
                <LinkGroups groups={site.linkGroups} />
              </div>
            </section>

            <Checklist site={site} />
          </aside>
        </div>

        <footer className="site-footer">
          <p>{site.footerNote}</p>
          <a href="https://allow.dnfm.kr">허락 페이지</a>
        </footer>
      </main>
    </div>
  );
}
