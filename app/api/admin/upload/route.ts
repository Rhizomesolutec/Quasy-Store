import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BUCKET = "product-images";
const MAX_BYTES = 4 * 1024 * 1024;
const IS_VERCEL = Boolean(process.env.VERCEL);
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
]);
const ALLOWED_EXT = ["jpg", "jpeg", "png", "webp", "gif", "avif", "heic", "heif"];

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

async function toWebp(input: Buffer) {
  const sharp = (await import("sharp")).default;
  sharp.cache(false);
  sharp.concurrency(1);
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80, effort: 2 })
    .toBuffer();
}

async function saveLocally(bytes: Uint8Array, fileName: string) {
  if (IS_VERCEL) {
    throw new Error("Local disk is read-only on the live server. Cloud storage is required.");
  }
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, fileName), bytes);
  return `/uploads/products/${fileName}`;
}

async function uploadToSupabase(bytes: Uint8Array, filePath: string, contentType: string) {
  const supabase = createAdminClient();

  const attemptUpload = () =>
    supabase.storage.from(BUCKET).upload(filePath, bytes, {
      contentType,
      upsert: true,
      cacheControl: "3600",
    });

  let { error: uploadError } = await attemptUpload();

  if (uploadError && /bucket|not found|does not exist/i.test(errorText(uploadError))) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
    });

    if (createError && !/already exists/i.test(errorText(createError))) {
      throw new Error(`Unable to create storage bucket: ${errorText(createError)}`);
    }

    await supabase.storage.updateBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
    });

    ({ error: uploadError } = await attemptUpload());
  }

  if (uploadError) {
    throw new Error(errorText(uploadError));
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
  if (!urlData?.publicUrl) {
    throw new Error("Upload succeeded but no public URL was returned.");
  }
  return urlData.publicUrl;
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
    const ext = rawExt && /^[a-z0-9]+$/i.test(rawExt) ? rawExt : "jpg";

    const typeOk =
      ALLOWED_TYPES.has(file.type) ||
      (!file.type && ALLOWED_EXT.includes(ext)) ||
      file.type.startsWith("image/");

    if (!typeOk) {
      return NextResponse.json(
        { error: "Unsupported file type. Use PNG, JPG, or WEBP." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be 4MB or smaller for live upload." },
        { status: 400 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    let bytes: Uint8Array = new Uint8Array(input);
    let contentType = file.type || "image/jpeg";
    let fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${ext === "jpeg" ? "jpg" : ext}`;

    try {
      const webpBuffer = await toWebp(input);
      bytes = new Uint8Array(webpBuffer);
      contentType = "image/webp";
      fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.webp`;
    } catch (convertError) {
      console.warn("Image convert skipped, uploading original:", errorText(convertError));
    }

    const remotePath = `products/${fileName}`;

    try {
      const url = await uploadToSupabase(bytes, remotePath, contentType);
      return NextResponse.json({ success: true, url, path: remotePath, storage: "supabase" });
    } catch (storageError) {
      console.error("Supabase storage upload failed:", errorText(storageError));
      if (IS_VERCEL) {
        return NextResponse.json(
          {
            error: `Cloud image storage failed: ${errorText(storageError)}. Check the product-images bucket and SUPABASE_SERVICE_ROLE_KEY on Vercel.`,
          },
          { status: 502 }
        );
      }
      const url = await saveLocally(bytes, fileName);
      return NextResponse.json({
        success: true,
        url,
        path: url,
        storage: "local",
        warning: `Cloud storage unavailable (${errorText(storageError)}). Saved locally instead.`,
      });
    }
  } catch (error) {
    console.error("Admin upload API error:", error);
    return NextResponse.json(
      {
        error: errorText(error) || "Unexpected error while uploading image",
      },
      { status: 500 }
    );
  }
}
