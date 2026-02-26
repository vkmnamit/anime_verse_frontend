"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import type { AnimeCard } from "@/src/lib/kitsu";
import { useAnimeModal } from "@/src/context/AnimeModalContext";

interface Props {
    animeList: AnimeCard[];
}

export default function HeroBanner({ animeList }: Props) {
    const { openModal } = useAnimeModal();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (animeList.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % animeList.length);
        }, 8000);

        return () => clearInterval(interval);
    }, [animeList.length]);

    const activeAnime = animeList[currentIndex];

    if (!activeAnime) return null;

    return (
        <section
            className="relative w-full h-[500px] lg:h-[78vh] overflow-hidden group bg-black"
        >
            {/* Background Slides */}
            {animeList.map((anime, idx) => (
                <div
                    key={anime.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {anime.coverImage ? (
                        <Image
                            src={anime.coverImage}
                            alt={anime.title}
                            fill
                            priority={idx === 0}
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#16161f]" />
                    )}

                    {/* Darkened Overlays */}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/80 to-transparent shadow-[inset_0_-100px_100px_rgba(11,11,15,0.8)]" />
                </div>
            ))}

            {/* Content Box — Netflix-level left margin */}
            <div className="absolute inset-x-0 bottom-[12%] lg:bottom-[15%] z-20 px-8 sm:px-12 lg:px-[60px]">
                <div className="max-w-[1000px] flex flex-col items-start gap-4 lg:gap-6">

                    {/* Highly Stylized Name Box */}
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-[#e63030]/10 blur-2xl" />
                        <div className="relative bg-[#1a0505]/60 backdrop-blur-3xl px-6 py-2">
                            <span className="block text-[#e63030] text-[10px] md:text-[13px] font-black uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(230,48,48,0.5)]">
                                {activeAnime.title}
                            </span>
                        </div>
                    </div>

                    <div className="max-w-[850px] space-y-4">
                        {/* Tagline */}
                        <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tighter uppercase drop-shadow-2xl">
                            Experience {activeAnime.subtype || 'Series'}
                        </h2>

                        {/* Description - Made slightly smaller */}
                        <p
                            className="text-white text-[10px] lg:text-[14px] font-medium leading-[1.3] opacity-80 line-clamp-3 max-w-xl text-pretty drop-shadow-lg"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            {activeAnime.synopsis}
                        </p>
                    </div>

                    {/* Buttons - More attractive & Compact */}
                    <div className="mt-4 lg:mt-6">
                        <button
                            onClick={() => openModal(activeAnime)}
                            className="flex items-center gap-3 px-1 py-1 bg-white/[0.05] text-white rounded-[4px] hover:bg-[#e63030]/10 hover:border-[#e63030]/40 transition-all border border-white/20 backdrop-blur-3xl shadow-[0_0_20px_rgba(0,0,0,0.5)] active:scale-95 group/btn pr-8 relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />

                            {/* Icon Box */}
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 group-hover/btn:bg-[#e63030] group-hover/btn:border-[#e63030] group-hover/btn:shadow-[0_0_15px_rgba(230,48,48,0.6)] transition-all duration-500">
                                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4m0-4h.01" />
                                </svg>
                            </div>
                            <span className="text-[12px] lg:text-[15px] font-black tracking-[0.2em] uppercase">
                                Explore Details
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom Glow Focus */}
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0b0b0f] to-transparent z-10 pointer-events-none" />
        </section>
    );
}
