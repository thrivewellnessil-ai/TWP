import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (!success) {
                toast.error("Invalid credentials");
                return;
            }

            const adminEmail = String(import.meta.env.VITE_ADMIN_EMAIL ?? '').trim().toLowerCase();
            const { data } = await supabase.auth.getUser();
            const signedInEmail = String(data.user?.email ?? '').toLowerCase();

            if (adminEmail && signedInEmail !== adminEmail) {
                await supabase.auth.signOut();
                toast.error("Access denied");
                return;
            }

            toast.success("Login successful!");
            navigate("/product-management");
        } catch (error) {
            toast.error("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-grow flex items-start justify-center px-4 pt-40 md:pt-56 pb-32">
                <div className="w-full max-w-md p-8 rounded-2xl glass border border-border">
                    <h1 className="text-2xl font-bold mb-6 text-center">Team Login</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="team@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}
