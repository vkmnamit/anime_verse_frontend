"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";

export default function FollowersPage() {
    const params = useParams();
    const profileUsername = params.username as string;
    const { token, user: currentUser } = useAuth();

    const [followerList, setFollowerList] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [globalResults, setGlobalResults] = useState<any[]>([]);
    const [searchOpen, setSearchOpen] = useState(true);

    const isOwnProfile = currentUser?.username === profileUsername;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.user.getFollowers(profileUsername);
                setFollowerList(res?.data || res || []);
            } catch (err) {
                console.error("Failed to fetch followers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [profileUsername]);

    useEffect(() => {
        const searchGlobal = async () => {
            if (searchQuery.trim().length < 2) {
                setGlobalResults([]);
                return;
            }
            try {
                const res = await api.user.search(searchQuery);
                // Filter out those already in followerList and current profile
                const results = (res?.data || res || []).filter((u: any) =>
                    !followerList.some(f => f.username === u.username) && u.username !== profileUsername
                );
                setGlobalResults(results);
            } catch (err) {
                console.error("Global search failed", err);
            }
        };

        const timer = setTimeout(searchGlobal, 400);
        return () => clearTimeout(timer);
    }, [searchQuery, followerList, profileUsername]);

    const filteredList = followerList.filter(f =>
        f.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRemoveFollower = async (username: string) => {
        if (!token || !isOwnProfile) return;
        // The backend might need a 'remove follower' endpoint, for now we just filter locally
        setFollowerList(prev => prev.filter(f => f.username !== username));
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-white/[0.02] border border-white/[0.05] rounded-none w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
            {/* Header / Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pl-6 border-l-[3px] border-[#e63030]">
                <div className="flex flex-col gap-1.5 flex-1">
                    <h2 className="text-3xl font-black uppercase tracking-[0.2em] text-white">Followers</h2>
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">{followerList.length} tracking your signals in the Verse</p>
                </div>

                {/* Navbar-style Search */}
                <div className="relative group w-full md:w-96 flex items-center justify-end">
                    <div className={`flex items-center overflow-hidden transition-all duration-500 bg-white/[0.02] border ${searchOpen ? "w-full border-white/10" : "w-0 border-transparent"} rounded-none`}>
                        <div className="pl-5 pr-3">
                            <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Titles, people, genres"
                            className="bg-transparent py-4 pr-6 text-[11px] font-black uppercase tracking-[0.3em] text-white placeholder:text-white/10 w-full outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* List — Local Filtering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredList.map((friend) => (
                    <div
                        key={friend.username}
                        className="group flex gap-6 p-6 bg-white/[0.02] border border-white/[0.05] rounded-none hover:bg-white/[0.04] transition-all duration-500 hover:border-white/10"
                    >
                        {/* Square Avatar */}
                        <div className="w-16 h-16 bg-white/[0.05] border border-white/[0.08] overflow-hidden shrink-0 shadow-lg relative rounded-none">
                            <img
                                src={friend.avatar_url || `https://ui-avatars.com/api/?name=${friend.username}&background=random`}
                                alt={friend.username}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/profile/${friend.username}`}
                                    className="text-[15px] font-black uppercase tracking-tight text-white group-hover:text-[#e63030] transition-colors truncate"
                                >
                                    {friend.username}
                                </Link>
                                <span className="text-[10px] font-black text-white/15 uppercase tracking-widest">@{friend.username}</span>
                            </div>
                            <p className="text-[11px] font-black text-white/25 uppercase tracking-widest truncate max-w-full italic">
                                "{friend.bio || "No status set."}"
                            </p>
                        </div>

                        {/* Action — Only if own profile */}
                        {isOwnProfile && (
                            <div className="shrink-0 flex items-center pr-2">
                                <button
                                    onClick={() => handleRemoveFollower(friend.username)}
                                    className="px-6 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-none text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#e63030] hover:bg-[#e63030]/10 hover:border-[#e63030]/30 transition-all"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Global Search Results */}
            {globalResults.length > 0 && (
                <div className="mt-16 flex flex-col gap-8 animate-in slide-in-from-bottom-10 duration-1000">
                    <div className="flex items-center gap-4">
                        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                        <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/20">Global Hits in the Verse</h3>
                        <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {globalResults.map((user) => (
                            <Link
                                key={user.username}
                                href={`/profile/${user.username}`}
                                className="group p-4 bg-white/[0.02] border border-white/5 flex items-center gap-4 hover:border-[#e63030]/40 transition-all hover:bg-white/[0.04]"
                            >
                                <div className="w-10 h-10 bg-white/5 border border-white/10 overflow-hidden shrink-0">
                                    <img
                                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.username}&background=random`}
                                        alt={user.username}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-black uppercase text-white group-hover:text-[#e63030] transition-colors truncate">
                                        {user.username}
                                    </div>
                                    <div className="text-[9px] font-black text-white/20 uppercase tracking-widest truncate">
                                        Open Signal
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {!loading && filteredList.length === 0 && searchQuery === "" && (
                <div className="py-40 flex flex-col items-center justify-center text-center px-10 border border-dashed border-white/5 rounded-none">
                    <p className="text-[14px] text-white/20 font-black uppercase tracking-[0.3em] italic">No active signals currently.</p>
                </div>
            )}
        </div>
    );
}
