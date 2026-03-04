"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: () => void;
    defaultCommunity?: string;
}

type PostTab = "text" | "image";

export default function CreatePostModal({ isOpen, onClose, onPostCreated, defaultCommunity }: CreatePostModalProps) {
    const { token } = useAuth();
    const [tab, setTab] = useState<PostTab>("text");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreviewError, setImagePreviewError] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [communityName, setCommunityName] = useState(defaultCommunity || "");
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [communities, setCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);
    const imageFileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            api.community.list()
                .then(res => {
                    const data = Array.isArray(res) ? res : (res.data || []);
                    setCommunities(data);
                })
                .catch(() => { });
            // reset form
            setTitle(""); setContent(""); setImageUrl(""); setIsSpoiler(false); setError(""); setTab("text"); setImagePreviewError(false); setImageUploading(false);
            setTimeout(() => titleRef.current?.focus(), 100);
        }
    }, [isOpen]);

    useEffect(() => {
        if (defaultCommunity) setCommunityName(defaultCommunity);
    }, [defaultCommunity]);

    const handleSubmit = async () => {
        if (!token) return;
        if (!title.trim()) { setError("Title is required"); return; }
        if (!communityName) { setError("Please select a community"); return; }
        if (tab === "image" && !imageUrl.trim()) { setError("Please add an image or paste a URL"); return; }

        setLoading(true);
        setError("");
        try {
            await api.community.createPost({
                title: title.trim(),
                content: content.trim() || undefined,
                image_url: tab === "image" ? imageUrl.trim() : undefined,
                community_name: communityName,
                is_spoiler: isSpoiler,
            }, token);
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
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#111113] border border-white/8 rounded-2xl shadow-2xl w-full max-w-145 max-h-[90vh] overflow-y-auto no-scrollbar animate-in zoom-in-95 duration-200">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/6">
                    <h2 className="text-[17px] font-bold text-white tracking-tight">Create Post</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 transition-colors text-white/40 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Tab switcher ── */}
                <div className="flex gap-1 px-6 pt-5">
                    {(["text", "image"] as PostTab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${tab === t
                                ? "bg-white/10 text-white"
                                : "text-white/35 hover:text-white/70 hover:bg-white/5"
                                }`}
                        >
                            {t === "text" ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            )}
                            {t === "text" ? "Text" : "Image"}
                        </button>
                    ))}
                </div>

                {/* ── Body ── */}
                <div className="px-6 pb-6 pt-4 flex flex-col gap-4">
                    {error && (
                        <div className="bg-[#e63030]/10 border border-[#e63030]/20 text-[#e63030] text-[13px] px-4 py-2.5 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Community */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">Community</label>
                        <select
                            value={communityName}
                            onChange={(e) => setCommunityName(e.target.value)}
                            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-white/20 transition-all text-white appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-[#111113]">Select a community...</option>
                            {communities.map((c) => (
                                <option key={c.id || c.slug} value={c.slug || c.name} className="bg-[#111113]">
                                    {c.name || c.slug}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">Title *</label>
                        <input
                            ref={titleRef}
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's this about?"
                            maxLength={300}
                            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-[15px] outline-none focus:border-white/20 transition-all text-white placeholder:text-white/20"
                        />
                        <span className="text-[11px] text-white/20 self-end">{title.length}/300</span>
                    </div>

                    {/* Body text */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">
                            {tab === "text" ? "Content" : "Caption"}
                            <span className="normal-case tracking-normal text-white/20 ml-1 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={tab === "text" ? "Share your thoughts..." : "Add a caption..."}
                            rows={tab === "text" ? 5 : 2}
                            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-white/20 transition-all text-white placeholder:text-white/20 resize-none leading-relaxed"
                        />
                    </div>

                    {/* Image upload — only in image tab */}
                    {tab === "image" && (
                        <div className="flex flex-col gap-2">
                            <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">Image *</label>

                            {/* Upload area */}
                            {!imageUrl && (
                                <div
                                    className="relative border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-white/25 hover:bg-white/[0.02] transition-all group"
                                    onClick={() => imageFileRef.current?.click()}
                                >
                                    {imageUploading ? (
                                        <>
                                            <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                                            <span className="text-[13px] text-white/40">Uploading…</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-7 h-7 text-white/25 group-hover:text-white/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <div className="text-center">
                                                <p className="text-[13px] text-white/50">Click to upload an image</p>
                                                <p className="text-[11px] text-white/25 mt-0.5">JPG, PNG, WebP · Max 5 MB</p>
                                            </div>
                                        </>
                                    )}
                                    <input
                                        ref={imageFileRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file || !token) return;
                                            setImageUploading(true);
                                            setError("");
                                            try {
                                                const { url } = await api.upload.file(file, "posts", token);
                                                setImageUrl(url);
                                                setImagePreviewError(false);
                                            } catch (err: any) {
                                                setError(err.message || "Upload failed");
                                            } finally {
                                                setImageUploading(false);
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                </div>
                            )}

                            {/* Preview */}
                            {imageUrl && !imagePreviewError && (
                                <div className="relative rounded-xl overflow-hidden border border-white/8 bg-black/40">
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        className="w-full max-h-56 object-contain"
                                        onError={() => setImagePreviewError(true)}
                                    />
                                    <button
                                        onClick={() => { setImageUrl(""); setImagePreviewError(false); }}
                                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors"
                                        title="Remove image"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                            {imagePreviewError && (
                                <p className="text-[12px] text-[#e63030]/70">Could not load image preview.</p>
                            )}

                            {/* URL fallback */}
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-px bg-white/6" />
                                <span className="text-[11px] text-white/25">or paste URL</span>
                                <div className="flex-1 h-px bg-white/6" />
                            </div>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => { setImageUrl(e.target.value); setImagePreviewError(false); }}
                                placeholder="https://i.imgur.com/example.jpg"
                                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-white/20 transition-all text-white placeholder:text-white/20"
                            />
                        </div>
                    )}

                    {/* Spoiler toggle */}
                    <label className="flex items-center gap-3 cursor-pointer w-fit group mt-1">
                        <div className="relative shrink-0">
                            <input type="checkbox" checked={isSpoiler} onChange={(e) => setIsSpoiler(e.target.checked)} className="sr-only peer" />
                            <div className="w-10 h-5 bg-white/8 rounded-full peer-checked:bg-[#e63030] transition-all border border-white/8" />
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white/50 rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-all" />
                        </div>
                        <span className="text-[13px] text-white/40 group-hover:text-white/70 transition-colors">Mark as spoiler</span>
                    </label>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/6">
                    <button onClick={onClose} className="px-4 py-2 text-[13px] text-white/30 hover:text-white/70 transition-colors rounded-xl hover:bg-white/5">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !title.trim()}
                        className="px-6 py-2.5 bg-[#e63030] hover:bg-[#ff4545] disabled:opacity-30 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-xl transition-all active:scale-95"
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}
