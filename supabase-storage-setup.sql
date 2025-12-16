-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS) policies for the products bucket
-- Allow public read access to all files
DROP POLICY IF EXISTS "Allow public access to product images" ON storage.objects;
CREATE POLICY "Allow public access to product images" ON storage.objects
FOR SELECT USING (bucket_id = 'products');

-- Allow uploads to products bucket (dev)
DROP POLICY IF EXISTS "Allow uploads to product images" ON storage.objects;
CREATE POLICY "Allow uploads to product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'products');

-- Allow updates in products bucket (dev)
DROP POLICY IF EXISTS "Allow updates to product images" ON storage.objects;
CREATE POLICY "Allow updates to product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'products');

-- Allow deletes in products bucket (dev)
DROP POLICY IF EXISTS "Allow deletes to product images" ON storage.objects;
CREATE POLICY "Allow deletes to product images" ON storage.objects
FOR DELETE USING (bucket_id = 'products');
