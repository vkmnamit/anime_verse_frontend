"use client";

import { useState } from "react";
import Link from "next/link";
import { communityGenres } from "@/src/lib/community";

const menuItems = [
    { label: "Feed", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, active: true },
    { label: "Hot Takes", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 3 3 6 3 9s-2.5 5-2.5 5 2.5-1.5 2.5-3.5a2.5 2.5 0 10-5 0c0 2.5 2.5 5 2.5 5s-2.5-3-2.5-5" /></svg> },
    { label: "Polls", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { label: "Discussions", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { label: "Reviews", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { label: "Memes", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: "Recommendations", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
];

const topUsers = [
    { name: "ShadowKing", lv: 45, xp: 45, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop" },
    { name: "Hikari", lv: 38, xp: 38, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" },
    { name: "OtakuSenpai", lv: 41, xp: 41, avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop" },
    { name: "AnimeLover", lv: 36, xp: 36, avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop" },
];

export default function CommunitySidebar() {
    const [genres] = useState(communityGenres);
    return (
        <aside className="w-72 hidden xl:flex flex-col gap-8 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-10">
            {/* Create Post Button (Screenshot style) */}
            <button className="w-full py-4 bg-[#e63030] hover:bg-[#ff3b3b] text-white font-black rounded-xl shadow-xl shadow-red-900/30 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group">
                <span className="text-xl font-bold">+</span>
                <span className="text-sm uppercase tracking-widest">Create Post</span>
            </button>

            {/* Main Menu */}
            <nav className="flex flex-col gap-1.5">
                {menuItems.map((item) => (
                    <button
                        key={item.label}
                        className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all group ${item.active
                            ? "bg-[#e63030] text-white shadow-lg shadow-red-900/20"
                            : "text-[#8a8a9a] hover:text-white hover:bg-white/[0.04]"
                            }`}
                    >
                        <div className={`${item.active ? "text-white" : "text-[#5a5a6a] group-hover:text-white"} transition-colors`}>
                            {item.icon}
                        </div>
                        <span className="text-[15px] font-bold tracking-tight">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="flex flex-col gap-5">
                <h3 className="px-5 text-[11px] font-black uppercase tracking-[0.2em] text-[#3f3f4a]">Genres</h3>
                <div className="grid grid-cols-2 gap-2.5 px-2">
                    {genres.map((genre) => (
                        <button
                            key={genre.label}
                            className={`px-3 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all hover:brightness-125 active:scale-95 flex items-center justify-center gap-2 border border-white/5 ${genre.color}`}
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                            {genre.label}
                        </button>
                    ))}
                    <button className="col-span-2 py-3 mt-1 text-[10px] font-black uppercase tracking-widest text-[#5a5a6a] hover:text-white transition-all bg-[#111118] border border-white/[0.05] rounded-xl">
                        Show More
                    </button>
                </div>
            </div>

            {/* Top Users (Screenshot style) */}
            <div className="flex flex-col gap-5">
                <div className="px-5">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3f3f4a]">Top Users</h3>
                </div>
                <div className="flex flex-col gap-3 px-2">
                    {topUsers.map((user) => (
                        <div key={user.name} className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#111118]/60 border border-white/[0.06] hover:bg-white/[0.08] transition-all cursor-pointer group shadow-lg">
                            <div className="relative shrink-0">
                                <img src={user.avatar} alt={user.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-white/[0.05]" />
                                <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-md flex items-center justify-center text-[8px] font-black text-black ring-2 ring-[#0b0b0f] shadow-lg">
                                    Lv.{user.lv}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-white group-hover:text-[#e63030] truncate transition-colors mb-0.5">{user.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black text-[#e63030]">Lv.{user.lv}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-0.5 shrink-0">
                                <div className="flex items-center gap-1">
                                    <span className="text-xs">🔥</span>
                                    <span className="text-[11px] font-black text-orange-400 italic">{user.xp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-4 mt-1 text-[11px] font-black uppercase tracking-widest text-[#5a5a6a] hover:text-white transition-all bg-[#111118] border border-white/[0.05] rounded-2xl">
                        See All
                    </button>
                </div>
            </div>
        </aside>
    );
}
