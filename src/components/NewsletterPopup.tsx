import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";

export function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Check if user has already seen the popup
        const output = localStorage.getItem("newsletterPopupShown");

        // Only show if not seen
        if (!output) {
            const handleInteraction = () => {
                // Only trigger on product pages, shop pages, or cart-test
                if (location.pathname.includes("/shop") || location.pathname.includes("/product") || location.pathname.includes("/cart-test")) {
                    // Small delay to not be annoying immediately
                    setTimeout(() => {
                        setIsOpen(true);
                    }, 2000);

                    // Remove listener once triggered
                    document.removeEventListener("click", handleInteraction);
                }
            };

            document.addEventListener("click", handleInteraction);

            return () => {
                document.removeEventListener("click", handleInteraction);
            };
        }
    }, [location.pathname]);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("newsletterPopupShown", "true");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock saving to a text file (console log)
        console.log(`Saved email to newsletter_subscribers.txt: ${email}`);
        setSubmitted(true);
        // Don't auto-close immediately so they can see the code
        // setTimeout(() => { handleClose(); }, 5000); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-4">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Gift className="w-6 h-6 text-primary" />
                    </div>

                    <h3 className="font-display font-bold text-2xl text-foreground">
                        {submitted ? "You're on the list!" : "Unlock Exclusive Perks!"}
                    </h3>

                    {!submitted ? (
                        <>
                            <p className="text-muted-foreground">
                                Sign up for our newsletter and get a special promo code, early access to new releases, and wellness tips.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-background"
                                />
                                <Button type="submit" className="w-full font-bold" size="lg">
                                    Get My Promo Code
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full text-muted-foreground hover:text-foreground"
                                    onClick={handleClose}
                                >
                                    No thanks, I'll pay full price
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="py-6 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <p className="text-muted-foreground">
                                Welcome to the family! Use this code at checkout:
                            </p>

                            <div className="bg-primary/10 border-2 border-dashed border-primary/30 rounded-lg p-4 cursor-copy hover:bg-primary/20 transition-colors"
                                onClick={() => { navigator.clipboard.writeText("THRIVE20"); }}
                                title="Click to copy"
                            >
                                <span className="font-mono text-2xl font-bold text-primary tracking-wider">
                                    THRIVE20
                                </span>
                            </div>

                            <p className="text-xs text-muted-foreground/60">
                                (Code copied to clipboard on click)
                            </p>

                            <div className="pt-2">
                                <Button onClick={handleClose} variant="outline" className="w-full">
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    )}

                    {!submitted && (
                        <p className="text-xs text-muted-foreground/60 pt-2">
                            Limited time offer. One time per customer.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
