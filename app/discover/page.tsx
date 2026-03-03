"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Navbar from "@/src/components/Navbar/Navbar";
import {
    getAnimeByCategory,
    getTrendingAnime,
    getPopularAnime,
    getTopRatedAnime,
    type AnimeCard as AnimeType,
} from "@/src/lib/kitsu";
import { useAnimeModal } from "@/src/context/AnimeModalContext";
import { useSearch } from "@/src/context/SearchContext";

export default function DiscoverPage() {
    const { openModal } = useAnimeModal();
    const { searchQuery } = useSearch();

    const [featured, setFeatured] = useState<AnimeType[]>([]);
    const [genreAnime, setGenreAnime] = useState<AnimeType[]>([]);
    const [popularList, setPopularList] = useState<AnimeType[]>([]);
    const [upcoming, setUpcoming] = useState<AnimeType[]>([]);
    const [battleAnime, setBattleAnime] = useState<AnimeType[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("Recommended");
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeFilterPanel, setActiveFilterPanel] = useState<string | null>(null);
    const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [loadingFilters, setLoadingFilters] = useState(false);

    const filterByQuery = (items: AnimeType[]) => {
        if (!searchQuery.trim()) return items;
        const q = searchQuery.toLowerCase();
        return items.filter(
            (a) =>
                a.title.toLowerCase().includes(q) ||
                a.synopsis?.toLowerCase().includes(q) ||
                a.categories?.some((c) => c.toLowerCase().includes(q))
        );
    };

    const filteredFeatured = useMemo(() => filterByQuery(featured), [featured, searchQuery]);
    const filteredGenreAnime = useMemo(() => filterByQuery(genreAnime), [genreAnime, searchQuery]);
    const filteredPopularList = useMemo(() => filterByQuery(popularList), [popularList, searchQuery]);
    const filteredUpcoming = useMemo(() => filterByQuery(upcoming), [upcoming, searchQuery]);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [feat, genre, pop, up, battle] = await Promise.all([
                    getTrendingAnime(2),
                    getAnimeByCategory("fantasy", 6),
                    getPopularAnime(6),
                    getAnimeByCategory("science-fiction", 4),
                    getTopRatedAnime(4),
                ]);
                setFeatured(feat);
                setGenreAnime(genre);
                setPopularList(pop);
                setUpcoming(up);
                setBattleAnime(battle);
            } catch (error) {
                console.error("Failed to fetch discovery data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const genres = [
        { name: "Shounen", color: "#c4363f" },
        { name: "Comedy", color: "#d4915a" },
        { name: "Adventure", color: "#258a7e" },
        { name: "Dark Fantasy", color: "#5c3585" },
        { name: "Sci-Fi", color: "#3d6b89" },
        { name: "Romance", color: "#cc6248" },
    ];

    const tags = [
        "Taste Battle",
        "Underrated",
        "Dark Fantasy",
        "Best Girl",
        "Comedy",
        "Romance",
        "Good?",
        "Isekai",
        "Classic",
    ];

    const featuredLabels = [
        {
            label: "Recommended",
            badge: "UNDERRATED",
            badgeColor: "#4a9eff",
            tagLabel: "✦ UNDERRATED",
            tagColor: "#4a9eff",
            subtitle: "Fantasy Journey Done Right",
        },
        {
            label: "Recent Fave",
            badge: "TRENDING",
            badgeColor: "#c4363f",
            tagLabel: "🔥 TRENDING",
            tagColor: "#c4363f",
            subtitle: "+ for Chuuni Dungeon Fans",
        },
    ];

    return (
        <div className="relative min-h-screen bg-[#130f12] text-white">
            {/* Fiery Background — dimmed further */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/discover_fire_bg.png"
                    alt="Fire Background"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                {/* FIX 7 — Stronger overlay behind content to calm the chaos */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#130f12]/60 via-[#130f12]/85 to-[#130f12]" />
                <div className="absolute inset-0 bg-[#130f12]/70" />
            </div>

            <Navbar />

            <main className="relative z-10 pt-8 px-5 lg:px-10 xl:px-16 max-w-[1520px] mx-auto">
                {/* Header Section — Minimal & Spacious */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <h1
                            className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-tight mb-6 text-white"
                            style={{ fontFamily: "var(--font-rubik), sans-serif" }}
                        >
                            Discover
                        </h1>
                        <div className="flex flex-col gap-6">
                            <p className="text-[#8a7e84] text-base sm:text-lg font-medium tracking-wide">
                                Find your next anime to watch
                            </p>

                            {/* Functional Filter Row */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-6 text-[13px] font-bold uppercase tracking-[0.15em] text-[#5a4e54]">
                                    <span className="text-[#8a7e84]/40">Filter by:</span>
                                    {["Genre", "Tags", "Year"].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setActiveFilterPanel(activeFilterPanel === f ? null : f)}
                                            className={`transition-colors flex items-center gap-1.5 group ${activeFilterPanel === f ? "text-[#c4363f]" : "hover:text-[#c4363f]"}`}
                                        >
                                            {f}
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-all ${activeFilterPanel === f ? "rotate-180 text-[#c4363f] opacity-100" : "opacity-0 group-hover:opacity-100 translate-y-[0.5px]"}`}>
                                                <path d="M2 4L5 7L8 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    ))}
                                    {(selectedGenre || selectedYear) && (
                                        <button
                                            onClick={() => {
                                                setSelectedGenre(null);
                                                setSelectedYear(null);
                                                setActiveFilterPanel(null);
                                            }}
                                            className="text-[10px] text-white/30 hover:text-white/60 transition-colors uppercase tracking-widest border-b border-white/10"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>

                                {/* Filter Dynamic Panel */}
                                {activeFilterPanel && (
                                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {activeFilterPanel === "Genre" && (
                                            <div className="flex flex-wrap gap-2">
                                                {genres.map(g => (
                                                    <button
                                                        key={g.name}
                                                        onClick={async () => {
                                                            setSelectedGenre(g.name);
                                                            setActiveFilterPanel(null);
                                                            setLoadingFilters(true);
                                                            try {
                                                                const res = await getAnimeByCategory(g.name.toLowerCase(), 6);
                                                                setGenreAnime(res);
                                                            } catch (e) { console.error(e); }
                                                            setLoadingFilters(false);
                                                        }}
                                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedGenre === g.name ? "bg-[#c4363f] text-white" : "bg-white/5 text-[#8a7e84] hover:bg-white/10 hover:text-white"}`}
                                                    >
                                                        {g.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {activeFilterPanel === "Tags" && (
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map(t => (
                                                    <button
                                                        key={t}
                                                        className="px-4 py-1.5 rounded-full text-xs font-bold bg-white/5 text-[#8a7e84] hover:bg-white/10"
                                                    >
                                                        {t}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {activeFilterPanel === "Year" && (
                                            <div className="flex flex-wrap gap-2">
                                                {["2024", "2023", "2022", "2021", "2020"].map(y => (
                                                    <button
                                                        key={y}
                                                        onClick={() => setSelectedYear(y)}
                                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedYear === y ? "bg-[#c4363f] text-white" : "bg-white/5 text-[#8a7e84] hover:bg-white/10"}`}
                                                    >
                                                        {y}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Minimal Sort Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] rounded-full px-6 py-3 text-sm font-bold text-white/70 transition-all"
                        >
                            <span className="text-white/30 font-medium">Sort:</span>
                            {sortBy}
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                className={`transition-transform duration-300 ${showDropdown ? "rotate-180 text-[#c4363f]" : ""}`}
                            >
                                <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 top-full mt-3 bg-[#1e1a1d] border border-white/[0.08] rounded-2xl overflow-hidden z-50 min-w-[180px] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                                {["Recommended", "Popular", "Top Rated", "Newest"].map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => {
                                            setSortBy(opt);
                                            setShowDropdown(false);
                                        }}
                                        className={`block w-full text-left px-5 py-3.5 text-sm hover:bg-white/[0.04] transition-colors ${sortBy === opt ? "text-[#c4363f] font-bold bg-[#c4363f]/5" : "text-[#b3a8ae]"}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                    {/* Left Column - Main Content */}
                    <div className="xl:col-span-8 flex flex-col gap-16">
                        {/* FIX 1: 60px+ vertical gaps between sections (gap-16 = 64px) */}

                        {/* Featured Hero Cards — FIX 2: darker overlays, reduced glow */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[0, 1].map((i) => (
                                    <div
                                        key={i}
                                        className="h-[300px] rounded-2xl bg-[#1e1a1d]/60 animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredFeatured.slice(0, 2).map((anime, idx) => {
                                    const meta = featuredLabels[idx] || featuredLabels[0];
                                    return (
                                        <div
                                            key={anime.id}
                                            onClick={() => openModal(anime)}
                                            className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/30"
                                        >
                                            <Image
                                                src={anime.coverImage || anime.posterImage}
                                                alt={anime.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Centered Content Block — FIX: Boxed labels and centered text */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                                {/* Recommended/Recent label in a Rectangular Box */}
                                                <div
                                                    className="inline-flex items-center justify-center px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/20 rounded-sm mb-4"
                                                    style={{ borderColor: `${meta.badgeColor}40` }}
                                                >
                                                    <span
                                                        className="text-[10px] font-black uppercase tracking-[0.25em]"
                                                        style={{ color: meta.badgeColor }}
                                                    >
                                                        {meta.label}
                                                    </span>
                                                </div>

                                                <h2
                                                    className="text-2xl lg:text-3xl font-black mb-2 leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                                                    style={{ fontFamily: "var(--font-rubik), sans-serif" }}
                                                >
                                                    {anime.title}
                                                </h2>
                                                <p className="text-white/60 text-sm mb-6 max-w-[80%] font-medium">
                                                    {meta.subtitle}
                                                </p>

                                                {/* Action Button visibility on hover */}
                                                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                    <span
                                                        className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                                                        style={{
                                                            backgroundColor: meta.badgeColor,
                                                            boxShadow: `0 0 20px ${meta.badgeColor}40`,
                                                        }}
                                                    >
                                                        View Details
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </section>
                        )}

                        {/* Popular Genres Row — FIX 4: wider gaps */}
                        <section>
                            <h2
                                className="text-[22px] font-bold mb-6 text-white/90"
                                style={{ fontFamily: "var(--font-rubik), sans-serif" }}
                            >
                                {selectedGenre ? `${selectedGenre} Favorites` : "Popular Genres"}
                                {loadingFilters && <span className="ml-4 text-xs font-normal text-white/30 animate-pulse font-sans">Updating...</span>}
                            </h2>
                            {loading ? (
                                <div className="grid grid-cols-3 sm:grid-cols-6 gap-5">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="aspect-[3/4] rounded-xl bg-[#1e1a1d]/60 animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5">
                                    {/* FIX 4 — gap-5 (20px) instead of gap-3 (12px) */}
                                    {filteredGenreAnime.slice(0, 6).map((anime, i) => (
                                        <div
                                            key={anime.id}
                                            onClick={() => openModal(anime)}
                                            className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 hover:scale-[1.03]"
                                        >
                                            <Image
                                                src={anime.posterImage}
                                                alt={genres[i]?.name || anime.title}
                                                fill
                                                className="object-cover transition-all duration-500 group-hover:brightness-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                                            <div className="absolute bottom-3 sm:bottom-4 inset-x-0 text-center px-1">
                                                <p className="text-[10px] sm:text-xs font-semibold tracking-wide truncate text-white/85">
                                                    {genres[i]?.name || anime.categories?.[0] || "Anime"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Two Column: Popular Anime + News & Upcoming */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Popular Anime List */}
                            <div>
                                <h2
                                    className="text-[22px] font-bold mb-6 text-white/90"
                                    style={{ fontFamily: "var(--font-rubik), sans-serif" }}
                                >
                                    Popular Anime
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {loading
                                        ? [...Array(4)].map((_, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-20 h-28 rounded-lg bg-[#1e1a1d]/60 animate-pulse shrink-0" />
                                                <div className="flex-1 space-y-3 pt-2">
                                                    <div className="h-5 bg-[#1e1a1d]/60 rounded animate-pulse w-3/4" />
                                                    <div className="h-3 bg-[#1e1a1d]/60 rounded animate-pulse w-1/2" />
                                                    <div className="h-3 bg-[#1e1a1d]/60 rounded animate-pulse w-1/3" />
                                                </div>
                                            </div>
                                        ))
                                        : filteredPopularList.slice(0, 4).map((anime) => (
                                            <div
                                                key={anime.id}
                                                onClick={() => openModal(anime)}
                                                className="group flex items-start gap-4 cursor-pointer p-3 rounded-2xl hover:bg-white/[0.03] transition-all duration-200"
                                            >
                                                <div className="relative w-20 h-28 rounded-xl overflow-hidden border border-white/[0.06] shrink-0 shadow-lg shadow-black/20">
                                                    <Image
                                                        src={anime.posterImage}
                                                        alt={anime.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 pt-1">
                                                    <h3 className="text-[15px] font-bold line-clamp-1 group-hover:text-[#c4363f] transition-colors text-white/95">
                                                        {anime.title}
                                                        {anime.rating && anime.rating > 80 && (
                                                            <span className="ml-2 text-[#d4915a]">🔥</span>
                                                        )}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {anime.categories?.slice(0, 2).map((cat) => (
                                                            <span
                                                                key={cat}
                                                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] border border-white/[0.06] text-[#a89da3]"
                                                            >
                                                                {cat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <p className="text-[11px] text-[#6a5e64] mt-2 font-medium">
                                                        {anime.rating ? `⭐ ${(anime.rating / 10).toFixed(1)}` : ""}{" "}
                                                        •{" "}
                                                        {anime.userCount
                                                            ? `${(anime.userCount / 1000).toFixed(0)}k`
                                                            : "—"}{" "}
                                                        who Liked
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* News & Upcoming */}
                            <div>
                                <h2
                                    className="text-[22px] font-bold mb-6 text-white/90"
                                    style={{ fontFamily: "var(--font-rubik), sans-serif" }}
                                >
                                    News & Upcoming
                                </h2>
                                <div className="flex flex-col gap-4">
                                    {loading
                                        ? [...Array(3)].map((_, i) => (
                                            <div key={i} className="flex gap-4">
                                                <div className="w-32 h-22 rounded-lg bg-[#1e1a1d]/60 animate-pulse shrink-0" />
                                                <div className="flex-1 space-y-3 pt-2">
                                                    <div className="h-5 bg-[#1e1a1d]/60 rounded animate-pulse w-3/4" />
                                                    <div className="h-3 bg-[#1e1a1d]/60 rounded animate-pulse w-1/2" />
                                                </div>
                                            </div>
                                        ))
                                        : filteredUpcoming.slice(0, 3).map((anime) => (
                                            <div
                                                key={anime.id}
                                                onClick={() => openModal(anime)}
                                                className="group flex items-start gap-4 cursor-pointer p-3 rounded-2xl hover:bg-white/[0.03] transition-all duration-200"
                                            >
                                                <div className="relative w-32 h-22 rounded-xl overflow-hidden border border-white/[0.06] shrink-0 shadow-lg shadow-black/20">
                                                    <Image
                                                        src={anime.coverImage || anime.posterImage}
                                                        alt={anime.title}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0 pt-1">
                                                    <h3 className="text-[15px] font-bold line-clamp-1 group-hover:text-[#c4363f] transition-colors text-white/95">
                                                        {anime.title}
                                                    </h3>
                                                    <p className="text-[12px] text-[#c4363f]/80 mt-1 font-medium">
                                                        {anime.status === "current"
                                                            ? "Airing"
                                                            : anime.status === "upcoming"
                                                                ? "Coming Soon"
                                                                : anime.subtype}
                                                    </p>
                                                    <p className="text-[11px] text-[#6a5e64] mt-1">
                                                        {anime.status === "upcoming" ? "Coming Soon" : "Weekly"}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar — Focus on Taste Battles */}
                    <div className="xl:col-span-4 flex flex-col gap-10">
                        {/* Taste Battles — Elevated Hero Presence */}
                        <section className="bg-black/40 backdrop-blur-xl border border-white/[0.05] rounded-[32px] p-8 lg:sticky lg:top-24">
                            <div className="flex items-center justify-between mb-10">
                                <h2
                                    className="text-2xl font-black italic tracking-tighter text-white/90"
                                    style={{ fontFamily: "var(--font-rubik), sans-serif" }}
                                >
                                    Taste Battles
                                </h2>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c4363f]/10 border border-[#c4363f]/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#c4363f] animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#c4363f]">Live</span>
                                </div>
                            </div>

                            {loading ? (
                                <div className="space-y-6">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="h-44 bg-white/[0.03] rounded-3xl animate-pulse" />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-12">
                                    {/* Elevated Battle Cards */}
                                    {[0, 2].map((startIndex) => {
                                        const b1 = battleAnime[startIndex];
                                        const b2 = battleAnime[startIndex + 1];
                                        if (!b1 || !b2) return null;

                                        return (
                                            <div key={startIndex} className="relative group/battle">
                                                {/* VS Badge — Floating center */}
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                                    <div className="w-11 h-11 rounded-full bg-black border-2 border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover/battle:scale-110 group-hover/battle:border-[#c4363f]/40">
                                                        <span className="text-[11px] font-black italic text-white group-hover/battle:text-[#c4363f]">VS</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3 relative">
                                                    {/* Side A */}
                                                    <div
                                                        onClick={() => openModal(b1)}
                                                        className="relative aspect-[3/4.2] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all group/item"
                                                    >
                                                        <Image src={b1.posterImage} alt={b1.title} fill className="object-cover grayscale-[0.3] group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-700" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                        <div className="absolute bottom-3 left-3 right-3">
                                                            <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight uppercase tracking-tight">{b1.title}</p>
                                                        </div>
                                                    </div>

                                                    {/* Side B */}
                                                    <div
                                                        onClick={() => openModal(b2)}
                                                        className="relative aspect-[3/4.2] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/20 transition-all group/item"
                                                    >
                                                        <Image src={b2.posterImage} alt={b2.title} fill className="object-cover grayscale-[0.3] group-hover/item:grayscale-0 group-hover/item:scale-110 transition-all duration-700" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                                        <div className="absolute bottom-3 left-3 right-3 text-right">
                                                            <p className="text-[10px] font-bold text-white line-clamp-2 leading-tight uppercase tracking-tight">{b2.title}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Meta Row */}
                                                <div className="flex justify-between items-center mt-4 px-1">
                                                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Active Battle</span>
                                                    <button className="text-[9px] font-black uppercase tracking-widest text-[#c4363f] hover:underline">Vote Now</button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <button className="w-full py-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-white/[0.05] hover:text-white transition-all mt-4">
                                        View All Battles
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                </div>

                {/* Footer spacing */}
                <div className="h-28" />
            </main>
        </div>
    );
}
