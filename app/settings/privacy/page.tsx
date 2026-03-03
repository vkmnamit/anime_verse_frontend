"use client";

import { useState } from "react";

const interactionSettings = [
    { id: "dm", label: "Direct Messages", description: "Allow users to send you private messages.", default: true },
    { id: "mentions", label: "Mentions", description: "Allow others to mention you in posts and comments.", default: true },
    { id: "friends", label: "Friend Requests", description: "Allow other users to send you friend requests.", default: true },
];

export default function PrivacyPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-black italic text-white tracking-tight mb-2 uppercase">Privacy</h1>
                <p className="text-white/40 text-sm">Manage your privacy and security</p>
            </header>

            <div className="space-y-8">
                {/* Profile Privacy */}
                <section>
                    <h2 className="text-[#e63030] font-black text-sm uppercase tracking-widest mb-4 ml-1">Profile Privacy</h2>
                    <div className="bg-[#111118]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-md space-y-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <h3 className="text-[14px] font-bold text-white group-hover:text-white transition-colors">Profile Visibility</h3>
                                <p className="text-[12px] text-white/40 mt-1">Limit who can view your profile.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[11px] font-bold text-white/30 uppercase">Public</span>
                                <div className="w-10 h-5 bg-[#e63030] rounded-full relative cursor-pointer border border-white/10 transition-colors">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-white/[0.04]" />

                        <div className="flex items-center justify-between group">
                            <div>
                                <h3 className="text-[14px] font-bold text-white">List Privacy</h3>
                                <p className="text-[12px] text-white/40 mt-1">Control who can view your watchlist, favorites, and ratings.</p>
                            </div>
                            <div className="w-10 h-5 bg-[#e63030] rounded-full relative cursor-pointer border border-white/10 transition-colors">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interaction Settings */}
                <section>
                    <h2 className="text-[#e63030] font-black text-sm uppercase tracking-widest mb-4 ml-1">Interaction Settings</h2>
                    <div className="bg-[#111118]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-md space-y-6">
                        {interactionSettings.map((item, idx) => (
                            <div key={item.id}>
                                <div className="flex items-center justify-between group">
                                    <div>
                                        <h3 className="text-[14px] font-bold text-white">{item.label}</h3>
                                        <p className="text-[12px] text-white/40 mt-1">{item.description}</p>
                                    </div>
                                    <div className="w-10 h-5 bg-[#e63030] rounded-full relative cursor-pointer border border-white/10 transition-colors">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
                                    </div>
                                </div>
                                {idx !== interactionSettings.length - 1 && <div className="h-px bg-white/[0.04] mt-6" />}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Public Statistics */}
                <section>
                    <h2 className="text-[#e63030] font-black text-sm uppercase tracking-widest mb-4 ml-1">Public Statistics</h2>
                    <div className="bg-[#111118]/60 border border-white/[0.06] rounded-2xl p-6 backdrop-blur-md space-y-6">
                        <div className="flex items-center justify-between group">
                            <div>
                                <h3 className="text-[14px] font-bold text-white">Statistics Visibility</h3>
                                <p className="text-[12px] text-white/40 mt-1">Display your anime stats on your profile.</p>
                            </div>
                            <div className="w-10 h-5 bg-[#e63030] rounded-full relative cursor-pointer border border-white/10 transition-colors">
                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/[0.04]">
                            <button className="w-full py-3 bg-red-950/20 hover:bg-red-900/30 text-[#ff4545] text-xs font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/10 active:scale-[0.98]">
                                Clear History
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
