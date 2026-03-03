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
                // For now, the API only supports own watchlist. 
                // If it's a different user, we might show nothing or fallback.
                if (token && currentUser?.username === profileUsername) {
                    const res = await api.watchlist.list(token);
                    const items = res.data || res || [];

                    // Fetch full kitsu details for each anime_id in the watchlist
                    const fullDetails = await Promise.all(
                        items.map(async (item: any) => {
                            try {
                                return await getAnimeById(item.anime_id);
                            } catch {
                                return null;
                            }
                        })
                    );

                    setWatchlist(fullDetails.filter(Boolean));
                } else {
                    // Placeholder for other users' public watchlists if supported in future
                    setWatchlist([]);
                }
            } catch (err) {
                console.error("Failed to fetch watchlist", err);
            }
            setLoading(false);
        };

        fetchWatchlist();
    }, [profileUsername, token, currentUser]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40">
                <div className="w-10 h-10 border-2 border-white/5 border-t-[#e63030] animate-spin rounded-none" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Accessing Signal...</p>
            </div>
        );
    }

    if (watchlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-white/[0.01] border border-white/[0.04] rounded-none animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-none bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-6 shadow-xl">
                    <span className="text-4xl grayscale opacity-20">📚</span>
                </div>
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-2">Null Matrix</h2>
                <p className="text-white/20 font-black uppercase tracking-widest text-[9px]">No transmissions saved in this frequency.</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                    <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Active Watchlist</h2>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest mt-1">{watchlist.length} Signals Synced</p>
                </div>
                <div className="h-[1px] flex-1 mx-8 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {watchlist.map((anime, idx) => (
                    <AnimeCard key={anime.id} anime={anime} index={idx} />
                ))}
            </div>
        </div>
    );
}
