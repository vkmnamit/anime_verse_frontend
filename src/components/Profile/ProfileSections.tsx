"use client";

import Image from "next/image";

// ─── Stats Bar (Removed Zap Points) ──────────────────────────────────────────
export function StatsBar({ debates }: { debates: number }) {
    return (
        <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-none mb-10 group hover:bg-white/[0.03] transition-all backdrop-blur-md">
            <div className="flex items-center justify-center p-6 bg-white/[0.01] border border-white/[0.03] rounded-none group/item cursor-pointer hover:bg-white/[0.04] transition-all relative overflow-hidden">
                {/* Visual accent */}
                <div className="absolute inset-y-0 left-0 w-[3px] bg-[#e63030] scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />

                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-none bg-white/[0.05] flex items-center justify-center border border-white/10 shadow-2xl group-hover:border-[#e63030]/40 transition-all">
                        <span className="text-2xl group-hover:scale-110 transition-transform duration-500">⚔️</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-[11px] font-black text-white/30 uppercase tracking-[0.4em]">Total Debates Won</p>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black italic text-white tracking-tighter opacity-90 group-hover:text-[#e63030] transition-colors">
                                {debates.toLocaleString()}
                            </span>
                            <div className="px-3 py-1 bg-[#e63030]/10 border border-[#e63030]/20 rounded-none">
                                <span className="text-[10px] font-black text-[#e63030] uppercase tracking-widest">Rank #12</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const topAnimeData = [
    { title: "Attack on Titan", rating: 84, category: "Dark Fantasy", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&h=600&fit=crop" },
    { title: "Jujutsu Kaisen", comments: 503, category: "Action", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=600&fit=crop" },
    { title: "Demon Slayer", category: "Adventure", image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=400&h=600&fit=crop" },
    { title: "Chainsaw Man", category: "Supernatural", image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=600&fit=crop" },
];

// ─── Top Anime Section (Rectangular Boxes) ──────────────────────────────────
export function TopAnimeSection() {
    return (
        <div className="mt-6 mb-12 group">
            <div className="flex flex-col items-center gap-4 mb-10">
                <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white/70 transition-colors">Top Transmission Signals</h2>
                <div className="w-16 h-[2px] bg-[#e63030] opacity-30" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {topAnimeData.map((anime) => (
                    <div key={anime.title} className="relative aspect-[2/3] rounded-none overflow-hidden group/card cursor-pointer border border-white/[0.04] hover:border-[#e63030]/40 transition-all duration-700 shadow-2xl bg-[#0b0b0f]">
                        <Image
                            src={anime.image}
                            alt={anime.title}
                            fill
                            className="object-cover grayscale-[40%] group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-1000"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover/card:opacity-90 transition-opacity" />

                        {/* Inner stroke on hover */}
                        <div className="absolute inset-4 border border-white/0 group-hover/card:border-white/10 transition-all duration-700 pointer-events-none" />

                        <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center text-center">
                            <h3 className="text-[14px] font-black uppercase tracking-tight text-white mb-3 group-hover/card:text-[#e63030] transition-colors drop-shadow-2xl">{anime.title}</h3>
                            <div className="flex flex-col items-center gap-2">
                                <div className="px-3 py-1 bg-white/[0.05] border border-white/[0.1] rounded-none">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{anime.category}</span>
                                </div>
                                {anime.rating && (
                                    <span className="text-[11px] font-black italic text-[#e63030] tracking-tighter">
                                        Signal Strength: {anime.rating}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// FriendsSection removed as requested
export function FriendsSection() {
    return null;
}
