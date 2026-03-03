"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

interface PostCommentsProps {
    postId: number | string;
    isOpen: boolean;
    onClose: () => void;
}

export default function PostComments({ postId, isOpen, onClose }: PostCommentsProps) {
    const { token, user } = useAuth();
    const router = useRouter();
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && postId) {
            setLoading(true);
            api.community.getPostComments(postId)
                .then(res => {
                    const data = Array.isArray(res) ? res : (res.data || []);
                    setComments(data);
                })
                .catch(err => console.error("Failed to fetch comments", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, postId]);

    const handleSubmit = async () => {
        if (!token) {
            router.push('/auth');
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            await api.community.addComment(postId, newComment.trim(), token);
            const localComment = {
                id: Date.now(),
                content: newComment.trim(),
                username: user?.username || "You",
                avatar_url: user?.avatar_url || null,
                created_at: new Date().toISOString()
            };
            setComments(prev => [localComment, ...prev]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="border-t border-white/[0.04] bg-[#0b0b0f]/60 px-6 md:px-8 py-8 transition-all animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm">

            {/* Add Comment Input — Redesigned for No Overlap */}
            <div className="mb-10 flex gap-5 items-start">
                {/* Fixed Avatar - No Overlap */}
                <div className="w-10 h-10 rounded-full bg-white/[0.06] shrink-0 flex items-center justify-center text-[12px] font-black text-white/30 border border-white/[0.08] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)] mt-1">
                    {user?.avatar_url ? (
                        <img src={user.avatar_url} className="w-full h-full object-cover" alt="User" />
                    ) : (
                        user?.username?.[0]?.toUpperCase() || "?"
                    )}
                </div>

                <div className="flex-1 flex flex-col gap-0 bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden focus-within:border-white/[0.12] focus-within:bg-white/[0.04] transition-all duration-300 group shadow-lg">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={token ? "What are your thoughts?" : "Sign in to join the transmission"}
                        className="w-full bg-transparent border-none outline-none text-[15px] text-white/90 placeholder:text-white/20 resize-none min-h-[110px] p-5 font-medium leading-relaxed"
                    />
                    <div className="flex justify-end p-3 px-5 bg-white/[0.01] border-t border-white/[0.04]">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !newComment.trim()}
                            className="px-7 py-2.5 bg-[#e63030] hover:bg-[#ff3b3b] disabled:opacity-20 disabled:hover:bg-[#e63030] text-white text-[12px] font-black rounded-full transition-all active:scale-95 shadow-[0_8px_20px_-5px_rgba(230,48,48,0.4)]"
                        >
                            {submitting ? "Transmitting..." : "Comment"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sort/Filter Bar */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/[0.03]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">Sort by:</span>
                        <span className="text-[12px] font-black text-white/80 group-hover:text-[#e63030] transition-colors flex items-center gap-2 uppercase tracking-widest">
                            Best <span className="text-[10px] opacity-40">▼</span>
                        </span>
                    </div>
                </div>
                <div className="relative group">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#e63030] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input
                        type="text"
                        placeholder="Search Comments"
                        className="bg-white/[0.03] border border-white/[0.05] rounded-full py-2.5 pl-11 pr-6 text-[11px] font-bold text-white placeholder:text-white/20 w-48 focus:w-72 focus:bg-white/[0.06] focus:border-white/[0.12] focus:ring-1 focus:ring-[#e63030]/20 outline-none transition-all duration-500"
                    />
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex flex-col gap-8 py-2">
                        {[1, 2].map(i => (
                            <div key={i} className="flex gap-4">
                                <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse shrink-0" />
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 w-32 bg-white/5 animate-pulse rounded-full" />
                                    <div className="h-16 w-full bg-white/5 animate-pulse rounded-2xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : comments.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                        <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.04] flex items-center justify-center mb-5 scale-110 shadow-inner">
                            <svg className="w-7 h-7 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        <p className="text-[14px] text-white/30 font-bold tracking-wide">No transmissions yet. Be the first to signal!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {comments.map((comment, i) => (
                            <div key={comment.id || i} className="group flex gap-5 relative pb-8 last:pb-2">
                                {/* Thread Line */}
                                <div className="absolute left-[19px] top-12 bottom-0 w-[2px] bg-white/[0.04] group-hover:bg-[#e63030]/20 transition-all duration-500" />

                                {/* Avatar */}
                                <div className="z-10 w-9 h-9 rounded-full bg-white/[0.06] shrink-0 flex items-center justify-center text-[11px] font-black text-white/30 border border-white/[0.08] overflow-hidden group-hover:border-[#e63030]/40 transition-all shadow-md">
                                    {comment.avatar_url ? (
                                        <img src={comment.avatar_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        (comment.username || "U")[0].toUpperCase()
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-[13px] font-black text-white/80 hover:text-[#e63030] cursor-pointer transition-colors tracking-tight">
                                            {comment.username || "Anonymous"}
                                        </span>
                                        <span className="text-[11px] text-white/20 font-black">•</span>
                                        <span className="text-[11px] text-white/30 font-bold uppercase tracking-widest text-[10px]">
                                            {comment.created_at ? new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Recently"}
                                        </span>
                                    </div>
                                    <div className="text-[15px] text-white/80 leading-relaxed font-medium pr-6 selection:bg-[#e63030]/30">
                                        {comment.content}
                                    </div>

                                    {/* Action bar — Reddit Inspired */}
                                    <div className="flex items-center gap-6 mt-4">
                                        <div className="flex items-center gap-1 bg-white/[0.04] rounded-full p-0.5 border border-white/[0.04]">
                                            <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/[0.06] text-white/30 hover:text-[#e63030] transition-all">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                                            </button>
                                            <span className="text-[12px] font-black text-white/60 px-1">1</span>
                                            <button className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/[0.06] text-white/30 hover:text-blue-400 transition-all">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                            </button>
                                        </div>
                                        <button className="flex items-center gap-2 text-[11px] font-black text-white/30 hover:text-white/60 uppercase tracking-widest transition-all">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            Reply
                                        </button>
                                        <button className="text-[11px] font-black text-white/30 hover:text-white/60 uppercase tracking-widest transition-all">Share</button>
                                        <button className="text-[11px] font-black text-white/30 hover:text-white/60 uppercase tracking-widest transition-all">Report</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer / Load More */}
            {comments.length > 0 && (
                <div className="flex justify-center mt-10 pt-6 border-t border-white/[0.04]">
                    <button
                        onClick={onClose}
                        className="text-[11px] font-black text-white/20 hover:text-[#e63030] transition-all uppercase tracking-[0.4em] px-10 py-3 bg-white/[0.02] rounded-full border border-white/[0.03] hover:border-[#e63030]/20"
                    >
                        Minimize Signals
                    </button>
                </div>
            )}
        </div>
    );
}
