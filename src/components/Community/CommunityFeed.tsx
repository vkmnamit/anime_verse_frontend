"use client";

import { useState, useEffect } from "react";
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

    const [revealedPosts, setRevealedPosts] = useState<Record<number, boolean>>({});
    const [likedPosts, setLikedPosts] = useState<number[]>([]);
    const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
    const [copiedPost, setCopiedPost] = useState<number | null>(null);
    const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set());
    const { searchQuery } = useSearch();
    const { token } = useAuth();
    const router = useRouter();

    const requireAuth = (e?: React.MouseEvent<HTMLElement>) => {
        if (!token) {
            if (e) e.preventDefault();
            router.push('/auth');
            return true;
        }
        return false;
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.community.posts(communitySlug ? { slug: communitySlug } : {});
                const data = Array.isArray(res) ? res : (res.data || res.posts || []);
                setPosts(data);
            } catch (err) {
                console.error("Failed to fetch posts", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        if (token) {
            api.community.getLikedPosts(token)
                .then(res => {
                    const data = Array.isArray(res) ? res : (res.data || []);
                    setLikedPosts(data);
                })
                .catch(err => console.error("Failed to fetch liked posts", err));
        }
    }, [token, communitySlug]);

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
        } catch (err) {
            console.error("Failed to toggle like", err);
            setLikedPosts(prev =>
                isLiked ? [...prev, postId] : prev.filter(id => id !== postId)
            );
        }
    };

    const handleShare = (postId: number) => {
        const url = typeof window !== 'undefined' ? `${window.location.origin}/community/post/${postId}` : '';
        navigator.clipboard.writeText(url);
        setCopiedPost(postId);
        setTimeout(() => setCopiedPost(null), 2000);
    };

    const toggleComments = (postId: number) => {
        setOpenComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    return (
        <div className="flex flex-col w-full relative font-sans">
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
                    posts.map((post: any) => (
                        <div
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
                                            setJoinedCommunities(prev => {
                                                const next = new Set(prev);
                                                next.has(slug) ? next.delete(slug) : next.add(slug);
                                                return next;
                                            });
                                        }}
                                        className="h-6 w-16 flex items-center justify-center rounded-full text-[11px] font-semibold transition-all active:scale-95"
                                        style={joinedCommunities.has(post.community_slug || (post.community_name || post.community || '').toLowerCase().replace(/\s+/g, '-'))
                                            ? { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.13)", color: "rgba(255,255,255,0.50)" }
                                            : { border: "1px solid rgba(255,255,255,0.20)", color: "rgba(255,255,255,0.45)" }
                                        }
                                    >
                                        {joinedCommunities.has(post.community_slug || (post.community_name || post.community || '').toLowerCase().replace(/\s+/g, '-')) ? '✓ Joined' : '+ Join'}
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

                            {/* Image */}
                            <div
                                className="w-full flex justify-center relative cursor-pointer"
                                onClick={() => ((post.is_spoiler || post.isSpoiler) ? setRevealedPosts(prev => ({ ...prev, [post.id]: true })) : null)}
                            >
                                <img
                                    src={post.image_url || post.image}
                                    alt={post.title}
                                    className={`w-full max-h-[440px] object-cover transition-all duration-700 ${(post.is_spoiler || post.isSpoiler) && !revealedPosts[post.id] ? "blur-2xl opacity-30" : ""}`}
                                />
                                {(post.is_spoiler || post.isSpoiler) && !revealedPosts[post.id] && (
                                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(20px)" }}>
                                        <div className="px-4 py-1.5 rounded-xl flex items-center gap-2" style={{ background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.10)" }}>
                                            <span className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>View spoiler</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action bar — smaller, subtler */}
                            <div className="flex items-center gap-1.5 px-5 py-2">
                                {/* Upvote pill */}
                                <div className="flex items-center rounded-full h-7 px-1 gap-0.5"
                                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                    <button
                                        onClick={() => handleLike(post.id)}
                                        className="w-7 h-[22px] flex items-center justify-center rounded-full transition-all"
                                        style={{ color: likedPosts.includes(post.id) ? "#e63030" : "rgba(255,255,255,0.35)" }}
                                    >
                                        <svg className="w-3.5 h-3.5" fill={likedPosts.includes(post.id) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                                    </button>
                                    <span className="text-[12px] font-bold px-1 select-none min-w-4 text-center"
                                        style={{ color: likedPosts.includes(post.id) ? "#e63030" : "rgba(255,255,255,0.60)" }}>
                                        {post.votes + (likedPosts.includes(post.id) ? 1 : 0)}
                                    </span>
                                    <button className="w-7 h-[22px] flex items-center justify-center rounded-full transition-all"
                                        style={{ color: "rgba(255,255,255,0.35)" }}>
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                </div>

                                {/* Comments */}
                                <button
                                    onClick={() => toggleComments(post.id)}
                                    className="flex items-center gap-1.5 h-7 px-2.5 rounded-full transition-all text-[11px] font-semibold"
                                    style={openComments[post.id]
                                        ? { background: "rgba(230,48,48,0.10)", border: "1px solid rgba(230,48,48,0.25)", color: "#e63030" }
                                        : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.40)" }
                                    }
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                    {post.comment_count ?? post.commentCount}
                                </button>
                            </div>

                            {/* Comments section */}
                            {openComments[post.id] && (
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.20)" }}>
                                    <PostComments
                                        postId={post.id}
                                        isOpen={openComments[post.id]}
                                        onClose={() => toggleComments(post.id)}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )
                }
            </div >
        </div >
    );
}