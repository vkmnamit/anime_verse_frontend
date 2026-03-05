"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";

function OAuthCallbackInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setTokenAndUser } = useAuth();
    const [status, setStatus] = useState<"loading" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const code = searchParams?.get("code");

                if (!code) {
                    throw new Error("No authorization code found in the URL.");
                }

                // Send code to backend — it does the Supabase exchange server-side
                const res = await api.auth.oauthCallback(code);
                const { user, session } = res.data || res;

                if (!session?.access_token) {
                    throw new Error("No session returned from server.");
                }

                setTokenAndUser(session.access_token, user);
                router.replace("/discover");
            } catch (err: any) {
                console.error("OAuth callback error:", err);
                setErrorMsg(err.message || "Authentication failed.");
                setStatus("error");
            }
        };

        handleCallback();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (status === "error") {
        return (
            <div className="min-h-screen bg-[#0b0b0f] flex flex-col items-center justify-center gap-4 text-white">
                <p className="text-red-400 text-lg font-semibold">Authentication failed</p>
                <p className="text-white/60 text-sm">{errorMsg}</p>
                <button
                    onClick={() => router.replace("/auth")}
                    className="mt-2 px-6 py-2 bg-[#e63030] rounded-xl text-white font-semibold hover:bg-[#c92020] transition-colors"
                >
                    Back to Sign In
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0b0f] flex flex-col items-center justify-center gap-4 text-white">
            <div className="w-10 h-10 border-4 border-[#e63030] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Signing you in…</p>
        </div>
    );
}

import { Suspense } from "react";

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0b0b0f] flex flex-col items-center justify-center gap-4 text-white">
                <div className="w-10 h-10 border-4 border-[#e63030] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <OAuthCallbackInner />
        </Suspense>
    );
}
