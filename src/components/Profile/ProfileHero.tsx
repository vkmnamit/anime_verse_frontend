"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

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
        <div className="relative w-full rounded-none overflow-hidden mb-12 group border border-white/[0.04] bg-[#000000]">

            {/* ── Banner ────────────────────────────────────────────────────── */}
            <div
                className={`relative h-72 md:h-96 w-full overflow-hidden bg-[#000000] ${isOwnProfile ? "cursor-pointer" : ""}`}
                onClick={() => isOwnProfile && bannerInputRef.current?.click()}
            >
                <Image
                    src={bannerSrc || "https://images.unsplash.com/photo-1462331940025-496df975641f?w=1600&h=600&fit=crop&q=100"}
                    alt="Cover"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/80 via-transparent to-transparent" />

                {/* Banner hover overlay */}
                {isOwnProfile && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-all z-10 opacity-0 hover:opacity-100">
                        {uploadingBanner ? (
                            <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-[11px] text-white font-bold uppercase tracking-widest">Change Banner</span>
                            </div>
                        )}
                    </div>
                )}

                <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage(file, "banners", "banner_url");
                        e.target.value = "";
                    }}
                />
            </div>

            {/* ── Profile Info Overlay ───────────────────────────────────────── */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 pointer-events-none">
                <div className="flex flex-col md:flex-row md:items-end gap-8 pointer-events-auto">

                    {/* Avatar */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-[6px] border-[#000000] shadow-[0_0_60px_rgba(0,0,0,0.8)] relative z-10 bg-[#000000]">
                            <Image src={avatarSrc} alt={user.username} fill className="object-cover" />
                            {uploadingAvatar && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                                    <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                        </div>
                        {/* + upload button */}
                        {isOwnProfile && (
                            <>
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-9 h-9 bg-[#e63030] rounded-full border-4 border-[#000000] z-20 flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadImage(file, "avatars", "avatar_url");
                                        e.target.value = "";
                                    }}
                                />
                            </>
                        )}
                    </div>

                    {/* Text Info */}
                    <div className="flex-1 flex flex-col gap-3 pb-2">

                        {/* Username */}
                        <div className="flex items-center gap-3">
                            {editingUsername ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={usernameVal}
                                        onChange={e => setUsernameVal(e.target.value)}
                                        onBlur={saveUsername}
                                        onKeyDown={e => {
                                            if (e.key === "Enter") e.currentTarget.blur();
                                            if (e.key === "Escape") { setEditingUsername(false); setUsernameVal(user.username); }
                                        }}
                                        className="text-2xl md:text-3xl font-black text-white tracking-tight bg-white/10 border border-white/20 rounded-lg px-3 py-1 outline-none focus:border-[#e63030]/60 uppercase italic min-w-[180px]"
                                    />
                                    {savingUsername && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />}
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-2xl italic uppercase">
                                        {usernameVal || user.username}
                                    </h1>
                                    {isOwnProfile && (
                                        <button
                                            onClick={() => setEditingUsername(true)}
                                            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all opacity-50 hover:opacity-100 shrink-0"
                                            title="Edit username"
                                        >
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Followers / Following */}
                        <div className="flex items-center gap-6">
                            <div className="cursor-pointer group/stat">
                                <span className="text-white font-black text-2xl tracking-tighter">{stats?.follower_count || 0}</span>
                                <span className="ml-3 text-white/40 text-[13px] font-medium group-hover/stat:text-white/60 transition-colors">Followers</span>
                            </div>
                            <div className="cursor-pointer group/stat">
                                <span className="text-white font-black text-2xl tracking-tighter">{stats?.following_count || 0}</span>
                                <span className="ml-3 text-white/40 text-[13px] font-medium group-hover/stat:text-white/60 transition-colors">Following</span>
                            </div>
                        </div>

                        {/* Bio */}
                        {editingBio ? (
                            <div className="flex flex-col gap-2 max-w-2xl">
                                <textarea
                                    autoFocus
                                    value={bioVal}
                                    onChange={e => setBioVal(e.target.value)}
                                    onBlur={saveBio}
                                    onKeyDown={e => {
                                        if (e.key === "Escape") setEditingBio(false);
                                        if (e.key === "Enter" && e.ctrlKey) e.currentTarget.blur();
                                    }}
                                    placeholder="Write something about yourself…"
                                    maxLength={300}
                                    rows={3}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-[15px] text-white/90 outline-none resize-none focus:border-[#e63030]/60 placeholder:text-white/30 italic leading-relaxed"
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] text-white/30">{bioVal.length}/300</span>
                                    <div className="flex items-center gap-2">
                                        {savingBio && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                        <button onClick={() => { setEditingBio(false); setBioVal(user.bio === "No combat record found." ? "" : user.bio); }} className="px-3 py-1.5 text-white/40 text-[11px] font-bold uppercase tracking-widest hover:text-white transition-colors">Cancel</button>
                                        <button onClick={saveBio} className="px-4 py-1.5 bg-[#e63030] text-white text-[11px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#ff4545] transition-colors">Save</button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-2 max-w-2xl group/bio">
                                <p className="text-white/70 text-lg md:text-xl leading-relaxed font-medium italic flex-1">
                                    {bioVal || (isOwnProfile
                                        ? <span className="text-white/25 text-base not-italic font-normal">Add a bio…</span>
                                        : user.bio)}
                                </p>
                                {isOwnProfile && (
                                    <button
                                        onClick={() => setEditingBio(true)}
                                        className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all opacity-0 group-hover/bio:opacity-100 mt-1 shrink-0"
                                        title="Edit bio"
                                    >
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Follow button — other users only */}
                    {!isOwnProfile && (
                        <div className="self-start md:self-end">
                            <button
                                onClick={handleFollowToggle}
                                disabled={followingLoading}
                                className={`px-10 py-4 ${stats?.is_following ? "bg-white/5 hover:bg-white/10 text-white border border-white/10" : "bg-white hover:bg-white/90 text-black"} text-[12px] font-black uppercase tracking-[0.2em] rounded-none transition-all active:scale-95 disabled:opacity-50 min-w-[180px]`}
                            >
                                {followingLoading ? "…" : (stats?.is_following ? "Following" : "Follow")}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
