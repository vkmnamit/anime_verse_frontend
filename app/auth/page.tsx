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
        <div className="min-h-screen bg-[#0b0b0f] flex overflow-hidden font-sans selection:bg-[#e63030]/30 selection:text-white">

            {/* --- LEFT SIDE: CINEMATIC ARTWORK --- */}
            <div className="hidden lg:flex w-[50%] relative overflow-hidden group border-r border-white/5">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="Anime Art"
                    fill
                    className="object-cover transition-transform duration-[20000ms] ease-out group-hover:scale-110"
                    priority
                />

                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-[#0b0b0f]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-black/40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(230,48,48,0.15),transparent_70%)]" />

                {/* Abstract "Embers" Overlay */}
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-red-500 rounded-full blur-[2px] animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full blur-[2px] animate-bounce" />
                    <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white/30 rounded-full blur-[1px]" />
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-[10%] left-[8%] z-10 max-w-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <span className="w-16 h-[2px] bg-[#e63030]" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50">Experience the Verse</span>
                    </div>
                    <h2 className="text-[80px] font-black text-white italic tracking-tighter leading-[0.85] drop-shadow-[0_20px_50px_rgba(0,0,0,1)] uppercase">
                        The ultimate <br /> <span className="text-[#e63030]">community</span> <br /> hub
                    </h2>
                </div>
            </div>

            {/* --- RIGHT SIDE: AUTH FORM --- */}
            <div className="w-full lg:w-[50%] flex flex-col items-center justify-center relative p-8 md:p-12 lg:p-24 overflow-y-auto overflow-x-hidden no-scrollbar">

                {/* Background Ambient Glows */}
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e63030]/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="w-full max-w-[500px] flex flex-col items-center relative z-10">

                    {/* Brand Logo & Tagline */}
                    <div className="mb-14 text-center">
                        <h1 className="text-[44px] font-black italic tracking-tighter leading-none mb-3">
                            <span className="text-[#e63030]">Anime</span><span className="text-white">Verse</span>
                        </h1>
                        <p className="text-white/40 text-[13px] font-bold tracking-[0.1em] uppercase italic">
                            Join the ultimate anime social universe
                        </p>
                    </div>

                    {/* Elite Auth Container */}
                    <div className="w-full bg-[#12121e]/80 backdrop-blur-[40px] border border-white/[0.06] rounded-[32px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] transition-all duration-500 hover:border-white/[0.1]">

                        {/* Interactive Tab Strategy */}
                        <div className="flex border-b border-white/[0.04] bg-white/[0.02]">
                            <button
                                onClick={() => setMode("signin")}
                                className={`flex-1 py-6 text-[13px] font-black uppercase tracking-[0.2em] transition-all relative group ${mode === 'signin' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
                            >
                                <span className="relative z-10">Sign In</span>
                                {mode === 'signin' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#e63030] to-transparent shadow-[0_0_20px_#e63030]" />
                                )}
                                <div className="absolute inset-0 bg-[#e63030]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button
                                onClick={() => setMode("signup")}
                                className={`flex-1 py-6 text-[13px] font-black uppercase tracking-[0.2em] transition-all relative group ${mode === 'signup' ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
                            >
                                <span className="relative z-10">Sign Up</span>
                                {mode === 'signup' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#e63030] to-transparent shadow-[0_0_20px_#e63030]" />
                                )}
                                <div className="absolute inset-0 bg-[#e63030]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>

                        {/* High-Performance Form Area */}
                        <div className="p-10 md:p-14">
                            <form onSubmit={handleSubmit} className="space-y-7">
                                {error && (
                                    <div className="bg-[#e63030]/15 border border-[#e63030]/30 text-[#e63030] text-[12px] p-5 rounded-2xl animate-shake flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-[#e63030] flex items-center justify-center shrink-0">
                                            <span className="text-white text-lg font-black italic">!</span>
                                        </div>
                                        <p className="font-bold tracking-tight">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-5">
                                    {mode === "signup" && (
                                        <div className="group relative">
                                            <input
                                                type="text"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-8 py-5 text-[15px] text-white placeholder:text-white/20 outline-none transition-all focus:border-[#e63030]/50 focus:bg-white/[0.08]"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="group relative">
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-8 py-5 text-[15px] text-white placeholder:text-white/20 outline-none transition-all focus:border-[#e63030]/50 focus:bg-white/[0.08]"
                                            required
                                        />
                                    </div>

                                    <div className="group relative">
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-8 py-5 text-[15px] text-white placeholder:text-white/20 outline-none transition-all focus:border-[#e63030]/50 focus:bg-white/[0.08]"
                                            required
                                        />
                                        <button type="button" className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 hover:text-white/40 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative group w-full h-[64px] bg-[#e63030] text-white rounded-2xl text-[14px] font-black uppercase tracking-[0.25em] shadow-[0_20px_50px_rgba(230,48,48,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-[800ms] pointer-events-none" />
                                    <span className="relative z-10">{loading ? "Synchronizing..." : mode === 'signin' ? "Engage Session" : "Awaken Profile"}</span>
                                </button>

                                <div className="text-center pt-2">
                                    <button type="button" className="text-[11px] font-black text-white/20 hover:text-[#e63030] transition-all uppercase tracking-[0.1em] italic">
                                        Request Access Recovery?
                                    </button>
                                </div>

                                {/* Dynamic Social Bridge */}
                                <div className="relative pt-6 pb-2 flex items-center justify-center">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.05]"></div></div>
                                    <span className="relative bg-[#12121e] px-6 text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">Integrated Sign-on</span>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <button type="button" className="flex items-center justify-center gap-4 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10 rounded-2xl py-4.5 transition-all group active:scale-95">
                                        <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                        <span className="text-[12px] font-black text-white/50 group-hover:text-white tracking-widest uppercase">Google</span>
                                    </button>
                                    <button type="button" className="flex items-center justify-center gap-4 bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/10 rounded-2xl py-4.5 transition-all group active:scale-95">
                                        <svg className="w-5 h-5" viewBox="0 0 640 512" fill="currentColor"><path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.131a1.712,1.712,0,0,0-.788.676C39.1,183.687,18.18,294.586,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.819,1.819,0,0,0-1.017-2.526,311.23,311.23,0,0,1-45.694-21.722,1.841,1.841,0,0,1-.173-3.056c3.048-2.288,6.1-4.664,8.995-7.11a1.8,1.8,0,0,1,1.889-.24c94.7,43.259,197.35,43.259,291.139,0a1.8,1.8,0,0,1,1.905.234c2.9,2.451,5.952,4.827,9.006,7.121a1.845,1.845,0,0,1-.167,3.056,330.046,330.046,0,0,1-45.7,21.722,1.828,1.828,0,0,0-1.017,2.536,368.611,368.611,0,0,0,29.983,48.818,1.882,1.882,0,0,0,2.062.684A485.925,485.925,0,0,0,610.7,405.729a1.88,1.88,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1s53.305,26.587,52.844,59.239S251.463,337.58,222.491,337.58Zm195.38,0c-28.972,0-52.844-26.587-52.844-59.239S388.437,219.1,417.871,219.1s53.305,26.587,52.844,59.239S446.843,337.58,417.871,337.58Z" /></svg>
                                        <span className="text-[12px] font-black text-white/50 group-hover:text-white tracking-widest uppercase">Discord</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Elite Footer Bridge */}
                    <nav className="mt-12 w-full flex items-center justify-center gap-10">
                        {['Discover', 'Browse', 'Community', 'Trending'].map(item => (
                            <Link key={item} href={`/${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10 hover:text-[#e63030] transition-colors">{item}</Link>
                        ))}
                    </nav>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-4px); }
                    75% { transform: translateX(4px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
