-- ==========================================
-- SUPABASE SCHEMA EXTENSION (v2)
-- ==========================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  name TEXT PRIMARY KEY,
  description TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Orders Table (Purchase History)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY, -- e.g. 'QS-10482'
  "customerEmail" TEXT NOT NULL,
  "customerName" TEXT NOT NULL,
  items JSONB DEFAULT '[]'::jsonb NOT NULL, -- Array of order items
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'Pending'::text NOT NULL, -- 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  date TEXT NOT NULL, -- YYYY-MM-DD
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Profiles Table (User Details)
CREATE TABLE IF NOT EXISTS public.profiles (
  email TEXT PRIMARY KEY, -- Using email as primary key to match user local sessions
  "fullName" TEXT,
  address TEXT,
  city TEXT,
  "postalCode" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- CONFIGURE RLS & PERMISSIONS FOR CRUD
-- ==========================================

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any conflicting policies if they exist (just in case)
DROP POLICY IF EXISTS "Allow public all access for categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public all access for orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public all access for profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public all access for products" ON public.products;
DROP POLICY IF EXISTS "Allow public all access for collections" ON public.collections;

-- Enable Public ALL (CRUD) Access on all tables
CREATE POLICY "Allow public all access for categories" ON public.categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all access for orders" ON public.orders
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all access for profiles" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all access for products" ON public.products
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all access for collections" ON public.collections
  FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- CREATE PRODUCT IMAGES STORAGE BUCKET
-- ==========================================

-- Insert public bucket configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop storage policies if they exist (to avoid duplicate errors)
DROP POLICY IF EXISTS "Allow public select from product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert into product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from product-images" ON storage.objects;

-- Create public storage RLS policies
CREATE POLICY "Allow public select from product-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow public insert into product-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public delete from product-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'product-images');
