const sites = window.DNFM_SITES;

const $ = (selector, root = document) => root.querySelector(selector);

function getCurrentSiteId() {
  const params = new URLSearchParams(window.location.search);
  const previewSite = params.get("site");

  if (previewSite && sites[previewSite]) {
    return previewSite;
  }

  const hostname = window.location.hostname.toLowerCase();
  const matched = Object.values(sites).find((site) =>
    site.hostnames.some((host) => host.toLowerCase() === hostname)
  );

  return matched?.id ?? "training";
}

function createAction(action, className = "action-button") {
  if (!action.url) {
    const button = document.createElement("button");
    button.className = `${className} is-disabled`;
    button.type = "button";
    button.disabled = true;
    button.textContent = action.label;
    button.title = action.reason;
    button.setAttribute("aria-label", `${action.label}: ${action.reason}`);
    return button;
  }

  const anchor = document.createElement("a");
  anchor.className = className;
  anchor.href = action.url;
  anchor.textContent = action.label;

  if (action.url.startsWith("http")) {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }

  if (action.note) {
    anchor.dataset.note = action.note;
  }

  return anchor;
}

function renderActions(actions) {
  return actions.map((action) => createAction(action).outerHTML).join("");
}

function renderStats(stats) {
  return stats
    .map(
      (stat) => `
        <article class="stat-tile">
          <strong>${stat.value}</strong>
          <span>${stat.label}</span>
          <small>${stat.detail}</small>
        </article>
      `
    )
    .join("");
}

function renderBriefing(items) {
  return items
    .map(
      (item) => `
        <article class="brief-card" data-accent="${item.accent}">
          <span class="brief-pin" aria-hidden="true"></span>
          <h3>${item.title}</h3>
          <p>${item.body}</p>
        </article>
      `
    )
    .join("");
}

function renderChecklist(site) {
  const stored = JSON.parse(localStorage.getItem(site.checklistKey) || "{}");

  return `
    <section class="work-panel checklist-panel" aria-labelledby="checklist-title">
      <div class="section-heading">
        <p>${site.eyebrow}</p>
        <h2 id="checklist-title">${site.checklistTitle}</h2>
      </div>
      <div class="checklist" data-checklist-key="${site.checklistKey}">
        ${site.checklist
          .map((item, index) => {
            const id = `${site.id}-check-${index}`;
            const checked = stored[index] ? "checked" : "";

            return `
              <label class="check-row" for="${id}">
                <input id="${id}" type="checkbox" data-check-index="${index}" ${checked} />
                <span>${item}</span>
              </label>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderGuideFilters(filters) {
  return filters
    .map(
      (filter, index) => `
        <button class="filter-chip ${index === 0 ? "is-active" : ""}" type="button" data-filter="${filter}">
          ${filter}
        </button>
      `
    )
    .join("");
}

function renderGuides(site) {
  return `
    <section class="guide-zone" aria-labelledby="guide-title">
      <div class="section-heading">
        <p>GUIDE STACK</p>
        <h2 id="guide-title">가이드 보드</h2>
      </div>
      <div class="filter-row" role="tablist" aria-label="가이드 필터">
        ${renderGuideFilters(site.guideFilters)}
      </div>
      <div class="guide-grid">
        ${site.guides
          .map(
            (guide) => `
              <article class="guide-card" data-category="${guide.category}">
                <span>${guide.category}</span>
                <h3>${guide.title}</h3>
                <p>${guide.body}</p>
                <div class="card-action"></div>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderLinkGroups(groups) {
  return groups
    .map(
      (group) => `
        <article class="link-group">
          <h3>${group.title}</h3>
          <div class="link-list">
            ${group.links
              .map((link) => {
                if (!link.url) {
                  return `<button type="button" disabled title="${link.reason}">${link.label}<small>${link.reason}</small></button>`;
                }

                const external = link.url.startsWith("http");
                return `<a href="${link.url}" ${external ? 'target="_blank" rel="noreferrer"' : ""}>${link.label}</a>`;
              })
              .join("")}
          </div>
        </article>
      `
    )
    .join("");
}

function renderTimeline(site) {
  return `
    <section class="timeline-section" id="${site.timelineId || "operations"}" aria-labelledby="timeline-title">
      <div class="section-heading">
        <p>OPERATIONS</p>
        <h2 id="timeline-title">${site.timelineTitle}</h2>
      </div>
      <div class="timeline">
        ${site.timeline
          .map(
            (item) => `
              <article class="timeline-item">
                <span>${item.time}</span>
                <h3>${item.title}</h3>
                <p>${item.body}</p>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderSite(site) {
  document.documentElement.dataset.theme = site.theme;
  document.title = `${site.title} | dnfm.kr`;
  $("#brandTitle").textContent = site.shortTitle;
  $("#brandSubtitle").textContent = site.eyebrow;

  const app = $("#app");
  app.innerHTML = `
    <section class="hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">${site.hero.kicker}</p>
        <h1>${site.hero.headline}</h1>
        <p class="hero-body">${site.hero.body}</p>
        <div class="action-row">
          ${renderActions(site.actions)}
        </div>
      </div>

      <aside class="radar-panel" aria-label="${site.title} 요약">
        <div class="radar-screen" aria-hidden="true">
          <span class="scan-line"></span>
          <span class="node node-a"></span>
          <span class="node node-b"></span>
          <span class="node node-c"></span>
        </div>
        <div class="callout">
          <p>${site.hero.calloutTitle}</p>
          <strong>${site.eyebrow}</strong>
          <span>${site.hero.calloutBody}</span>
        </div>
      </aside>
    </section>

    <section class="stats-grid" aria-label="핵심 운영 지표">
      ${renderStats(site.stats)}
    </section>

    <section class="brief-grid" aria-label="운영 브리핑">
      ${renderBriefing(site.briefing)}
    </section>

    <div class="split-layout">
      ${renderChecklist(site)}
      <section class="work-panel links-panel" aria-labelledby="links-title">
        <div class="section-heading">
          <p>LINK ROUTER</p>
          <h2 id="links-title">바로가기</h2>
        </div>
        <div class="link-groups">
          ${renderLinkGroups(site.linkGroups)}
        </div>
      </section>
    </div>

    ${renderGuides(site)}
    ${renderTimeline(site)}

    <footer class="site-footer">
      <p>${site.footerNote}</p>
    </footer>
  `;

  hydrateGuideCards(site);
  bindChecklist(site);
  bindFilters();
  bindSwitcher(site.id);
}

function hydrateGuideCards(site) {
  $$(".guide-card").forEach((card, index) => {
    const guide = site.guides[index];
    const target = $(".card-action", card);
    target.appendChild(createAction({ label: guide.linkLabel, url: guide.url, reason: "링크 등록 전" }, "text-link"));
  });
}

function bindChecklist(site) {
  const panel = $(`[data-checklist-key="${site.checklistKey}"]`);
  if (!panel) {
    return;
  }

  panel.addEventListener("change", (event) => {
    const input = event.target.closest("[data-check-index]");
    if (!input) {
      return;
    }

    const stored = JSON.parse(localStorage.getItem(site.checklistKey) || "{}");
    stored[input.dataset.checkIndex] = input.checked;
    localStorage.setItem(site.checklistKey, JSON.stringify(stored));
  });
}

function bindFilters() {
  const filterRow = $(".filter-row");
  const cards = Array.from(document.querySelectorAll(".guide-card"));

  if (!filterRow) {
    return;
  }

  filterRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) {
      return;
    }

    $(".filter-chip.is-active", filterRow)?.classList.remove("is-active");
    button.classList.add("is-active");

    const filter = button.dataset.filter;
    cards.forEach((card) => {
      const isVisible = filter === "전체" || card.dataset.category === filter;
      card.hidden = !isVisible;
    });
  });
}

function bindSwitcher(activeSiteId) {
  document.querySelectorAll("[data-site-link]").forEach((link) => {
    const isActive = link.dataset.siteLink === activeSiteId;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
}

function $$(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

renderSite(sites[getCurrentSiteId()]);
