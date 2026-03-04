"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import AnimeCard from "@/src/components/AnimeCard/AnimeCard";
import { getAnimeById } from "@/src/lib/kitsu";

import Carousel from "@/src/components/Carousel/Carousel";

export default function WatchlistPage() {
    const params = useParams();
    const profileUsername = params.username as string;
    const { token } = useAuth();

    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            setLoading(true);
            try {
                const res = await api.watchlist.getPublicList(profileUsername);
                const items = res?.data || res || [];

                if (items.length > 0) {
                    const fullDetails = await Promise.all(
                        items.map(async (item: any) => {
                            let animeData = null;
                            if (item.anime && item.anime.id) {
                                animeData = {
                                    id: item.anime.id,
                                    title: item.anime.title,
                                    posterImage: item.anime.cover_image,
                                    synopsis: item.anime.synopsis,
                                    rating: item.anime.average_score,
                                    status: item.anime.status,
                                    categories: item.anime.genres || []
                                };
                            } else {
                                try {
                                    animeData = await getAnimeById(item.anime_id);
                                } catch {
                                    animeData = null;
                                }
                            }
                            return animeData ? { ...animeData, watchlistStatus: item.status } : null;
                        })
                    );
                    setWatchlist(fullDetails.filter(Boolean));
                } else {
                    setWatchlist([]);
                }
            } catch (err) {
                console.error("Failed to fetch watchlist", err);
            }
            setLoading(false);
        };

        fetchWatchlist();
    }, [profileUsername]);

    // Grouping logic
    const sections = [
        { id: 'watching', title: 'Currently Syncing' },
        { id: 'planned', title: 'Planned for Future' },
        { id: 'completed', title: 'Completed Archives' },
        { id: 'on_hold', title: 'On Hold' },
        { id: 'dropped', title: 'Declassified / Dropped' }
    ];

    if (loading) {
        return (
            <div className="space-y-12 animate-pulse pl-6">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-4">
                        <div className="h-6 bg-white/5 w-48 rounded-sm" />
                        <div className="flex gap-4 overflow-hidden">
                            {[...Array(6)].map((_, j) => (
                                <div key={j} className="w-[150px] lg:w-[185px] aspect-[2/3] bg-white/[0.02] border border-white/5 rounded-sm" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (watchlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-white/[0.01] border border-white/[0.04] rounded-none animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-none bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-6 shadow-xl">
                    <span className="text-4xl grayscale opacity-10">📖</span>
                </div>
                <h2 className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] mb-2 italic">Null Matrix</h2>
                <p className="text-white/20 font-black uppercase tracking-widest text-[9px]">No signals archived in this sector.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700 -mx-8 sm:-mx-12 lg:-mx-[60px]">
            <div className="space-y-2 mb-10 pl-8 sm:pl-12 lg:pl-[60px]">
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Personal Repository</h2>
                <div className="h-[1px] w-24 bg-[#e63030]" />
            </div>

            {sections.map(section => {
                const items = watchlist.filter(item => item.watchlistStatus === section.id);
                if (items.length === 0) return null;

                return (
                    <Carousel key={section.id} title={section.title}>
                        {items.map((anime, idx) => (
                            <div key={anime.id} className="transition-transform duration-300 hover:scale-[1.02]">
                                <AnimeCard anime={anime} index={idx} hideLike={true} />
                            </div>
                        ))}
                    </Carousel>
                );
            })}
        </div>
    );
}
