-- PRODUCTION RLS (recommended): public read, admin-only writes
-- Admin email: thrivewellness.il@veinternational.org

-- PRODUCTS TABLE
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Products public read" ON public.products;
DROP POLICY IF EXISTS "Products admin insert" ON public.products;
DROP POLICY IF EXISTS "Products admin update" ON public.products;
DROP POLICY IF EXISTS "Products admin delete" ON public.products;

CREATE POLICY "Products public read" ON public.products
FOR SELECT
USING (true);

CREATE POLICY "Products admin insert" ON public.products
FOR INSERT
WITH CHECK (auth.email() = 'thrivewellness.il@veinternational.org');

CREATE POLICY "Products admin update" ON public.products
FOR UPDATE
USING (auth.email() = 'thrivewellness.il@veinternational.org')
WITH CHECK (auth.email() = 'thrivewellness.il@veinternational.org');

CREATE POLICY "Products admin delete" ON public.products
FOR DELETE
USING (auth.email() = 'thrivewellness.il@veinternational.org');


-- STORAGE (products bucket)
-- Note: bucket must exist (id = 'products')

DROP POLICY IF EXISTS "Allow public access to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow deletes to product images" ON storage.objects;

CREATE POLICY "Allow public access to product images" ON storage.objects
FOR SELECT
USING (bucket_id = 'products');

CREATE POLICY "Allow uploads to product images" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'products'
  AND auth.email() = 'thrivewellness.il@veinternational.org'
);

CREATE POLICY "Allow updates to product images" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'products'
  AND auth.email() = 'thrivewellness.il@veinternational.org'
);

CREATE POLICY "Allow deletes to product images" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'products'
  AND auth.email() = 'thrivewellness.il@veinternational.org'
);
