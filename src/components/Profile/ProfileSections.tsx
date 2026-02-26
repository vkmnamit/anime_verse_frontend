"use client";

import Image from "next/image";

export function StatsBar({ zapPoints, debates }: { zapPoints: number, debates: number }) {
    return (
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-6 mb-8 group hover:border-white/[0.1] transition-all">
            <div className="flex-1 flex items-center gap-4 px-4 py-2 bg-black/40 rounded-xl border border-white/[0.04]">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <span className="text-xl">🟪</span>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-[#6b6b78] uppercase tracking-wider">Zap Points</p>
                    <p className="text-lg font-black text-white italic">⚡ {zapPoints.toLocaleString()}</p>
                </div>
                <div className="ml-auto opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs">🕒</span>
                </div>
            </div>

            <div className="flex-1 flex items-center gap-4 px-4 py-2 bg-black/40 rounded-xl border border-white/[0.04]">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                    <span className="text-xl">⚔️</span>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-[#6b6b78] uppercase tracking-wider">Debates</p>
                    <p className="text-lg font-black text-white italic">{debates.toLocaleString()}</p>
                </div>
                <button className="ml-auto w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                    <span className="text-[10px]">▼</span>
                </button>
            </div>
        </div>
    );
}

const topAnime = [
    { title: "Attack on Titan", rating: 94, category: "Dark Fantasy", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=400&h=600&fit=crop" },
    { title: "Jujutsu Kaisen", comments: 503, category: "Action", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=600&fit=crop" },
    { title: "Demon Slayer", category: "Demon Slayer", image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=400&h=600&fit=crop" },
    { title: "Chainsaw Man", category: "Chainsaw Man", image: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=400&h=600&fit=crop" },
];

export function TopAnimeSection() {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white italic flex items-center gap-3">
                    Top Anime
                    <span className="text-[#6b6b78] text-[10px] not-italic font-bold flex items-center gap-1">
                        <span className="text-xs">💬</span> Top Reactions
                    </span>
                </h2>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[10px] font-bold text-[#b3b3c2] hover:text-white transition-all flex items-center gap-2">
                        Most Reactions <span>▼</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {topAnime.map((anime) => (
                    <div key={anime.title} className="relative aspect-[2/3] rounded-2xl overflow-hidden group cursor-pointer border border-white/[0.06]">
                        <Image
                            src={anime.image}
                            alt={anime.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-sm font-black text-white leading-tight mb-2 group-hover:text-[#e63030] transition-colors">{anime.title}</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-[#e63030] bg-red-500/10 px-2 py-1 rounded-md border border-red-500/20">{anime.category}</span>
                                {anime.rating && <span className="text-[10px] font-bold text-white">{anime.rating}%</span>}
                                {anime.comments && <span className="text-[10px] font-bold text-white flex items-center gap-1">💬 {anime.comments}</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FriendsSection() {
    const friends = [
        { name: "Satoru", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
        { name: "Killua", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop" },
        { name: "Hinata", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
        { name: "Levi", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
        { name: "Mikasa", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-white italic flex items-center gap-3">
                    Friends
                    <span className="w-5 h-5 bg-white/[0.05] rounded-md flex items-center justify-center text-[10px] not-italic cursor-pointer hover:bg-white/[0.1]">+</span>
                </h2>
                <button className="text-[10px] font-bold text-[#6b6b78] hover:text-white transition-colors">View All Friends ›</button>
            </div>

            <div className="flex flex-wrap gap-4">
                {friends.map((friend) => (
                    <div key={friend.name} className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/[0.06] group-hover:border-[#e63030] transition-all relative">
                            <Image src={friend.avatar} alt={friend.name} fill className="object-cover" />
                        </div>
                        <span className="text-[10px] font-bold text-[#8a8a9a] group-hover:text-white transition-colors">{friend.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
