"use client";

import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

interface PostCommentsProps {
    postId: number | string;
    isOpen: boolean;
    onClose: () => void;
    onCommentAdded?: () => void;
}

interface Comment {
    id: number;
    content: string;
    username: string;
    avatar_url: string | null;
    created_at: string;
    likes: number;
    parent_id: number | null;
    replies: Comment[];
    user_id?: string;
}

export default function PostComments({ postId, isOpen, onClose, onCommentAdded }: PostCommentsProps) {
    const { token, user } = useAuth();
    const router = useRouter();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [replyTo, setReplyTo] = useState<{ id: number; username: string } | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [replySubmitting, setReplySubmitting] = useState(false);
    const [likedComments, setLikedComments] = useState<number[]>([]);
    const [expandedReplies, setExpandedReplies] = useState<Record<number, boolean>>({});
    const [copiedComment, setCopiedComment] = useState<number | null>(null);

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

            // Fetch liked comments
            if (token) {
                api.community.getLikedComments(token)
                    .then(res => {
                        const data = Array.isArray(res) ? res : (res.data || []);
                        setLikedComments(data);
                    })
                    .catch(err => console.error("Failed to fetch liked comments", err));
            }
        }
    }, [isOpen, postId, token]);

    const handleSubmit = async () => {
        if (!token) {
            router.push('/auth');
            return;
        }
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await api.community.addComment(postId, newComment.trim(), token);
            const savedComment = res?.data || res;
            const localComment: Comment = {
                id: savedComment?.id || Date.now(),
                content: newComment.trim(),
                username: user?.username || "You",
                avatar_url: user?.avatar_url || null,
                created_at: new Date().toISOString(),
                likes: 0,
                parent_id: null,
                replies: [],
                user_id: user?.id,
            };
            setComments(prev => [localComment, ...prev]);
            setNewComment("");
            onCommentAdded?.();
        } catch (err) {
            console.error("Failed to add comment", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId: number) => {
        if (!token) {
            router.push('/auth');
            return;
        }
        if (!replyContent.trim()) return;

        setReplySubmitting(true);
        try {
            const res = await api.community.addComment(postId, replyContent.trim(), token, parentId);
            const savedReply = res?.data || res;
            const localReply: Comment = {
                id: savedReply?.id || Date.now(),
                content: replyContent.trim(),
                username: user?.username || "You",
                avatar_url: user?.avatar_url || null,
                created_at: new Date().toISOString(),
                likes: 0,
                parent_id: parentId,
                replies: [],
                user_id: user?.id,
            };

            // Add reply to the parent comment
            setComments(prev => prev.map(c => {
                if (c.id === parentId) {
                    return { ...c, replies: [...(c.replies || []), localReply] };
                }
                return c;
            }));

            setReplyContent("");
            setReplyTo(null);
            setExpandedReplies(prev => ({ ...prev, [parentId]: true }));
            onCommentAdded?.();
        } catch (err) {
            console.error("Failed to add reply", err);
        } finally {
            setReplySubmitting(false);
        }
    };

    const handleCommentLike = async (commentId: number) => {
        if (!token) {
            router.push('/auth');
            return;
        }

        const isLiked = likedComments.includes(commentId);
        // Optimistic update
        setLikedComments(prev =>
            isLiked ? prev.filter(id => id !== commentId) : [...prev, commentId]
        );
        // Update likes count in the comment tree
        const updateLikes = (list: Comment[]): Comment[] =>
            list.map(c => ({
                ...c,
                likes: c.id === commentId ? (c.likes || 0) + (isLiked ? -1 : 1) : c.likes,
                replies: updateLikes(c.replies || [])
            }));
        setComments(prev => updateLikes(prev));

        try {
            await api.community.toggleCommentLike(commentId, token);
        } catch (err) {
            console.error("Failed to toggle comment like", err);
            // Revert
            setLikedComments(prev =>
                isLiked ? [...prev, commentId] : prev.filter(id => id !== commentId)
            );
            setComments(prev => updateLikes(prev)); // will ±1 again = revert
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!token) return;
        try {
            await api.community.deleteComment(commentId, token);
            // Remove from state
            const removeComment = (list: Comment[]): Comment[] =>
                list.filter(c => c.id !== commentId).map(c => ({
                    ...c,
                    replies: removeComment(c.replies || [])
                }));
            setComments(prev => removeComment(prev));
        } catch (err) {
            console.error("Failed to delete comment", err);
        }
    };

    const handleShareComment = (commentId: number) => {
        const url = typeof window !== 'undefined' ? `${window.location.origin}/community/post/${postId}#comment-${commentId}` : '';
        navigator.clipboard.writeText(url);
        setCopiedComment(commentId);
        setTimeout(() => setCopiedComment(null), 2000);
    };

    if (!isOpen) return null;

    const renderComment = (comment: Comment, depth: number = 0) => {
        const isOwn = user?.id && comment.user_id === user.id;
        const isLiked = likedComments.includes(comment.id);
        const hasReplies = comment.replies && comment.replies.length > 0;
        const repliesExpanded = expandedReplies[comment.id] !== false; // default open

        return (
            <div key={comment.id} id={`comment-${comment.id}`}
                className={`group flex gap-3 relative ${depth === 0 ? 'pb-6 last:pb-2' : 'pb-3 last:pb-1'}`}
                style={{ marginLeft: depth > 0 ? `${Math.min(depth * 24, 72)}px` : '0' }}
            >
                {/* Thread Line */}
                {depth === 0 && (
                    <div className="absolute left-[15px] top-10 bottom-0 w-[2px] bg-white/[0.05] group-hover:bg-white/[0.1] transition-colors" />
                )}
                {depth > 0 && (
                    <div className="absolute left-[12px] top-8 bottom-0 w-[1.5px] bg-white/[0.04]" />
                )}

                {/* Avatar */}
                <div className={`z-10 ${depth === 0 ? 'w-8 h-8' : 'w-6 h-6'} rounded-full bg-white/[0.06] shrink-0 flex items-center justify-center text-[${depth === 0 ? '10' : '8'}px] font-bold text-white/50 border border-white/[0.08] overflow-hidden shadow-sm`}>
                    {comment.avatar_url ? (
                        <img src={comment.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        (comment.username || "U")[0].toUpperCase()
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className={`${depth === 0 ? 'text-[13px]' : 'text-[12px]'} font-bold text-white/80 hover:underline cursor-pointer transition-colors`}>
                            {comment.username || "Anonymous"}
                        </span>
                        {isOwn && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-bold uppercase tracking-wider">you</span>
                        )}
                        <span className="text-[11px] text-white/30">•</span>
                        <span className={`${depth === 0 ? 'text-[12px]' : 'text-[11px]'} text-white/40`}>
                            {comment.created_at ? new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Just now"}
                        </span>
                    </div>
                    <div className={`${depth === 0 ? 'text-[14px]' : 'text-[13px]'} text-white/90 leading-relaxed font-normal selection:bg-white/20`}>
                        {comment.content}
                    </div>

                    {/* Action bar */}
                    <div className="flex items-center gap-1 mt-1.5 -ml-1.5">
                        {/* Upvote */}
                        <div className="flex items-center">
                            <button
                                onClick={() => handleCommentLike(comment.id)}
                                className={`w-7 h-7 flex items-center justify-center rounded hover:bg-white/[0.08] transition-colors ${isLiked ? 'text-[#FF4500]' : 'text-white/50 hover:text-[#FF4500]'}`}
                            >
                                <svg className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 15l8-8 8 8" /></svg>
                            </button>
                            <span className={`text-[11px] font-bold min-w-[12px] text-center ${isLiked ? 'text-[#FF4500]' : 'text-white/60'}`}>
                                {(comment.likes || 0) > 0 ? comment.likes : ''}
                            </span>
                        </div>

                        {/* Reply */}
                        <button
                            onClick={() => {
                                if (!token) { router.push('/auth'); return; }
                                setReplyTo(replyTo?.id === comment.id ? null : { id: comment.id, username: comment.username });
                                setReplyContent("");
                            }}
                            className={`flex items-center gap-1 px-2 py-1.5 rounded text-[11px] font-bold transition-colors ${replyTo?.id === comment.id ? 'bg-white/[0.12] text-white' : 'hover:bg-white/[0.08] text-white/60'}`}
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            Reply
                        </button>

                        {/* Share */}
                        <button
                            onClick={() => handleShareComment(comment.id)}
                            className={`px-2 py-1.5 rounded text-[11px] font-bold transition-colors ${copiedComment === comment.id ? 'bg-green-500/15 text-green-400' : 'hover:bg-white/[0.08] text-white/60'}`}
                        >
                            {copiedComment === comment.id ? 'Copied!' : 'Share'}
                        </button>

                        {/* Delete (own comments only) */}
                        {isOwn && (
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="px-2 py-1.5 rounded hover:bg-red-500/10 text-[11px] font-bold text-white/40 hover:text-red-400 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    {/* Reply Input */}
                    {replyTo?.id === comment.id && (
                        <div className="mt-3 flex gap-2 items-start animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="w-6 h-6 rounded-full bg-white/[0.06] shrink-0 flex items-center justify-center text-[8px] font-bold text-white/50 overflow-hidden mt-0.5">
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} className="w-full h-full object-cover" alt="User" />
                                ) : (
                                    user?.username?.[0]?.toUpperCase() || "?"
                                )}
                            </div>
                            <div className="flex-1 flex flex-col bg-white/[0.03] border border-white/[0.1] rounded-lg overflow-hidden focus-within:border-white/[0.25] transition-all">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Reply to ${comment.username}...`}
                                    autoFocus
                                    className="w-full bg-transparent border-none outline-none text-[13px] text-white/90 placeholder:text-white/35 resize-none min-h-[60px] p-2.5 leading-relaxed"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') { setReplyTo(null); setReplyContent(""); }
                                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && replyContent.trim()) {
                                            handleReply(comment.id);
                                        }
                                    }}
                                />
                                <div className="flex justify-between items-center bg-white/[0.02] p-1.5 border-t border-white/[0.05]">
                                    <button
                                        onClick={() => { setReplyTo(null); setReplyContent(""); }}
                                        className="px-3 py-1 text-[11px] font-bold text-white/40 hover:text-white/70 rounded-full transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleReply(comment.id)}
                                        disabled={replySubmitting || !replyContent.trim()}
                                        className="px-4 py-1 bg-white text-black hover:bg-gray-200 disabled:opacity-40 disabled:bg-white/[0.1] disabled:text-white text-[11px] font-bold rounded-full transition-all active:scale-95"
                                    >
                                        {replySubmitting ? "..." : "Reply"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Replies */}
                    {hasReplies && (
                        <div className="mt-2">
                            {comment.replies.length > 2 && (
                                <button
                                    onClick={() => setExpandedReplies(prev => ({ ...prev, [comment.id]: !repliesExpanded }))}
                                    className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-blue-300 mb-2 transition-colors"
                                >
                                    <div className="w-4 h-[1.5px] bg-white/10 rounded" />
                                    {repliesExpanded
                                        ? `Hide replies`
                                        : `${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`
                                    }
                                </button>
                            )}
                            {(repliesExpanded || comment.replies.length <= 2) && (
                                <div className="flex flex-col gap-1 mt-1">
                                    {comment.replies.map(reply => renderComment(reply, depth + 1))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="border-t border-white/[0.04] bg-[#0b0b0f]/80 px-4 md:px-5 py-6 transition-all animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-sm">

            {/* Add Comment Input — Reddit Style */}
            <div className="mb-6 flex gap-3 items-start">
                {/* Fixed Avatar */}
                <div className="w-8 h-8 rounded-full bg-white/[0.06] shrink-0 flex items-center justify-center text-[10px] font-bold text-white/50 overflow-hidden shadow-sm mt-1">
                    {user?.avatar_url ? (
                        <img src={user.avatar_url} className="w-full h-full object-cover" alt="User" />
                    ) : (
                        user?.username?.[0]?.toUpperCase() || "?"
                    )}
                </div>

                <div className="flex-1 flex flex-col bg-white/[0.03] border border-white/[0.1] rounded-lg overflow-hidden focus-within:border-white/[0.3] focus-within:bg-white/[0.05] transition-all duration-200 shadow-inner">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={token ? "What are your thoughts?" : "Sign in to leave a comment"}
                        className="w-full bg-transparent border-none outline-none text-[14px] text-white/90 placeholder:text-white/40 resize-none min-h-[90px] p-3 leading-relaxed"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && newComment.trim()) {
                                handleSubmit();
                            }
                        }}
                    />
                    <div className="flex justify-between items-center bg-white/[0.02] p-2 border-t border-white/[0.05]">
                        <div className="flex items-center gap-2 pl-2">
                            <button className="text-white/30 hover:text-white/60 transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/20 font-medium">⌘ Enter</span>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !newComment.trim()}
                                className="px-5 py-1.5 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:bg-white/[0.1] disabled:text-white text-[12px] font-bold rounded-full transition-all active:scale-95"
                            >
                                {submitting ? "Posting..." : "Comment"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sort/Filter Bar */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/[0.05]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-white/50 transition-colors">Sort by:</span>
                        <span className="text-[12px] font-black text-white/80 group-hover:text-[#e63030] transition-colors flex items-center gap-2 uppercase tracking-widest">
                            Best <span className="text-[10px] opacity-40">▼</span>
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/25 font-semibold">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
                </div>
            </div>

            {/* Comments List */}
            <div className="space-y-2">
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
                    <div className="flex flex-col gap-1">
                        {comments.map(comment => renderComment(comment, 0))}
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
