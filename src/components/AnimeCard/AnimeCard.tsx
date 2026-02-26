"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { AnimeCard as AnimeCardType } from "@/src/lib/kitsu";
import { useAnimeModal } from "@/src/context/AnimeModalContext";

/* Clean sentiment / reaction badges */
function getReactionBadge(anime: AnimeCardType, index: number) {
    const r = anime.rating;
    if (r && r >= 85) return "Must Watch";
    if (r && r >= 80) return "Trending";
    if (r && r >= 75) return "Popular";
    if (r && r >= 70) return "Hot";
    const pool = ["Top Rated", "Community Pick", "Debated", "Underrated"];
    return pool[index % pool.length];
}

interface Props {
    anime: AnimeCardType;
    index?: number;
    variant?: "default" | "large";
}

export default function AnimeCard({ anime, index = 0, variant = "default" }: Props) {
    const tag = getReactionBadge(anime, index);
    const { openModal } = useAnimeModal();
    const isLarge = variant === "large";
    const [wishlisted, setWishlisted] = useState(false);
    const [commentCount, setCommentCount] = useState<number | null>(null);

    // Fetch real comment count from backend
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return;

        fetch(`${apiUrl}/comments/anime/${anime.id}?limit=1`)
            .then(res => res.json())
            .then(data => {
                if (data?.meta?.total !== undefined) {
                    setCommentCount(data.meta.total);
                } else if (Array.isArray(data?.data)) {
                    setCommentCount(data.data.length);
                }
            })
            .catch(() => setCommentCount(0));
    }, [anime.id]);

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        setWishlisted(!wishlisted);
    };

    return (
        <div
            onClick={() => openModal(anime)}
            className="shrink-0 w-[150px] lg:w-[185px] cursor-pointer group snap-start"
        >
            {/* Card — All content overlaid on the poster */}
            <div className="relative w-full aspect-[2/3] rounded-md overflow-hidden bg-[#12121a]">
                <Image
                    src={anime.posterImage}
                    alt={anime.title}
                    fill
                    sizes={isLarge ? "220px" : "185px"}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Wishlist Heart — Top Right */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-2 right-2 z-30 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-all active:scale-90"
                    aria-label="Add to wishlist"
                >
                    <svg
                        className={`w-3.5 h-3.5 transition-colors duration-300 ${wishlisted ? "fill-[#e63030] text-[#e63030]" : "fill-none text-white/80"}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                {/* Bottom Gradient Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black via-black/70 to-transparent z-10" />

                {/* Content Overlay — On the card */}
                <div className="absolute inset-x-0 bottom-0 z-20 p-2.5 flex flex-col gap-1.5">
                    {/* Title — Rubik 600 */}
                    <h4
                        className="text-white line-clamp-1 drop-shadow-lg"
                        style={{
                            fontFamily: 'var(--font-rubik), Rubik, sans-serif',
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '120%',
                        }}
                    >
                        {anime.title}
                    </h4>

                    {/* Tags Row — Inter 400 9px */}
                    <div className="flex items-center flex-wrap gap-1.5">
                        <span
                            className="px-2 py-0.5 rounded-sm bg-white/15 backdrop-blur-sm text-white/95"
                            style={{
                                fontFamily: 'var(--font-inter), Inter, sans-serif',
                                fontWeight: 400,
                                fontSize: '9px',
                                lineHeight: '100%',
                                letterSpacing: '0',
                            }}
                        >
                            {tag}
                        </span>
                        {anime.categories.slice(0, 2).map((cat) => (
                            <span
                                key={cat}
                                className="px-2 py-0.5 rounded-sm bg-white/10 backdrop-blur-sm text-white/70"
                                style={{
                                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                                    fontWeight: 400,
                                    fontSize: '9px',
                                    lineHeight: '100%',
                                    letterSpacing: '0',
                                }}
                            >
                                {cat}
                            </span>
                        ))}
                    </div>

                    {/* Description — Inter 400 10px */}
                    <p
                        className="text-white/70 line-clamp-2 drop-shadow-md"
                        style={{
                            fontFamily: 'var(--font-inter), Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: '9px',
                            lineHeight: '130%',
                        }}
                    >
                        {anime.synopsis}
                    </p>

                    {/* Bottom Row — Rating + Comments */}
                    <div className="flex items-center justify-between mt-0.5">
                        {/* Rating */}
                        {anime.rating && (
                            <div className="flex items-center gap-1">
                                <svg className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <span
                                    className="text-white/90 font-semibold"
                                    style={{
                                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                                        fontSize: '9px',
                                    }}
                                >
                                    {(anime.rating / 10).toFixed(1)}
                                </span>
                            </div>
                        )}

                        {/* Comment count — dynamic from backend */}
                        <div className="flex items-center gap-1 text-white/50">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                            <span
                                style={{
                                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                                    fontSize: '8px',
                                    fontWeight: 400,
                                }}
                            >
                                {commentCount !== null ? commentCount : "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
