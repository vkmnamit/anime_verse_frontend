"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/src/context/AuthContext";

export default function AuthPage() {
    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (mode === "signin") {
                await login({ email, password });
            } else {
                if (!username) {
                    setError("Username is required");
                    setLoading(false);
                    return;
                }
                await signup({ email, password, username });
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center relative overflow-hidden font-sans">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/5 blur-[120px] rounded-full" />

            {/* Particles/Embers (Simulated with div dots) */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 10}s`
                        }}
                    />
                ))}
            </div>

            {/* Split Container */}
            <div className="w-full max-w-7xl h-full lg:h-[90vh] grid grid-cols-1 lg:grid-cols-2 relative z-10 px-4 md:px-12 py-8 gap-12">

                {/* Left Side: Massive Cinematic Illustration */}
                <div className="relative hidden lg:flex rounded-[32px] overflow-hidden border border-white/[0.08] shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
                    <Image
                        src="https://images.unsplash.com/photo-1541562232579-512a21360020?w=1200&h=1800&fit=crop&q=100"
                        alt="Anime Universe"
                        fill
                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                        priority
                    />
                    {/* Dark Overlay for better image depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent opacity-60" />

                    <div className="absolute bottom-16 left-12 right-12">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-3">
                                <span className="w-12 h-[2px] bg-[#e63030]" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/60">Featured Series</span>
                            </div>
                            <div>
                                <h2 className="text-6xl font-black text-white italic tracking-tighter leading-[0.9] drop-shadow-2xl">
                                    THE VERSE <br /> <span className="text-[#e63030]">AWAKENING</span>
                                </h2>
                                <p className="text-white/40 text-sm mt-6 max-w-sm leading-relaxed font-medium">
                                    Experience the next generation of anime social interaction. Connect, watch, and battle in the ultimate community.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="flex flex-col items-center justify-center relative lg:pr-12">
                    <div className="w-full max-w-[450px] min-h-[660px] bg-black/80 backdrop-blur-md rounded-[4px] px-16 py-16 flex flex-col shadow-2xl relative z-10">

                        {/* Headline */}
                        <h1 className="text-[32px] font-bold text-white mb-7">
                            {mode === "signin" ? "Sign In" : "Sign Up"}
                        </h1>

                        {/* Auth Form */}
                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                            {error && (
                                <div className="bg-[#e87c03] text-white text-[13px] py-3.5 px-5 rounded-[4px] font-medium mb-4">
                                    {error}
                                </div>
                            )}

                            {mode === "signup" && (
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        className="w-full bg-[#333] border-none rounded-[4px] px-5 py-4 text-[16px] text-white placeholder:text-[#8c8c8c] outline-none focus:bg-[#454545] transition-all"
                                    />
                                </div>
                            )}

                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Email or phone number"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-[#333] border-none rounded-[4px] px-5 py-4 text-[16px] text-white placeholder:text-[#8c8c8c] outline-none focus:bg-[#454545] transition-all"
                                />
                            </div>

                            <div className="relative">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-[#333] border-none rounded-[4px] px-5 py-4 text-[16px] text-white placeholder:text-[#8c8c8c] outline-none focus:bg-[#454545] transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#e50914] hover:bg-[#f40612] transition-colors text-white py-3.5 rounded-[4px] font-bold text-[16px] mt-6 shadow-md active:scale-[0.99] disabled:opacity-50"
                            >
                                {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Get Started"}
                            </button>

                            <div className="flex items-center justify-between mt-3 text-[#b3b3b3]">
                                <div className="flex items-center gap-1.5">
                                    <input type="checkbox" id="remember" className="w-4 h-4 rounded-sm bg-[#333] border-none accent-[#b3b3b3]" />
                                    <label htmlFor="remember" className="text-[13px] font-medium cursor-pointer">Remember me</label>
                                </div>
                                <button type="button" className="text-[13px] hover:underline font-medium">
                                    Need help?
                                </button>
                            </div>
                        </form>

                        {/* Bottom Section */}
                        <div className="mt-10 space-y-4">
                            <div className="flex items-center gap-2 text-[#737373] text-[16px]">
                                {mode === "signin" ? "New to AnimeVerse?" : "Already have an account?"}
                                <button
                                    onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                                    className="text-white hover:underline font-medium"
                                >
                                    {mode === "signin" ? "Sign up now" : "Sign in now"}
                                </button>
                            </div>

                            <p className="text-[13px] text-[#8c8c8c] leading-tight">
                                This page is protected by Google reCAPTCHA to ensure you're not a bot. <button className="text-[#0071eb] hover:underline">Learn more.</button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
                    50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
                }
                .animate-float {
                    animation-name: float;
                    animation-iteration-count: infinite;
                    animation-timing-function: ease-in-out;
                }
            `}</style>
        </div>
    );
}
