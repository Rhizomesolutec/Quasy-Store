import fs from "fs";
import path from "path";

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["node_modules", ".next"].includes(entry.name)) walk(p, out);
    } else if (/\.(tsx?|jsx?|json)$/.test(entry.name)) out.push(p);
  }
  return out;
}

const files = ["app", "components", "lib", "data"].flatMap((r) => walk(r));
let n = 0;
for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  const m = [...t.matchAll(/\/images\/[^"'`]+?\.(jpe?g|png|gif|bmp)\b/gi)];
  if (m.length) {
    n += m.length;
    console.log(f, m.length, m.slice(0, 3).map((x) => x[0]).join(" | "));
  }
}
console.log("remaining /images/ raster refs", n);
