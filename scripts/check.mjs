import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const contentPath = resolve(root, "src", "content.js");
const htmlPath = resolve(root, "src", "index.html");
const appPath = resolve(root, "src", "app.js");
const cssPath = resolve(root, "src", "assets", "styles.css");

const [contentJs, html, app, css] = await Promise.all([
  readFile(contentPath, "utf8"),
  readFile(htmlPath, "utf8"),
  readFile(appPath, "utf8"),
  readFile(cssPath, "utf8")
]);

const context = {};
const script = new Function("window", contentJs);
script(context);

const sites = context.DNFM_SITES;
const problems = [];

if (!sites?.training || !sites?.allow) {
  problems.push("training and allow site configs are required.");
}

for (const site of Object.values(sites || {})) {
  if (!site.title || !site.eyebrow || !site.hero?.headline) {
    problems.push(`${site.id}: title, eyebrow, and hero headline are required.`);
  }

  if (!Array.isArray(site.actions) || site.actions.length < 3) {
    problems.push(`${site.id}: at least three actions are required.`);
  }

  for (const action of site.actions) {
    if (!action.url && !action.reason) {
      problems.push(`${site.id}: disabled action "${action.label}" needs a reason.`);
    }
  }

  for (const group of site.linkGroups || []) {
    for (const link of group.links) {
      if (!link.url && !link.reason) {
        problems.push(`${site.id}: disabled link "${link.label}" needs a reason.`);
      }
    }
  }
}

if (!html.includes("content.js") || !html.includes("app.js")) {
  problems.push("index.html must load content.js and app.js.");
}

if (!app.includes("allow.dnfm.kr") && !contentJs.includes("allow.dnfm.kr")) {
  problems.push("allow.dnfm.kr routing must be represented.");
}

if (/#[0-9a-fA-F]{3,8}/.test(app)) {
  problems.push("app.js should not contain raw color values.");
}

if (!css.includes("@media (max-width: 720px)")) {
  problems.push("mobile breakpoint is missing.");
}

if (problems.length) {
  console.error(problems.map((problem) => `- ${problem}`).join("\n"));
  process.exit(1);
}

console.log("Static project checks passed.");
