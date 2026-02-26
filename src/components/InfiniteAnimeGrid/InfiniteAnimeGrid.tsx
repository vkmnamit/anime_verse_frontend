"use client";

import { useEffect, useState, useRef } from "react";
import AnimeCard from "@/src/components/AnimeCard/AnimeCard";
import Carousel from "@/src/components/Carousel/Carousel";
import { getPaginatedAnime, AnimeCard as AnimeCardType } from "@/src/lib/kitsu";

export default function InfiniteAnimeGrid() {
    const [animeList, setAnimeList] = useState<AnimeCardType[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef(null);

    const LIMIT = 20;

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);

        try {
            const nextAnime = await getPaginatedAnime(offset, LIMIT);
            if (nextAnime.length === 0) {
                setHasMore(false);
            } else {
                setAnimeList((prev) => [...prev, ...nextAnime]);
                setOffset((prev) => prev + LIMIT);
            }
        } catch (error) {
            console.error("Failed to fetch anime:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [offset, hasMore, loading]);

    // Group anime into rows for carousels
    // Each page (LIMIT) will be one row
    const rows: AnimeCardType[][] = [];
    for (let i = 0; i < animeList.length; i += LIMIT) {
        rows.push(animeList.slice(i, i + LIMIT));
    }

    return (
        <div className="w-full space-y-6 lg:space-y-10 pb-12">
            {/* Rows of Carousels */}
            {rows.map((row, idx) => (
                <Carousel
                    key={`row-${idx}`}
                    title={idx === 0 ? "Explore the Verse Library" : `Verse Library — Volume ${idx + 1}`}
                >
                    {row.map((anime, i) => (
                        <AnimeCard key={`${anime.id}-${idx}-${i}`} anime={anime} index={idx * LIMIT + i} />
                    ))}
                </Carousel>
            ))}

            {/* Loading Indicator / Observer Target */}
            <div
                ref={observerTarget}
                className="w-full h-32 flex items-center justify-center mt-12"
            >
                {loading && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#e63030]/20 border-t-[#e63030] rounded-full animate-spin" />
                        <span className="text-[#5a5a6a] text-xs font-black uppercase tracking-widest">
                            Fetching from Verse...
                        </span>
                    </div>
                )}
                {!hasMore && animeList.length > 0 && (
                    <span className="text-[#5a5a6a] text-xs font-black uppercase tracking-widest opacity-50">
                        You've reached the end of the universe.
                    </span>
                )}
            </div>
        </div>
    );
}
