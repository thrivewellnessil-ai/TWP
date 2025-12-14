import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { products: csvProducts } = useProductsCsv();
  const sourceProducts = csvProducts.length ? csvProducts : products;

  const variants = useMemo(() => {
    const group = sourceProducts.filter(p => slugify(p.groupName) === slug);
    return group;
  }, [slug, sourceProducts]);

  const [selected, setSelected] = useState<Product | null>(variants[0] || null);

  useEffect(() => {
    setSelected(variants[0] || null);
  }, [variants]);

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
    // Reset quantity after adding
    setQuantity(1);
  };

  // Group-level description placeholder. Replace with real copy later if desired.
  const groupDescription = `Discover ${selected.groupName} — premium quality designed to elevate your routine. Choose your ${category === "Wellness" ? "flavor" : "color"} and enjoy exceptional performance.`;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section with Product Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-gradient-to-b from-slate-900 via-black to-black">


        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Product Image - Left Side */}
            <div className="flex items-center justify-center min-h-[350px] lg:min-h-[500px]">
              <div className="relative w-full max-w-md">
                {selected.image ? (
                  <img
                    src={selected.image?.replace(/^public\//, '/')}
                    alt={selected.name}
                    className="w-full h-auto object-contain drop-shadow-2xl"
                  />
                ) : (
                  <div className="h-[500px] flex items-center justify-center text-9xl font-display text-white/10">
                    {selected.groupName.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info - Right Side */}
            <div className="flex flex-col justify-center space-y-8">
              {/* Breadcrumbs */}
              <div className="text-sm text-white/60">
                <Link to="/shop/water-bottles" className="hover:text-white transition">Water Bottles</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{selected.groupName}</span>
              </div>

              {/* Title */}
              <div>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
                  {selected.groupName}
                </h1>
                <p className="text-xl text-white/70 font-light leading-relaxed max-w-lg">
                  Premium insulated water bottle engineered with advanced thermal technology. Keep your drinks at the perfect temperature for hours.
                </p>
              </div>

              {/* Price */}
              <div className="text-5xl font-bold">
                ${selected.price.toFixed(2)}
              </div>

              {/* Color Variants */}
              {variants.length > 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-white/60 uppercase tracking-widest font-medium">
                    Available Colors
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelected(variant)}
                        className={cn(
                          "w-12 h-12 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white",
                          selected.id === variant.id
                            ? "border-white scale-110"
                            : "border-white/30 hover:border-white/60",
                          variant.hexColor === "#FFFFFF" && "bg-white border-white"
                        )}
                        style={{
                          backgroundColor: variant.hexColor !== "#FFFFFF" ? variant.hexColor : undefined
                        }}
                        title={variant.color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg font-bold transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg font-bold transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-bold text-lg rounded-full px-8 h-12 transition-all duration-300"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Capacity</p>
                  <p className="text-lg font-semibold">
                    {selected.groupName.includes("Glacier") ? "40 oz" : "32 oz"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Material</p>
                  <p className="text-lg font-semibold">Stainless Steel</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Insulation</p>
                  <p className="text-lg font-semibold">Double-Wall</p>
                </div>
                <div>
                  <p className="text-xs text-white/60 uppercase tracking-widest mb-1">Warranty</p>
                  <p className="text-lg font-semibold">Lifetime</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 tracking-tight">About {selected.groupName}</h2>
            <p className="text-lg text-white/70 font-light leading-relaxed">{groupDescription}</p>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 tracking-tight">Specifications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <p className="text-sm text-white/60 uppercase tracking-widest mb-3">Capacity</p>
              <p className="text-2xl font-bold">{selected.groupName.includes("Glacier") ? "40 oz" : "32 oz"}</p>
            </div>
            <div>
              <p className="text-sm text-white/60 uppercase tracking-widest mb-3">Material</p>
              <p className="text-2xl font-bold">Stainless Steel</p>
            </div>
            <div>
              <p className="text-sm text-white/60 uppercase tracking-widest mb-3">Insulation</p>
              <p className="text-2xl font-bold">Double-Wall</p>
            </div>
            <div>
              <p className="text-sm text-white/60 uppercase tracking-widest mb-3">Warranty</p>
              <p className="text-2xl font-bold">Lifetime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-20 bg-slate-950">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 tracking-tight">Explore More Water Bottles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sourceProducts
              .filter(p => p.category === category && p.groupName !== selected.groupName)
              .slice(0, 4)
              .map((p, i) => (
                <Link key={`${p.id}-${i}`} to={`/product/${slugify(p.groupName)}`} className="group block">
                  <div className="aspect-square bg-black rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-white/30 transition">
                    {p.image ? (
                      <img src={p.image?.replace(/^public\//, '/')} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="text-6xl font-display text-white/10">{p.groupName.charAt(0)}</div>
                    )}
                  </div>
                  <div className="font-display font-bold text-white tracking-tight mb-1">{p.groupName}</div>
                  <div className="text-white/70 text-sm">${p.price.toFixed(2)}</div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
