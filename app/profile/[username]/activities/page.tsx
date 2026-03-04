"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import { useAnimeModal } from "@/src/context/AnimeModalContext";
import { formatDistanceToNowStrict } from "date-fns";

export default function ActivitiesPage() {
    const params = useParams();
    const username = params.username as string;
    const { user: authUser } = useAuth();
    const { openModal } = useAnimeModal();
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivities = async () => {
            setLoading(true);
            try {
                const res = await api.user.getComments(username);
                setActivities(res?.data || res || []);
            } catch (err) {
                console.error("Failed to load activities:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, [username]);

    const getTimeLabel = (date: string) => {
        try {
            const label = formatDistanceToNowStrict(new Date(date));
            return label.replace(' minutes', 'm').replace(' minute', 'm')
                .replace(' hours', 'h').replace(' hour', 'h')
                .replace(' days', 'd').replace(' day', 'd')
                .replace(' weeks', 'w').replace(' week', 'w')
                .replace(' months', 'mo').replace(' month', 'mo')
                .replace(' years', 'y').replace(' year', 'y')
                .replace(' ago', '');
        } catch { return 'now'; }
    };

    if (loading) {
        return (
            <div className="flex flex-col border-t border-white/5 divide-y divide-white/5 animate-pulse">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-6 px-1">
                        <div className="w-12 h-12 bg-white/[0.03] rounded-none shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/[0.03] w-1/3" />
                            <div className="h-3 bg-white/[0.02] w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 border-t border-white/5 bg-white/[0.01] rounded-none animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-none bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mb-6">
                    <span className="text-3xl grayscale opacity-10">🔔</span>
                </div>
                <h2 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1 italic">Silent Frequency</h2>
                <p className="text-white/10 font-black uppercase tracking-widest text-[8px]">No notifications found in this sector.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto flex flex-col gap-4 py-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Temporal Feed</h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#e63030] animate-pulse" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Live Signals</span>
                </div>
            </div>

            {activities.map((activity, idx) => (
                <div
                    key={activity.id}
                    onClick={() => {
                        if (activity.anime) {
                            openModal({
                                id: String(activity.anime.id),
                                title: activity.anime.title,
                                posterImage: activity.anime.cover_image,
                                synopsis: activity.anime.synopsis || "",
                                rating: activity.anime.average_score,
                                categories: activity.anime.genres || []
                            } as any);
                        }
                    }}
                    style={{
                        animationDelay: `${idx * 100}ms`
                    }}
                    className="relative flex items-center gap-5 p-5 rounded-[24px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-pointer group overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500"
                >
                    {/* Background Accent Glow */}
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#e63030]/10 blur-[50px] rounded-full group-hover:bg-[#e63030]/20 transition-all" />

                    {/* Colorful indicator bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#e63030] to-orange-500 opacity-60" />

                    {/* Circular Avatar / Thumbnail */}
                    <div className="relative w-14 h-14 shrink-0 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl transition-transform group-hover:scale-105 duration-500 bg-black">
                        {activity.anime?.cover_image ? (
                            <img src={activity.anime.cover_image} alt="" className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/5">
                                <span className="text-[10px] font-black text-white/20">V</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Content Matrix */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[14px] font-black text-white tracking-tight">@{username}</span>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">Record</span>
                        </div>
                        <p className="text-[13px] text-white/60 leading-tight">
                            Logged a <span className="text-white font-bold italic">broadcast</span> on <span className="text-white font-black group-hover:text-[#e63030] transition-colors">{activity.anime?.title || "Classified"}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] font-black text-white/15 uppercase tracking-[0.2em]">{getTimeLabel(activity.created_at)} ago</span>
                            <div className="w-1 h-1 rounded-full bg-white/10" />
                            <span className="text-[11px] font-black text-[#e63030]/60 uppercase tracking-widest italic">Encrypted Connection</span>
                        </div>
                    </div>

                    {/* Action Button - Insta style */}
                    <div className="shrink-0">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#e63030] group-hover:border-[#e63030] transition-all">
                            <svg className="w-4 h-4 text-white group-hover:scale-125 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
