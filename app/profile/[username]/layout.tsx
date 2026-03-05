"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";
import Navbar from "@/src/components/Navbar/Navbar";
import ProfileHero from "@/src/components/Profile/ProfileHero";
import ProfileTabs from "@/src/components/Profile/ProfileTabs";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const router = useRouter();
    const { user: currentUser, refreshUser } = useAuth();
    const profileUsername = params.username as string;

    const [profileData, setProfileData] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // isOwnProfile moved down

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [pRes, sRes] = await Promise.all([
                    api.user.getProfile(profileUsername),
                    api.user.getStats(profileUsername)
                ]);
                if (pRes) setProfileData(pRes.data || pRes);
                if (sRes) setStats(sRes.data || sRes);
            } catch (err) {
                console.error("Failed to fetch profile/stats", err);
            }
            setLoading(false);
        };
        fetchAll();
    }, [profileUsername]);

    const handleProfileUpdated = async () => {
        await refreshUser();
        try {
            const [pRes, sRes] = await Promise.all([
                api.user.getProfile(currentUser?.username || profileUsername),
                api.user.getStats(currentUser?.username || profileUsername)
            ]);
            const data = pRes.data || pRes;
            setProfileData(data);
            setStats(sRes.data || sRes);
            if (data.username && data.username !== profileUsername) {
                router.replace(`/profile/${data.username}`);
            }
        } catch { }
    };

    const isInvalidUsername = (u: any) => !u || String(u).trim() === "null" || String(u).trim() === "undefined" || String(u).trim() === "unset";

    // An empty or invalid currentUser username means they are routing to /profile/unset or /profile/null
    const isOwnProfile = Boolean(
        currentUser?.username === profileUsername ||
        (currentUser && isInvalidUsername(currentUser.username) && isInvalidUsername(profileUsername))
    );

    const safeUsername = !isInvalidUsername(profileData?.username)
        ? profileData.username
        : (!isInvalidUsername(profileUsername) ? profileUsername : "User");

    const user = {
        username: safeUsername,
        avatar: profileData?.avatar_url || (isOwnProfile ? currentUser?.avatar_url : "") || "/default-avatar.png",
        banner: profileData?.banner_url || (isOwnProfile ? currentUser?.banner_url : "") || null,
        bio: profileData?.bio || (isOwnProfile ? currentUser?.bio : "") || "No combat record found.",
        tags: profileData?.genres || (isOwnProfile ? currentUser?.genres : []) || [],
        isVip: true,
    };

    return (
        <div className="relative min-h-screen bg-[#000000] text-white font-sans">
            <Navbar />
            <main className="pt-32 pb-24 px-6 lg:px-12 max-w-[1700px] mx-auto min-h-screen flex flex-col gap-20">
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <div className="w-12 h-12 border-2 border-white/5 border-t-[#e63030] animate-spin rounded-full shadow-[0_0_20px_rgba(230,48,48,0.2)]" />
                    </div>
                ) : (
                    <div className="w-full flex flex-col gap-12 sm:gap-24">
                        <div className="max-w-5xl mx-auto w-full">
                            <ProfileHero
                                user={user}
                                stats={stats}
                                isOwnProfile={isOwnProfile}
                                onProfileUpdated={handleProfileUpdated}
                            />
                        </div>

                        <div className="w-full border-y border-white/5 bg-white/[0.01]">
                            <ProfileTabs username={profileUsername} />
                        </div>

                        <div className="max-w-[1520px] mx-auto w-full px-4 lg:px-8">
                            {children}
                        </div>
                    </div>
                )}
            </main>
            <footer className="h-24 bg-[#000000]" />
        </div>
    );
}
