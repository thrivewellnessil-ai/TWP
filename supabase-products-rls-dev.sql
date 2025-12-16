-- DEV ONLY: Allow client-side CRUD on products table (remove/tighten for production)

-- Ensure RLS is enabled (if it's already enabled, this is safe)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing dev policies if they exist
DROP POLICY IF EXISTS "Products public read" ON public.products;
DROP POLICY IF EXISTS "Products public insert" ON public.products;
DROP POLICY IF EXISTS "Products public update" ON public.products;
DROP POLICY IF EXISTS "Products public delete" ON public.products;

-- Allow anyone to read products
CREATE POLICY "Products public read" ON public.products
FOR SELECT
USING (true);

-- Allow anyone to insert products
CREATE POLICY "Products public insert" ON public.products
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update products
CREATE POLICY "Products public update" ON public.products
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to delete products
CREATE POLICY "Products public delete" ON public.products
FOR DELETE
USING (true);
