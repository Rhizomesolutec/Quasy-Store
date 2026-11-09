import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createAdminClient } from "@/utils/supabase/admin";
import {
  PRODUCT_IMAGE_BUCKET,
  PRODUCT_IMAGE_MAX_BYTES,
  PRODUCT_IMAGE_PREFIX,
} from "@/lib/imageStorage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const IS_PRODUCTION = Boolean(process.env.VERCEL);
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/pjpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
]);
const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "heic", "heif"]);
const ALLOWED_SHARP_FORMATS = new Set(["jpeg", "png", "webp", "gif", "avif", "heif", "tiff"]);

function errorText(error: unknown) {
  if (!error) return "Unknown error";
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object") {
    const row = error as {
      message?: string;
      error?: string;
      details?: string;
      hint?: string;
      statusCode?: string | number;
    };
    const parts = [row.message, row.error, row.details, row.hint, row.statusCode]
      .map((part) => (part == null ? "" : String(part)))
      .filter(Boolean);
    if (parts.length > 0) return parts.join(" — ");
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function logUpload(
  level: "info" | "warn" | "error",
  event: string,
  extra: Record<string, unknown> = {}
) {
  const payload = {
    scope: "admin/upload",
    event,
    ...extra,
    ts: new Date().toISOString(),
  };
  const line = JSON.stringify(payload);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.info(line);
}

function isQuotaError(message: string) {
  return /quota|exceeded.*storage|storage.*limit|maximum allowed size|payload too large|entity too large|insufficient storage|413|507/i.test(
    message
  );
}

function sniffImage(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return "gif";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return "webp";
  }
  // ISO BMFF: ....ftyp (AVIF / HEIC / HEIF)
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    const brand = buf.toString("ascii", 8, 12).toLowerCase();
    if (brand.includes("avif") || brand === "avis") return "avif";
    if (brand.includes("heic") || brand.includes("heif") || brand === "mif1") return "heif";
    return "heif";
  }
  const head = buf.subarray(0, 256).toString("utf8").trim().toLowerCase();
  if (head.startsWith("<svg") || head.startsWith("<?xml") || head.startsWith("<!doctype") || head.startsWith("<html")) {
    return "xml";
  }
  return null;
}

async function inspectImage(input: Buffer) {
  const sniffed = sniffImage(input);
  if (sniffed === "xml") {
    throw new Error("SVG and HTML files are not allowed.");
  }

  const sharp = (await import("sharp")).default;
  sharp.cache(false);
  sharp.concurrency(1);
  const meta = await sharp(input, { failOn: "none", animated: false }).metadata();
  const format = (meta.format || sniffed || "").toLowerCase();

  if (!format || !ALLOWED_SHARP_FORMATS.has(format)) {
    throw new Error("File is not a supported image. Use JPG, PNG, or WEBP.");
  }
  if (!meta.width || !meta.height) {
    throw new Error("Image has no readable dimensions.");
  }

  return { format, width: meta.width, height: meta.height, sniffed };
}

async function convertUpload(input: Buffer) {
  const sharp = (await import("sharp")).default;
  sharp.cache(false);
  sharp.concurrency(1);
  const pipeline = () =>
    sharp(input, { failOn: "none", animated: false }).rotate().resize(1600, 1600, {
      fit: "inside",
      withoutEnlargement: true,
    });

  try {
    const webp = await pipeline().webp({ quality: 80, effort: 2 }).toBuffer();
    if (!webp.length) throw new Error("empty webp");
    return { bytes: webp, contentType: "image/webp", ext: "webp" as const };
  } catch {
    const jpeg = await pipeline().jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    if (!jpeg.length) throw new Error("empty jpeg");
    return { bytes: jpeg, contentType: "image/jpeg", ext: "jpg" as const };
  }
}

async function saveLocally(bytes: Uint8Array, fileName: string) {
  if (IS_PRODUCTION) {
    throw new Error("Local disk is read-only on the live server. Cloud storage is required.");
  }
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), bytes);
  return `/uploads/products/${fileName}`;
}

async function ensurePublicBucket(
  supabase: ReturnType<typeof createAdminClient>
) {
  const { data, error } = await supabase.storage.getBucket(PRODUCT_IMAGE_BUCKET);

  if (error && /not found|does not exist/i.test(errorText(error))) {
    const { error: createError } = await supabase.storage.createBucket(PRODUCT_IMAGE_BUCKET, {
      public: true,
      fileSizeLimit: PRODUCT_IMAGE_MAX_BYTES,
    });
    if (createError && !/already exists/i.test(errorText(createError))) {
      throw new Error(`Unable to create storage bucket: ${errorText(createError)}`);
    }
    logUpload("info", "bucket_created", { bucket: PRODUCT_IMAGE_BUCKET, public: true });
    return;
  }

  if (error) {
    throw new Error(`Unable to read storage bucket: ${errorText(error)}`);
  }

  if (data && data.public !== true) {
    const { error: updateError } = await supabase.storage.updateBucket(PRODUCT_IMAGE_BUCKET, {
      public: true,
      fileSizeLimit: PRODUCT_IMAGE_MAX_BYTES,
    });
    if (updateError) {
      throw new Error(`Unable to mark storage bucket public: ${errorText(updateError)}`);
    }
    logUpload("warn", "bucket_marked_public", { bucket: PRODUCT_IMAGE_BUCKET });
  }
}

async function assertPubliclyReadable(url: string) {
  const request = async (method: "HEAD" | "GET") =>
    fetch(url, {
      method,
      cache: "no-store",
      redirect: "follow",
      headers: method === "GET" ? { Range: "bytes=0-31" } : undefined,
      signal: AbortSignal.timeout(8000),
    });

  let res: Response;
  try {
    res = await request("HEAD");
    if (res.status === 405 || res.status === 501 || res.status === 403 || !res.ok) {
      res = await request("GET");
    }
  } catch (error) {
    throw new Error(`Public image URL is not reachable: ${errorText(error)}`);
  }

  if (!res.ok) {
    throw new Error(`Public image URL returned HTTP ${res.status}.`);
  }

  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  if (
    contentType &&
    !contentType.startsWith("image/") &&
    contentType !== "application/octet-stream"
  ) {
    throw new Error(`Public URL did not return an image (${contentType || "unknown type"}).`);
  }
}

async function uploadToSupabase(
  bytes: Uint8Array,
  filePath: string,
  contentType: string
) {
  const supabase = createAdminClient();
  await ensurePublicBucket(supabase);

  const attemptUpload = (pathToUse: string) =>
    supabase.storage.from(PRODUCT_IMAGE_BUCKET).upload(pathToUse, bytes, {
      contentType,
      upsert: false,
      cacheControl: "31536000",
    });

  let remotePath = filePath;
  let { error: uploadError } = await attemptUpload(remotePath);

  if (uploadError && /exists|duplicate|already/i.test(errorText(uploadError))) {
    remotePath = `${PRODUCT_IMAGE_PREFIX}${Date.now()}-${randomUUID().slice(0, 8)}-${path.posix.basename(filePath)}`;
    ({ error: uploadError } = await attemptUpload(remotePath));
  }

  if (uploadError) {
    const message = errorText(uploadError);
    if (isQuotaError(message)) {
      const quotaError = new Error(`STORAGE_QUOTA: ${message}`);
      throw quotaError;
    }
    throw new Error(message);
  }

  const { data: urlData } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(remotePath);
  if (!urlData?.publicUrl) {
    throw new Error("Upload succeeded but no public URL was returned.");
  }

  try {
    await assertPubliclyReadable(urlData.publicUrl);
  } catch (verifyError) {
    logUpload("error", "public_url_unverified", {
      path: remotePath,
      url: urlData.publicUrl,
      error: errorText(verifyError),
    });
    throw new Error(
      `Image uploaded but is not publicly readable. Check that the ${PRODUCT_IMAGE_BUCKET} bucket is public.`
    );
  }

  return { url: urlData.publicUrl, path: remotePath };
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("qusay_admin_session")?.value;
    if (adminSession !== "true") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const rawExt = file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase()
      : undefined;
    const ext = rawExt && /^[a-z0-9]+$/i.test(rawExt) ? rawExt : "";

    const declaredType = (file.type || "").toLowerCase();
    const typeOk =
      ALLOWED_TYPES.has(declaredType) ||
      (!declaredType && ALLOWED_EXT.has(ext));

    if (!typeOk) {
      logUpload("warn", "rejected_mime", {
        type: declaredType,
        ext,
        size: file.size,
        name: file.name,
      });
      return NextResponse.json(
        { error: "Unsupported file type. Use PNG, JPG, or WEBP." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > PRODUCT_IMAGE_MAX_BYTES) {
      logUpload("warn", "rejected_size", { size: file.size, name: file.name });
      return NextResponse.json(
        { error: "Image must be 4MB or smaller for live upload." },
        { status: 400 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    if (input.byteLength <= 0 || input.byteLength > PRODUCT_IMAGE_MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be 4MB or smaller for live upload." },
        { status: 400 }
      );
    }

    let inspected;
    try {
      inspected = await inspectImage(input);
    } catch (inspectError) {
      logUpload("warn", "rejected_format", {
        type: declaredType,
        ext,
        size: input.byteLength,
        error: errorText(inspectError),
      });
      return NextResponse.json(
        { error: errorText(inspectError) || "File is not a supported image." },
        { status: 400 }
      );
    }

    const isHeic = inspected.format === "heif" || inspected.sniffed === "heif";

    let bytes: Uint8Array;
    let contentType: string;
    let fileName: string;

    try {
      const converted = await convertUpload(input);
      bytes = new Uint8Array(converted.bytes);
      contentType = converted.contentType;
      fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${converted.ext}`;
    } catch (convertError) {
      logUpload("warn", "convert_failed", {
        format: inspected.format,
        error: errorText(convertError),
      });
      if (isHeic) {
        return NextResponse.json(
          {
            error:
              "This photo format is not supported in the browser. Upload a JPG, PNG, or WEBP instead.",
          },
          { status: 400 }
        );
      }
      if (!["jpeg", "png", "webp", "gif"].includes(inspected.format)) {
        return NextResponse.json(
          { error: "Could not convert this image. Upload a JPG, PNG, or WEBP instead." },
          { status: 400 }
        );
      }
      bytes = new Uint8Array(input);
      contentType =
        inspected.format === "png"
          ? "image/png"
          : inspected.format === "webp"
            ? "image/webp"
            : inspected.format === "gif"
              ? "image/gif"
              : "image/jpeg";
      fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${inspected.format === "jpeg" ? "jpg" : inspected.format}`;
    }

    const remotePath = `${PRODUCT_IMAGE_PREFIX}${fileName}`;

    try {
      const stored = await uploadToSupabase(bytes, remotePath, contentType);
      logUpload("info", "upload_verified", {
        path: stored.path,
        bytes: bytes.byteLength,
        contentType,
        format: inspected.format,
        width: inspected.width,
        height: inspected.height,
      });
      return NextResponse.json({
        success: true,
        url: stored.url,
        path: stored.path,
        storage: "supabase",
        verified: true,
      });
    } catch (storageError) {
      const message = errorText(storageError);
      logUpload("error", "supabase_upload_failed", {
        path: remotePath,
        bytes: bytes.byteLength,
        contentType,
        production: IS_PRODUCTION,
        quota: isQuotaError(message),
        error: message,
      });

      if (isQuotaError(message)) {
        return NextResponse.json(
          {
            error:
              "Cloud image storage is full or over quota. Free space in the product-images bucket and try again.",
          },
          { status: 507 }
        );
      }

      if (IS_PRODUCTION) {
        return NextResponse.json(
          {
            error:
              "Cloud image storage failed. The photo was not saved. Try again in a moment.",
          },
          { status: 502 }
        );
      }

      const url = await saveLocally(bytes, fileName);
      logUpload("warn", "local_fallback", { url, path: url });
      return NextResponse.json({
        success: true,
        url,
        path: url,
        storage: "local",
        verified: false,
        warning:
          "Cloud storage unavailable. Saved locally for this development session only.",
      });
    }
  } catch (error) {
    logUpload("error", "unexpected_failure", { error: errorText(error) });
    return NextResponse.json(
      {
        error: "Unexpected error while uploading image",
      },
      { status: 500 }
    );
  }
}
