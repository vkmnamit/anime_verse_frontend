"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved?: () => void;
}

export default function EditProfileModal({ isOpen, onClose, onSaved }: EditProfileModalProps) {
    const { user, token, setUser } = useAuth();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [genres, setGenres] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const availableGenres = [
        "Action", "Adventure", "Comedy", "Drama", "Fantasy",
        "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life",
        "Sports", "Supernatural", "Thriller", "Psychological", "Isekai"
    ];

    useEffect(() => {
        if (isOpen && user) {
            setUsername(user.username || "");
            setBio(user.bio || "");
            setAvatarUrl(user.avatar_url || "");
            setBannerUrl(user.banner_url || "");
            setGenres(user.genres || []);
            setError("");
            setSuccess(false);
        }
    }, [isOpen, user]);

    const toggleGenre = (genre: string) => {
        setGenres(prev =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre)
                : [...prev, genre]
        );
    };

    const handleSubmit = async () => {
        if (!token) return;
        if (!username.trim()) {
            setError("Username is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const updates: any = {};
            if (username.trim() !== user?.username) updates.username = username.trim();
            if (bio.trim() !== (user?.bio || "")) updates.bio = bio.trim();
            if (avatarUrl.trim() !== (user?.avatar_url || "")) updates.avatar_url = avatarUrl.trim() || undefined;
            if (bannerUrl.trim() !== (user?.banner_url || "")) updates.banner_url = bannerUrl.trim() || undefined;

            // Always sync genres if they changed
            const currentGenres = user?.genres || [];
            const sortedNew = [...genres].sort();
            const sortedOld = [...currentGenres].sort();
            if (JSON.stringify(sortedNew) !== JSON.stringify(sortedOld)) {
                updates.genres = genres;
            }

            if (Object.keys(updates).length === 0) {
                onClose();
                return;
            }

            const res = await api.user.updateProfile(updates, token);
            const updatedUser = res.data || res;

            setUser((prev: any) => prev ? { ...prev, ...updatedUser } : prev);
            setSuccess(true);
            setTimeout(() => {
                onSaved?.();
                onClose();
            }, 800);
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-[#0b0b0f] border border-white/[0.08] rounded-none w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.06]">
                    <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Initialize Profile Sync</h2>
                    <button onClick={onClose} className="w-8 h-8 rounded-none bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/50 hover:text-white transition-all">
                        <span className="text-xs">✕</span>
                    </button>
                </div>

                {/* Body */}
                <div className="px-8 py-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {/* Avatar preview */}
                    <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-white/[0.03]">
                        <div className="flex flex-col items-center gap-4">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block text-center">Avatar Preview</label>
                            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/[0.08] overflow-hidden flex items-center justify-center shrink-0 relative group/avatar">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110 duration-700" />
                                ) : (
                                    <span className="text-xl font-black text-white/10 italic">IMG</span>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center gap-4">
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block">Avatar URL</label>
                                <input
                                    type="url"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    placeholder="https://host.com/avatar.jpg"
                                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-none px-4 py-3 text-[13px] outline-none focus:border-[#e63030]/40 transition-all text-white placeholder:text-white/10"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block">Banner URL</label>
                                <input
                                    type="url"
                                    value={bannerUrl}
                                    onChange={(e) => setBannerUrl(e.target.value)}
                                    placeholder="https://host.com/banner.jpg"
                                    className="w-full bg-white/[0.02] border border-white/[0.06] rounded-none px-4 py-3 text-[13px] outline-none focus:border-[#e63030]/40 transition-all text-white placeholder:text-white/10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block">System Designation</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Designation..."
                            maxLength={30}
                            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-none px-4 py-3 text-[14px] outline-none focus:border-[#e63030]/40 transition-all text-white placeholder:text-white/10 font-bold italic"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2 block">Transmission Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Establishing communication parameters..."
                            rows={3}
                            maxLength={300}
                            className="w-full bg-white/[0.02] border border-white/[0.06] rounded-none px-4 py-3 text-[13px] outline-none focus:border-[#e63030]/40 transition-all text-white placeholder:text-white/10 resize-none leading-relaxed italic"
                        />
                    </div>

                    {/* Genres */}
                    <div>
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 block">Preference Matrix (Genres)</label>
                        <div className="flex flex-wrap gap-2">
                            {availableGenres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => toggleGenre(genre)}
                                    className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all border ${genres.includes(genre)
                                        ? "bg-[#e63030]/20 border-[#e63030] text-white"
                                        : "bg-white/[0.02] border-white/[0.06] text-white/30 hover:border-white/20"
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Error / Success */}
                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-none px-4 py-3 text-red-500 text-[11px] font-black uppercase tracking-widest">
                            Error: {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-[#e63030]/10 border border-[#e63030]/30 rounded-none px-4 py-3 text-[#e63030] text-[11px] font-black uppercase tracking-widest flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#e63030] animate-pulse" />
                            Synchronization Complete
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-4 px-8 py-6 border-t border-white/[0.06]">
                    <button
                        onClick={onClose}
                        className="text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all"
                    >
                        Abort
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-3 bg-[#e63030] disabled:bg-white/5 disabled:text-white/10 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-none transition-all shadow-xl hover:shadow-[#e63030]/20"
                    >
                        {loading ? "Syncing..." : "Apply Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
