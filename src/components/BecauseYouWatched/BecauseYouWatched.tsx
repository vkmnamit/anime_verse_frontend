"use client";

import { useState, useEffect } from "react";
import Carousel from "@/src/components/Carousel/Carousel";
import AnimeCard from "@/src/components/AnimeCard/AnimeCard";
import type { AnimeCard as AnimeCardType } from "@/src/lib/kitsu";

interface Props {
    fallbackAnime: AnimeCardType[];
}

/**
 * Dynamic "Because you watched X" section.
 * - If the user is logged in, fetches their watchlist from the backend
 *   and picks a random watched anime to use as the title.
 * - If not logged in, falls back to the first trending anime title.
 * - Displays recommended anime based on similar categories.
 */
export function BecauseYouWatchedSection({ fallbackAnime }: Props) {
    const [watchedTitle, setWatchedTitle] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<AnimeCardType[]>(fallbackAnime);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) {
            setIsLoading(false);
            return;
        }

        // Try to get user's watchlist for personalized title
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (!token) {
            // Not logged in — use fallback
            setWatchedTitle(fallbackAnime[0]?.title || "Attack on Titan");
            setIsLoading(false);
            return;
        }

        fetch(`${apiUrl}/watchlist?limit=10`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                const watchlist = data?.data || [];
                if (watchlist.length > 0) {
                    // Pick a random anime from user's watchlist
                    const randomEntry = watchlist[Math.floor(Math.random() * watchlist.length)];
                    const title = randomEntry?.anime_title || randomEntry?.title || fallbackAnime[0]?.title;
                    setWatchedTitle(title);

                    // If the backend has a category, we could fetch similar anime
                    // For now, use fallback anime which are already popular picks
                } else {
                    setWatchedTitle(fallbackAnime[0]?.title || "Attack on Titan");
                }
            })
            .catch(() => {
                setWatchedTitle(fallbackAnime[0]?.title || "Attack on Titan");
            })
            .finally(() => setIsLoading(false));
    }, [fallbackAnime]);

    if (isLoading) {
        return (
            <section className="mb-8 lg:mb-12">
                <div className="px-4 sm:px-6 lg:px-16 mb-3">
                    <div className="h-5 w-64 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="px-4 sm:px-6 lg:px-16 flex gap-2 lg:gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="shrink-0 w-[150px] lg:w-[185px] aspect-[2/3] rounded-md bg-white/5 animate-pulse" />
                    ))}
                </div>
            </section>
        );
    }

    return (
        <Carousel title={`Because you watched ${watchedTitle}`}>
            {recommendations.map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
        </Carousel>
    );
}
