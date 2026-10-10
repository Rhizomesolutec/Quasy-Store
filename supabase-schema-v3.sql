-- ==========================================
-- SUPABASE SCHEMA EXTENSION (v3)
-- WhatsApp checkout: contact + delivery columns on orders
-- ==========================================
-- Safe to re-run. Without this migration the orders API silently falls back
-- to the core columns and the WhatsApp phone number is not persisted.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS "customerPhone" TEXT,
  ADD COLUMN IF NOT EXISTS "paymentMethod" TEXT DEFAULT 'whatsapp'::text,
  ADD COLUMN IF NOT EXISTS "shippingZone" TEXT DEFAULT 'domestic'::text,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS "postalCode" TEXT;

-- Phone is the primary contact for WhatsApp orders, so make lookups cheap.
CREATE INDEX IF NOT EXISTS orders_customer_phone_idx
  ON public.orders ("customerPhone");
