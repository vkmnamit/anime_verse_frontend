"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/src/lib/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function BattlesPage() {
    const params = useParams();
    const username = params.username as string;
    const [votes, setVotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVotes = async () => {
            setLoading(true);
            try {
                const res = await api.user.getVotedBattles(username);
                setVotes(res?.data || res || []);
            } catch (err) {
                console.error("Failed to load battles:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVotes();
    }, [username]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 bg-white/[0.02] border border-white/5 rounded-none w-full" />
                ))}
            </div>
        );
    }

    if (votes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-white/[0.02] border border-white/[0.04] rounded-none animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-none bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(230,48,48,0.2)]">
                    <span className="text-4xl grayscale opacity-20">⚔️</span>
                </div>
                <h2 className="text-2xl font-black text-white/40 uppercase tracking-widest italic mb-2">Null Participation</h2>
                <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">No combat records found in the battle archives.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {votes.map((vote) => {
                const b = vote.battle;
                const votedA = vote.vote_for === 'A';
                const chosenAnime = votedA ? b.anime_a_rel : b.anime_b_rel;

                return (
                    <div
                        key={vote.id}
                        className="relative p-6 bg-white/[0.02] border border-white/[0.05] rounded-none hover:bg-white/[0.04] transition-all duration-300 group overflow-hidden"
                    >
                        {/* Status Label */}
                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#e63030] text-[9px] font-black uppercase tracking-widest text-white italic">
                            Voted {vote.vote_for}
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/[0.05] border border-white/10 overflow-hidden">
                                    <img
                                        src={chosenAnime?.cover_image || "https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=500&q=80"}
                                        alt="Chosen"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[13px] font-black uppercase tracking-widest text-white/80 truncate">
                                        Battle Entry: {chosenAnime?.title || "Classified"}
                                    </h4>
                                    <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] italic">
                                        Engagement logged {formatDistanceToNow(new Date(vote.created_at))} ago
                                    </p>
                                </div>
                            </div>

                            <div className="h-[1px] w-full bg-white/[0.04]" />

                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/10 uppercase">Combat System Online</span>
                                <Link
                                    href="/battles"
                                    className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#e63030] transition-colors flex items-center gap-2"
                                >
                                    View Live Matrix ⚡
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
