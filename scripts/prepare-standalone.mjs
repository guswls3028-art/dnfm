import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");

if (!fs.existsSync(standaloneDir)) {
  console.log("[prepare-standalone] skipped: .next/standalone not found");
  process.exit(0);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.rmSync(to, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
  console.log(`[prepare-standalone] copied ${path.relative(root, from)} -> ${path.relative(root, to)}`);
}

copyDir(path.join(root, ".next", "static"), path.join(standaloneDir, ".next", "static"));
copyDir(path.join(root, "public"), path.join(standaloneDir, "public"));
