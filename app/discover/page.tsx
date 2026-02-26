"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/src/components/Navbar/Navbar";
import AnimeCard from "@/src/components/AnimeCard/AnimeCard";
import { getAnimeByCategory, getTrendingAnime, getPopularAnime, type AnimeCard as AnimeType } from "@/src/lib/kitsu";
import { useAnimeModal } from "@/src/context/AnimeModalContext";
import { api } from "@/src/lib/api";

export default function DiscoverPage() {
    const { openModal } = useAnimeModal();
    const [recommended, setRecommended] = useState<AnimeType[]>([]);
    const [popularGenres, setPopularGenres] = useState<AnimeType[]>([]);
    const [upcoming, setUpcoming] = useState<AnimeType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [rec, gen, up] = await Promise.all([
                    getTrendingAnime(2),
                    getAnimeByCategory("fantasy", 6),
                    getPopularAnime(4)
                ]);
                setRecommended(rec);
                setPopularGenres(gen);
                setUpcoming(up);
            } catch (error) {
                console.error("Failed to fetch discovery data", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const genres = [
        { name: "Shounen", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=300&h=450&fit=crop" },
        { name: "Comedy", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=300&h=450&fit=crop" },
        { name: "Adventure", image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=300&h=450&fit=crop" },
        { name: "Dark Fantasy", image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=300&h=450&fit=crop" },
        { name: "Music", image: "https://images.unsplash.com/photo-1542451313-a11b03b51d6d?w=300&h=450&fit=crop" },
        { name: "Action", image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=300&h=450&fit=crop" },
    ];

    return (
        <div className="relative min-h-screen bg-[#0b0b0f] text-white">
            {/* Cinematic Nebula Background */}
            <div className="fixed inset-0 z-0 opacity-40">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="Space Background"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0f]/60 via-[#0b0b0f] to-[#0b0b0f]" />
            </div>

            <Navbar />

            <main className="relative z-10 pt-28 px-6 lg:px-12 max-w-[1600px] mx-auto">
                {/* Header */}
                <header className="mb-10">
                    <h1 className="text-6xl font-black tracking-tighter mb-4">Discover</h1>
                    <p className="text-xl text-[#8a8a9a] font-medium italic underline underline-offset-8 decoration-[#e63030]/30">Find your next obsession</p>
                </header>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4 bg-white/[0.03] p-1.5 rounded-sm border border-white/[0.06]">
                        <span className="text-sm font-bold text-[#6b6b78] pl-3">Filter by:</span>
                        <div className="flex items-center gap-2">
                            {["Genre", "Tags", "Year"].map(f => (
                                <button key={f} className="px-5 py-2 rounded-sm text-sm font-bold bg-white/[0.05] hover:bg-white/[0.1] transition-all border border-white/[0.08]">
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">

                    {/* Main Content Area (8 cols) */}
                    <div className="xl:col-span-8 flex flex-col gap-16">

                        {/* Featured Recommended Cards */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recommended.map(anime => (
                                <div
                                    key={anime.id}
                                    onClick={() => openModal(anime)}
                                    className="group relative h-72 rounded-sm overflow-hidden cursor-pointer border border-white/[0.08] transition-all"
                                >
                                    <Image src={anime.coverImage || anime.posterImage} alt={anime.title} fill className="object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-sm border border-white/10 text-[9px] font-black uppercase tracking-widest text-white">
                                        Top Rated
                                    </div>

                                    <div className="absolute bottom-8 left-8 max-w-[300px]">
                                        <p className="text-[#e63030] text-[10px] font-black uppercase tracking-widest mb-2">Featured</p>
                                        <h2 className="text-3xl font-black mb-2 leading-tight uppercase">{anime.title}</h2>
                                        <p className="text-[#b3b3c2] text-xs line-clamp-2 font-medium opacity-80 leading-relaxed">{anime.synopsis}</p>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Popular Genres Row */}
                        <section>
                            <h2 className="text-2xl font-black mb-8 border-l-4 border-[#e63030] pl-4 uppercase tracking-tight">
                                Popular Categories
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                                {genres.map(g => (
                                    <div key={g.name} className="group relative aspect-[3/4.5] rounded-sm overflow-hidden cursor-pointer border border-white/10">
                                        <Image src={g.image} alt={g.name} fill className="object-cover opacity-60 transition-opacity group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                        <div className="absolute bottom-4 inset-x-0 text-center">
                                            <p className="text-sm font-black tracking-tight uppercase">{g.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* New & Upcoming Section */}
                        <section>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
                                {/* News List */}
                                <div>
                                    <h2 className="text-2xl font-black mb-8 border-l-4 border-[#e63030] pl-4 uppercase tracking-tight">
                                        Recent News
                                    </h2>
                                    <div className="flex flex-col gap-6">
                                        {popularGenres.slice(0, 4).map(anime => (
                                            <div key={anime.id} onClick={() => openModal(anime)} className="group flex items-center gap-4 cursor-pointer">
                                                <div className="relative w-20 h-28 rounded-sm overflow-hidden border border-white/10 shrink-0">
                                                    <Image src={anime.posterImage} alt={anime.title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-black line-clamp-1 uppercase tracking-tight">{anime.title}</h3>
                                                    <div className="flex gap-2 mt-2">
                                                        <span className="px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[9px] font-black text-[#8a8a9a] uppercase">{anime.subtype}</span>
                                                        <span className="px-2 py-0.5 rounded-sm bg-[#e63030]/10 border border-[#e63030]/20 text-[9px] font-black text-[#e63030] uppercase font-serif">Trending</span>
                                                    </div>
                                                    <p className="text-[10px] text-[#6b6b78] mt-2 font-bold line-clamp-1 uppercase tracking-tighter">
                                                        {anime.categories.slice(0, 1).join(" / ") || "Anime"} • {Math.floor(Math.random() * 5000)} Likes
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* New & Upcoming */}
                                <div>
                                    <h2 className="text-2xl font-black mb-8 border-l-4 border-[#e63030] pl-4 uppercase tracking-tight">
                                        Coming Soon
                                    </h2>
                                    <div className="flex flex-col gap-6">
                                        {upcoming.slice(0, 3).map(anime => (
                                            <div key={anime.id} onClick={() => openModal(anime)} className="group flex items-center gap-4 cursor-pointer">
                                                <div className="relative w-36 h-28 rounded-sm overflow-hidden border border-white/10 shrink-0">
                                                    <Image src={anime.coverImage || anime.posterImage} alt={anime.title} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-black line-clamp-1 uppercase tracking-tight">{anime.title}</h3>
                                                    <p className="text-xs text-[#e63030] mt-1 font-black uppercase tracking-widest text-[10px]">Upcoming • 2024</p>
                                                    <div className="mt-3 flex gap-2">
                                                        <div className="px-3 py-1.5 rounded-sm bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest">
                                                            View Info
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* Sidebar Area (4 cols) */}
                    <div className="xl:col-span-4 flex flex-col gap-12">

                        {/* Taste Battles */}
                        <section className="bg-white/[0.02] border border-white/[0.06] rounded-sm p-8">
                            <h2 className="text-2xl font-black mb-8 border-l-4 border-[#e63030] pl-4 uppercase tracking-tight">
                                Taste Battles
                            </h2>

                            <div className="flex flex-col gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-20 h-24 rounded-sm overflow-hidden border border-white/10">
                                        <Image src="https://images.unsplash.com/photo-1541562232579-512a21360020?w=200&h=300&fit=crop" alt="A" fill className="object-cover opacity-60" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[0.95rem] font-bold text-white mb-1 uppercase tracking-tight">Classic Shounen</h4>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="h-[1px] flex-1 bg-white/10" />
                                    <span className="text-xl font-black italic text-[#8a8a9a]">VS</span>
                                    <div className="h-[1px] flex-1 bg-white/10" />
                                </div>

                                <div className="flex flex-row-reverse items-center gap-4">
                                    <div className="relative w-20 h-24 rounded-sm overflow-hidden border border-[#e63030]/30 shadow-[0_0_20px_rgba(230,48,48,0.1)]">
                                        <Image src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=200&h=300&fit=crop" alt="B" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 text-right">
                                        <h4 className="text-[0.95rem] font-bold text-[#e63030] uppercase tracking-tight">Modern Dark</h4>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-10 py-4 bg-white/[0.05] border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-sm hover:bg-[#e63030] hover:border-[#e63030] transition-all">
                                CAST YOUR VOTE
                            </button>
                        </section>

                        {/* Browse Tags */}
                        <section className="bg-white/[0.02] border border-white/[0.06] rounded-sm p-8">
                            <h2 className="text-2xl font-black mb-8 border-l-4 border-[#e63030] pl-4 uppercase tracking-tight">
                                Top Tags
                            </h2>
                            <div className="flex flex-wrap gap-2.5">
                                {[
                                    "UNDERRATED", "DARK FANTASY",
                                    "BEST GIRL", "COMEDY", "ROMANCE",
                                    "PSYCHOLOGICAL", "ISEKAI", "GORY", "CLASSIC"
                                ].map(tag => (
                                    <button key={tag} className="px-4 py-2 rounded-sm text-[10px] font-black text-[#b3b3c2] bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.1] hover:text-white transition-all tracking-widest">
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </section>

                    </div>

                </div>

                <div className="h-32" />
            </main>
        </div>
    );
}
