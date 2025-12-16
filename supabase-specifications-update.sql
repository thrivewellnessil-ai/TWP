-- Add specifications column to products table
ALTER TABLE products ADD COLUMN specifications JSONB;

-- Update existing products with appropriate specifications
UPDATE products SET specifications = '{
  "capacity": "40 oz",
  "material": "Premium Stainless Steel",
  "insulation": "Double-Wall Vacuum",
  "warranty": "Lifetime",
  "dimensions": "10.5\" H x 3.5\" D",
  "weight": "1.2 lbs",
  "features": ["Ice Cap Lid", "Sweat-proof", "BPA-free", "Leak-proof"]
}' WHERE category = 'Water Bottles' AND group_name LIKE '%Glacier%';

UPDATE products SET specifications = '{
  "capacity": "32 oz", 
  "material": "Premium Stainless Steel",
  "insulation": "Double-Wall Vacuum",
  "warranty": "Lifetime",
  "dimensions": "9.5\" H x 3.0\" D",
  "weight": "1.0 lbs",
  "features": ["Ice Cap Lid", "Sweat-proof", "BPA-free", "Leak-proof"]
}' WHERE category = 'Water Bottles' AND group_name LIKE '%Iceberg%';

UPDATE products SET specifications = '{
  "servings": "30",
  "weight": "2.2 lbs",
  "flavor_profile": "Rich & Creamy",
  "ingredients": ["Premium Whey Protein", "Natural Flavors", "Digestive Enzymes"],
  "benefits": ["Muscle Recovery", "25g Protein", "No Artificial Sweeteners"],
  "warranty": "30-day satisfaction"
}' WHERE category = 'Wellness' AND group_name LIKE '%Peak%';

UPDATE products SET specifications = '{
  "servings": "60",
  "weight": "0.5 lbs",
  "flavor_profile": "Refreshing & Hydrating",
  "ingredients": ["Electrolyte Blend", "Natural Flavors", "Vitamin C"],
  "benefits": ["Rapid Hydration", "Electrolyte Balance", "Zero Sugar"],
  "warranty": "30-day satisfaction"
}' WHERE category = 'Wellness' AND group_name LIKE '%Surge%';

UPDATE products SET specifications = '{
  "items": "Multiple Products",
  "savings": "25% vs individual purchase",
  "includes": ["Full Product Line", "Premium Accessories", "Free Shipping"],
  "benefits": ["Complete Wellness Package", "Best Value", "Curated Selection"],
  "warranty": "Individual product warranties apply"
}' WHERE category = 'Bundles';

UPDATE products SET specifications = '{
  "material": "Premium Materials",
  "function": "Product Enhancement",
  "compatibility": "All Thrive Products",
  "benefits": ["Improved Experience", "Durable Design", "Easy to Clean"],
  "warranty": "1-year limited"
}' WHERE category = 'Accessories';
