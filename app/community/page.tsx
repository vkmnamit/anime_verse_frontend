"use client";

import CommunitySidebar from "@/src/components/Community/CommunitySidebar";
import CommunityFeed from "@/src/components/Community/CommunityFeed";
import CreatePostModal from "@/src/components/Community/CreatePostModal";
import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function CommunityPage() {
    const [topCommunities, setTopCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [feedKey, setFeedKey] = useState(0);
    const router = useRouter();
    const { token } = useAuth();

    const requireAuth = (e?: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
        if (!token) {
            if (e) e.preventDefault();
            router.push('/auth');
            return true;
        }
        return false;
    };

    const openCreatePost = (e?: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
        if (requireAuth(e)) return;
        setShowCreatePost(true);
    };

    useEffect(() => {
        api.community.list()
            .then(res => {
                const data = Array.isArray(res) ? res : (res.data || []);
                setTopCommunities(data.slice(0, 5));
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch top communities", err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            {/* ── Feed Column — clean, centered, Reddit-style ── */}
            <div className="w-full min-w-0">

                {/* Create Post Bar */}
                <div className="bg-[#121212]/80 backdrop-blur-md border border-white/[0.06] rounded-2xl px-4 py-2.5 mb-5 flex items-center gap-3 hover:border-white/[0.12] transition-all w-full">
                    <div className="w-9 h-9 rounded-full bg-white/[0.06] shrink-0 flex items-center justify-center text-[10px] font-bold text-white/40 overflow-hidden border border-white/[0.08]">
                        r/
                    </div>
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Create a post"
                            onFocus={openCreatePost}
                            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-full h-9 px-4 text-[14px] outline-none transition-colors focus:border-[#e63030]/50 focus:bg-white/[0.06] placeholder:text-white/30 font-medium text-white"
                        />
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <button title="Photo" onClick={openCreatePost} className="w-9 h-9 flex items-center justify-center hover:bg-white/[0.06] rounded-full text-white/30 transition-colors hover:text-white/60">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </button>
                        <button title="Link" onClick={openCreatePost} className="w-9 h-9 flex items-center justify-center hover:bg-white/[0.06] rounded-full text-white/30 transition-colors hover:text-white/60">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Top Communities */}
                <div className="xl:hidden mb-6">
                    <h3 className="text-[12px] font-semibold text-white/30 uppercase tracking-[0.05em] mb-3 px-1">Top Communities</h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
                        {loading ? (
                            [1, 2, 3, 4].map(i => <div key={i} className="w-12 h-12 rounded-full bg-white/[0.06] animate-pulse shrink-0" />)
                        ) : topCommunities.map((c) => (
                            <div key={c.id} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
                                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-white/40 overflow-hidden group-hover:border-[#e63030] transition-all">
                                    {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover" /> : (c.slug || "r/").slice(2, 4).toUpperCase()}
                                </div>
                                <span className="text-[11px] font-medium text-white/50 group-hover:text-white transition-colors truncate max-w-[56px]">{c.name || c.slug?.replace('r/', '')}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Community Feed */}
                <CommunityFeed type="home" key={feedKey} />

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
            />
        </>
    );
}
