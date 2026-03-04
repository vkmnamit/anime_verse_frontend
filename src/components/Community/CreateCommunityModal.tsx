"use client";

import { useState } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

interface CreateCommunityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCommunityCreated?: () => void;
}

export default function CreateCommunityModal({ isOpen, onClose, onCommunityCreated }: CreateCommunityModalProps) {
    const { token } = useAuth();
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const slug = name.trim() ? `r/${name.trim().replace(/\s+/g, '')}` : "";

    const handleSubmit = async () => {
        if (!token) return;
        if (!name.trim()) {
            setError("Community name is required");
            return;
        }
        if (name.trim().length < 3) {
            setError("Name must be at least 3 characters");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await api.community.create({ name: name.trim(), description: description.trim() || undefined }, token);
            const data = res.data || res;
            setName("");
            setDescription("");
            onCommunityCreated?.();
            onClose();
            // Navigate to the new community
            const newSlug = data.slug?.replace('r/', '') || name.trim().replace(/\s+/g, '');
            router.push(`/community/${newSlug}`);
        } catch (err: any) {
            setError(err.message || "Failed to create community");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#111113] border border-white/8 rounded-2xl shadow-2xl w-full max-w-120 animate-in zoom-in-95 duration-200">

                {/* ── Header ── */}
                <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/6">
                    <h2 className="text-[17px] font-bold text-white tracking-tight">Create Community</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 transition-colors text-white/40 hover:text-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    {error && (
                        <div className="bg-[#e63030]/10 border border-[#e63030]/20 text-[#e63030] text-[13px] px-4 py-2.5 rounded-xl">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">
                            Community Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. ChainsawMan"
                            maxLength={50}
                            autoFocus
                            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-[15px] outline-none focus:border-white/20 transition-all text-white placeholder:text-white/20"
                        />
                        {slug && (
                            <p className="text-[12px] text-white/35 font-mono mt-0.5">{slug}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-semibold text-white/30 uppercase tracking-widest">
                            Description
                            <span className="normal-case tracking-normal text-white/20 ml-1 font-normal">(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this community about?"
                            rows={3}
                            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-white/20 transition-all text-white placeholder:text-white/20 resize-none"
                        />
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/6">
                    <button onClick={onClose} className="px-4 py-2 text-[13px] text-white/30 hover:text-white/70 transition-colors rounded-xl hover:bg-white/5">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !name.trim()}
                        className="px-6 py-2.5 bg-[#e63030] hover:bg-[#ff4545] disabled:opacity-30 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-xl transition-all active:scale-95"
                    >
                        {loading ? "Creating..." : "Create Community"}
                    </button>
                </div>
            </div>
        </div>
    );
}
