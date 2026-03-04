"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearch } from "@/src/context/SearchContext";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import PostComments from "./PostComments";

export default function CommunityFeed({
    communitySlug,
    type = "home"
}: {
    communitySlug?: string;
    type?: string;
}) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastPostRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    const [revealedPosts, setRevealedPosts] = useState<Record<number, boolean>>({});
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
    const [copiedPost, setCopiedPost] = useState<number | null>(null);
    const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set());
    const { searchQuery } = useSearch();
    const { token, user } = useAuth();
    const router = useRouter();

    const requireAuth = (e?: React.MouseEvent<HTMLElement>) => {
        if (!token) {
            if (e) e.preventDefault();
            router.push('/auth');
            return true;
        }
        return false;
    };

    const fetchPosts = async (currentPage = 1, isRefresh = false) => {
        if (currentPage === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const params: any = { page: currentPage, limit: 12 };
            if (communitySlug) params.slug = communitySlug;

            const res = await api.community.posts(params);
            const data = Array.isArray(res) ? res : (res.data || res.posts || []);

            if (isRefresh || currentPage === 1) {
                setPosts(data);
            } else {
                setPosts(prev => [...prev, ...data]);
            }

            if (data.length < 12) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
        } catch (err) {
            console.error("Failed to fetch posts", err);
        } finally {
            if (currentPage === 1) setLoading(false);
            else setLoadingMore(false);
        }
    };

    const handleRefresh = () => {
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        fetchPosts(1, true);
    }, [communitySlug]);

    useEffect(() => {
        if (page > 1) {
            fetchPosts(page);
        }
    }, [page]);

    useEffect(() => {
        if (token) {
            api.community.getLikedPosts(token)
                .then(res => {
                    const data = Array.isArray(res) ? res : (res.data || []);
                    setLikedPosts(data);
                })
                .catch(err => console.error("Failed to fetch liked posts", err));

            api.community.getJoined(token)
                .then(res => {
                    const data = Array.isArray(res) ? res : (res.data || []);
                    setJoinedCommunities(new Set(data));
                })
                .catch(err => console.error("Failed to fetch joined communities", err));
        }
    }, [token]);

    const handleLike = async (postId: number) => {
        if (requireAuth() || !token) return;

        const isLiked = likedPosts.includes(postId);
        setLikedPosts(prev =>
            isLiked
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );

        try {
            await api.community.toggleLike(postId, token);
            // After successful toggle, we could adjust state, but we've already done it optimistically
            // To be safe, we only handle the failure (revert) in the catch block
        } catch (err) {
            console.error("Failed to toggle like", err);
            // Revert state on failure
            setLikedPosts(prev =>
                isLiked ? [...prev, postId] : prev.filter(id => id !== postId)
            );
            setPosts(prev => prev.map(p => {
                if (p.id === postId) {
                    return { ...p, votes: (p.votes || 0) + (isLiked ? 1 : -1) };
                }
                return p;
            }));
        }
    };

    const handleShare = (postId: number) => {
        const url = typeof window !== 'undefined' ? `${window.location.origin}/community/post/${postId}` : '';
        navigator.clipboard.writeText(url);
        setCopiedPost(postId);
        setTimeout(() => setCopiedPost(null), 2000);

        // Optimistic share count update
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return { ...p, share_count: (p.share_count || 0) + 1 };
            }
            return p;
        }));

        // Track share in the database
        api.community.trackShare(postId).catch(err => {
            console.error("Failed to track share", err);
            // Revert if it's really important, but shares are usually low stakes
        });
    };

    const handleJoin = async (slug: string) => {
        if (!token) {
            router.push('/auth');
            return;
        }

        const isJoined = joinedCommunities.has(slug);

        // Optimistic update
        setJoinedCommunities(prev => {
            const next = new Set(prev);
            if (isJoined) next.delete(slug);
            else next.add(slug);
            return next;
        });

        try {
            await api.community.toggleJoin(slug, token);
        } catch (err) {
            console.error("Failed to toggle join", err);
            // Revert state
            setJoinedCommunities(prev => {
                const next = new Set(prev);
                if (isJoined) next.add(slug);
                else next.delete(slug);
                return next;
            });
        }
    };

    const toggleComments = (postId: number) => {
        setOpenComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    return (
        <div className="flex flex-col w-full relative font-sans">

            {/* Refresh Button */}
            <div className="flex justify-end mb-4 px-2">
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-all text-sm font-semibold disabled:opacity-50"
                >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M4.582 9A8 8 0 0119.419 15M19.419 15A8 8 0 014.582 9" />
                    </svg>
                    Refresh Feed
                </button>
            </div>

            <div className="flex flex-col gap-3 w-full">
                {loading ? (
                    <div className="flex flex-col gap-4 w-full">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 animate-pulse rounded-2xl" style={{ background: "rgba(15,15,15,0.70)", border: "1px solid rgba(255,255,255,0.05)" }} />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="py-20 text-center text-white/30 italic text-[14px] font-medium w-full">No transmissions today</div>
                ) : (
                    posts.map((post: any, index: number) => (
                        <div
                            ref={posts.length === index + 1 ? lastPostRef : null}
                            key={post.id}
                            className="rounded-2xl overflow-hidden transition-all w-full group hover:border-white/[0.12]"
                            style={{
                                background: "rgba(18,18,18,0.85)",
                                border: "1px solid rgba(255,255,255,0.06)",
                            }}
                        >
                            {/* Subreddit row */}
                            <div className="flex items-center gap-2 px-5 pt-3.5 pb-0">
                                <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center border shrink-0"
                                    style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.09)" }}>
                                    <span className="text-[7px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>r/</span>
                                </div>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span
                                        onClick={() => router.push(`/community/${post.community_slug || (post.community_name || post.community || '').toLowerCase().replace(/\s+/g, '-')}`)}
                                        className="text-[12px] font-semibold hover:underline cursor-pointer transition-colors truncate"
                                        style={{ color: "rgba(255,255,255,0.60)" }}
                                    >
                                        {post.community_name || post.community}
                                    </span>
                                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.18)" }}>•</span>
                                    <span className="text-[11px] shrink-0" style={{ color: "rgba(255,255,255,0.35)" }}>
                                        {post.created_at ? new Date(post.created_at).toLocaleDateString() : (post.time || '1h ago')}
                                    </span>
                                </div>
                                {/* Join / Joined toggle */}
                                <div className="ml-auto shrink-0">
                                    <button
                                        onClick={(e) => {
                                            if (requireAuth(e)) return;
                                            const slug = post.community_slug || (post.community_name || post.community || '').toLowerCase().replace(/\s+/g, '-');
                                            handleJoin(slug);
                                        }}
                                        className={`h-8 px-4 rounded-full text-[12px] font-bold transition-all border ${joinedCommunities.has(post.community_slug || (post.community_name || post.community || '').toLowerCase().replace(/\s+/g, '-'))
                                            ? "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                                            : "bg-white text-black border-white hover:bg-white/90 shadow-lg shadow-white/5 active:scale-95"
                                            }`}
                                    >
                                        {joinedCommunities.has(post.community_slug || (post.community_name || post.community || '').toLowerCase().replace(/\s+/g, '-')) ? "Joined" : "Join"}
                                    </button>
                                </div>
                            </div>

                            {/* Title */}
                            <div className="px-5 pt-2 pb-2">
                                <h2 className="text-[16px] font-semibold leading-snug text-white/90 tracking-tight">{post.title}</h2>
                                {post.meta_tag && (
                                    <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.40)" }}>
                                        {post.meta_tag}
                                    </span>
                                )}
                            </div>

                            {/* Content Preview (Text) */}
                            {post.content && (
                                <div className={`px-5 pb-3 ${!(post.image_url || post.image) ? "" : "line-clamp-3"}`}>
                                    <p className="text-[14px] leading-relaxed text-white/80 whitespace-pre-wrap font-medium">
                                        {post.content}
                                    </p>
                                </div>
                            )}

                            {/* Image */}
                            {(post.image_url || post.image) && (
                                <div
                                    className="w-full flex justify-center relative bg-[#050505] cursor-pointer mt-1 border-t border-b border-white/[0.02]"
                                    onClick={() => ((post.is_spoiler || post.isSpoiler) ? setRevealedPosts(prev => ({ ...prev, [post.id]: true })) : null)}
                                >
                                    <img
                                        src={post.image_url || post.image}
                                        alt={post.title}
                                        className={`w-full max-h-[550px] object-contain transition-all duration-700 ${(post.is_spoiler || post.isSpoiler) && !revealedPosts[post.id] ? "blur-2xl opacity-30" : ""}`}
                                    />
                                    {(post.is_spoiler || post.isSpoiler) && !revealedPosts[post.id] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-2xl">
                                            <div className="px-5 py-2.5 rounded-full flex items-center gap-2" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(10px)" }}>
                                                <span className="text-[13px] font-bold text-white uppercase tracking-wider">Tap to reveal spoiler</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action bar — Reddit style */}
                            <div className="flex items-center gap-2 px-4 py-2 mt-1">
                                {/* Upvote pill */}
                                <div className="flex items-center rounded-full h-9 px-1 gap-1"
                                    style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.08] transition-colors"
                                        style={{ color: likedPosts.includes(post.id) ? "#FF4500" : "rgba(255,255,255,0.6)" }}
                                    >
                                        <svg className="w-5 h-5" fill={likedPosts.includes(post.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 15l8-8 8 8" /></svg>
                                    </button>
                                    <span className="text-[13px] font-bold select-none min-w-[20px] text-center"
                                        style={{ color: likedPosts.includes(post.id) ? "#FF4500" : "rgba(255,255,255,0.8)" }}>
                                        {post.votes || 0}
                                    </span>
                                    <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/[0.08] transition-colors text-white/60 hover:text-[#7193ff]">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 9l-8 8-8-8" /></svg>
                                    </button>
                                </div>

                                {/* Comments */}
                                <button
                                    onClick={() => toggleComments(post.id)}
                                    className="flex items-center gap-2 h-9 px-3.5 rounded-full transition-colors text-[13px] font-bold hover:bg-white/[0.08]"
                                    style={openComments[post.id]
                                        ? { background: "rgba(255,255,255,0.12)", color: "#fff" }
                                        : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)" }
                                    }
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    {post.comment_count ?? post.commentCount ?? 0}
                                </button>

                                {/* Share */}
                                <button
                                    onClick={() => handleShare(post.id)}
                                    className={`flex items-center gap-2 h-9 px-3.5 rounded-full transition-colors text-[13px] font-bold ${copiedPost === post.id ? 'bg-green-500/20 text-green-400' : 'bg-white/[0.06] hover:bg-white/[0.08] text-white/80'}`}
                                >
                                    {copiedPost === post.id ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                            {post.share_count || 0 > 0 ? (post.share_count >= 1000 ? (post.share_count / 1000).toFixed(1) + 'k' : post.share_count) : 'Share'}
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Comments section */}
                            {openComments[post.id] && (
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.20)" }}>
                                    <PostComments
                                        postId={post.id}
                                        isOpen={openComments[post.id]}
                                        onClose={() => toggleComments(post.id)}
                                        onCommentAdded={() => {
                                            setPosts(prev => prev.map(p => {
                                                if (p.id === post.id) {
                                                    return { ...p, comment_count: (p.comment_count || 0) + 1 };
                                                }
                                                return p;
                                            }));
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )
                }

                {loadingMore && (
                    <div className="flex justify-center py-6 w-full">
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                    </div>
                )}
            </div >
        </div >
    );
}