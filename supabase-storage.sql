-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access to product images
CREATE POLICY "Product images are publicly viewable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Create policy for authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products' AND 
    auth.role() = 'authenticated'
  );

-- Create policy for authenticated users to update product images
CREATE POLICY "Authenticated users can update product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'products' AND 
    auth.role() = 'authenticated'
  );

-- Create policy for authenticated users to delete product images
CREATE POLICY "Authenticated users can delete product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products' AND 
    auth.role() = 'authenticated'
  );
