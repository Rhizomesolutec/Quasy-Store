/**
 * Convert all raster images under public/ to WebP and remove originals.
 * Run: node scripts/convert-to-webp.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve("public");
const EXTS = new Set([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tif", ".tiff"]);
const CONCURRENCY = 8;
const QUALITY = 80;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

async function convertOne(file) {
  const ext = path.extname(file);
  const out = file.slice(0, -ext.length) + ".webp";

  // Skip if webp already newer than source
  if (fs.existsSync(out)) {
    const srcStat = fs.statSync(file);
    const outStat = fs.statSync(out);
    if (outStat.mtimeMs >= srcStat.mtimeMs && outStat.size > 0) {
      fs.unlinkSync(file);
      return { file, status: "exists" };
    }
  }

  const isPng = ext.toLowerCase() === ".png";
  await sharp(file)
    .webp({
      quality: QUALITY,
      alphaQuality: 90,
      effort: 4,
      ...(isPng ? {} : {}),
    })
    .toFile(out);

  fs.unlinkSync(file);
  return { file, status: "converted", out };
}

async function runPool(items, worker, limit) {
  let i = 0;
  let done = 0;
  const errors = [];

  async function workerLoop() {
    while (i < items.length) {
      const idx = i++;
      const item = items[idx];
      try {
        await worker(item);
      } catch (err) {
        errors.push({ file: item, error: String(err?.message || err) });
      } finally {
        done++;
        if (done % 25 === 0 || done === items.length) {
          process.stdout.write(`\rConverted ${done}/${items.length}`);
        }
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => workerLoop()));
  process.stdout.write("\n");
  return errors;
}

const files = walk(ROOT);
console.log(`Found ${files.length} images to convert under public/`);

if (files.length === 0) {
  console.log("Nothing to convert.");
  process.exit(0);
}

const errors = await runPool(files, convertOne, CONCURRENCY);

if (errors.length) {
  console.error(`\n${errors.length} failures:`);
  for (const e of errors.slice(0, 20)) console.error("-", e.file, e.error);
  process.exit(1);
}

console.log("Done. All images converted to WebP.");
