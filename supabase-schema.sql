-- ==========================================
-- SUPABASE DATABASE SCHEMA FOR QUSAY STORE
-- ==========================================

-- 1. Create Collections Table
CREATE TABLE public.collections (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE public.products (
  id TEXT PRIMARY KEY, -- Using TEXT to match your mock IDs ('1', '2', etc.). Can default to gen_random_uuid() for new entries.
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  collection TEXT REFERENCES public.collections(slug) ON DELETE SET NULL,
  price NUMERIC NOT NULL,
  "compareAtPrice" NUMERIC,
  images TEXT[] DEFAULT '{}'::text[] NOT NULL,
  colors JSONB DEFAULT '[]'::jsonb NOT NULL, -- Format: [{"name": "Aged Sterling Silver", "hex": "#B9B4AA"}]
  sizes TEXT[] DEFAULT '{}'::text[] NOT NULL,
  rating NUMERIC DEFAULT 0 NOT NULL,
  "reviewCount" INTEGER DEFAULT 0 NOT NULL,
  "isNew" BOOLEAN DEFAULT false NOT NULL,
  "isBestSeller" BOOLEAN DEFAULT false NOT NULL,
  "inStock" BOOLEAN DEFAULT true NOT NULL,
  "stockCount" INTEGER DEFAULT 0 NOT NULL,
  "variantLabel" TEXT,
  tagline TEXT,
  description TEXT,
  details TEXT[] DEFAULT '{}'::text[] NOT NULL,
  "shippingInfo" TEXT,
  video TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Reviews Table
CREATE TABLE public.reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  author TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  date TEXT NOT NULL, -- Storing as text (YYYY-MM-DD) to match the mock data, or could be a Date/Timestamp
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  verified BOOLEAN DEFAULT false NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Enable RLS on all tables so they are secure by default
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Enable Public Read Access for anyone (using the Anon/Publishable API Key)
CREATE POLICY "Allow public read access for collections" ON public.collections
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access for products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access for reviews" ON public.reviews
  FOR SELECT USING (true);
