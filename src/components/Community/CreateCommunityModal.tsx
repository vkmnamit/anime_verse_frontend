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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[480px] mx-4">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-[18px] font-bold text-gray-900">Create a Community</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] font-medium px-4 py-2.5 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Name */}
                    <div>
                        <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Community Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. ChainsawMan"
                            maxLength={50}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] outline-none focus:border-blue-500 transition-colors text-gray-800 font-medium placeholder:text-gray-400"
                        />
                        {slug && (
                            <p className="text-[12px] text-blue-600 font-bold mt-1.5">{slug}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What is this community about?"
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-blue-500 transition-colors text-gray-800 font-medium placeholder:text-gray-400 resize-none"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                    <button onClick={onClose} className="px-5 py-2 text-[13px] font-bold text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !name.trim()}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-full transition-all shadow-sm active:scale-95"
                    >
                        {loading ? "Creating..." : "Create Community"}
                    </button>
                </div>
            </div>
        </div>
    );
}
