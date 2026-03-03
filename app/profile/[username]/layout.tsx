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
    const [loading, setLoading] = useState(true);

    const isOwnProfile = currentUser?.username === profileUsername;

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await api.user.getProfile(profileUsername);
                if (res) {
                    setProfileData(res.data || res);
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
            setLoading(false);
        };
        fetchProfile();
    }, [profileUsername]);

    const handleProfileUpdated = async () => {
        await refreshUser();
        try {
            const res = await api.user.getProfile(currentUser?.username || profileUsername);
            const data = res.data || res;
            setProfileData(data);
            if (data.username && data.username !== profileUsername) {
                router.replace(`/profile/${data.username}`);
            }
        } catch { }
    };

    const user = {
        username: profileData?.username || profileUsername || "Unnamed",
        avatar: profileData?.avatar_url || (isOwnProfile && currentUser?.avatar_url) ? (profileData?.avatar_url || currentUser?.avatar_url || "/default-avatar.png") : "/default-avatar.png",
        bio: profileData?.bio || (isOwnProfile ? currentUser?.bio : "") || "",
        tags: profileData?.genres || (isOwnProfile ? currentUser?.genres : []) || [],
        isVip: true,
    };

    return (
        <div className="relative min-h-screen bg-[#0b0b0f] text-white font-sans">
            <Navbar />
            <main className="pt-28 pb-20 px-6 lg:px-12 max-w-[1700px] mx-auto min-h-screen">
                {loading ? (
                    <div className="flex items-center justify-center py-40">
                        <div className="w-12 h-12 border-2 border-white/5 border-t-[#e63030] animate-spin rounded-full shadow-[0_0_20px_rgba(230,48,48,0.2)]" />
                    </div>
                ) : (
                    <>
                        <ProfileHero user={user} isOwnProfile={isOwnProfile} onProfileUpdated={handleProfileUpdated} />
                        <ProfileTabs username={profileUsername} />
                        {children}
                    </>
                )}
            </main>
            <footer className="h-24 bg-[#0b0b0f]" />
        </div>
    );
}
