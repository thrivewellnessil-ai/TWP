-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In Store',
  sku TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  buy_link TEXT,
  image_url TEXT,
  group_name TEXT,
  color TEXT,
  hex_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Create policy for authenticated users to insert products
CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update products
CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete products
CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert sample data (migrate from existing products)
INSERT INTO products (name, description, category, status, sku, price, buy_link, image_url, group_name, color, hex_color) VALUES
('Divider', 'Product divider accessory', 'Accessories', 'Removal Requested', 'O-DI', 8.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/divider-odi/', '/product-images/O-DI.png', 'Divider', NULL, NULL),
('Ice Molds', 'Ice molds for beverages', 'Accessories', 'Removal Requested', 'O-IM', 19.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/ice-molds-oim/', '/product-images/O-IM.png', 'Ice Molds', NULL, NULL),
('Shaker Ball', 'Shaker ball for mixing', 'Accessories', 'In Store', 'O-SB', 7.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/shaker-ball-osb/', '/product-images/O-SB.png', 'Shaker Ball', NULL, NULL),
('The Anchor (Snack Compartment)', 'Snack compartment accessory', 'Accessories', 'In Store', 'O-AN', 12.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/the-anchor-snack-compartment-oan/', '/product-images/O-AN.png', 'The Anchor', 'Snack Compartment', NULL),
('Surge IV (Blue Razzberry)', 'Blue razzberry flavored electrolyte drink', 'Wellness', 'In Store', 'SU-EL-1', 19.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/surge-iv-blue-razzberry-suel1/', '/product-images/SU-EL-1.png', 'Surge IV', 'Blue Razzberry', '#0000FF'),
('Surge IV (Fruit Punch)', 'Fruit punch flavored electrolyte drink', 'Wellness', 'In Store', 'SU-EL-2', 19.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/surge-iv-fruit-punch-suel2/', '/product-images/SU-EL-2.png', 'Surge IV', 'Fruit Punch', '#FF4500'),
('Surge IV (Lemonade)', 'Lemonade flavored electrolyte drink', 'Wellness', 'In Store', 'SU-EL-3', 19.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/surge-iv-lemonade-suel3/', '/product-images/SU-EL-3.png', 'Surge IV', 'Lemonade', '#FFFF00'),
('Surge IV (Pina Colada)', 'Pina colada flavored electrolyte drink', 'Wellness', 'In Store', 'SU-EL-4', 19.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/surge-iv-pina-colada-suel4/', '/product-images/SU-EL-4.png', 'Surge IV', 'Pina Colada', '#F0E68C'),
('Surge IV (Strawberry)', 'Strawberry flavored electrolyte drink', 'Wellness', 'In Store', 'SU-EL-5', 19.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/surge-iv-strawberry-suel5/', '/product-images/SU-EL-5.png', 'Surge IV', 'Strawberry', '#FF69B4'),
('Surge IV (Tropical Vibes)', 'Tropical vibes flavored electrolyte drink', 'Wellness', 'In Store', 'SU-EL-6', 19.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/surge-iv-tropical-punch-suel6/', '/product-images/SU-EL-6.png', 'Surge IV', 'Tropical Vibes', '#FF7F50'),
('Surge IV (Cucumber Lime)', 'Cucumber lime flavored electrolyte drink', 'Wellness', 'In Store', 'SU-EL-7', 19.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/surge-iv-cucumber-lime-suel7/', '/product-images/SU-EL-7.png', 'Surge IV', 'Cucumber Lime', '#90EE90'),
('Surge IV (Apple Cider)', 'Apple cider flavored electrolyte drink', 'Wellness', 'In Store', 'SU-EL-8', 19.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/surge-iv-apple-cider-suel8/', '/product-images/SU-EL-8.png', 'Surge IV', 'Apple Cider', '#D2691E'),
('The Snow Cap (Modified Lid)', 'Modified snow cap lid', 'Accessories', 'Removal Requested', 'CA-SC', 14.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/the-snow-cap-modified-lid-casc/', '/product-images/CA-SC.png', 'The Snow Cap', 'Modified Lid', NULL),
('Peak Protein (Chocolate)', 'Chocolate flavored protein powder', 'Wellness', 'In Store', 'SU-PR-1', 34.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/peak-powder-chocolate-supr1/', '/product-images/SU-PR-1.png', 'Peak Protein', 'Chocolate', '#3E2723'),
('Peak Protein (Vanilla)', 'Vanilla flavored protein powder', 'Wellness', 'In Store', 'SU-PR-2', 34.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/peak-powder-vanilla-supr2/', '/product-images/SU-PR-2.png', 'Peak Powder', 'Vanilla', '#F3E5AB'),
('The Glacier (White) w. Ice Cap', 'White glacier water bottle with ice cap', 'Water Bottles', 'In Store', 'BO-46', 75.00, 'https://portal.veinternational.org/buybuttons/us019814/btn/the-glacier-white-w-ice-cap-bo46/', '/product-images/BO-46.png', 'The Glacier', 'White', '#FFFFFF'),
('The Iceberg (White) w. Ice Cap', 'White iceberg water bottle with ice cap', 'Water Bottles', 'In Store', 'BO-36', 60.00, 'https://portal.veinternational.org/buybuttons/us019814/btn/the-iceberg-white-w-ice-cap-bo36/', '/product-images/BO-36.png', 'The Iceberg', 'White', '#FFFFFF'),
('Alo x Thrive Bundle', 'Alo and Thrive collaboration bundle', 'Bundles', 'In Store', 'SE-F-1', 499.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/alo-x-thrive-bundle-sef1/', '/product-images/SE-F-1.png', 'Alo x Thrive Bundle', NULL, NULL),
('Peleton x Thrive Bundle', 'Peleton and Thrive collaboration bundle', 'Bundles', 'In Store', 'SE-F-2', 2999.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/peloton-x-thrive-bundle-sef2/', '/product-images/SE-F-2.png', 'Peleton x Thrive Bundle', NULL, NULL),
('Fall Bundle', 'Seasonal fall bundle', 'Bundles', 'In Store', 'SE-F-3', 399.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/fall-bundle-sef3/', '/product-images/SE-F-3.png', 'Fall Bundle', NULL, NULL),
('Peak Protein (Pumpkin Spice)', 'Pumpkin spice flavored protein powder', 'Wellness', 'In Store', 'SU-PR-3', 34.99, 'https://portal.veinternational.org/buybuttons/us019814/btn/peak-protein-pumpkin-spice-supr3/', '/product-images/SU-PR-3.png', 'Peak Protein', 'Pumpkin Spice', '#D2691E')
ON CONFLICT (sku) DO NOTHING;
