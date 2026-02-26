"use client";

import React, { useEffect, useState } from "react";
import { getPopularAnime, getTrendingAnime, type AnimeCard as AnimeCardType } from "@/src/lib/kitsu";

export default function TrendingSidebar() {
    const [popular, setPopular] = useState<AnimeCardType[]>([]);
    const [trending, setTrending] = useState<AnimeCardType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [popData, trendData] = await Promise.all([
                    getPopularAnime(10),
                    getTrendingAnime(10)
                ]);
                setPopular(popData);
                setTrending(trendData);
            } catch (err) {
                console.error("Failed to fetch sidebar data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-10 sticky top-20 h-fit self-start z-10 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white/5 h-64 rounded-xl border border-white/10" />
                ))}
            </aside>
        );
    }

    return (
        <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-8 sticky top-20 h-[calc(100vh-100px)] self-start z-10 overflow-y-auto custom-sidebar-container pr-1">
            {/* Box 1: Heat Ranking Widget (Restored Rounded Style) */}
            <div className="bg-[#111118]/60 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col h-[400px]">
                <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <span className="text-orange-500 text-lg">🔥</span>
                        <h3 className="text-[14px] font-black text-white uppercase tracking-[0.2em]">Heat Ranking</h3>
                    </div>
                    <span className="text-[#e63030] text-sm font-black">🔥</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="px-2 py-4 flex flex-col gap-1">
                        {/* Fake Tabs */}
                        <div className="flex gap-4 px-4 mb-4 border-b border-white/5 pb-3">
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#e63030] cursor-pointer">Sinking</span>
                            <span className="text-[11px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors cursor-pointer">Heat & Feed</span>
                        </div>

                        {/* Popular List */}
                        <div className="flex flex-col gap-6 px-4">
                            {popular.map((anime, i) => (
                                <div key={anime.id} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                            <img src={anime.posterImage} alt={anime.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold text-sm line-clamp-1 group-hover:text-[#e63030] transition-colors">{anime.title}</span>
                                            <span className="text-[#e63030] text-[9px] font-black uppercase tracking-widest mt-0.5">
                                                {i === 0 ? "New" : i === 1 ? "Underrated" : "Top Pick"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-white/20 group-hover:text-white transition-colors">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Box 2: Most Heat Gained (Restored Rounded Style) */}
            <div className="bg-[#111118]/60 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-2xl p-6 h-[300px] flex flex-col">
                <h3 className="text-[18px] font-black text-white italic tracking-tighter mb-6 shrink-0">Most Heat Gained</h3>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col gap-6">
                        {trending.slice(0, 6).map((anime, i) => (
                            <div key={anime.id} className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                    <img src={anime.posterImage} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-white font-bold text-[15px] group-hover:text-[#e63030] transition-colors line-clamp-1">{anime.title}</span>
                                    <span className={i === 0 ? "text-emerald-500 text-[10px] font-black uppercase tracking-widest" : "text-emerald-500/60 text-[10px] font-black uppercase tracking-widest"}>
                                        {i === 0 ? "New" : "Underrated"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Verse Weekly Recap Card (REVERTED TO ORIGINAL ROUNDED STYLE) */}
            <div
                className="relative overflow-hidden rounded-xl group cursor-pointer h-56 shrink-0"
                onClick={() => trending[0] && (window.location.href = `/anime/${trending[0].id}`)}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#e63030] to-orange-600 opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" />

                <div className="relative z-10 p-8 h-full flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e63030] mb-4">Verse Weekly</span>
                    <h4 className="text-3xl font-black text-white italic leading-[1.1] mb-2 truncate">
                        {trending[0]?.title || "The Anime Recap"}
                    </h4>
                    <p className="text-white/40 text-[12px] font-medium leading-relaxed mb-auto line-clamp-2">
                        {trending[0]?.synopsis || "Don't miss the biggest shifts in the community this week."}
                    </p>
                    <div className="flex items-center gap-3 text-white font-black text-[11px] uppercase tracking-[0.3em] group-hover:gap-5 transition-all">
                        Read More <span>→</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-sidebar-container::-webkit-scrollbar,
                .custom-scrollbar::-webkit-scrollbar {
                    width: 2px;
                }
                .custom-sidebar-container::-webkit-scrollbar-track,
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-sidebar-container::-webkit-scrollbar-thumb,
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e63030;
                }
            `}</style>
        </aside>
    );
}
