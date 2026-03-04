"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import AnimeCard from "@/src/components/AnimeCard/AnimeCard";
import { getAnimeById } from "@/src/lib/kitsu";

export default function WatchlistPage() {
    const params = useParams();
    const profileUsername = params.username as string;
    const { token, user: currentUser } = useAuth();

    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            setLoading(true);
            try {
                // Try fetching public watchlist first
                const res = await api.watchlist.getPublicList(profileUsername);
                const items = res?.data || res || [];

                if (items.length > 0) {
                    // For each item, we need to ensure we have the kitsu data
                    // The backend might already have some in .anime, but let's be safe
                    const fullDetails = await Promise.all(
                        items.map(async (item: any) => {
                            // If backend has anime data synced
                            if (item.anime && item.anime.id) {
                                // Transform backend anime to kitsu-like format for AnimeCard
                                return {
                                    id: item.anime.id,
                                    title: item.anime.title,
                                    posterImage: item.anime.cover_image,
                                    synopsis: item.anime.synopsis,
                                    rating: item.anime.average_score,
                                    status: item.anime.status,
                                    categories: item.anime.genres || []
                                };
                            }
                            // Fallback to Kitsu if needed
                            try {
                                return await getAnimeById(item.anime_id);
                            } catch {
                                return null;
                            }
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

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[2/3] bg-white/[0.02] border border-white/5 rounded-none" />
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
        <div className="animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-12 pl-6 border-l-[3px] border-[#e63030]">
                <div className="flex flex-col gap-1.5">
                    <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Active Watchlist</h2>
                    <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mt-1">{watchlist.length} Signals Decrypted</p>
                </div>
                <div className="h-[1px] flex-1 ml-16 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                {watchlist.map((anime, idx) => (
                    <div key={anime.id} className="transition-transform duration-500 hover:scale-[1.03]">
                        <AnimeCard anime={anime} index={idx} />
                    </div>
                ))}
            </div>
        </div>
    );
}
