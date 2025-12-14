import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products, Product } from "@/data/products";
import { useProductsCsv } from "@/hooks/useProductsCsv";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { ProductLineSection } from "@/components/ProductLineSection";


export default function SupplementsPage() {
    const { addToCart } = useCart();
    const { products: csvProducts } = useProductsCsv();
    const sourceProducts = csvProducts.length ? csvProducts : products;

    const wellnessProducts = useMemo(() => {
        return sourceProducts.filter((product) =>
            (product.category === "Wellness" && (product.groupName.includes("Peak") || product.groupName === "Surge IV"))
        );
    }, [sourceProducts]);

    const groupedProducts = useMemo(() => {
        const groups: { [key: string]: Product[] } = {};
        wellnessProducts.forEach(product => {
            if (!groups[product.groupName]) {
                groups[product.groupName] = [];
            }
            groups[product.groupName].push(product);
        });
        return Object.values(groups);
    }, [wellnessProducts]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="relative">
                <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
                    {/* Image Background */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-background"></div>
                    </div>


                    {/* Darker overlay for text readability */}
                    <div className="absolute inset-0 bg-black/40 z-10"></div>

                    {/* Content */}
                    <div className="container mx-auto px-4 lg:px-8 text-center relative z-20">
                        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                            <span className="text-gradient">Supplements</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
                            Premium protein powders, electrolytes, and nutritional supplements to fuel your fitness journey.
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Scroll down"
                        onClick={() => window.scrollTo({ behavior: 'smooth', top: window.innerHeight })}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-30 hover:opacity-90 focus:outline-none"
                    >
                        <ChevronDown className="w-8 h-8 text-white/80" />
                    </button>
                </section>

                {/* Overview / quick navigation divider */}
                <section className="border-y border-white/10 bg-gradient-to-r from-slate-950/60 via-black to-slate-950/60 py-10">
                    <div className="container mx-auto px-4 lg:px-8 flex flex-col gap-6 items-center">
                        <p className="text-sm uppercase tracking-[0.25em] text-white/50">
                            Explore the supplements
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {groupedProducts.map((group) => {
                                const label = group[0].groupName;
                                const sectionId = label.toLowerCase().replace(/\s+/g, "-");
                                return (
                                    <a
                                        key={label}
                                        href={`#${sectionId}`}
                                        className="px-4 py-2 rounded-full border border-white/15 bg-white/5 text-sm text-white/80 hover:bg-white/15 hover:border-white/40 transition-colors"
                                    >
                                        {label}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Product Showcase Sections */}
                <div className="relative">
                    {groupedProducts.map((group, index) => {
                        const sectionId = group[0].groupName.toLowerCase().replace(/\s+/g, "-");
                        const isLast = index === groupedProducts.length - 1;
                        return (
                            <div key={group[0].groupName}>
                                <ProductLineSection
                                    variants={group}
                                    index={index}
                                    addToCart={addToCart}
                                    sectionId={sectionId}
                                    lineDescription="Premium formulas designed to support hydration, recovery, and performance."
                                />
                                {!isLast && (
                                    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer />
        </div>
    );
}

function ProductCard({ variants, index, addToCart }: { variants: Product[]; index: number; addToCart: any }) {
    const [selectedVariant, setSelectedVariant] = useState(variants[0]);
    const [quantity, setQuantity] = useState(1);
    const product = selectedVariant;

    useEffect(() => {
        setSelectedVariant(variants[0]);
    }, [variants]);

    const slugify = (text: string) =>
        text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart({
                name: product.name,
                link: product.buyLink,
                price: product.price,
                image: product.image,
            });
        }
        setQuantity(1);
    };

    return (
        <div
            className={cn(
                "group relative rounded-2xl overflow-hidden transition-all duration-500 h-[500px] shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 animate-fade-in-up border border-border/50",
            )}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Full Background Image */}
            <div className="absolute inset-0 bg-white">
                <Link to={`/product/${slugify(product.groupName)}`} className="absolute inset-0 z-10" aria-label={`View ${product.groupName}`} />
                {product.image ? (
                    <img
                        key={product.image}
                        src={product.image.replace(/^public\//, '/')}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : null}

                {/* Fallback Placeholder */}
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center bg-gray-100",
                    product.image ? "hidden" : ""
                )}>
                    <div className="text-6xl font-display font-bold text-gray-300">
                        {product.groupName.charAt(0)}
                    </div>
                </div>
                {/* No Image Overlay */}
                {!product.image && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                        <div className="text-6xl font-display font-bold text-gray-300">
                            {product.groupName.charAt(0)}
                        </div>
                    </div>
                )}
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

            {/* Top badges */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md bg-white/90 text-purple-600"
                )}>
                    Supplements
                </span>
            </div>

            {/* Product Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col z-20 text-white">
                <h3 className="font-display text-2xl font-bold mb-3 line-clamp-2 tracking-wide leading-tight shadow-black/50 drop-shadow-md">
                    <Link to={`/product/${slugify(product.groupName)}`} className="hover:underline">
                        {product.groupName}
                    </Link>
                </h3>

                {/* Variant Swatches */}
                {variants.length > 1 && (
                    <div className="flex flex-wrap gap-2 mb-4 items-center">
                        {variants.map((variant) => (
                            <button
                                key={variant.id}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedVariant(variant);
                                }}
                                className={cn(
                                    "w-6 h-6 rounded-full border border-white/30 transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm",
                                    selectedVariant.id === variant.id && "ring-2 ring-white scale-110",
                                    variant.hexColor === "#FFFFFF" && "bg-white",
                                )}
                                style={{ backgroundColor: variant.hexColor }}
                                title={variant.color}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-display font-bold">${product.price.toFixed(2)}</span>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-2 py-1 border border-white/20">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setQuantity(Math.max(1, quantity - 1));
                                }}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 hover:scale-110 flex items-center justify-center text-sm font-bold transition-all duration-200"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>
                            <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setQuantity(Math.min(99, quantity + 1));
                                }}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 hover:scale-110 flex items-center justify-center text-sm font-bold transition-all duration-200"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <Button
                        variant="default"
                        size="lg"
                        className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 text-base shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300"
                        onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart();
                        }}
                    >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
}
