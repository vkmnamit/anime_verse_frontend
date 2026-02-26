"use client";

import React, { useEffect, useState } from "react";
import { getTrendingAnime, type AnimeCard as AnimeCardType } from "@/src/lib/kitsu";
import { useAnimeModal } from "@/src/context/AnimeModalContext";
import { api } from "@/src/lib/api";

export default function TrendingList() {
    const [trending, setTrending] = useState<AnimeCardType[]>([]);
    const [loading, setLoading] = useState(true);
    const { openModal } = useAnimeModal();

    useEffect(() => {
        const fetchTrending = async () => {
            setLoading(true);
            try {
                // Fetch rich data from Kitsu first
                const data = await getTrendingAnime(10);

                // Then enrich with real comment counts from our local backend
                const enriched = await Promise.all(data.map(async (anime) => {
                    try {
                        const commentsRes = await api.anime.comments(anime.id);
                        return { ...anime, realCommentCount: commentsRes.data?.length || 0 };
                    } catch {
                        return { ...anime, realCommentCount: 0 };
                    }
                }));
                setTrending(enriched);
            } catch (err) {
                console.error("Failed to fetch trending:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col gap-6 animate-pulse">
                <div className="h-20 bg-white/5 rounded-3xl w-1/3" />
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-32 bg-white/5 rounded-3xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col gap-8 pb-20">
            <header className="flex items-end justify-between pt-20 px-4 md:px-12 lg:px-24">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter mb-2 italic">Trending Now</h1>
                    <p className="text-white/40 text-lg font-bold uppercase tracking-[0.2em]">Verified Community Heat</p>
                </div>
            </header>

            {/* List */}
            <div className="flex flex-col px-4 md:px-12 lg:px-24">
                {trending.map((anime, index) => (
                    <div
                        key={anime.id}
                        onClick={() => openModal(anime)}
                        className="group relative flex items-center gap-8 py-10 border-b border-white/[0.03] hover:bg-white/[0.01] transition-all cursor-pointer first:pt-0"
                    >
                        {/* Rank Number - Bold & High Visibility */}
                        <div className="text-7xl font-black italic text-[#e63030]/40 w-24 text-center select-none group-hover:text-[#e63030] transition-colors leading-none">
                            {index + 1}
                        </div>

                        {/* Image Box - Pure Rectangle */}
                        <div className="relative w-40 lg:w-48 aspect-[2/3] bg-[#111118]/40 backdrop-blur-2xl border border-white/10 rounded-sm overflow-hidden shadow-2xl shrink-0">
                            <img
                                src={anime.coverImage || anime.posterImage}
                                alt={anime.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0 flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                <h2
                                    className="text-2xl lg:text-3xl font-black text-white group-hover:text-[#e63030] transition-colors truncate tracking-tighter uppercase"
                                    style={{ fontFamily: 'var(--font-rubik), Rubik, sans-serif' }}
                                >
                                    {anime.title}
                                </h2>
                                {anime.rating && (
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-none border border-white/20 shrink-0">
                                        <span className="text-white font-black text-[11px] uppercase tracking-widest">★ {(anime.rating / 10).toFixed(1)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Synopsis - Increased visibility */}
                            <p className="text-white/60 text-[14px] font-medium line-clamp-2 leading-relaxed max-w-[800px] tracking-wide">
                                {anime.synopsis}
                            </p>

                            {/* Tags Row - Sharp Borders */}
                            <div className="flex items-center flex-wrap gap-3 mt-1">
                                <span className="px-3 py-1.5 rounded-none bg-white/10 text-white/90 text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                                    {anime.categories?.[0] || "Anime"}
                                </span>
                                {anime.status === "current" && (
                                    <span className="px-3 py-1.5 rounded-none bg-[#e63030]/20 text-[#e63030] text-[10px] font-black uppercase tracking-[0.2em] border border-[#e63030]/30">
                                        Active Trend
                                    </span>
                                )}
                                <span className="px-3 py-1.5 rounded-none bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5">
                                    HD 4K
                                </span>
                            </div>
                        </div>

                        {/* Stats Area - Restored Original Style */}
                        <div className="hidden md:flex items-center gap-6 px-4">
                            <div className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-sm font-black tracking-widest uppercase">
                                    {(anime as any).realCommentCount || 0} <span className="hidden lg:inline">Comments</span>
                                </span>
                            </div>
                        </div>

                        {/* Sharp Chevron */}
                        <div className="text-white/[0.05] group-hover:text-[#e63030] group-hover:translate-x-1 transition-all">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
