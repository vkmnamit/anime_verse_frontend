"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import CommunityFeed from "@/src/components/Community/CommunityFeed";
import CreatePostModal from "@/src/components/Community/CreatePostModal";
import { api } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

/**
 * CommunitySlugPage handles both system feeds (popular, trending, discover)
 * and specific community pages (e.g., r/anime).
 */
export default function CommunitySlugPage() {
    const params = useParams();
    const slug = params.slug as string;
    const router = useRouter();
    const { token } = useAuth();

    const [community, setCommunity] = useState<any>(null);
    const [topCommunities, setTopCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [feedKey, setFeedKey] = useState(0);

    const isSystemFeed = ["popular", "trending", "discover"].includes(slug);

    const openCreatePost = (e?: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
        if (!token) {
            if (e) e.preventDefault();
            router.push('/auth');
            return;
        }
        setShowCreatePost(true);
    };

    const handleJoin = (e: React.MouseEvent<HTMLElement>) => {
        if (!token) {
            e.preventDefault();
            router.push('/auth');
        }
    };

    useEffect(() => {
        // Fetch top communities for mobile view
        api.community.list()
            .then(res => {
                const data = Array.isArray(res) ? res : (res.data || []);
                setTopCommunities(data.slice(0, 5));
            })
            .catch(err => console.error("Failed to fetch top communities", err));

        if (!isSystemFeed && slug) {
            // Fetch specific community details if it's not a system feed
            api.community.details(slug)
                .then(res => {
                    setCommunity(res.data || res);
                })
                .catch(err => console.error("Failed to fetch community details", err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [slug, isSystemFeed]);

    const formattedSlug = slug.startsWith('r/') ? slug : `r/${slug}`;

    return (
        <>
            {/* Feed Column — clean, centered, Reddit-style */}
            <div className="w-full min-w-0">
                {/* Mobile Category Nav - Only visible on mobile/tablet */}
                <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar pb-6 px-1">
                    {[
                        { label: 'Home', slug: 'home', href: '/community', icon: '🏠' },
                        { label: 'Popular', slug: 'popular', href: '/community/popular', icon: '🔥' },
                        { label: 'Trending', slug: 'trending', href: '/community/trending', icon: '📈' },
                        { label: 'Discover', slug: 'discover', href: '/community/discover', icon: '🌍' }
                    ].map((tab) => {
                        const isActive = (tab.slug === 'home' && !isSystemFeed && !params.slug) || (tab.slug === slug);
                        return (
                            <button
                                key={tab.label}
                                onClick={() => router.push(tab.href)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap text-[13px] font-black uppercase tracking-wider transition-all border ${isActive
                                    ? 'bg-[#e63030] border-[#e63030] text-white shadow-lg shadow-[#e63030]/20'
                                    : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.08]'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Community Header (Only for specific communities) */}
                {!isSystemFeed && community && (
                    <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="w-full h-32 bg-white/[0.04] rounded-2xl overflow-hidden relative mb-6 border border-white/[0.06]">
                            {community.banner_url ? (
                                <img src={community.banner_url} alt="Banner" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-r from-[#e63030]/20 to-[#ff6b2c]/10" />
                            )}
                        </div>
                        <div className="flex items-end gap-5 px-4 -mt-12 relative z-10">
                            <div className="w-20 h-20 rounded-xl bg-[#12121a] border-4 border-[#0b0b0f] overflow-hidden shadow-md flex items-center justify-center text-2xl font-bold text-white/40">
                                {community.avatar_url ? (
                                    <img src={community.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    community.name?.[0].toUpperCase() || "R"
                                )}
                            </div>
                            <div className="mb-1 flex-1">
                                <h1 className="text-2xl font-bold text-white leading-tight">{community.name || formattedSlug}</h1>
                                <p className="text-[13px] text-white/40 font-medium tracking-wide">{formattedSlug}</p>
                            </div>
                            <button onClick={handleJoin} className="px-6 py-2 bg-gradient-to-r from-[#e63030] to-[#ff6b2c] hover:from-[#ff4545] hover:to-[#ff7b3c] text-white text-[13px] font-bold rounded-full transition-all shadow-lg shadow-[#e63030]/20 active:scale-95 mb-1">
                                JOIN
                            </button>
                        </div>
                        <div className="h-[1px] bg-white/[0.06] w-full mt-8" />
                    </div>
                )}

                {/* Create Post Bar */}
                <div className="bg-[#121212]/80 backdrop-blur-md border border-white/[0.06] rounded-2xl px-4 py-2.5 mb-5 flex items-center gap-3 hover:border-white/[0.12] transition-all w-full">
                    <div className="w-9 h-9 rounded-full bg-white/[0.06] shrink-0 flex items-center justify-center text-[10px] font-bold text-white/40 overflow-hidden border border-white/[0.08]">
                        {isSystemFeed ? "r/" : (slug?.[0]?.toUpperCase() || "R")}
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            onFocus={openCreatePost}
                            placeholder={isSystemFeed ? "Create a post" : `Post to ${formattedSlug}`}
                            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-full h-9 px-4 text-[14px] outline-none transition-colors focus:border-[#e63030]/50 focus:bg-white/[0.06] placeholder:text-white/30 font-medium text-white"
                        />
                    </div>
                </div>

                {/* Mobile Top Communities - Only visible on small screens */}
                <div className="xl:hidden mb-6">
                    <h3 className="text-[12px] font-semibold text-white/30 uppercase tracking-[0.05em] mb-3 px-1">Top Communities</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
                        {loading && topCommunities.length === 0 ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="w-12 h-12 rounded-full bg-white/[0.06] animate-pulse shrink-0" />)
                        ) : topCommunities.map((c) => (
                            <div key={c.id || c.slug} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer" onClick={() => router.push(`/community/${c.slug?.replace('r/', '') || c.id}`)}>
                                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/40 overflow-hidden group-hover:border-[#e63030] transition-all">
                                    {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover" /> : (c.slug || "r/").slice(0, 4).toUpperCase()}
                                </div>
                                <span className="text-[11px] font-medium text-white/50 group-hover:text-white transition-colors truncate max-w-[56px]">{c.name || c.slug?.replace('r/', '')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Community Feed Component */}
                <CommunityFeed
                    key={feedKey}
                    type={isSystemFeed ? slug : "home"}
                    communitySlug={isSystemFeed ? undefined : formattedSlug}
                />

                {/* Footer */}
                <div className="py-8 mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/15 text-center">AnimeVerse © 2026</p>
                </div>
            </div>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={showCreatePost}
                onClose={() => setShowCreatePost(false)}
                onPostCreated={() => setFeedKey(prev => prev + 1)}
                defaultCommunity={!isSystemFeed ? slug : undefined}
            />
        </>
    );
}
