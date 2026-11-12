import type { Product } from "@/lib/types";

export const LINE_MARKER = "__line:";

export type ShowcaseLine = {
  slug: string;
  name: string;
  eyebrow: string;
  note: string;
  stamp: string;
  stampColor: string;
  channel: string;
  image: string;
  subs: string[];
};

export const SHOWCASE_LINES: ShowcaseLine[] = [
  {
    slug: "handmade",
    name: "Handmade",
    eyebrow: "From the Bench",
    note: "Cast, filed, and finished by hand — workshop originals.",
    stamp: "Handmade",
    stampColor: "#ED5903",
    channel: "01",
    image: "/images/showcase/handmade.webp",
    subs: [
      "Necklace",
      "Bracelet",
      "Bag",
      "Keychain",
      "Pant chain",
      "Pendant",
      "Glow in the dark necklace",
      "Resin necklace",
    ],
  },
  {
    slug: "hand-picked",
    name: "Hand Picked",
    eyebrow: "For the Wrist",
    note: "Pieces we pick by hand — necklaces, bracelets, watches, and more.",
    stamp: "Hand Picked",
    stampColor: "#FFD400",
    channel: "02",
    image: "/images/showcase/hand-picked.webp",
    subs: [
      "Necklace",
      "Bracelet",
      "Jacket",
      "Ring",
      "Keychain",
      "Pant",
      "T shirt",
      "Watch",
      "Pendant",
      "Cap",
      "Shirt",
      "Hoodie",
    ],
  },
  {
    slug: "qusay-made",
    name: "Qusay Made",
    eyebrow: "House Line",
    note: "Apparel and merch made under the Qusay name.",
    stamp: "Qusay Made",
    stampColor: "#FFFFFF",
    channel: "03",
    image: "/images/showcase/qusay-made.webp",
    subs: ["Jacket", "T shirt", "Mhr merch", "Shirt", "Pant", "Perfume"],
  },
  {
    slug: "toys",
    name: "Toys",
    eyebrow: "Play Vault",
    note: "Figures, metal cars, and games from the vault.",
    stamp: "Toys",
    stampColor: "#ED5903",
    channel: "04",
    image: "/images/showcase/toys.webp",
    subs: ["Action figure", "Metal cars", "Games"],
  },
  {
    slug: "crystals",
    name: "Crystals",
    eyebrow: "Stone Drawer",
    note: "Crystals and stones — no extra drawers, just the pieces.",
    stamp: "Crystals",
    stampColor: "#FFD400",
    channel: "05",
    image: "/images/showcase/crystals.webp",
    subs: [],
  },
];

const SUB_TO_SHOP: Record<string, string> = {
  necklace: "Necklaces",
  bracelet: "Bracelets",
  bag: "Denim Sling Bag",
  keychain: "Key Chain",
  "pant chain": "Pant Hook Chain",
  pendant: "Pendant",
  jacket: "Jacket",
  ring: "Ring",
  pant: "Pant",
  "t shirt": "T shirt",
  watch: "Watch",
  cap: "Cap",
  shirt: "Shirt",
  hoodie: "Hoodie",
  "glow in the dark necklace": "Glow Dark Necklace",
  "resin necklace": "Resin necklace",
  perfume: "Perfume",
  "mhr merch": "Mhr merch",
  "action figure": "Action figure",
  "metal cars": "Metal cars",
  games: "Games",
};

export function getShowcaseLine(slugOrName: string) {
  const value = decodeURIComponent(slugOrName).toLowerCase().replace(/_/g, "-");
  return SHOWCASE_LINES.find(
    (line) =>
      line.slug === value ||
      line.name.toLowerCase() === value ||
      line.name.toLowerCase().replace(/\s+/g, "-") === value
  );
}

export function shopCategoryForSub(sub: string) {
  return SUB_TO_SHOP[sub.toLowerCase()] || sub;
}

export function subToSlug(sub: string) {
  return sub.toLowerCase().replace(/\s+/g, "-");
}

export function findSub(line: ShowcaseLine, slug: string) {
  const value = decodeURIComponent(slug).toLowerCase();
  return line.subs.find(
    (sub) => subToSlug(sub) === value || sub.toLowerCase() === value
  );
}

export function parseLineFromDetails(details: string[] | undefined) {
  const row = (details || []).find((item) => item.startsWith(LINE_MARKER));
  return row ? row.slice(LINE_MARKER.length).trim() : "";
}

export function stripLineFromDetails(details: string[] | undefined) {
  return (details || []).filter((item) => !item.startsWith(LINE_MARKER));
}

export function withLineInDetails(details: string[], line: string) {
  const clean = stripLineFromDetails(details);
  return line ? [`${LINE_MARKER}${line}`, ...clean] : clean;
}

export function productLineName(product: Product) {
  if (product.line) return product.line;
  const fromDetails = parseLineFromDetails(product.details);
  if (fromDetails) return fromDetails;
  const category = product.category.toLowerCase();
  const match = SHOWCASE_LINES.find(
    (line) =>
      category === line.name.toLowerCase() ||
      category === line.slug.replace(/-/g, " ")
  );
  return match?.name || "";
}

export function isShowcaseCategory(name: string) {
  const value = name.toLowerCase();
  return SHOWCASE_LINES.some(
    (line) => value === line.name.toLowerCase() || value === line.slug.replace(/-/g, " ")
  );
}

function hasExplicitLine(product: Product) {
  return Boolean(product.line || parseLineFromDetails(product.details) || isShowcaseCategory(product.category));
}

export function matchesSub(product: Product, sub: string) {
  const category = product.category.toLowerCase().trim();
  const name = product.name.toLowerCase();
  const key = sub.toLowerCase();
  const shop = shopCategoryForSub(sub).toLowerCase();
  const isGlowNecklace =
    (category.includes("glow") && category.includes("necklace")) ||
    (name.includes("glow") && name.includes("necklace"));
  const isResinNecklace =
    (category.includes("resin") && category.includes("necklace")) ||
    (name.includes("resin") && name.includes("necklace"));
  if (category === shop || category === key) {
    if (key === "necklace" && (isGlowNecklace || isResinNecklace)) return false;
    return true;
  }
  if (key === "necklace") {
    return category.includes("necklace") && !isGlowNecklace && !isResinNecklace;
  }
  if (key === "glow in the dark necklace") {
    return (
      (category.includes("glow") && category.includes("necklace")) ||
      (name.includes("glow") && name.includes("necklace"))
    );
  }
  if (key === "resin necklace") {
    return (
      (category.includes("resin") && category.includes("necklace")) ||
      (name.includes("resin") && name.includes("necklace"))
    );
  }
  if (key === "hoodie") return category.includes("hoodie") || name.includes("hoodie");
  if (key === "shirt") return category === "shirt" || category === "shirts";
  if (key === "bracelet") return category.includes("bracelet") || category.includes("cuff");
  if (key === "watch") return category.includes("watch");
  if (key === "bag") return category.includes("bag") || category.includes("sling");
  if (key === "keychain") return category.includes("key chain") || category.includes("keychain");
  if (key === "pant chain") return category.includes("pant hook") || category.includes("pant chain");
  if (key === "pendant") return category.includes("pendant");
  return false;
}

export function belongsToLine(product: Product, line: ShowcaseLine) {
  const named = productLineName(product).toLowerCase();
  if (named && named === line.name.toLowerCase()) return true;

  if (hasExplicitLine(product)) return false;

  if (line.slug === "handmade") {
    return ["necklace", "pendant"].some((kind) =>
      product.category.toLowerCase().includes(kind)
    );
  }
  if (line.slug === "hand-picked") {
    return ["bracelet", "watch", "cuff"].some((kind) =>
      product.category.toLowerCase().includes(kind)
    );
  }
  return false;
}

export function filterShowcaseLine(products: Product[], line: ShowcaseLine) {
  return products.filter((p) => belongsToLine(p, line));
}

export function filterShowcaseSub(products: Product[], line: ShowcaseLine, sub: string) {
  const inLine = filterShowcaseLine(products, line);
  return inLine.filter((p) => matchesSub(p, sub));
}

const CARD_IMAGES: Record<string, string> = {
  "handmade:necklace": "/images/showcase/subs/handmade-necklace.webp",
  "handmade:bracelet": "/images/showcase/subs/handmade-bracelet.webp",
  "handmade:bag": "/images/showcase/subs/handmade-bag.webp",
  "handmade:keychain": "/images/showcase/subs/handmade-keychain.webp",
  "handmade:pant chain": "/images/showcase/subs/handmade-pant-chain.webp",
  "handmade:pendant": "/images/showcase/subs/handmade-pendant.webp",
  "handmade:glow in the dark necklace": "/images/showcase/subs/handmade-glow-necklace.webp",
  "handmade:resin necklace": "/images/showcase/subs/handmade-resin-necklace.webp",

  "hand-picked:necklace": "/images/showcase/subs/handpicked-necklace.webp",
  "hand-picked:bracelet": "/images/showcase/subs/handpicked-bracelet.webp",
  "hand-picked:jacket": "/images/showcase/subs/handpicked-jacket.webp",
  "hand-picked:ring": "/images/showcase/subs/handpicked-ring.webp",
  "hand-picked:keychain": "/images/showcase/subs/handpicked-keychain.webp",
  "hand-picked:pant": "/images/showcase/subs/handpicked-pant.webp",
  "hand-picked:t shirt": "/images/showcase/subs/handpicked-tshirt.webp",
  "hand-picked:watch": "/images/showcase/subs/handpicked-watch.webp",
  "hand-picked:pendant": "/images/showcase/subs/handpicked-pendant.webp",
  "hand-picked:cap": "/images/showcase/subs/handpicked-cap.webp",
  "hand-picked:shirt": "/images/showcase/subs/handpicked-shirt.webp",
  "hand-picked:hoodie": "/images/showcase/subs/handpicked-hoodie.webp",

  "qusay-made:jacket": "/images/showcase/subs/qusaymade-jacket.webp",
  "qusay-made:t shirt": "/images/showcase/subs/qusaymade-tshirt.webp",
  "qusay-made:mhr merch": "/images/showcase/subs/qusaymade-mhr-merch.webp",
  "qusay-made:shirt": "/images/showcase/subs/qusaymade-shirt.webp",
  "qusay-made:pant": "/images/showcase/subs/qusaymade-pant.webp",
  "qusay-made:perfume": "/images/showcase/subs/qusaymade-perfume.webp",

  "toys:action figure": "/images/showcase/subs/toys-action-figure.webp",
  "toys:metal cars": "/images/showcase/subs/toys-metal-cars.webp",
  "toys:games": "/images/showcase/subs/toys-games.webp",
};

export function imageForSub(line: ShowcaseLine, sub: string, _products: Product[] = []) {
  return CARD_IMAGES[`${line.slug}:${sub.toLowerCase()}`] || line.image;
}
