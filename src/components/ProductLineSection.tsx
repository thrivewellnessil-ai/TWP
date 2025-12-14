import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

interface ProductLineSectionProps {
  variants: Product[];
  index: number;
  addToCart: (item: { name: string; link: string; price: number; image?: string }) => void;
  sectionId: string;
  lineDescription: string;
}

export function ProductLineSection({
  variants,
  index,
  addToCart,
  sectionId,
  lineDescription,
}: ProductLineSectionProps) {
  const isEven = index % 2 === 0;

  const displayVariants = useMemo(() => {
    const filtered = variants.filter((variant) => variant.hexColor && variant.color);
    if (filtered.length === 0) {
      return variants;
    }
    const seen = new Set<string>();
    return filtered.filter((variant) => {
      const key = variant.hexColor as string;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [variants]);

  const [selectedVariant, setSelectedVariant] = useState(displayVariants[0]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelectedVariant(displayVariants[0]);
    setQuantity(1);
  }, [displayVariants]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        name: selectedVariant.name,
        link: selectedVariant.buyLink,
        price: selectedVariant.price,
        image: selectedVariant.image,
      });
    }
    setQuantity(1);
  };

  return (
    <section
      id={sectionId}
      className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-20 bg-gradient-to-b from-slate-950 via-black to-slate-950"
      )}
    >
      <div className="absolute inset-0 matrix-dots opacity-3" aria-hidden="true" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div
          className={cn(
            "grid lg:grid-cols-2 gap-12 items-center",
            isEven ? "" : "lg:grid-flow-dense"
          )}
        >
          {/* Product Image */}
          <div
            className={cn(
              "flex items-center justify-center min-h-[350px] lg:min-h-[500px]",
              !isEven && "lg:col-start-2"
            )}
          >
            <div className="relative w-full max-w-md">
              {selectedVariant.image && (
                <img
                  key={selectedVariant.image}
                  src={selectedVariant.image.replace(/^public\//, "/")}
                  alt={selectedVariant.name}
                  loading="lazy"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div
            className={cn(
              "flex flex-col justify-center",
              !isEven && "lg:col-start-1"
            )}
          >
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                  {selectedVariant.groupName}
                </h2>
                <p className="text-lg text-white/70 font-light leading-relaxed max-w-lg">
                  {lineDescription}
                </p>
              </div>

              {/* Price */}
              <div className="text-4xl font-bold">
                ${selectedVariant.price.toFixed(2)}
              </div>

              {/* Variants */}
              {displayVariants.length > 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-white/60 uppercase tracking-widest font-medium">
                    Available Options
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {displayVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white",
                          selectedVariant.id === variant.id
                            ? "border-white scale-110"
                            : "border-white/30 hover:border-white/60",
                          variant.hexColor === "#FFFFFF" && "bg-white border-white"
                        )}
                        style={{
                          backgroundColor:
                            variant.hexColor !== "#FFFFFF" ? variant.hexColor : undefined,
                        }}
                        title={variant.color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 pt-6">
                <div className="flex items-center justify-between gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 sm:px-5 border border-white/20 h-12 w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg font-bold transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-lg font-bold transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-bold text-lg rounded-full px-8 h-12 min-w-[180px] transition-all duration-300"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>

              {/* Generic specs */}
              <div className="pt-6 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-widest mb-1">
                      Category
                    </p>
                    <p className="text-lg font-semibold">{selectedVariant.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <p className="text-lg font-semibold">{selectedVariant.status || "In Store"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-widest mb-1">
                      SKU
                    </p>
                    <p className="text-lg font-semibold">{selectedVariant.sku}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-widest mb-1">
                      Group
                    </p>
                    <p className="text-lg font-semibold">{selectedVariant.groupName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
