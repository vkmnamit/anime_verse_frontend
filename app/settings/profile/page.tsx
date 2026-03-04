"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";
import Image from "next/image";

export default function ProfileSettingsPage() {
    const { user, token, setUser } = useAuth();

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [savedUsername, setSavedUsername] = useState("");
    const [savedBio, setSavedBio] = useState("");

    const [saving, setSaving] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setBio(user.bio || "");
            setSavedUsername(user.username || "");
            setSavedBio(user.bio || "");
        }
    }, [user]);

    const saveField = async (field: "username" | "bio", value: string, saved: string) => {
        if (!token || !user || value === saved) return;
        setSaving(field);
        setError(null);
        setSuccess(null);
        try {
            const res = await api.user.updateProfile({ [field]: value }, token);
            const updated = res.data || res;
            setUser((prev: any) => ({ ...prev, ...updated }));
            if (field === "username") setSavedUsername(value);
            if (field === "bio") setSavedBio(value);
            setSuccess(field === "username" ? "Display name saved" : "Description saved");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to save");
            setTimeout(() => setError(null), 3000);
        } finally {
            setSaving(null);
        }
    };

    const uploadImage = async (file: File, folder: "avatars" | "banners", field: "avatar_url" | "banner_url") => {
        if (!token || !user) return;
        setSaving(field);
        setError(null);
        setSuccess(null);
        try {
            const { url } = await api.upload.file(file, folder, token);
            const res = await api.user.updateProfile({ [field]: url }, token);
            const updated = res.data || res;
            setUser((prev: any) => ({ ...prev, ...updated, [field]: url }));
            setSuccess(field === "avatar_url" ? "Avatar updated" : "Banner updated");
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message || "Upload failed");
            setTimeout(() => setError(null), 3000);
        } finally {
            setSaving(null);
        }
    };

    const avatarUrl = (user as any)?.avatar_url;
    const bannerUrl = (user as any)?.banner_url;

    return (
        <div className="w-full max-w-2xl animate-in fade-in duration-500">

            {/* Status toasts */}
            {success && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white/70 flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-[#ff4545]/10 border border-[#ff4545]/20 text-[13px] text-[#ff6b6b]">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-0 border border-white/8 rounded-2xl overflow-hidden">

                {/* ── Banner image ──────────────────────────────────── */}
                <div
                    className="relative h-24 sm:h-32 bg-white/3 border-b border-white/8 cursor-pointer group overflow-hidden"
                    onClick={() => bannerInputRef.current?.click()}
                >
                    {bannerUrl ? (
                        <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[11px] text-white/20 uppercase tracking-widest">Banner image</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {saving === "banner_url" ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="text-[11px] sm:text-[12px] text-white/70 uppercase tracking-widest">Change banner</span>
                        )}
                    </div>
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

                {/* ── Avatar ───────────────────────────────────────── */}
                <div className="flex items-center gap-4 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5 border-b border-white/8 bg-white/1.5">
                    <div
                        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/6 border border-white/10 cursor-pointer group overflow-hidden shrink-0"
                        onClick={() => avatarInputRef.current?.click()}
                    >
                        {avatarUrl ? (
                            <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/30 text-xl font-medium">
                                {username?.[0]?.toUpperCase() || "?"}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                            {saving === "avatar_url" ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <span className="text-[10px] text-white/80 uppercase tracking-widest text-center leading-tight px-1">Change</span>
                            )}
                        </div>
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
                    </div>
                    <div>
                        <span className="text-[14px] sm:text-[15px] font-medium text-white">Profile photo</span>
                        <p className="text-[12px] sm:text-[13px] text-white/35 mt-0.5">JPG, PNG, WebP or GIF · Max 5 MB</p>
                    </div>
                </div>

                {/* ── Display name ──────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-5 sm:py-6 border-b border-white/8 bg-white/1.5">
                    <div className="flex flex-col gap-1">
                        <span className="text-[14px] sm:text-[15px] font-medium text-white">Display name</span>
                        <span className="text-[12px] sm:text-[13px] text-white/35">This is how others see you.</span>
                    </div>
                    <div className="flex items-center gap-3 sm:shrink-0 sm:ml-6">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={() => saveField("username", username, savedUsername)}
                            onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur())}
                            className="bg-white/4 border border-white/10 rounded-lg px-3 py-2 text-[14px] text-white/80 outline-none w-full sm:w-44 sm:text-right focus:border-white/25 focus:text-white transition-all placeholder:text-white/25"
                            placeholder="Enter name..."
                        />
                        {saving === "username" && (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin shrink-0" />
                        )}
                    </div>
                </div>

                {/* ── About / Bio ───────────────────────────────────── */}
                <div className="flex flex-col px-4 sm:px-6 py-5 sm:py-6 bg-white/1.5">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[14px] sm:text-[15px] font-medium text-white">Public description</span>
                            <span className="text-[12px] sm:text-[13px] text-white/35">Shown on your public profile page.</span>
                        </div>
                        {saving === "bio" && (
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin shrink-0" />
                        )}
                    </div>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        onBlur={() => saveField("bio", bio, savedBio)}
                        placeholder="Write something about yourself..."
                        className="w-full bg-white/3 border border-white/8 px-3 sm:px-4 py-3 text-[14px] text-white/80 outline-none resize-none rounded-xl placeholder:text-white/20 focus:border-white/20 focus:text-white transition-all"
                        rows={4}
                        maxLength={300}
                    />
                    <div className="flex justify-end mt-2">
                        <span className="text-[11px] sm:text-[12px] text-white/25">{bio.length}/300</span>
                    </div>
                </div>

            </div>

            {/* Save hint */}
            <p className="mt-4 text-[11px] sm:text-[12px] text-white/20 text-center">
                Changes save automatically · Images upload instantly
            </p>

        </div>
    );
}
