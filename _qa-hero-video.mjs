import { chromium, devices } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = "C:/academy/dnfm/_artifacts/qa-click-test/2026-05-14-hero-video-local";
await mkdir(OUT, { recursive: true });

const themes = ["moonlight", "elvenguard", "campfire"];

const browser = await chromium.launch();

async function captureViewport(label, viewport, deviceDescriptor) {
  const ctx = await browser.newContext({
    viewport,
    ...(deviceDescriptor ? deviceDescriptor : {}),
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error(`[${label}] pageerror`, e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.error(`[${label}] console.error`, m.text());
  });
  await page.goto(BASE + "/?_=" + Date.now(), { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForSelector(".hero-video", { timeout: 10000 });

  // 첫 진입 (default = moonlight)
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/${label}_01_default.png`, fullPage: false });

  // 각 테마 클릭 → 캡처
  for (const id of themes) {
    await page.click(`.hero-video__chip[data-theme="${id}"]`);
    await page.waitForTimeout(900);
    const themeAttr = await page.getAttribute("html", "data-hero-theme");
    const videoSrc = await page.getAttribute(".hero-video__video", "src");
    const accent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--theme-accent").trim());
    console.log(`[${label}] click ${id} → html[data-hero-theme]=${themeAttr} video.src=${videoSrc} accent=${accent}`);
    await page.screenshot({ path: `${OUT}/${label}_02_${id}.png`, fullPage: false });
  }

  // 페이지 fullPage (마지막 = campfire)
  await page.screenshot({ path: `${OUT}/${label}_03_full.png`, fullPage: true });

  // localStorage 확인
  const stored = await page.evaluate(() => localStorage.getItem("dnfm.hero.theme"));
  console.log(`[${label}] localStorage dnfm.hero.theme = ${stored}`);
  await ctx.close();
}

await captureViewport("desktop_1366", { width: 1366, height: 768 });
await captureViewport("mobile_390", { width: 390, height: 844 }, devices["iPhone 13"]);

await browser.close();
console.log("DONE → " + OUT);
