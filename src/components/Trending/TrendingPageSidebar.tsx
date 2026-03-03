"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getTrendingAnime, type AnimeCard as AnimeCardType } from "@/src/lib/kitsu";
import { api } from "@/src/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface BattleWinner {
    title: string;
    image: string;
    votePct: number;
    round: string;
}

const GENRES = [
    { name: "Action", heat: 98, color: "bg-[#e63030]", status: "Trending" },
    { name: "Romance", heat: 85, color: "bg-pink-500", status: "Peaking" },
    { name: "Shonen", heat: 92, color: "bg-orange-500", status: "Trending" },
    { name: "Horror", heat: 45, color: "bg-purple-600", status: "Stable" },
    { name: "Fantasy", heat: 78, color: "bg-emerald-500", status: "Rising" },
    { name: "Sci-Fi", heat: 62, color: "bg-blue-500", status: "Stable" },
];

const CONTRIBUTORS = [
    { name: "ZenX", points: 1240, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZenX" },
    { name: "Mina_V", points: 980, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mina" },
    { name: "Luffy_99", points: 850, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luffy" },
];

export default function TrendingPageSidebar() {
    const [graphData, setGraphData] = useState([40, 70, 45, 90, 65, 80, 50, 95, 75, 85, 60, 100, 70, 85, 40, 60]);
    const [featuredAnime, setFeaturedAnime] = useState<AnimeCardType | null>(null);
    const [activeUsers, setActiveUsers] = useState(1240);
    const [battleWinners, setBattleWinners] = useState<BattleWinner[]>([]);

    useEffect(() => {
        // Fetch battle winners
        const fetchWinners = async () => {
            try {
                const res: any = await api.battles.list(1, 20);
                const battles: any[] = Array.isArray(res) ? res : (res.data || []);
                const winners: BattleWinner[] = battles
                    .filter((b: any) => b.winner)
                    .slice(0, 5)
                    .map((b: any) => {
                        const isA = b.winner === "A";
                        const anime = isA ? b.anime_a_rel : b.anime_b_rel;
                        const votes = b.votes || {};
                        const total = (votes.A || 0) + (votes.B || 0);
                        const won = isA ? (votes.A || 0) : (votes.B || 0);
                        return {
                            title: anime?.title || anime?.canonicalTitle || "Unknown",
                            image: anime?.posterImage?.large || anime?.posterImage?.medium || anime?.coverImage?.large || "",
                            votePct: total ? Math.round((won / total) * 100) : 0,
                            round: "Round of 16",
                        };
                    });
                setBattleWinners(winners);
            } catch { /* no winners yet */ }
        };
        fetchWinners();

        // 1. Fetch real trending #1 anime for highlight
        const fetchFeatured = async () => {
            try {
                const data = await getTrendingAnime(1);
                if (data && data.length > 0) setFeaturedAnime(data[0]);
            } catch (err) {
                console.error("Failed to fetch featured anime:", err);
            }
        };
        fetchFeatured();

        // 2. Animate Graph Fluctuations
        const interval = setInterval(() => {
            setGraphData(prev => prev.map(h => {
                const delta = (Math.random() - 0.5) * 15;
                return Math.max(30, Math.min(100, h + delta));
            }));
            setActiveUsers(prev => prev + Math.floor((Math.random() - 0.5) * 20));
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <aside className="w-full lg:w-[360px] xl:w-[400px] shrink-0 flex flex-col gap-8 lg:sticky lg:top-24 lg:h-[calc(100vh-120px)] lg:overflow-y-auto no-scrollbar pb-10">

            {/* 1. Pulse of the Verse — Real-time Fluctuating Graph */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#e63030] mb-1">Live Feed • Tournament Day 2</span>
                        <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Pulse of the Verse</h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#e63030]/10 border border-[#e63030]/20 rounded-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e63030] animate-pulse" />
                        <span className="text-[9px] font-black text-[#e63030] uppercase">Live</span>
                    </div>
                </div>

                <div className="h-24 flex items-end gap-1.5 px-1">
                    {graphData.map((h, i) => (
                        <div
                            key={i}
                            className="flex-1 bg-white/10 hover:bg-[#e63030] transition-all duration-700 rounded-t-sm relative group"
                            style={{
                                height: `${h}%`,
                                opacity: 0.3 + (h / 100) * 0.7,
                            }}
                        >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                                {Math.round(h)}%
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[9px] font-bold text-white/20 uppercase tracking-widest border-t border-white/5 pt-4">
                    <span>Heat Index Scale</span>
                    <span className="text-white/40">{activeUsers.toLocaleString()} Active Users</span>
                </div>
            </div>

            {/* 2. Hall of Fame — Dynamic Anime Highlight */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 flex flex-col gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4915a] mb-1">Weekly Pick</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Hall of Fame</h3>
                </div>

                {/* Real Trending Post */}
                <div className="group cursor-pointer" onClick={() => featuredAnime && (window.location.href = `/anime/${featuredAnime.id}`)}>
                    <div className="mb-4 aspect-[21/9] bg-black/40 border border-white/5 overflow-hidden rounded-sm relative">
                        {featuredAnime ? (
                            <img
                                src={featuredAnime.posterImage}
                                alt={featuredAnime.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full animate-pulse bg-white/5" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-2 left-3">
                            <span className="text-[8px] font-black bg-[#e63030] text-white px-2 py-0.5 rounded-sm uppercase tracking-tighter italic">Top Trending</span>
                        </div>
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2 group-hover:text-[#d4915a] transition-colors line-clamp-1">
                        {featuredAnime?.title || "Loading Weekly Pick..."}
                    </h4>
                    <p className="text-[10px] text-white/40 leading-relaxed line-clamp-2 italic">
                        The definitive leader of the current season. High heat generated in community threads this week.
                    </p>
                </div>

                <div className="h-px bg-white/5" />

                <div className="flex flex-col gap-4">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Top Feed Contributors</span>
                    {CONTRIBUTORS.map((user, i) => (
                        <div key={user.name} className="flex items-center justify-between group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 group-hover:border-[#d4915a]/50 transition-colors">
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-black border border-white/10 rounded-full flex items-center justify-center text-[7px] font-black text-[#d4915a]">
                                        #{i + 1}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black text-white uppercase tracking-wider">{user.name}</span>
                                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Elite Verse Member</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[11px] font-black text-white italic">{user.points}</span>
                                <p className="text-[8px] font-bold text-white/20 uppercase">Trend Pts</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Genre Heatmap — Categorical Trends */}
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 flex flex-col gap-6 mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">Categories</span>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Interests Map</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {GENRES.map((genre) => (
                        <div key={genre.name} className="relative group cursor-pointer overflow-hidden bg-black/40 border border-white/5 p-3 flex flex-col justify-between h-20 hover:bg-white/[0.02] transition-colors">
                            <div className={`absolute top-0 right-0 w-1 h-full ${genre.color}`} />
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{genre.name}</span>
                                <span className="text-[8px] font-black text-[#e63030] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{genre.status}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-black text-white italic">{genre.heat}%</span>
                                <span className="text-[9px] font-bold text-white/20 uppercase">Peak</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </aside>
    );
}
