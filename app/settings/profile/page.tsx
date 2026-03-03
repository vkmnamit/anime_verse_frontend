"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";

export default function ProfileSettingsPage() {
    const { user, token, setUser } = useAuth();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setBio(user.bio || "");
            setAvatarUrl(user.avatar_url || "");
        }
    }, [user]);

    const handleSave = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const updates: any = {};
            if (username !== user?.username) updates.username = username;
            if (bio !== (user?.bio || "")) updates.bio = bio;
            if (avatarUrl !== (user?.avatar_url || "")) updates.avatar_url = avatarUrl;

            if (Object.keys(updates).length > 0) {
                const res = await api.user.updateProfile(updates, token);
                setUser((prev: any) => ({ ...prev, ...(res.data || res) }));
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-3xl animate-in fade-in duration-500 space-y-12">

            <div className="space-y-8">
                {/* Avatar */}
                <div className="flex flex-col gap-6">
                    <label className="text-[14px] font-bold text-white tracking-wide">Profile Identity</label>
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 rounded-full bg-white/[0.04] border border-white/[0.08] overflow-hidden flex items-center justify-center relative group">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-2xl font-black text-white/20 uppercase tracking-widest italic">{username?.[0] || "?"}</span>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Preview</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-3">
                            <input
                                type="url"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="Avatar Image URL"
                                className="w-full bg-white/[0.04] border border-white/[0.06] rounded-full px-6 py-3 text-[13px] text-white outline-none focus:border-[#e63030]/30 transition-all placeholder:text-white/10"
                            />
                            <p className="text-[11px] text-white/20 ml-4 font-black uppercase tracking-widest">Visual Frequency Allocation</p>
                        </div>
                    </div>
                </div>

                {/* Username */}
                <div className="space-y-4">
                    <label className="text-[14px] font-bold text-white tracking-wide">Display Designation</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="User Designation..."
                        className="w-full max-w-lg bg-white/[0.04] border border-white/[0.06] rounded-full px-6 py-4 text-[14px] text-white font-bold italic outline-none focus:border-[#e63030]/30 transition-all placeholder:text-white/10"
                    />
                </div>

                {/* Bio */}
                <div className="space-y-4">
                    <label className="text-[14px] font-bold text-white tracking-wide">Biography Transmission</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Communication parameters..."
                        rows={3}
                        className="w-full max-w-xl bg-white/[0.04] border border-white/[0.06] rounded-3xl px-6 py-5 text-[14px] text-white/70 leading-relaxed italic outline-none focus:border-[#e63030]/30 transition-all placeholder:text-white/10 resize-none"
                    />
                </div>
            </div>

            <div className="pt-6 flex items-center gap-6">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-10 py-3.5 bg-[#e63030] hover:bg-[#ff3b3b] disabled:bg-white/5 disabled:text-white/10 text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-full transition-all active:scale-95 shadow-xl shadow-red-950/20"
                >
                    {loading ? "Syncing..." : "Update Profile"}
                </button>
                {success && (
                    <span className="text-[#4ade80] text-[12px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 shadow-sm">
                        Profile Synced
                    </span>
                )}
            </div>

        </div>
    );
}
