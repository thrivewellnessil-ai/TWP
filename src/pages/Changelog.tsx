import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

export default function Changelog() {
    const changes = [
        {
            version: "1.7.1",
            date: "December 14, 2025",
            type: "Stable Release",
            items: [
                "Refactored Newsletter page with unified Apple-style hero design.",
                "Redesigned Mission page hero and content layout for consistency.",
                "Enhanced Newsletter Popup with 'Cart Test' support and promo code display.",
                "Cleaned up unused page components and assets.",
                "Fixed layout structure issues on Supplements page."
            ]
        },
        {
            version: "1.7.0",
            date: "December 14, 2025",
            type: "Major Update",
            items: [
                "Standardized 'Apple Style' Hero sections across all product pages.",
                "Enhanced Shop page hero design.",
                "Improved 'Explore More' card logic with hover effects and direct variant linking.",
                "Optimized layout for product details (left-aligned actions).",
                "Fixed various layout and navigation consistency issues."
            ]
        },
        {
            version: "1.6.1",
            date: "December 14, 2025",
            type: "Stable Release",
            items: [
                "Added 'New Release' badge to Hero section.",
                "Implemented one-time newsletter popup for new visitors.",
                "Centered team photos in Team page.",
                "Connected Team Login to external portal.",
                "Improved SEO and site performance.",
                "Cleaned up unused assets and code."
            ]
        },
        {
            version: "1.5.0",
            date: "December 10, 2025",
            type: "Dev Push",
            items: [
                "Initial specialized wellness branding.",
                "Added Floating Cart functionality.",
                "Integrated checkout system with automated processing.",
                "Launched Shop and Product Detail pages."
            ]
        },
        {
            version: "1.0.0",
            date: "November 1, 2025",
            type: "Initial Launch",
            items: [
                "Project initialization.",
                "Basic routing and layout setup."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-12">

                {/* Back Button */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                </div>

                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl font-bold mb-2">Changelog</h1>
                    <p className="text-muted-foreground mb-12">
                        Track our latest updates, improvements, and releases.
                    </p>

                    <div className="space-y-12">
                        {changes.map((change) => (
                            <div key={change.version} className="relative pl-8 border-l border-border/50">
                                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-primary" />

                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold font-display">v{change.version}</h2>
                                    <Badge variant="outline" className="text-xs">
                                        {change.type}
                                    </Badge>
                                    <span className="text-sm text-muted-foreground ml-auto">
                                        {change.date}
                                    </span>
                                </div>

                                <ul className="space-y-2">
                                    {change.items.map((item, i) => (
                                        <li key={i} className="text-muted-foreground flex items-start gap-2">
                                            <span className="mt-2 w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
