import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = process.env.OUT_DIR || "C:/academy/dnfm/_artifacts/qa-click-test/2026-05-14-hero-cross-local";
await mkdir(OUT, { recursive: true });

const themes = ["moonlight", "elvenguard", "campfire"];
const pages = [
  { path: "/", name: "home" },
  { path: "/board", name: "board" },
  { path: "/events", name: "events" },
  { path: "/guide", name: "guide" },
];

const browser = await chromium.launch();
const summary = [];

async function run(label, viewport, deviceDescriptor) {
  const ctx = await browser.newContext({
    viewport,
    ...(deviceDescriptor ? deviceDescriptor : {}),
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => summary.push(`[${label}] pageerror: ${e.message}`));

  // warm up — 첫 dev 컴파일은 오래 걸리니 통과만
  await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForSelector(".hero-video", { timeout: 60000 });

  for (const theme of themes) {
    // 1) home 으로 와서 그 테마로 클릭
    await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForSelector(".hero-video", { timeout: 30000 });
    await page.click(`.hero-video__chip[data-theme="${theme}"]`);
    await page.waitForTimeout(800);
    const stored = await page.evaluate(() => localStorage.getItem("dnfm.hero.theme"));
    summary.push(`[${label}] set theme = ${theme} (ls=${stored})`);

    // 2) 다른 페이지 진입 — ThemeBootstrap 이 적용했는지
    for (const pg of pages) {
      await page.goto(BASE + pg.path + "?_=" + Date.now(), { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(700);
      const themeAttr = await page.getAttribute("html", "data-hero-theme");
      const siteBg = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--site-bg").trim());
      const accent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--theme-accent").trim());
      const overflowX = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      summary.push(`[${label}] ${theme} → ${pg.path} html=${themeAttr} accent=${accent} overflowX=${overflowX} site-bg(len)=${siteBg.length}`);
      await page.screenshot({ path: `${OUT}/${label}_${theme}_${pg.name}.png`, fullPage: false });
    }
  }
  await ctx.close();
}

await run("desktop_1366", { width: 1366, height: 768 });
await run("mobile_390", { width: 390, height: 844 }, devices["iPhone 13"]);

await browser.close();
console.log("\n=== QA SUMMARY ===");
for (const line of summary) console.log(line);
console.log(`\nDONE → ${OUT}`);
