"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProfileHeroProps {
    user: {
        username: string;
        avatar: string;
        banner?: string | null;
        bio: string;
        tags: string[];
        isVip?: boolean;
    };
    stats?: {
        follower_count: number;
        following_count: number;
        is_following: boolean;
        reactions_given: number;
        opinions_posted: number;
    } | null;
    isOwnProfile?: boolean;
    onProfileUpdated?: () => void;
}

export default function ProfileHero({ user, stats, isOwnProfile, onProfileUpdated }: ProfileHeroProps) {
    const { token, setUser } = useAuth();
    const router = useRouter();

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    // Optimistic local image state
    const [avatarSrc, setAvatarSrc] = useState<string>(user.avatar || "/default-avatar.png");
    const [bannerSrc, setBannerSrc] = useState<string | null | undefined>(user.banner);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingBanner, setUploadingBanner] = useState(false);

    // Inline edit state
    const [editingUsername, setEditingUsername] = useState(false);
    const [editingBio, setEditingBio] = useState(false);
    const [usernameVal, setUsernameVal] = useState(user.username);
    const [bioVal, setBioVal] = useState(user.bio === "No combat record found." ? "" : user.bio);
    const [savingUsername, setSavingUsername] = useState(false);
    const [savingBio, setSavingBio] = useState(false);

    const [followingLoading, setFollowingLoading] = useState(false);

    // ── Upload helpers ─────────────────────────────────────────────────────────
    const uploadImage = async (file: File, folder: "avatars" | "banners", field: "avatar_url" | "banner_url") => {
        if (!token) return;
        if (field === "avatar_url") setUploadingAvatar(true);
        else setUploadingBanner(true);
        try {
            const { url } = await api.upload.file(file, folder, token);
            await api.user.updateProfile({ [field]: url }, token);
            if (field === "avatar_url") {
                setAvatarSrc(url);
                setUser((prev: any) => ({ ...prev, avatar_url: url }));
            } else {
                setBannerSrc(url);
                setUser((prev: any) => ({ ...prev, banner_url: url }));
            }
            if (onProfileUpdated) onProfileUpdated();
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            if (field === "avatar_url") setUploadingAvatar(false);
            else setUploadingBanner(false);
        }
    };

    // ── Save text fields ───────────────────────────────────────────────────────
    const saveUsername = async () => {
        if (!token || !usernameVal.trim() || usernameVal.trim() === user.username) {
            setEditingUsername(false);
            setUsernameVal(user.username);
            return;
        }
        setSavingUsername(true);
        try {
            const res = await api.user.updateProfile({ username: usernameVal.trim() }, token);
            const updated = res.data || res;
            setUser((prev: any) => ({ ...prev, ...updated }));
            if (onProfileUpdated) onProfileUpdated();
        } catch (err: any) {
            console.error("Username save failed", err);
            setUsernameVal(user.username);
        } finally {
            setSavingUsername(false);
            setEditingUsername(false);
        }
    };

    const saveBio = async () => {
        if (!token) { setEditingBio(false); return; }
        setSavingBio(true);
        try {
            const res = await api.user.updateProfile({ bio: bioVal.trim() }, token);
            const updated = res.data || res;
            setUser((prev: any) => ({ ...prev, ...updated }));
            if (onProfileUpdated) onProfileUpdated();
        } catch (err: any) {
            console.error("Bio save failed", err);
        } finally {
            setSavingBio(false);
            setEditingBio(false);
        }
    };

    // ── Follow toggle ──────────────────────────────────────────────────────────
    const handleFollowToggle = async () => {
        if (!token || !user.username) return;
        setFollowingLoading(true);
        try {
            if (stats?.is_following) {
                await api.user.unfollow(user.username, token);
            } else {
                await api.user.follow(user.username, token);
            }
            if (onProfileUpdated) onProfileUpdated();
        } catch (err) {
            console.error("Follow toggle failed", err);
        } finally {
            setFollowingLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto mb-20 group">
            {/* ── Main Profile Card ─────────────────────────────────────────── */}
            <div className="relative bg-[#000000] border border-white/5 rounded-[48px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)]">

                {/* Immersive Header (Banner) */}
                <div
                    className={`relative h-80 md:h-[450px] w-full overflow-hidden ${isOwnProfile ? "cursor-pointer" : ""}`}
                    onClick={() => isOwnProfile && bannerInputRef.current?.click()}
                >
                    <Image
                        src={bannerSrc || "https://images.unsplash.com/photo-1462331940025-496df975641f?w=1600&h=600&fit=crop&q=100"}
                        alt="Cover"
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90"
                        priority
                    />

                    {/* Gradient Overlay for visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60" />

                    {/* Banner Control Overlay */}
                    {isOwnProfile && (
                        <div className="absolute top-8 right-8 z-20">
                            {uploadingBanner ? (
                                <div className="w-10 h-10 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <button className="flex items-center gap-2 bg-black/40 hover:bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 transition-all">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="text-[11px] text-white font-bold uppercase tracking-widest">Change Cover</span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Floating Navigation/Actions at top left (Optional, mimicking Dribbble arrow) */}
                    <div className="absolute top-8 left-8 flex gap-4">
                        <button
                            onClick={() => router.back()}
                            className="w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/50 backdrop-blur-xl border border-white/10 rounded-full transition-all"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Info & Identity Section */}
                <div className="relative px-8 md:px-16 pb-16 -mt-24 md:-mt-32 z-10 flex flex-col md:flex-row md:items-end justify-between gap-10">

                    {/* Left: Avatar & Text */}
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-10 text-center md:text-left">

                        {/* Avatar */}
                        <div className="relative group/avatar">
                            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-[8px] border-[#000000] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative bg-[#000000] pointer-events-auto">
                                <Image src={avatarSrc} alt={user.username} fill className="object-cover" />
                                {uploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                                        <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>

                            {/* Online/Status Indicator */}
                            <div className="absolute bottom-5 right-5 w-8 h-8 bg-[#10b981] border-[5px] border-[#000000] rounded-full z-20 shadow-lg" />

                            {isOwnProfile && (
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center rounded-full z-30 pointer-events-auto"
                                >
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                                        <span className="text-white text-3xl font-light">+</span>
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Name & Handle */}
                        <div className="flex flex-col gap-2 pb-2">
                            <div className="flex flex-col">
                                <h1 className="text-3xl md:text-5xl font-black text-white selection:bg-[#e63030]/30">
                                    {user.username}
                                    {user.isVip && <span className="ml-3 text-lg align-middle">💎</span>}
                                </h1>
                                <p className="text-white/40 font-bold text-lg md:text-xl tracking-tight">
                                    @{user.username.toLowerCase().replace(/\s+/g, '')}
                                </p>
                            </div>

                            {/* Stats Inline */}
                            <div className="flex items-center justify-center md:justify-start gap-4 text-white/60 font-medium pt-2">
                                <span className="flex items-center gap-2">
                                    <strong className="text-white font-black">{stats?.follower_count || 0}</strong> followers
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <span className="flex items-center gap-2">
                                    <strong className="text-white font-black">{stats?.following_count || 0}</strong> following
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex gap-4 self-center md:self-end pb-2">
                        {!isOwnProfile ? (
                            <>
                                <button className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full transition-all group/action">
                                    <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={handleFollowToggle}
                                    disabled={followingLoading}
                                    className={`px-10 py-4 ${stats?.is_following ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' : 'bg-white hover:bg-white/90 text-black'} text-[14px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95 disabled:opacity-50 min-w-[160px] shadow-xl`}
                                >
                                    {followingLoading ? "..." : (stats?.is_following ? "Following" : "Follow")}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => router.push("/settings/profile")}
                                className="px-12 py-4 bg-[#e63030] hover:bg-[#ff3b3b] text-white text-[14px] font-black uppercase tracking-widest rounded-full transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(230,48,48,0.5)]"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Bio Section at Bottom of Card */}
                <div className="px-8 md:px-16 pb-12">
                    <div className="max-w-3xl">
                        <p className="text-white/70 text-lg md:text-xl leading-relaxed font-medium">
                            {user.bio || "No combat record found."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Hidden inputs */}
            <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file, "avatars", "avatar_url");
                }}
            />
            <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadImage(file, "banners", "banner_url");
                }}
            />
        </div>
    );
}
