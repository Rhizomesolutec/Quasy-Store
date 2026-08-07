/**
 * Update local /images/ path extensions to .webp in source files.
 * Allows spaces and parentheses in paths. Does not touch remote URLs.
 * Run: node scripts/update-image-refs.mjs
 */
import fs from "fs";
import path from "path";

const ROOTS = ["app", "components", "lib", "data"];
const FILE_RE = /\.(tsx?|jsx?|json|css|mjs)$/;
const SKIP = new Set(["node_modules", ".next"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (FILE_RE.test(entry.name)) out.push(full);
  }
  return out;
}

function rewrite(content) {
  // Local /images/... paths (spaces, parentheses, %20 ok)
  return content.replace(
    /(\/images\/[^"'`]+?)\.(jpe?g|png|gif|bmp)\b/gi,
    "$1.webp"
  );
}

const files = ROOTS.flatMap((r) => walk(r));
let changed = 0;

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = rewrite(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed++;
    console.log("updated", file);
  }
}

console.log(`Done. Updated ${changed} files.`);
