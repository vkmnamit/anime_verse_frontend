"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getPopularAnime, getTrendingAnime, type AnimeCard as AnimeCardType } from "@/src/lib/kitsu";
import { useSearch } from "@/src/context/SearchContext";
import AnimeCard from "@/src/components/AnimeCard/AnimeCard";

export default function TrendingSidebar() {
    const [popular, setPopular] = useState<AnimeCardType[]>([]);
    const [trending, setTrending] = useState<AnimeCardType[]>([]);
    const [loading, setLoading] = useState(true);
    const { searchQuery } = useSearch();

    const filteredPopular = useMemo(() => {
        if (!searchQuery.trim()) return popular;
        const q = searchQuery.toLowerCase();
        return popular.filter(a => a.title.toLowerCase().includes(q));
    }, [popular, searchQuery]);

    const filteredTrending = useMemo(() => {
        if (!searchQuery.trim()) return trending;
        const q = searchQuery.toLowerCase();
        return trending.filter(a => a.title.toLowerCase().includes(q));
    }, [trending, searchQuery]);

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
            <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-6 lg:gap-10 lg:sticky lg:top-20 lg:h-fit lg:self-start z-10 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white/5 h-48 lg:h-64 rounded-none border border-white/10" />
                ))}
            </aside>
        );
    }

    return (
        <aside className="w-full lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-6 lg:gap-8 lg:sticky lg:top-20 lg:h-[calc(100vh-100px)] lg:self-start z-10 lg:overflow-y-auto custom-sidebar-container pr-0 lg:pr-1">
            {/* Box 1: Heat Ranking Widget */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/5 rounded-none overflow-hidden shadow-2xl flex flex-col min-h-[400px]">
                <div className="px-6 py-5 flex items-center justify-center border-b border-white/5 bg-white/[0.03]">
                    <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-black text-white uppercase tracking-[0.4em]">Heat Ranking</h3>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="flex flex-col h-full">
                        {/* Fake Tabs */}
                        <div className="flex justify-center gap-6 px-4 py-3 border-b border-white/5 bg-white/[0.01]">
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#e63030] cursor-pointer">Sinking</span>
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors cursor-pointer">Heat & Feed</span>
                        </div>

                        {/* Popular List - Horizontal Scroll */}
                        <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory custom-scrollbar-hide h-full items-center">
                            <div className="flex gap-6 px-6 py-6">
                                {filteredPopular.map((anime, i) => (
                                    <AnimeCard key={anime.id} anime={anime} index={i} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Box 2: Most Heat Gained */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/5 rounded-none overflow-hidden shadow-2xl flex flex-col min-h-[300px]">
                <div className="px-6 py-5 flex items-center justify-center border-b border-white/5 bg-white/[0.03]">
                    <h3 className="text-[14px] font-black text-white uppercase text-center tracking-[0.4em] shrink-0">Most Heat Gained</h3>
                </div>

                <div className="flex-1 flex overflow-x-auto snap-x snap-mandatory custom-scrollbar-hide h-full items-center">
                    <div className="flex gap-6 px-6 py-6">
                        {filteredTrending.slice(0, 6).map((anime, i) => (
                            <AnimeCard key={anime.id} anime={anime} index={i} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Verse Weekly Highlights — Dynamic Infinite Scroll */}
            <div className="flex flex-col gap-4 shrink-0">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4915a]">Verse Weekly</span>
                        <div className="h-[1px] w-4 bg-[#d4915a]/30" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Hall of Fame</span>
                    </div>
                </div>

                <div className="relative h-80 sm:h-96 w-full overflow-hidden border-y border-white/5 bg-white/[0.02]">
                    <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#130f12] to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#130f12] to-transparent z-10" />

                    <div className="flex gap-4 animate-infinite-scroll py-8 px-4 w-max">
                        {/* Render double for seamless loop */}
                        {[...trending, ...trending].map((anime, idx) => (
                            <div
                                key={`${anime.id}-${idx}`}
                                onClick={() => window.location.href = `/anime/${anime.id}`}
                                className="relative w-44 sm:w-52 aspect-[2/3] shrink-0 group cursor-pointer rounded-lg overflow-hidden border border-white/5 hover:border-[#d4915a]/40 transition-all duration-500"
                            >
                                <img
                                    src={anime.posterImage}
                                    alt={anime.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                                <div className="absolute bottom-0 inset-x-0 p-5 z-20">
                                    <p className="text-[10px] font-black text-[#d4915a] uppercase tracking-[0.2em] mb-1.5">Weekly Pick</p>
                                    <h5 className="text-white text-[13px] font-black uppercase tracking-wider line-clamp-2 leading-tight drop-shadow-lg">{anime.title}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes infinite-scroll {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-infinite-scroll {
                    animation: infinite-scroll 40s linear infinite;
                }
                .animate-infinite-scroll:hover {
                    animation-play-state: paused;
                }
                .custom-sidebar-container::-webkit-scrollbar,
                .custom-scrollbar::-webkit-scrollbar,
                .custom-scrollbar-hide::-webkit-scrollbar {
                    width: 2px;
                    height: 0px;
                }
                .custom-scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
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
