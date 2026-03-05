"use client";

import Image from "next/image";

// ─── About Section ───────────────────────────────────────────────────────────
export function AboutWidget({ text }: { text: string }) {
    return (
        <div className="flex flex-col gap-6 mt-4 group">
            <h3 className="text-[14px] font-bold text-white/20 px-8">About Me</h3>
            <div className="bg-[#000000] border border-white/5 p-10 rounded-[32px] relative overflow-hidden group-hover:bg-white/[0.02] transition-all duration-700 shadow-2xl">
                <p className="text-[16px] leading-[1.8] text-white/50 font-medium selection:bg-[#e63030]/30 selection:text-white">
                    {text}
                </p>
            </div>
        </div>
    );
}

// ─── Badges Widget ────────────────────────────────────────────────────────────
export function BadgesWidget({ badges }: { badges: any[] }) {
    return (
        <div className="flex flex-col gap-6 mt-6 group">
            <h3 className="text-[14px] font-bold text-white/20 px-8">Badges</h3>
            <div className="bg-[#000000] border border-white/5 p-10 rounded-[32px] group-hover:bg-white/[0.02] transition-all duration-700 shadow-2xl">
                <div className="grid grid-cols-3 gap-8">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 group/item">
                            <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-3xl rounded-none shadow-2xl group-hover/item:border-[#e63030]/30 group-hover/item:bg-white/[0.05] transition-all duration-500">
                                {badge.icon}
                            </div>
                            <span className="text-[12px] font-bold text-white/30 text-center leading-tight">
                                {badge.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Identity Hub (Combined Widget) ──────────────────────────────────────────
export function IdentityHub({ bio, genres }: { bio: string, genres: any[] }) {
    if (!bio && genres.length === 0) return null;

    return (
        <div className="flex flex-col gap-12">
            {bio && <AboutWidget text={bio} />}
            {genres.length > 0 && <GenresWidget genres={genres} />}
        </div>
    );
}

// ─── Genres Widget ────────────────────────────────────────────────────────────
export function GenresWidget({ genres }: { genres: any[] }) {
    return (
        <div className="flex flex-col gap-6 mt-6 group">
            <h3 className="text-[14px] font-bold text-white/20 px-8">Favorite Genres</h3>
            <div className="bg-[#000000] border border-white/5 p-10 rounded-[32px] group-hover:bg-white/[0.02] transition-all duration-700 shadow-2xl">
                <div className="flex flex-wrap gap-4">
                    {genres.map((genre, i) => (
                        <div key={i} className="px-6 py-3 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center gap-3 hover:bg-[#e63030]/10 hover:hover:border-[#e63030]/20 transition-all cursor-default">
                            <span className="text-sm">{genre.icon}</span>
                            <span className="text-[12px] font-bold text-white/50">{genre.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Reactions Widget ──────────────────────────────────────────────────────────
export function ReactionsWidget({ reactions }: { reactions: any[] }) {
    return (
        <div className="flex flex-col gap-6 mt-4 group">
            <h3 className="text-[14px] font-bold text-white/20 px-8">Recent Reactions</h3>
            <div className="bg-[#000000] border border-white/5 p-6 rounded-[32px] group-hover:bg-white/[0.01] transition-all duration-700 shadow-2xl">
                <div className="flex flex-col gap-4">
                    {reactions.map((r, i) => (
                        <div key={i} className="flex items-center gap-6 p-4 rounded-[24px] border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all group/row">
                            <div className="w-14 h-20 bg-white/[0.03] border border-white/[0.08] rounded-[16px] shrink-0 overflow-hidden flex items-center justify-center text-2xl shadow-2xl group-hover/row:scale-105 transition-all">
                                {r.icon || "🔥"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[15px] font-bold text-white/90 truncate group-hover/row:text-[#e63030] transition-colors">{r.anime}</h4>
                                <p className="text-[12px] font-medium text-white/30">{r.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Watchlist Progress ────────────────────────────────────────────────────────
export function ProgressWidget({ percentage }: { percentage: number }) {
    return (
        <div className="flex flex-col gap-6 mt-6 group">
            <h3 className="text-[14px] font-bold text-white/20 px-8">Watchlist Progress</h3>
            <div className="bg-[#000000] border border-white/5 p-10 rounded-[32px] group-hover:bg-white/[0.02] transition-all duration-700 shadow-2xl flex items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                        <circle cx="64" cy="64" r="58" fill="none" stroke="#e63030" strokeWidth="8" strokeDasharray="364.4" strokeDashoffset={364.4 - (364.4 * percentage) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black italic text-white">{percentage}%</span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">Progress</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Release Schedule ──────────────────────────────────────────────────────────
export function ScheduleWidget({ releases }: { releases: any[] }) {
    return (
        <div className="flex flex-col gap-6 mt-6 group">
            <h3 className="text-[14px] font-bold text-white/20 px-8">Watchlist Updates</h3>
            <div className="bg-[#000000] border border-white/5 p-6 rounded-[32px] group-hover:bg-white/[0.01] transition-all duration-700 shadow-2xl">
                <div className="flex flex-col gap-4">
                    {releases.map((rel, i) => (
                        <div key={i} className="flex items-center gap-6 p-4 rounded-[24px] border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all group/row shadow-xl">
                            <div className="w-14 h-14 bg-white/[0.03] border border-white/[0.08] rounded-[16px] shrink-0 flex items-center justify-center text-xl shadow-xl">
                                🎬
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-[14px] font-bold text-white/90 truncate group-hover/row:text-[#e63030] transition-colors italic uppercase">Ep {rel.episode}: {rel.title}</h2>
                                <p className="text-[11px] font-medium text-white/30 truncate mt-1">Coming in {rel.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
