"use client";

import Image from "next/image";

export function AboutWidget({ text }: { text: string }) {
    return (
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                About Me
            </h3>
            <p className="text-[#8a8a9a] text-sm leading-relaxed">
                {text}
            </p>
        </div>
    );
}

export function BadgesWidget({ badges }: { badges: { name: string, icon: string }[] }) {
    return (
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                Badges
                <span className="text-[#6b6b78] text-[10px] cursor-help">❓</span>
            </h3>
            <div className="flex flex-col gap-3">
                {badges.map((badge) => (
                    <div key={badge.name} className="flex items-center gap-3 p-2 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                            {badge.icon}
                        </div>
                        <span className="text-xs font-bold text-[#b3b3c2] group-hover:text-white transition-colors">{badge.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function GenresWidget({ genres }: { genres: { name: string, icon: string }[] }) {
    return (
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Favorite Genres</h3>
            <div className="flex flex-col gap-1">
                {genres.map((genre) => (
                    <div key={genre.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer group">
                        <span className="text-lg">{genre.icon}</span>
                        <span className="text-sm font-bold text-[#8a8a9a] group-hover:text-white transition-colors">{genre.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ReactionsWidget({ reactions }: { reactions: { anime: string, time: string, icon: string }[] }) {
    return (
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Recently Reactions</h3>
            <div className="flex flex-col gap-4">
                {reactions.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0 border border-white/[0.06] group-hover:border-white/[0.1] transition-all overflow-hidden">
                            <Image src={`https://images.unsplash.com/photo-1541562232579-512a21360020?w=80&h=80&fit=crop&q=80`} alt={r.anime} width={40} height={40} className="object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-[#e63030] transition-colors">{r.anime}</h4>
                            <p className="text-[10px] text-[#6b6b78]">{r.time} • {r.icon}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ProgressWidget({ percentage }: { percentage: number }) {
    return (
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                Watchlist Progress
                <span className="text-[10px] text-[#6b6b78]">{percentage}%</span>
            </h3>
            <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-[#e63030] to-[#ff6b2c] rounded-full shadow-[0_0_8px_rgba(230,48,48,0.4)]"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-[#6b6b78] uppercase font-bold tracking-wider">Completed</span>
                    <span className="text-sm font-black text-white italic">13h 198</span>
                </div>
                <div className="w-px h-8 bg-white/[0.06]" />
                <div className="flex flex-col gap-0.5 text-right">
                    <span className="text-[10px] text-[#6b6b78] uppercase font-bold tracking-wider">Minutes</span>
                    <span className="text-sm font-black text-white italic">187 235</span>
                </div>
            </div>
        </div>
    );
}

export function ScheduleWidget({ releases }: { releases: { title: string, episode: number, time: string }[] }) {
    return (
        <div className="bg-[#111118] border border-white/[0.06] rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">Later This Week</h3>
            <div className="flex flex-col gap-4">
                {releases.map((rel, i) => (
                    <div key={i} className="flex gap-3 group cursor-pointer">
                        <div className="w-10 h-14 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0 overflow-hidden">
                            <Image src={`https://images.unsplash.com/photo-1542451313-a11b03b51d6d?w=80&h=120&fit=crop&q=80`} alt={rel.title} width={40} height={56} className="object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-white group-hover:text-[#e63030] transition-colors leading-tight">{rel.title}</h4>
                            <p className="text-[10px] text-[#6b6b78] mt-1">Episode {rel.episode}</p>
                            <p className="text-[10px] text-[#e63030] font-bold mt-0.5">{rel.time}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-6 py-2.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] rounded-xl text-[10px] font-bold text-[#b3b3c2] transition-all">
                View All
            </button>
        </div>
    );
}
