"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

export default function FollowersPage() {
    const params = useParams();
    const profileUsername = params.username as string;
    const { token } = useAuth();

    const [followerList, setFollowerList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Static fallback for now until backend support for follows is verified
                setFollowerList([
                    { id: 1, name: "OtakuSensei123", username: "otakusensei", avatar: "https://avatar.iran.liara.run/public/boy?username=otakusensei", bio: "Anime theorist & manga collector" },
                    { id: 2, name: "BestGirlTsunade23", username: "tsunade23", avatar: "https://avatar.iran.liara.run/public/girl?username=tsunade23", bio: "Lvl 100 Boss in the Verse" },
                    { id: 3, name: "WeebFighter06", username: "weebfighter", avatar: "https://avatar.iran.liara.run/public/boy?username=weebfighter", bio: "Shounen only. Hit me up for a debate!" },
                    { id: 4, name: "TopTheoristKage", username: "kage_theorist", avatar: "https://avatar.iran.liara.run/public/boy?username=kage_theorist", bio: "Uncovering the secrets of the grand line" },
                ]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [profileUsername]);

    const filteredList = followerList.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRemoveFollower = (id: number | string) => {
        setFollowerList(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header / Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pl-6 border-l-[3px] border-[#e63030]">
                <div className="flex flex-col gap-1.5">
                    <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-white">Followers</h2>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">{filteredList.length} tracking your signals in the Verse</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-4">
                        <svg className="w-5 h-5 text-white/10 group-focus-within:text-[#e63030] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <div className="w-[1px] h-4 bg-white/5 group-focus-within:bg-[#e63030]/20" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="SEARCH PEOPLE"
                        className="bg-white/[0.02] border border-white/[0.05] rounded-none py-4 pl-16 pr-6 text-[11px] font-black uppercase tracking-[0.3em] text-white placeholder:text-white/10 w-full focus:bg-white/[0.04] focus:border-[#e63030]/30 outline-none transition-all duration-300"
                    />
                </div>
            </div>

            {/* List — Rectangular Boxes (No Curver) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredList.map((friend) => (
                    <div
                        key={friend.id}
                        className="group flex gap-6 p-6 bg-white/[0.02] border border-white/[0.05] rounded-none hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10"
                    >
                        {/* Square Avatar */}
                        <div className="w-16 h-16 bg-white/[0.05] border border-white/[0.08] overflow-hidden shrink-0 shadow-lg relative rounded-none">
                            <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/profile/${friend.username}`}
                                    className="text-[15px] font-black uppercase tracking-tight text-white group-hover:text-[#e63030] transition-colors truncate"
                                >
                                    {friend.name}
                                </Link>
                                <span className="text-[10px] font-black text-white/15 uppercase tracking-widest">@{friend.username}</span>
                            </div>
                            <p className="text-[11px] font-black text-white/25 uppercase tracking-widest truncate max-w-full italic">
                                "{friend.bio}"
                            </p>
                        </div>

                        {/* Action — Little Right to Edge (as requested) */}
                        <div className="shrink-0 flex items-center pr-2">
                            <button
                                onClick={() => handleRemoveFollower(friend.id)}
                                className="px-6 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-none text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#e63030] hover:bg-[#e63030]/10 hover:border-[#e63030]/30 transition-all"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && filteredList.length === 0 && (
                <div className="py-40 flex flex-col items-center justify-center text-center px-10 border border-dashed border-white/5 rounded-none">
                    <p className="text-[14px] text-white/20 font-black uppercase tracking-[0.3em] italic">No active signals currently.</p>
                </div>
            )}
        </div>
    );
}
