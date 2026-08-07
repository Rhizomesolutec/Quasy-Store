import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { createAdminClient } from "@/utils/supabase/admin";

export const runtime = "nodejs";

const BUCKET = "product-images";
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

async function saveLocally(bytes: Uint8Array, fileName: string) {
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
      upsert: false,
      cacheControl: "3600",
    });

  let { error: uploadError } = await attemptUpload();

  // Create the bucket once if it doesn't exist, then retry.
  if (uploadError && /bucket|not found|does not exist/i.test(uploadError.message)) {
    const { error: createError } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
    });

    if (createError && !/already exists/i.test(createError.message)) {
      throw new Error(`Unable to create storage bucket: ${createError.message}`);
    }

    ({ error: uploadError } = await attemptUpload());
  }

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
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

    // Some browsers send an empty MIME type; allow by extension in that case.
    const typeOk =
      ALLOWED_TYPES.has(file.type) ||
      (!file.type && ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext));

    if (!typeOk) {
      return NextResponse.json(
        { error: "Unsupported file type. Use PNG, JPG, WEBP, GIF, or AVIF." },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Image must be between 1 byte and 5MB." },
        { status: 400 }
      );
    }

    const input = Buffer.from(await file.arrayBuffer());
    const webpBuffer = await sharp(input)
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
    const bytes = new Uint8Array(webpBuffer);

    const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.webp`;
    const remotePath = `products/${fileName}`;
    const contentType = "image/webp";

    try {
      const url = await uploadToSupabase(bytes, remotePath, contentType);
      return NextResponse.json({ success: true, url, path: remotePath, storage: "supabase" });
    } catch (storageError) {
      console.error("Supabase storage upload failed, using local fallback:", storageError);
      const url = await saveLocally(bytes, fileName);
      return NextResponse.json({
        success: true,
        url,
        path: url,
        storage: "local",
        warning:
          storageError instanceof Error
            ? `Cloud storage unavailable (${storageError.message}). Saved locally instead.`
            : "Cloud storage unavailable. Saved locally instead.",
      });
    }
  } catch (error) {
    console.error("Admin upload API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while uploading image",
      },
      { status: 500 }
    );
  }
}
