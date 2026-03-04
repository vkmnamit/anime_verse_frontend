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

                return (
                    <div
                        key={vote.id}
                        className="relative p-6 bg-white/[0.02] border border-white/[0.05] rounded-none hover:bg-white/[0.04] transition-all duration-300 group overflow-hidden"
                    >
                        {/* Status Label */}
                        <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#e63030] text-[9px] font-black uppercase tracking-widest text-white italic z-10">
                            Combat Support Logged
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex items-center justify-between gap-4">
                                {/* Contender A */}
                                <div className={`flex items-center gap-3 flex-1 min-w-0 relative ${votedA ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className={`w-14 h-14 shrink-0 overflow-hidden border-2 transition-all relative ${votedA ? 'border-[#e63030]' : 'border-white/10'}`}>
                                        <img src={b.anime_a_rel?.cover_image} alt="A" className="w-full h-full object-cover" />
                                        {votedA && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-[#e63030]/60">
                                                <span className="text-[8px] font-black text-white uppercase tracking-tighter">VOTED</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-[10px] font-black text-white/20 uppercase">A</span>
                                        <span className="text-[11px] font-black text-white truncate">{b.anime_a_rel?.title}</span>
                                    </div>
                                </div>

                                <div className="text-[10px] font-black text-[#e63030]/40 italic">VS</div>

                                {/* Contender B */}
                                <div className={`flex items-center gap-3 flex-1 min-w-0 flex-row-reverse relative ${!votedA ? 'opacity-100' : 'opacity-30'}`}>
                                    <div className={`w-14 h-14 shrink-0 overflow-hidden border-2 transition-all relative ${!votedA ? 'border-[#e63030]' : 'border-white/10'}`}>
                                        <img src={b.anime_b_rel?.cover_image} alt="B" className="w-full h-full object-cover" />
                                        {!votedA && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-[#e63030]/60">
                                                <span className="text-[8px] font-black text-white uppercase tracking-tighter">VOTED</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-w-0 text-right">
                                        <span className="text-[10px] font-black text-white/20 uppercase">B</span>
                                        <span className="text-[11px] font-black text-white truncate">{b.anime_b_rel?.title}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <div className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#e63030]" />
                                    Voted: <span className="text-[#e63030]">{votedA ? b.anime_a_rel?.title : b.anime_b_rel?.title}</span>
                                </div>
                                <p className="text-[10px] font-medium text-white/20 uppercase tracking-[0.2em] italic">
                                    Engagement logged {formatDistanceToNow(new Date(vote.created_at))} ago
                                </p>
                            </div>

                            <div className="h-[1px] w-full bg-white/[0.04]" />

                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/10 uppercase">Combat Matrix System</span>
                                <Link
                                    href="/battles"
                                    className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#e63030] transition-colors flex items-center gap-2"
                                >
                                    Jump to Live Grid ⚡
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
