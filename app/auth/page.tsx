"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/src/context/AuthContext";

function AuthForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, login, signup } = useAuth();

    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (user) {
            setIsRedirecting(true);
            const rawRedirect = searchParams?.get('redirect');
            const destination = (rawRedirect && !rawRedirect.startsWith('/auth'))
                ? rawRedirect
                : '/discover';
            router.replace(destination);
            return;
        }
        const oauthError = searchParams?.get('error');
        if (oauthError) setError(decodeURIComponent(oauthError));
    }, [searchParams, router, user]);

    if (user || isRedirecting) {
        return (
            <div className="fixed inset-0 bg-[#0b0b0f] flex items-center justify-center z-[100]">
                <div className="w-12 h-12 border-4 border-[#e63030] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (mode === "signin") {
                if (!email) throw new Error("Please enter your email.");
                if (!password) throw new Error("Please enter your password.");
                await login({ email: email.trim(), password });
            } else {
                const emailTrim = email.trim();
                if (!emailTrim) throw new Error("Please enter your email.");
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim)) throw new Error("Please enter a valid email address.");
                if (!username) throw new Error("Username is required.");
                if (!password) throw new Error("Please enter a password.");
                if (password.length < 8) throw new Error("Password must be at least 8 characters.");
                await signup({ email: emailTrim, password, username });
            }
            const redirectUrl = searchParams?.get('redirect') || '/discover';
            router.push(redirectUrl);
        } catch (err: any) {
            setError(err.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center relative p-4 font-sans selection:bg-[#e63030]/30 selection:text-white">

            {/* Cinematic Background Art */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(230,48,48,0.15),transparent_60%)]" />
            </div>

            {/* --- POPUP BOX (Center) --- */}
            <div className="w-full max-w-[425px] min-h-[460px] my-8 bg-white/[0.01] backdrop-blur-[12px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative z-10 flex flex-col gap-5 px-5 sm:px-[34px] py-7 sm:py-[32px] rounded-3xl sm:rounded-[32px] animate-in fade-in zoom-in duration-500">

                {/* Close Button */}
                <button
                    onClick={() => router.back()}
                    className="absolute top-[21px] right-[34px] text-white/40 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header */}
                <div className="text-center">
                    <h2 className="text-[22px] font-bold text-white tracking-tight">
                        {mode === "signin" ? "Sign in to" : "Sign up to"} <span className="text-[#e63030]">Anime</span>Verse
                    </h2>
                </div>

                {/* Social Login Section */}
                <div className="flex justify-center w-full">
                    <div className="relative w-[223px] h-[64px] flex items-center justify-center rounded-[50px] border border-white/10 bg-white/[0.02]">
                        <span className="absolute -top-[12px] left-1/2 -translate-x-1/2 bg-[#0b0b0f] px-3 py-0.5 text-[10px] font-bold text-white/50 uppercase tracking-widest whitespace-nowrap rounded-full border border-white/10">
                            Sign in with
                        </span>
                        <div className="flex items-center justify-center gap-5">
                            <button onClick={() => { }} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            </button>
                            <button onClick={() => { }} className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center hover:scale-110 transition-transform">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
                            </button>
                            <button onClick={() => { }} className="w-10 h-10 rounded-full bg-[#5865F2] flex items-center justify-center hover:scale-110 transition-transform">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 640 512"><path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.131a1.712,1.712,0,0,0-.788.676C39.1,183.687,18.18,294.586,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.819,1.819,0,0,0-1.017-2.526,311.23,311.23,0,0,1-45.694-21.722,1.841,1.841,0,0,1-.173-3.056c3.048-2.288,6.1-4.664,8.995-7.11a1.8,1.8,0,0,1,1.889-.24c94.7,43.259,197.35,43.259,291.139,0a1.8,1.8,0,0,1,1.905.234c2.9,2.451,5.952,4.827,9.006,7.121a1.845,1.845,0,0,1-.167,3.056,330.046,330.046,0,0,1-45.7,21.722,1.828,1.828,0,0,0-1.017,2.536,368.611,368.611,0,0,0,29.983,48.818,1.882,1.882,0,0,0,2.062.684A485.925,485.925,0,0,0,610.7,405.729a1.88,1.88,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1s53.305,26.587,52.844,59.239S251.463,337.58,222.491,337.58Zm195.38,0c-28.972,0-52.844-26.587-52.844-59.239S388.437,219.1,417.871,219.1s53.305,26.587,52.844,59.239S446.843,337.58,417.871,337.58Z" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-[1px] bg-white/10" />
                    <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Or</span>
                    <div className="flex-1 h-[1px] bg-white/10" />
                </div>

                {/* Form Area */}
                <form onSubmit={handleSubmit} className="flex flex-col items-center gap-[18px]">
                    {mode === "signup" && (
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full h-[46px] bg-transparent border border-white/10 rounded-[16px] px-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[#e63030]/50 transition-colors"
                            required
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-[46px] bg-transparent border border-white/10 rounded-[16px] px-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[#e63030]/50 transition-colors"
                        required
                    />

                    <div className="relative w-full h-[46px]">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-full bg-transparent border border-white/10 rounded-[16px] px-[14px] text-white placeholder-white/20 focus:outline-none focus:border-[#e63030]/50 transition-colors"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-[14px] top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest">{showPassword ? "Hide" : "Show"}</span>
                        </button>
                    </div>

                    {error && <p className="text-[#e63030] text-[12px] font-bold text-center mt-[-6px] animate-shake">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[46px] bg-[#e63030] hover:bg-[#ff4545] text-white font-bold rounded-xl transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(230,48,48,0.3)] disabled:opacity-50"
                    >
                        {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Sign Up"}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-4 text-[13px] text-white/40">
                    {mode === "signin" ? (
                        <>Don't have an account? <button onClick={() => setMode("signup")} className="text-white hover:underline font-bold">Sign up</button></>
                    ) : (
                        <>Already have an account? <button onClick={() => setMode("signin")} className="text-white hover:underline font-bold">Sign in</button></>
                    )}
                </div>

                {/* Compliance Text */}
                <div className="mt-6 pt-4 border-t border-white/5 text-center">
                    <p className="text-[11px] text-white/20 leading-relaxed px-4">
                        By signing up you confirm that you are over 12 years old and agree to the <Link href="/terms" className="underline hover:text-white transition-colors">Terms and Conditions</Link>
                    </p>
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
            `}</style>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center text-white italic tracking-widest uppercase text-sm">Synchronizing Verse...</div>}>
            <AuthForm />
        </Suspense>
    );
}