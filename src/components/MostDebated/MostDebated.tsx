"use client";

import Image from "next/image";
import { useAnimeModal } from "@/src/context/AnimeModalContext";
import type { AnimeCard } from "@/src/lib/kitsu";

interface Props {
    animeList: AnimeCard[];
}

export default function MostDebated({ animeList }: Props) {
    const { openModal } = useAnimeModal();

    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span className="text-[#e63030]">🌡️</span> Most Debated This Week
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
                {animeList.slice(0, 3).map((anime) => (
                    <div
                        key={anime.id}
                        onClick={() => openModal(anime)}
                        className="group relative bg-[#12121a]/80 backdrop-blur-xl border border-white/[0.08] rounded-[1.5rem] overflow-hidden hover:border-[#e63030]/50 transition-all cursor-pointer shadow-2xl"
                    >
                        {/* Banner Image */}
                        <div className="relative h-44 w-full">
                            {anime.coverImage || anime.posterImage ? (
                                <Image
                                    src={anime.coverImage || anime.posterImage}
                                    alt={anime.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-[#1a1a28] to-[#0b0b0f]" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Title Overlay */}
                            <div className="absolute bottom-3 left-4 right-4">
                                <h4 className="text-xl font-black text-white leading-tight drop-shadow-lg line-clamp-1">
                                    {anime.title}
                                </h4>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="p-4 pt-3 flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[9px] font-black uppercase tracking-wider border border-indigo-500/20">
                                    😈 Dark & Intense
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-300 text-[9px] font-black uppercase tracking-wider border border-orange-500/20">
                                    🔥 Loved by 89%
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[9px] font-black uppercase tracking-wider border border-red-500/20">
                                    🔥 Trending Now
                                </span>
                            </div>

                            {/* Info Bar */}
                            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[10px] text-[#8a8a9a] font-bold">
                                <div className="flex items-center gap-2">
                                    <span>{anime.subtype.toUpperCase()}</span>
                                    <span>•</span>
                                    <span>{anime.episodeCount || "???"} Episodes</span>
                                    <span>•</span>
                                    <span>{anime.status.charAt(0).toUpperCase() + anime.status.slice(1)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs">💬</span>
                                        <span className="text-white">{(anime.userCount / 500).toFixed(1)}k</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white bg-white/[0.05] px-2 py-1 rounded-lg">
                                        <span className="text-xs">⚔️</span>
                                        <span className="uppercase tracking-tighter">Hot Debate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
