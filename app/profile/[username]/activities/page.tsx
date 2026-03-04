"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { api } from "@/src/lib/api";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function ActivitiesPage() {
    const params = useParams();
    const username = params.username as string;
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

    if (loading) {
        return (
            <div className="flex flex-col gap-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/[0.02] border border-white/5 rounded-none w-full" />
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 bg-white/[0.02] border border-white/[0.04] rounded-none animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 rounded-none bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6 shadow-xl">
                    <span className="text-4xl grayscale opacity-20">⚡</span>
                </div>
                <h2 className="text-2xl font-black text-white/40 uppercase tracking-widest italic mb-2">Null Activity</h2>
                <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">No transmissions detected in this sector.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-none hover:bg-white/[0.04] transition-all duration-300 group"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#e63030]/10 border border-[#e63030]/20 flex items-center justify-center uppercase font-black text-[#e63030] shrink-0">
                            C
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">
                                    Transmission logged {formatDistanceToNow(new Date(activity.created_at))} ago
                                </span>
                                {activity.anime && (
                                    <Link
                                        href={`/discover`}
                                        className="text-[10px] font-black uppercase tracking-widest text-[#e63030] hover:underline"
                                    >
                                        In: {activity.anime.title}
                                    </Link>
                                )}
                            </div>
                            <p className="text-[15px] font-medium text-white/70 leading-relaxed italic mb-4">
                                "{activity.content}"
                            </p>
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/20 transition-colors">
                                <span>Status: Verified</span>
                                <div className="w-1 h-1 rounded-full bg-white/10" />
                                <span>ID: {activity.id.slice(0, 8)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
