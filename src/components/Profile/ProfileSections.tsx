"use client";

import Image from "next/image";

// ─── Stats Bar (Removed Zap Points) ──────────────────────────────────────────
export function StatsBar({ debates }: { debates: number }) {
    return (
        <div className="bg-white/[0.03] border border-white/[0.08] p-5 rounded-none mb-14 group hover:bg-white/[0.05] transition-all backdrop-blur-md">
            <div className="flex items-center justify-center p-8 bg-black/40 border border-white/[0.05] rounded-none group/item cursor-pointer hover:bg-white/[0.02] transition-all relative overflow-hidden">
                {/* Visual accent */}
                <div className="absolute inset-y-0 left-0 w-[4px] bg-[#e63030] scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />

                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-none bg-white/[0.05] flex items-center justify-center border border-white/10 shadow-2xl group-hover:border-[#e63030]/40 transition-all">
                        <span className="text-3xl group-hover:scale-110 transition-transform duration-500">⚔️</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-[14px] font-bold text-white/30 text-center">Total Debates Won</p>
                        <div className="flex items-center gap-6">
                            <span className="text-5xl font-black italic text-white tracking-tighter opacity-90 group-hover:text-[#e63030] transition-colors">
                                {debates.toLocaleString()}
                            </span>
                            <div className="px-4 py-1.5 bg-[#e63030]/10 border border-[#e63030]/30 rounded-none">
                                <span className="text-[11px] font-bold text-[#e63030] tracking-widest uppercase">Rank #12</span>
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
export function TopAnimeSection({ anime }: { anime: any[] }) {
    const displayList = anime?.length > 0 ? anime : [];

    return (
        <div className="mt-6 mb-16 group">
            <div className="flex flex-col items-center gap-4 mb-12">
                <h2 className="text-[15px] font-bold text-white/40 group-hover:text-white/70 transition-colors">Watchlist Favorites</h2>
                <div className="w-20 h-[2px] bg-[#e63030] opacity-30" />
            </div>

            {displayList.length === 0 ? (
                <div className="bg-white/[0.03] border border-white/[0.08] p-24 flex flex-col items-center justify-center text-center">
                    <p className="text-[13px] font-bold text-white/20 tracking-wider">Empty Watchlist Collection</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayList.map((item) => (
                        <div key={item.id} className="relative aspect-[2/3] rounded-none overflow-hidden group/card cursor-pointer border border-white/[0.06] hover:border-[#e63030]/50 transition-all duration-700 shadow-2xl bg-[#000000]">
                            <Image
                                src={item.posterImage}
                                alt={item.title}
                                fill
                                className="object-cover grayscale-[20%] group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-1000"
                            />
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80 group-hover/card:opacity-95 transition-opacity" />

                            <div className="absolute inset-5 border border-white/0 group-hover/card:border-white/10 transition-all duration-700 pointer-events-none" />

                            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center">
                                <h3 className="text-[16px] font-black italic uppercase tracking-tight text-white mb-2 group-hover/card:text-[#e63030] transition-colors drop-shadow-2xl line-clamp-2">{item.title}</h3>
                                <div className="flex flex-col items-center gap-2">
                                    {item.rating > 0 && (
                                        <span className="text-[12px] font-bold text-[#e63030] group-hover:text-white transition-colors">
                                            Score: {(item.rating / 10).toFixed(1)} ⭐
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// FriendsSection removed as requested
export function FriendsSection() {
    return null;
}
