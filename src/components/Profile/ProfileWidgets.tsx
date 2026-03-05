"use client";

import Image from "next/image";

// ─── About Section ───────────────────────────────────────────────────────────
export function AboutWidget({ text }: { text: string }) {
    return (
        <div className="flex flex-col gap-6 mt-4 group">
            <h3 className="text-[14px] font-bold text-white/40 text-center group-hover:text-white/60 transition-colors">About Me</h3>
            <div className="bg-[#000000] border border-white/[0.08] p-10 rounded-none relative overflow-hidden group-hover:bg-white/[0.02] transition-all duration-500 min-h-[160px] flex items-center justify-center shadow-2xl">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#e63030]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                <p className="text-[16px] leading-[1.8] text-white/60 font-medium text-center selection:bg-[#e63030]/30 selection:text-white">
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
            <h3 className="text-[14px] font-bold text-white/40 text-center group-hover:text-white/60 transition-colors">Badges</h3>
            <div className="bg-[#000000] border border-white/[0.08] p-10 rounded-none group-hover:bg-white/[0.02] transition-all duration-500 min-h-[140px] shadow-2xl">
                <div className="grid grid-cols-3 gap-8">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex flex-col items-center gap-4 group/item">
                            <div className="w-16 h-16 bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-3xl rounded-none shadow-2xl group-hover/item:border-[#e63030]/30 group-hover/item:bg-white/[0.08] transition-all duration-500">
                                {badge.icon}
                            </div>
                            <span className="text-[11px] font-bold text-white/30 text-center leading-tight group-hover/item:text-white/50 transition-colors">
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
            <h3 className="text-[14px] font-bold text-white/40 text-center group-hover:text-white/60 transition-colors">Favorite Genres</h3>
            <div className="bg-[#000000] border border-white/[0.08] p-10 rounded-none group-hover:bg-white/[0.02] transition-all duration-500 min-h-[140px] shadow-2xl">
                <div className="flex flex-wrap justify-center gap-4">
                    {genres.map((genre, i) => (
                        <div key={i} className="px-6 py-3 bg-white/[0.05] border border-white/[0.1] rounded-none flex items-center gap-3 hover:bg-[#e63030]/10 hover:border-[#e63030]/30 transition-all cursor-default">
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
            <h3 className="text-[14px] font-bold text-white/40 text-center group-hover:text-white/60 transition-colors">Recent Reactions</h3>
            <div className="bg-[#000000] border border-white/[0.08] p-6 rounded-none group-hover:bg-white/[0.01] transition-all duration-500 shadow-2xl">
                <div className="flex flex-col gap-3">
                    {reactions.map((r, i) => (
                        <div key={i} className="flex items-center gap-6 p-5 border border-white/[0.05] hover:border-white/20 group/row hover:bg-white/[0.02] transition-all shadow-xl">
                            <div className="w-14 h-20 bg-white/[0.03] border border-white/[0.08] rounded-none shrink-0 overflow-hidden flex items-center justify-center text-2xl shadow-2xl group-hover/row:scale-105 transition-transform duration-500">
                                {r.icon || "🔥"}
                            </div>
                            <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
                                <h4 className="text-[15px] font-bold text-white/90 truncate group-hover/row:text-[#e63030] transition-colors italic uppercase">{r.anime}</h4>
                                <p className="text-[11px] font-medium text-white/30">{r.time}</p>
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
        <div className="flex flex-col gap-5 mt-6 group">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 text-center group-hover:text-white/60 transition-colors">Watchlist Goal</h3>
            <div className="bg-white/[0.02] border border-white/[0.05] p-9 rounded-none group-hover:bg-white/[0.04] transition-all duration-500">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="56" cy="56" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                            <circle cx="56" cy="56" r="50" fill="none" stroke="#e63030" strokeWidth="6" strokeDasharray="314" strokeDashoffset={314 - (314 * percentage) / 100} strokeLinecap="square" className="transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black italic text-white">{percentage}%</span>
                            <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-0.5">Progress</span>
                        </div>
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
            <h3 className="text-[14px] font-bold text-white/40 text-center group-hover:text-white/60 transition-colors">Watchlist Updates</h3>
            <div className="bg-[#000000] border border-white/[0.08] p-6 rounded-none group-hover:bg-white/[0.01] transition-all duration-500 shadow-2xl">
                <div className="flex flex-col gap-3">
                    {releases.map((rel, i) => (
                        <div key={i} className="flex items-center gap-6 p-5 border border-white/[0.05] hover:border-white/20 hover:bg-white/[0.02] transition-all group/row shadow-xl">
                            <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-none shrink-0 flex items-center justify-center text-2xl shadow-xl">
                                🎬
                            </div>
                            <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
                                <h4 className="text-[15px] font-bold text-white/90 truncate group-hover/row:text-[#e63030] transition-colors italic uppercase">Ep {rel.episode}: {rel.title}</h4>
                                <div className="flex items-center gap-2">
                                    <p className="text-[11px] font-medium text-white/40 truncate">Coming in {rel.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
