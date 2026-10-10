export const STORE = {
  name: "QUSAY STORE",
  displayName: "Qusay Store",
  email: "storequsay@gmail.com",
  phoneDisplay: "+91 8075 814 037",
  phoneTel: "+918075814037",
  whatsappDigits: "918075814037",
  addressLine: "Chalil Moolakkal, Panayi, Anakkayam",
  city: "Malappuram",
  region: "Kerala",
  country: "India",
  mapsUrl: "https://maps.app.goo.gl/FMoeYEUQJpKiQqWi6?g_st=aw",
  mapsEmbedUrl:
    "https://maps.google.com/maps?q=Chalil%20Moolakkal%2C%20Panayi%2C%20Anakkayam%2C%20Malappuram&z=16&output=embed",
} as const;

export const STORE_ADDRESS = `${STORE.addressLine}, ${STORE.city}, ${STORE.region}, ${STORE.country}`;

export function storeTelHref() {
  return `tel:${STORE.phoneTel}`;
}

export function storeMailHref() {
  return `mailto:${STORE.email}`;
}

export function storeWhatsAppHref(prefill?: string) {
  const base = `https://wa.me/${STORE.whatsappDigits}`;
  return prefill ? `${base}?text=${encodeURIComponent(prefill)}` : base;
}
