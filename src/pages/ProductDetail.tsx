import { useMemo, useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products, Product } from "@/data/products";
import { useProductsCsv } from "@/hooks/useProductsCsv";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Minus, Plus } from "lucide-react";

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const initialSku = searchParams.get("sku");

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { products: csvProducts } = useProductsCsv();
  const sourceProducts = csvProducts.length ? csvProducts : products;
  const [csvDescription, setCsvDescription] = useState<string | null>(null);

  const variants = useMemo(() => {
    const group = sourceProducts.filter(p => slugify(p.groupName) === slug);
    return group;
  }, [slug, sourceProducts]);

  // Determine initial selection based on SKU param or default to first
  const [selected, setSelected] = useState<Product | null>(null);

  useEffect(() => {
    if (variants.length > 0) {
      if (initialSku) {
        const found = variants.find(v => v.sku === initialSku);
        setSelected(found || variants[0]);
      } else {
        setSelected(variants[0]);
      }
    }
  }, [variants, initialSku]);

  useEffect(() => {
    // If we already have a description in product data (if added later), use it
    // Otherwise try to fetch from CSV
    const fetchDescription = async () => {
      try {
        const response = await fetch("/products.csv");
        const text = await response.text();
        const lines = text.split("\n");
        // Simple CSV parser that handles the user's specific edit (desc at end)
        // Original CSV line: ...,Buy Button Links,Product Descriptions
        // Example line: ...,https://...,hi,

        const productLine = lines.find(line => {
          // Basic check - improve if SKU is in a standard column
          if (!line) return false;
          return line.includes(selected?.sku || "XXXX");
        });

        if (productLine) {
          // Split by comma
          const cols = productLine.split(",");
          // The description seems to be the last or second to last column based on user input
          // The user added 'hi' at the end.
          // Let's filter out empty trailing strings
          const validCols = cols.map(c => c.trim()).filter(c => c !== "");
          // Assuming description is the last valid column if it's not a url
          const lastCol = validCols[validCols.length - 1];

          // Basic heuristic: if it doesn't look like the URL, it's the description
          if (lastCol && !lastCol.includes("http") && !lastCol.includes("TRUE") && !lastCol.includes("FALSE") && lastCol.length > 2) {
            setCsvDescription(lastCol.replace(/^"|"$/g, '').replace(/""/g, '"'));
          }
        }
      } catch (e) {
        console.error("Failed to load description", e);
      }
    };

    if (selected?.sku) {
      fetchDescription();
    }
  }, [selected?.sku]);

  if (!variants || variants.length === 0 || !selected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-28 pb-16">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h1 className="font-display text-3xl font-bold mb-2">Product not found</h1>
            <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const category = selected.category;
  const isSupplement = category === "Wellness" || category === "Supplements";

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Wellness":
        return "bg-emerald-500/10 text-emerald-700";
      case "Water Bottles":
        return "bg-sky-500/10 text-sky-600";
      case "Bundles":
        return "bg-orange-500/10 text-orange-600";
      case "Accessories":
        return "bg-purple-500/10 text-purple-600";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case "Wellness":
        return "bg-emerald-500/5";
      case "Water Bottles":
        return "bg-sky-500/5";
      case "Bundles":
        return "bg-orange-500/5";
      case "Accessories":
        return "bg-purple-500/5";
      default:
        return "bg-primary/5";
    }
  };

  const handleAddToCart = () => {
    addToCart(
      {
        name: selected.name,
        link: selected.buyLink,
        price: selected.price,
        image: selected.image,
      },
      quantity
    );
    setQuantity(1);
  };

  // Group-level description placeholder. Replace with real copy later if desired.
  // Use CSV description if available
  const displayDescription = csvDescription || `Discover ${selected.groupName} — premium quality designed to elevate your routine.Choose your ${isSupplement ? "flavor" : "color"} and enjoy exceptional performance.`;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section with Product Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-slate-900 via-black to-black">


        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Product Image - Left Side */}
            <div className="flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
              <div className="relative w-full max-w-sm">
                {selected.image ? (
                  <img
                    src={selected.image?.replace(/^public\//, '/')}
                    alt={selected.name}
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-8xl font-display text-white/10">
                    {selected.groupName.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info - Right Side */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Breadcrumbs */}
              <div className="text-sm text-white/60">
                <Link to="/shop" className="hover:text-white transition">Shop</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{selected.groupName}</span>
              </div>

              {/* Title */}
              <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-2">
                  {selected.groupName}
                </h1>
                <p className="text-base text-white/70 font-light leading-relaxed max-w-md">
                  {displayDescription}
                </p>
              </div>

              {/* Price & Actions Row */}
              <div className="flex flex-col items-start gap-6">
                {/* Price */}
                <div className="text-3xl font-bold text-glacier">
                  ${selected.price.toFixed(2)}
                </div>

                {/* Variants */}
                {variants.length > 1 && (
                  <div className="space-y-2">
                    <p className="text-xs text-white/60 uppercase tracking-widest font-medium">
                      Available {isSupplement ? "Flavors" : "Colors"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => setSelected(variant)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white",
                            selected.id === variant.id
                              ? "border-white scale-110"
                              : "border-white/30 hover:border-white/60",
                            variant.hexColor === "#FFFFFF" && "bg-white border-white"
                          )}
                          style={{
                            backgroundColor: variant.hexColor !== "#FFFFFF" ? variant.hexColor : undefined,
                            backgroundImage: isSupplement && !variant.hexColor ? "linear-gradient(45deg, #333, #666)" : undefined // Fallback for flavor if no color
                          }}
                          title={variant.color}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-white/80">{selected.color}</p>
                  </div>
                )}

                {/* Controls */}
                <div className="flex items-center gap-3">
                  {/* Quantity */}
                  <div className="flex items-center h-10 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full hover:bg-white/10 flex items-center justify-center text-lg font-bold transition-colors rounded-l-full"
                      aria-label="Decrease"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(99, quantity + 1))}
                      className="w-10 h-full hover:bg-white/10 flex items-center justify-center text-lg font-bold transition-colors rounded-r-full"
                      aria-label="Increase"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90 font-bold text-base rounded-full h-10 px-6 transition-all duration-300"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>



              {/* Features (Only show for non-supplements or adapt for supplements) */}
              {!isSupplement && (
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest mb-0.5">Capacity</p>
                    <p className="text-sm font-semibold">
                      {selected.groupName.includes("Glacier") ? "40 oz" : "32 oz"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest mb-0.5">Material</p>
                    <p className="text-sm font-semibold">Stainless Steel</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest mb-0.5">Insulation</p>
                    <p className="text-sm font-semibold">Double-Wall</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest mb-0.5">Warranty</p>
                    <p className="text-sm font-semibold">Lifetime</p>
                  </div>
                </div>
              )}

              {isSupplement && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">Benefits</p>
                  <ul className="text-sm text-white/80 list-disc pl-4 space-y-1">
                    <li>Fast-acting hydration</li>
                    <li>Zero sugar</li>
                    <li>Natural ingredients</li>
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>


      {/* Specifications Section - Conditional */}
      {!isSupplement && (
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <h2 className="font-display text-2xl font-bold mb-8 tracking-tight">Specifications</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-widest mb-2">Capacity</p>
                <p className="text-xl font-bold">{selected.groupName.includes("Glacier") ? "40 oz" : "32 oz"}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-widest mb-2">Material</p>
                <p className="text-xl font-bold">Stainless Steel</p>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-widest mb-2">Insulation</p>
                <p className="text-xl font-bold">Double-Wall</p>
              </div>
              <div>
                <p className="text-xs text-white/60 uppercase tracking-widest mb-2">Warranty</p>
                <p className="text-xl font-bold">Lifetime</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 tracking-tight">Explore More</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sourceProducts
              .filter(p => p.category === category && p.groupName !== selected.groupName)
              // We need to dedupe by group name for "Explore More" to avoid showing all colors of same product
              .filter((p, index, self) =>
                index === self.findIndex((t) => (
                  t.groupName === p.groupName
                ))
              )
              .slice(0, 4)
              .map((p, i) => (
                <ExploreCard key={`${p.id}-${i}`} product={p} allProducts={sourceProducts} />
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ExploreCard({ product, allProducts }: { product: Product, allProducts: Product[] }) {
  // Get all variants for this product group
  const variants = allProducts.filter(p => p.groupName === product.groupName);
  const [hoveredVariant, setHoveredVariant] = useState(product);

  return (
    <Link
      to={`/product/${slugify(product.groupName)}?sku=${hoveredVariant.sku}`}
      className="group block"
      onMouseLeave={() => setHoveredVariant(variants[0])}
    >
      <div className="aspect-square bg-black rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-white/30 transition relative">
        {/* Main Image (swaps on hover if variant selected) */}
        {hoveredVariant.image ? (
          <img
            src={hoveredVariant.image?.replace(/^public\//, '/')}
            alt={hoveredVariant.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="text-6xl font-display text-white/10">{hoveredVariant.groupName.charAt(0)}</div>
        )}

        {/* Variant Swatches on Hover - positioned absolute bottom */}
        {variants.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity px-2">
            {variants.slice(0, 5).map(v => (
              <span
                key={v.id}
                className={cn(
                  "w-4 h-4 rounded-full border border-white/50 cursor-pointer shadow-sm",
                  hoveredVariant.id === v.id ? "scale-110 border-white" : ""
                )}
                style={{ backgroundColor: v.hexColor }}
                onMouseEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // prevent link click? No, we want hover
                  setHoveredVariant(v);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="font-display font-bold text-white tracking-tight mb-1">{product.groupName}</div>
      <div className="text-white/70 text-sm">${product.price.toFixed(2)}</div>
    </Link>
  );
}
