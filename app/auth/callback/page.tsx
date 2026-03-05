"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";

export default function AuthCallbackPage() {
    const router = useRouter();
    const { setTokenAndUser } = useAuth();
    const [status, setStatus] = useState<"loading" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase writes the session into the URL hash/query — getSession picks it up
                const { data, error } = await supabase.auth.getSession();

                if (error || !data.session) {
                    throw new Error(error?.message || "No session found after OAuth.");
                }

                const accessToken = data.session.access_token;

                // Fetch the user profile from our backend (same as email/password flow)
                const userData = await api.auth.me(accessToken);
                const user = userData.data || userData;

                // Store into AuthContext + localStorage
                setTokenAndUser(accessToken, user);

                // Redirect to discover
                router.replace("/discover");
            } catch (err: any) {
                console.error("OAuth callback error:", err);
                setErrorMsg(err.message || "Authentication failed.");
                setStatus("error");
            }
        };

        handleCallback();
    }, []);  // eslint-disable-line react-hooks/exhaustive-deps

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
