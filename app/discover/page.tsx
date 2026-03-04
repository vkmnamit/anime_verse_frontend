"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Navbar from "@/src/components/Navbar/Navbar";
import { api } from "@/src/lib/api";
import {
    type AnimeCard as AnimeType
} from "@/src/lib/kitsu";
import { mapBackendToFrontend } from "@/src/lib/anime-mapper";
import { useAnimeModal } from "@/src/context/AnimeModalContext";
import { useSearch } from "@/src/context/SearchContext";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function DiscoverPage() {
    const { openModal } = useAnimeModal();
    const { searchQuery } = useSearch();
    const { user, token } = useAuth();
    const router = useRouter();

    const [featured, setFeatured] = useState<AnimeType[]>([]);
    const [mainList, setMainList] = useState<AnimeType[]>([]);
    const [popularList, setPopularList] = useState<AnimeType[]>([]);
    const [upcoming, setUpcoming] = useState<AnimeType[]>([]);
    const [todaysBattles, setTodaysBattles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingFilters, setLoadingFilters] = useState(false);
    const [activeSort, setActiveSort] = useState<"Popular" | "Trending" | "Top Rated" | "Recent">("Popular");
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    // Personalisation
    const [forYouList, setForYouList] = useState<AnimeType[]>([]);
    const [topGenres, setTopGenres] = useState<string[]>([]);
    const [loadingForYou, setLoadingForYou] = useState(false);
    const [forYouGenre, setForYouGenre] = useState<string>("");

    // Fetch personalised taste + "For You" row — runs on every page visit
    const fetchForYou = useCallback(async () => {
        if (!token) return;
        setLoadingForYou(true);
        try {
            const taste = await api.user.getTaste(token);
            const genres = taste?.topGenres || [];
            setTopGenres(genres);
            const topGenre = genres[0];
            if (!topGenre) return;
            setForYouGenre(topGenre);

            // pick a random genre from top 3 each page load for variety
            const pickFrom = genres.slice(0, 3);
            const picked = pickFrom[Math.floor(Math.random() * pickFrom.length)] || topGenre;
            setForYouGenre(picked);

            const res = await api.anime.list({ genre: picked, sort: "popular", limit: 8 });
            const data = Array.isArray(res) ? res : (res?.data || []);
            setForYouList(data.map(mapBackendToFrontend));
        } catch (e) {
            // silently fail — for-you section just doesn't render
        } finally {
            setLoadingForYou(false);
        }
    }, [token]);

    // Initial data load
    useEffect(() => {
        async function loadData() {
            try {
                const trendRes = await api.anime.trending(2);
                setFeatured((trendRes?.data || trendRes || []).map(mapBackendToFrontend));
            } catch (e) { }

            try {
                const popRes = await api.anime.popular(4);
                setPopularList((popRes?.data || popRes || []).map(mapBackendToFrontend));
            } catch (e) { }

            try {
                const upRes = await api.anime.list({ sort: 'recent', limit: 3 });
                setUpcoming((upRes?.data || upRes || []).map(mapBackendToFrontend));
            } catch (e) { }

            try {
                const battlesRes = await api.battles.today();
                setTodaysBattles(battlesRes?.battles || battlesRes?.data?.battles || []);
            } catch (e) { }
        }
        loadData();
    }, []);

    // For You — re-runs every time the user is present (page load / token change)
    useEffect(() => {
        fetchForYou();
    }, [fetchForYou]);

    // Main filtered list
    useEffect(() => {
        async function fetchMainList() {
            setLoadingFilters(true);
            try {
                let sortValue = 'popular';
                if (activeSort === 'Trending') sortValue = 'trending';
                if (activeSort === 'Top Rated') sortValue = 'score';
                if (activeSort === 'Recent') sortValue = 'recent';

                const res = await api.anime.list({
                    sort: sortValue,
                    genre: selectedGenre,
                    year: selectedYear,
                    q: searchQuery || selectedTag || undefined,
                    limit: 12
                });

                const data = Array.isArray(res) ? res : (res?.data || []);
                setMainList(data.map(mapBackendToFrontend));
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingFilters(false);
                setLoading(false);
            }
        }
        fetchMainList();
    }, [activeSort, selectedGenre, selectedTag, selectedYear, searchQuery]);

    const genres = [
        { name: "Action", color: "#c4363f" },
        { name: "Comedy", color: "#d4915a" },
        { name: "Adventure", color: "#258a7e" },
        { name: "Fantasy", color: "#5c3585" },
        { name: "Romance", color: "#cc6248" },
        { name: "Sci-Fi", color: "#3d6b89" },
        { name: "Horror", color: "#4a9eff" },
    ];

    const tags = ["Isekai", "Mecha", "Supernatural", "Military", "Music", "Seinen", "Shounen"];

    const featuredMeta = [
        {
            subtitle: "Handpicked for your absolute taste",
            gradientFrom: "#c4363f",
            gradientTo: "#7b1520",
            accentColor: "#ff6b7a",
        },
        {
            subtitle: "Global viewers are obsessing over this",
            gradientFrom: "#1a3a6b",
            gradientTo: "#0d1f3c",
            accentColor: "#4a9eff",
        },
    ];

    return (
        <div className="relative min-h-screen bg-[#130f12] text-white">
            <div className="fixed inset-0 z-0">
                <Image src="/discover_fire_bg.png" alt="Fire Background" fill className="object-cover opacity-20" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-[#130f12]/60 via-[#130f12]/85 to-[#130f12]" />
            </div>

            <Navbar />

            <main className="relative z-10 pt-8 px-5 lg:px-10 xl:px-16 max-w-[1520px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-tight mb-4 text-white uppercase italic">
                            Discover
                        </h1>
                        <p className="text-[#8a7e84] text-base sm:text-lg font-medium tracking-widest uppercase">
                            Find your next obsession
                        </p>
                    </div>
                </div>

                {/* ── PERSONALISED "FOR YOU" ROW ───────────────────────────── */}
                {user && (
                    <section className="mb-16">
                        <div className="flex items-center gap-4 mb-7">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[#c4363f] animate-pulse" />
                                <h2 className="text-[13px] font-black uppercase tracking-[0.35em] text-white/50">
                                    For You
                                </h2>
                                {forYouGenre && (
                                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/8 text-[11px] font-black uppercase tracking-widest text-white/40">
                                        {forYouGenre}
                                    </span>
                                )}
                            </div>
                            {/* Shown top genres as breadcrumbs */}
                            {topGenres.length > 1 && (
                                <div className="flex items-center gap-2 ml-4">
                                    {topGenres.slice(0, 5).map((g, i) => (
                                        <button
                                            key={g}
                                            onClick={() => {
                                                setForYouGenre(g);
                                                setLoadingForYou(true);
                                                api.anime.list({ genre: g, sort: "popular", limit: 8 })
                                                    .then(res => {
                                                        const data = Array.isArray(res) ? res : (res?.data || []);
                                                        setForYouList(data.map(mapBackendToFrontend));
                                                    })
                                                    .finally(() => setLoadingForYou(false));
                                            }}
                                            className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full transition-all ${g === forYouGenre
                                                ? "text-white bg-white/10 border border-white/15"
                                                : "text-white/25 hover:text-white/60"
                                                }`}
                                        >
                                            {i === 0 ? "🔥 " : ""}{g}
                                        </button>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={fetchForYou}
                                className="ml-auto text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/50 transition-all flex items-center gap-1.5"
                                title="Refresh recommendations"
                            >
                                <svg className={`w-3 h-3 ${loadingForYou ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M4.582 9A8 8 0 0119.419 15M19.419 15A8 8 0 014.582 9" />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        {loadingForYou ? (
                            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="aspect-[3/4.2] w-36 shrink-0 rounded-2xl bg-white/3 animate-pulse" />
                                ))}
                            </div>
                        ) : forYouList.length > 0 ? (
                            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
                                {forYouList.map(anime => (
                                    <div
                                        key={anime.id}
                                        onClick={() => openModal(anime)}
                                        className="group relative w-36 shrink-0 aspect-[3/4.2] rounded-2xl overflow-hidden cursor-pointer border border-white/6 hover:border-white/20 transition-all duration-300 hover:scale-105"
                                    >
                                        <Image src={anime.posterImage} alt={anime.title} fill className="object-cover transition-all duration-500 group-hover:brightness-125" />
                                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black via-black/40 to-transparent">
                                            <h3 className="text-[11px] font-black italic uppercase leading-tight line-clamp-2">{anime.title}</h3>
                                        </div>
                                        {/* Genre badge on hover */}
                                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="px-2 py-0.5 bg-[#c4363f]/80 backdrop-blur-sm rounded-full text-[9px] font-black uppercase tracking-widest">{forYouGenre}</span>
                                        </div>
                                    </div>
                                ))}
                                {/* CTA to filter full list by this genre */}
                                <div
                                    onClick={() => setSelectedGenre(forYouGenre)}
                                    className="w-36 shrink-0 aspect-[3/4.2] rounded-2xl border-2 border-dashed border-white/10 hover:border-white/25 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-white/3 group"
                                >
                                    <svg className="w-6 h-6 text-white/20 group-hover:text-white/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-white/50 text-center px-2 leading-tight">See all {forYouGenre}</span>
                                </div>
                            </div>
                        ) : null}

                        {/* Activity hint — shown if taste is empty */}
                        {!loadingForYou && forYouList.length === 0 && topGenres.length === 0 && (
                            <div className="py-8 px-6 rounded-2xl border border-dashed border-white/8 text-center">
                                <p className="text-[12px] font-black uppercase tracking-widest text-white/20">Start watching, reacting & commenting to unlock your taste profile</p>
                            </div>
                        )}
                    </section>
                )}

                {/* ── FILTERS BAR ─────────────────────────────────────────── */}
                <div className="mb-20 overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-12 min-w-max pb-10">
                        {/* Sort Toggles */}
                        <div className="flex items-center gap-3 rounded-[24px] bg-white/[0.04] border border-white/[0.08] p-3 shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                            {["Popular", "Trending", "Top Rated", "Recent"].map((s) => {
                                const isActive = activeSort === s;
                                let activeStyles = "bg-white text-black shadow-2xl scale-110";
                                if (s === "Trending" && isActive) activeStyles = "bg-yellow-400 text-black shadow-[0_0_30px_rgba(250,204,21,0.5)] scale-110";
                                if (s === "Top Rated" && isActive) activeStyles = "bg-[#c4363f] text-white shadow-[0_0_30px_rgba(196,54,63,0.5)] scale-110";
                                return (
                                    <button key={s} onClick={() => setActiveSort(s as any)} className={`px-10 py-4 rounded-xl text-[15px] font-black uppercase tracking-[0.2em] transition-all duration-400 ${isActive ? activeStyles : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"}`}>
                                        {s}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="w-px h-14 bg-white/[0.1] shrink-0" />

                        {/* Genre Pills */}
                        <div className="flex items-center gap-6">
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 mr-4 whitespace-nowrap">Explore Genre</span>
                            <div className="flex items-center gap-4">
                                {genres.map((g) => (
                                    <button
                                        key={g.name}
                                        onClick={() => setSelectedGenre(selectedGenre === g.name ? null : g.name)}
                                        className={`px-10 py-4.5 rounded-[22px] text-[14.5px] font-black uppercase tracking-widest transition-all duration-500 border ${selectedGenre === g.name
                                            ? "text-white shadow-[0_15px_60px_rgba(0,0,0,0.5)] scale-110 z-10"
                                            : "bg-white/[0.03] text-white/30 border-white/[0.06] hover:bg-white/[0.1] hover:text-white hover:scale-105"
                                            }`}
                                        style={selectedGenre === g.name ? { backgroundColor: g.color, borderColor: g.color, boxShadow: `0 20px 50px ${g.color}60` } : {}}
                                    >
                                        {g.name}
                                        {/* highlight genres the user likes */}
                                        {topGenres.includes(g.name) && (
                                            <span className="ml-2 text-[8px] opacity-60">★</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-14 bg-white/[0.1] shrink-0" />

                        {/* Tag Pills */}
                        <div className="flex items-center gap-6">
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 mr-4 whitespace-nowrap">Core Tags</span>
                            <div className="flex items-center gap-4">
                                {tags.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                                        className={`px-8 py-4.5 rounded-[22px] text-[14px] font-black uppercase tracking-widest transition-all duration-300 border ${selectedTag === t
                                            ? "bg-white text-black border-white shadow-2xl scale-110"
                                            : "bg-white/[0.03] text-white/30 border-white/[0.06] hover:bg-white/[0.08] hover:text-white hover:scale-105"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="w-px h-14 bg-white/[0.1] shrink-0" />

                        {/* Year Pills */}
                        <div className="flex items-center gap-6">
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 mr-4 whitespace-nowrap">Year</span>
                            {["2025", "2024", "2023", "2022"].map((y) => (
                                <button
                                    key={y}
                                    onClick={() => setSelectedYear(selectedYear === y ? null : y)}
                                    className={`px-8 py-4.5 rounded-[22px] text-[15px] font-black uppercase tracking-widest transition-all duration-300 border ${selectedYear === y
                                        ? "bg-yellow-400 text-black border-yellow-400 shadow-[0_15px_45px_rgba(250,204,21,0.5)] scale-115"
                                        : "bg-white/[0.03] text-white/30 border-white/[0.06] hover:bg-white/[0.08] hover:text-white hover:scale-105"
                                        }`}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    <div className="xl:col-span-8 flex flex-col gap-20">

                        {/* FEATURED HERO */}
                        {loading ? (
                            <div className="aspect-21/9 rounded-3xl bg-white/3 animate-pulse" />
                        ) : (
                            featured.length > 0 && (
                                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {featured.slice(0, 2).map((anime, idx) => {
                                        const meta = featuredMeta[idx] || featuredMeta[0];
                                        return (
                                            <div
                                                key={anime.id}
                                                onClick={() => openModal(anime)}
                                                className="group relative h-[380px] rounded-4xl overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]"
                                            >
                                                <Image src={anime.coverImage || anime.posterImage} alt={anime.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                                {/* Coloured gradient overlay */}
                                                <div
                                                    className="absolute inset-0"
                                                    style={{ background: `linear-gradient(to top, ${meta.gradientFrom} 0%, ${meta.gradientTo} 40%, transparent 100%)` }}
                                                />
                                                {/* Subtle top vignette */}
                                                <div className="absolute inset-0 bg-black/20" />
                                                {/* Content — centered */}
                                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                                    <h2 className="text-3xl lg:text-4xl font-black mb-3 italic uppercase tracking-tighter drop-shadow-2xl" style={{ color: '#fff', textShadow: `0 0 40px ${meta.accentColor}80` }}>
                                                        {anime.title}
                                                    </h2>
                                                    <p className="text-white/70 text-sm font-medium tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                                                        {meta.subtitle}
                                                    </p>
                                                </div>
                                                {/* Bottom accent line */}
                                                <div className="absolute bottom-0 inset-x-0 h-1 opacity-60" style={{ background: `linear-gradient(to right, transparent, ${meta.accentColor}, transparent)` }} />
                                            </div>
                                        );
                                    })}
                                </section>
                            )
                        )}

                        {/* MAIN LIST */}
                        <section>
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-[28px] font-black uppercase italic tracking-tighter">
                                    {selectedGenre || activeSort} Anime
                                    {loadingFilters && <span className="ml-4 text-[10px] font-black text-[#c4363f] animate-pulse">Scanning DB...</span>}
                                </h2>
                                {selectedGenre && (
                                    <button onClick={() => setSelectedGenre(null)} className="text-[10px] font-black uppercase tracking-widest text-white/25 hover:text-white/60 transition-all">
                                        Clear ✕
                                    </button>
                                )}
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="aspect-[3/4.2] rounded-2xl bg-white/[0.03] animate-pulse" />
                                    ))}
                                </div>
                            ) : mainList.length === 0 ? (
                                <div className="py-20 text-center border-2 border-dashed border-white/[0.05] rounded-[32px]">
                                    <p className="text-white/20 font-black uppercase tracking-widest text-lg">Target not found</p>
                                    <p className="text-white/10 text-xs mt-2 font-medium">Try different coordinates or reset filters.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
                                    {mainList.map((anime) => (
                                        <div key={anime.id} onClick={() => openModal(anime)} className="group relative aspect-[3/4.2] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.06] transition-all duration-300 hover:scale-[1.05] hover:border-white/20">
                                            <Image src={anime.posterImage} alt={anime.title} fill className="object-cover transition-all duration-500 group-hover:brightness-125" />
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/40 to-transparent">
                                                <h3 className="text-[13px] font-black italic uppercase leading-tight line-clamp-1">{anime.title}</h3>
                                                <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-[10px] font-bold text-[#c4363f]">⭐ {(anime.rating || 0 / 10).toFixed(1)}</span>
                                                    <span className="text-[10px] font-medium text-white/40">{anime.subtype}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* POPULAR RIGHT NOW — horizontal scroll */}
                        {popularList.length > 0 && (
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-[28px] font-black uppercase italic tracking-tighter">Popular Right Now</h2>
                                    <button onClick={() => setActiveSort("Popular")} className="text-[10px] font-black uppercase tracking-widest text-white/25 hover:text-white/60 transition-all">View All →</button>
                                </div>
                                <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
                                    {popularList.map((anime) => (
                                        <div
                                            key={anime.id}
                                            onClick={() => openModal(anime)}
                                            className="group relative w-44 shrink-0 aspect-[3/4.5] rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105"
                                        >
                                            <Image src={anime.posterImage} alt={anime.title} fill className="object-cover transition-all duration-500 group-hover:brightness-110" />
                                            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
                                            <div className="absolute inset-x-0 bottom-0 p-4">
                                                <h3 className="text-[12px] font-black italic uppercase leading-tight line-clamp-2">{anime.title}</h3>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <span className="text-[10px] font-bold text-yellow-400">★ {(anime.rating || 0).toFixed(1)}</span>
                                                    <span className="text-[9px] font-medium text-white/30 uppercase">{anime.subtype}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* RECENTLY TRANSMITTED */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-20">
                            <div>
                                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8">Recently Transmitted</h3>
                                <div className="space-y-4">
                                    {upcoming.map(anime => (
                                        <div key={anime.id} onClick={() => openModal(anime)} className="flex gap-4 p-3 rounded-2xl hover:bg-white/3 transition-all cursor-pointer group">
                                            <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-white/8 shrink-0">
                                                <Image src={anime.coverImage || anime.posterImage} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={anime.title} />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <h4 className="text-sm font-black italic uppercase line-clamp-1">{anime.title}</h4>
                                                <span className="text-[10px] font-bold text-[#c4363f] mt-1 uppercase tracking-widest">{anime.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* VERSE WEEKLY — proper centered rectangle */}
                            <div className="relative overflow-hidden rounded-4xl border border-[#c4363f]/30 bg-[#1a0509]">
                                {/* Background glow */}
                                <div className="absolute inset-0 bg-linear-to-br from-[#c4363f]/20 via-[#c4363f]/5 to-transparent" />
                                <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#c4363f]/10 rounded-full blur-3xl" />
                                {/* Content — centered */}
                                <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 min-h-[260px] gap-6">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[#c4363f]/20 border border-[#c4363f]/30 rounded-full">
                                        <div className="w-1.5 h-1.5 bg-[#c4363f] rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black text-[#c4363f] uppercase tracking-widest">Weekly Dispatch</span>
                                    </div>
                                    <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Verse Weekly</h3>
                                    <p className="text-white/50 text-sm leading-relaxed font-medium max-w-xs">
                                        All major transmissions have been verified. Engage with the community pulse or start a new transmission in your local sector.
                                    </p>
                                    <button
                                        onClick={() => router.push('/community')}
                                        className="px-10 py-3.5 bg-[#c4363f] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all shadow-[0_10px_40px_rgba(196,54,63,0.4)]"
                                    >
                                        Go to Community
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* SIDEBAR */}
                    <div className="xl:col-span-4">
                        <div className="lg:sticky lg:top-24 bg-black/40 backdrop-blur-3xl border border-white/[0.05] rounded-[40px] p-8 lg:p-10 shadow-2xl">

                            {/* Taste profile pill strip — if logged in */}
                            {topGenres.length > 0 && (
                                <div className="mb-10">
                                    <p className="text-[10px] font-black uppercase tracking-[0.35em] text-white/25 mb-3">Your Taste</p>
                                    <div className="flex flex-wrap gap-2">
                                        {topGenres.map((g, i) => (
                                            <button
                                                key={g}
                                                onClick={() => setSelectedGenre(g)}
                                                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-[10px] font-black uppercase tracking-widest text-white/50 hover:bg-white/10 hover:text-white transition-all"
                                            >
                                                {i === 0 ? "🔥 " : ""}{g}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between mb-12">
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Taste Battles</h2>
                                <div className="flex items-center gap-2 px-3 py-1 bg-[#c4363f]/10 border border-[#c4363f]/20 rounded-full animate-pulse">
                                    <div className="w-1.5 h-1.5 bg-[#c4363f] rounded-full" />
                                    <span className="text-[9px] font-black text-[#c4363f] uppercase tracking-widest">Live</span>
                                </div>
                            </div>

                            <div className="space-y-16">
                                {todaysBattles.length === 0 ? (
                                    <div className="py-20 text-center opacity-20">
                                        <p className="text-xs font-black uppercase tracking-widest">Neutral Zone</p>
                                    </div>
                                ) : (
                                    todaysBattles.map(battle => (
                                        <div key={battle.id} className="relative group/battle">
                                            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                                <div className="w-12 h-12 bg-black border-2 border-white/10 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover/battle:scale-110">
                                                    <span className="text-[12px] font-black italic uppercase text-white/40 group-hover/battle:text-[#c4363f]">VS</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="relative aspect-[3/4.2] rounded-2xl overflow-hidden border border-white/5 cursor-pointer group/item hover:border-white/20 transition-all">
                                                    <Image src={battle.animeA.image || "https://placehold.co/600x400/000000/FFFFFF/png?text=Side+A"} fill className="object-cover grayscale group-hover/item:grayscale-0 transition-all duration-700" alt={battle.animeA.name} />
                                                    <div className="absolute inset-0 bg-black/40" />
                                                    <div className="absolute bottom-3 inset-x-3">
                                                        <p className="text-[9px] font-black uppercase italic leading-tight text-white line-clamp-1">{battle.animeA.name}</p>
                                                    </div>
                                                </div>
                                                <div className="relative aspect-[3/4.2] rounded-2xl overflow-hidden border border-white/5 cursor-pointer group/item hover:border-white/20 transition-all">
                                                    <Image src={battle.animeB.image || "https://placehold.co/600x400/000000/FFFFFF/png?text=Side+B"} fill className="object-cover grayscale group-hover/item:grayscale-0 transition-all duration-700" alt={battle.animeB.name} />
                                                    <div className="absolute inset-0 bg-black/40" />
                                                    <div className="absolute bottom-3 inset-x-3 text-right">
                                                        <p className="text-[9px] font-black uppercase italic leading-tight text-white line-clamp-1">{battle.animeB.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex items-center justify-between">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">Round {battle.round}</span>
                                                <button onClick={() => router.push(`/battles/${battle.id}`)} className="text-[10px] font-black uppercase tracking-widest text-[#c4363f] hover:underline transition-all">
                                                    Vote Transmission
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <button onClick={() => router.push('/battles')} className="w-full py-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:bg-white/[0.08] hover:text-white transition-all shadow-xl">
                                    Sector Bracket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-28" />
            </main>
        </div>
    );
}

