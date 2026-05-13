import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const apps = [
  { dir: "newb", expectedId: "training", domain: "dnfm.kr" },
  { dir: "allow", expectedId: "allow", domain: "allow.dnfm.kr" }
];
const problems = [];

for (const app of apps) {
  const appRoot = resolve(root, app.dir);
  const packagePath = resolve(appRoot, "package.json");
  const contentPath = resolve(appRoot, "src", "lib", "content.js");
  const pagePath = resolve(appRoot, "src", "app", "page.jsx");
  const componentPath = resolve(appRoot, "src", "components", "SitePage.jsx");
  const cssPath = resolve(appRoot, "src", "app", "globals.css");

  for (const requiredPath of [packagePath, contentPath, pagePath, componentPath, cssPath]) {
    if (!existsSync(requiredPath)) {
      problems.push(`${app.dir}: missing ${requiredPath}`);
    }
  }

  if (problems.length) {
    continue;
  }

  const [pkgRaw, content, page, component, css] = await Promise.all([
    readFile(packagePath, "utf8"),
    readFile(contentPath, "utf8"),
    readFile(pagePath, "utf8"),
    readFile(componentPath, "utf8"),
    readFile(cssPath, "utf8")
  ]);

  const pkg = JSON.parse(pkgRaw);

  for (const dependency of ["next", "react", "react-dom"]) {
    if (!pkg.dependencies?.[dependency]) {
      problems.push(`${app.dir}: missing ${dependency} dependency.`);
    }
  }

  if (!content.includes(`id: "${app.expectedId}"`)) {
    problems.push(`${app.dir}: expected site id ${app.expectedId}.`);
  }

  if (!content.includes(app.domain)) {
    problems.push(`${app.dir}: expected domain ${app.domain}.`);
  }

  if (!content.includes("url: null") || !content.includes("reason:")) {
    problems.push(`${app.dir}: placeholder links must stay disabled with reasons.`);
  }

  if (!page.includes("<SitePage site={site} />")) {
    problems.push(`${app.dir}: page must render SitePage with local site content.`);
  }

  if (!component.includes("use client")) {
    problems.push(`${app.dir}: SitePage must be a client component for checklist/filter interactions.`);
  }

  if (!css.includes("@media (max-width: 720px)")) {
    problems.push(`${app.dir}: mobile breakpoint is missing.`);
  }
}

if (problems.length) {
  console.error(problems.map((problem) => `- ${problem}`).join("\n"));
  process.exit(1);
}

console.log("Next.js workspace checks passed.");
