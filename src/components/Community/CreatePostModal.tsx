"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
    defaultCommunity?: string;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated, defaultCommunity }: CreatePostModalProps) {
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [communityName, setCommunityName] = useState(defaultCommunity || "");
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [communities, setCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isOpen) {
            api.community.list()
                .then(res => {
                    const data = Array.isArray(res) ? res : (res.data || []);
                    setCommunities(data);
                })
                .catch(() => { });
        }
    }, [isOpen]);

    useEffect(() => {
        if (defaultCommunity) setCommunityName(defaultCommunity);
    }, [defaultCommunity]);

    const handleSubmit = async () => {
        if (!token) return;
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (!communityName) {
            setError("Please select a community");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.community.createPost({
                title: title.trim(),
                content: content.trim() || undefined,
                image_url: imageUrl.trim() || undefined,
                community_name: communityName,
                is_spoiler: isSpoiler,
            }, token);

            setTitle("");
            setContent("");
            setImageUrl("");
            setIsSpoiler(false);
            onPostCreated?.();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-[#0b0b0f] border border-white/[0.08] backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/[0.06] sticky top-0 bg-[#0b0b0f]/80 backdrop-blur-md z-10">
                    <h2 className="text-[22px] font-black text-white tracking-tight uppercase">New Post</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/[0.06] rounded-full transition-all text-white/40 hover:text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 flex flex-col gap-6">
                    {error && (
                        <div className="bg-[#e63030]/10 border border-[#e63030]/20 text-[#e63030] text-[13px] font-bold px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    {/* Community Select */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Destination</label>
                        <select
                            value={communityName}
                            onChange={(e) => setCommunityName(e.target.value)}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-3.5 text-[14px] outline-none focus:border-[#e63030]/50 transition-all text-white font-bold appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-[#0b0b0f]">Select a realm...</option>
                            {communities.map((c) => (
                                <option key={c.id || c.slug} value={c.slug || c.name} className="bg-[#0b0b0f]">
                                    {c.slug || c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Hook the viewers..."
                            maxLength={300}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-3.5 text-[15px] outline-none focus:border-[#e63030]/50 transition-all text-white font-bold placeholder:text-white/20"
                        />
                        <div className="flex justify-end">
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{title.length}/300</p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Transmission</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your absolute takes..."
                            rows={5}
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 text-[15px] outline-none focus:border-[#e63030]/50 transition-all text-white font-medium placeholder:text-white/20 resize-none leading-relaxed"
                        />
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Visual Link (Optional)</label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://imgur.com/cinematic-moment.jpg"
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-3.5 text-[14px] outline-none focus:border-[#e63030]/50 transition-all text-white font-bold placeholder:text-white/20"
                        />
                        {imageUrl && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-white/[0.08] max-h-56 relative group">
                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.parentElement!.style.display = 'none')} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <span className="text-[9px] font-black text-white/80 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-1 rounded">Visual Preview</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Spoiler toggle */}
                    <div className="pt-2">
                        <label className="flex items-center gap-4 cursor-pointer group w-fit">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={isSpoiler}
                                    onChange={(e) => setIsSpoiler(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-white/[0.08] rounded-full peer peer-checked:bg-[#e63030] transition-all border border-white/[0.06]" />
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white/40 rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-all" />
                            </div>
                            <span className="text-[12px] font-black text-white/40 group-hover:text-white/80 uppercase tracking-[0.15em] transition-colors leading-none">Classify as Spoiler</span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-4 px-8 py-6 border-t border-white/[0.06] bg-white/[0.01]">
                    <button onClick={onClose} className="px-6 py-3 text-[12px] font-black text-white/30 hover:text-white uppercase tracking-[0.2em] hover:bg-white/[0.04] rounded-xl transition-all">
                        Abandon
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !title.trim()}
                        className="px-10 py-3.5 bg-gradient-to-r from-[#e63030] to-[#ff6b2c] hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-white text-[13px] font-black rounded-xl transition-all shadow-xl shadow-[#e63030]/20 uppercase tracking-[0.1em] active:scale-95"
                    >
                        {loading ? "Transmitting..." : "Send Transmission"}
                    </button>
                </div>
            </div>
        </div>
    );
}
