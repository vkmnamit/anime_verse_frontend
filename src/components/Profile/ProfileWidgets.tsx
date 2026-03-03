"use client";

import Image from "next/image";

// ─── About Section ───────────────────────────────────────────────────────────
export function AboutWidget({ text }: { text: string }) {
    return (
        <div className="flex flex-col gap-5 mt-4 group">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 text-center group-hover:text-white/60 transition-colors">About Me</h3>
            <div className="bg-white/[0.02] border border-white/[0.05] p-7 rounded-none relative overflow-hidden group-hover:bg-white/[0.04] transition-all duration-500">
                {/* Accent line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#e63030]/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

                <p className="text-[14px] leading-[1.8] text-white/50 font-medium text-center selection:bg-[#e63030]/30 selection:text-white">
                    {text}
                </p>
            </div>
        </div>
    );
}

// ─── Badges Widget ────────────────────────────────────────────────────────────
export function BadgesWidget({ badges }: { badges: any[] }) {
    return (
        <div className="flex flex-col gap-5 mt-6 group">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 text-center group-hover:text-white/60 transition-colors">Badges</h3>
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-none group-hover:bg-white/[0.04] transition-all duration-500">
                <div className="grid grid-cols-3 gap-6">
                    {badges.map((badge, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 group/item">
                            <div className="w-14 h-14 bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-2xl rounded-none shadow-lg group-hover/item:border-[#e63030]/30 group-hover/item:bg-white/[0.08] transition-all duration-500">
                                {badge.icon}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/20 text-center leading-tight group-hover/item:text-white/50 transition-colors">
                                {badge.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Genres Widget ────────────────────────────────────────────────────────────
export function GenresWidget({ genres }: { genres: any[] }) {
    return (
        <div className="flex flex-col gap-5 mt-6 group">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 text-center group-hover:text-white/60 transition-colors">Fav Genres</h3>
            <div className="bg-white/[0.02] border border-white/[0.05] p-8 rounded-none group-hover:bg-white/[0.04] transition-all duration-500">
                <div className="flex flex-wrap justify-center gap-3">
                    {genres.map((genre, i) => (
                        <div key={i} className="px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-none flex items-center gap-2 hover:bg-[#e63030]/5 hover:border-[#e63030]/20 transition-all cursor-default">
                            <span className="text-xs">{genre.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{genre.name}</span>
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
        <div className="flex flex-col gap-5 mt-4 group">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 text-center group-hover:text-white/60 transition-colors">Recent Reactions</h3>
            <div className="bg-white/[0.02] border border-white/[0.05] p-2 rounded-none group-hover:bg-white/[0.04] transition-all duration-500">
                <div className="flex flex-col">
                    {reactions.map((r, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/[0.03] last:border-none group/row hover:bg-white/[0.02] transition-colors">
                            <div className="w-12 h-16 bg-white/[0.05] border border-white/[0.08] rounded-none shrink-0 overflow-hidden flex items-center justify-center text-xl shadow-lg group-hover/row:scale-105 transition-transform duration-500">
                                {r.icon || "🔥"}
                            </div>
                            <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-0">
                                <h4 className="text-[13px] font-black uppercase tracking-tight text-white/80 truncate group-hover/row:text-[#e63030] transition-colors">{r.anime}</h4>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">{r.time}</p>
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
        <div className="flex flex-col gap-5 mt-6 group">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 text-center group-hover:text-white/60 transition-colors">Transmissions</h3>
            <div className="bg-white/[0.02] border border-white/[0.05] p-2 rounded-none group-hover:bg-white/[0.04] transition-all duration-500">
                <div className="flex flex-col">
                    {releases.map((rel, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-white/[0.03] last:border-none hover:bg-white/[0.02] transition-colors group/row">
                            <div className="w-14 h-14 bg-white/[0.05] border border-white/[0.08] rounded-none shrink-0 flex items-center justify-center text-xl shadow-lg">
                                📡
                            </div>
                            <div className="flex-1 flex flex-col justify-center gap-0.5 min-w-0">
                                <h4 className="text-[13px] font-black uppercase tracking-tight text-white/80 truncate group-hover/row:text-[#e63030] transition-colors">Ep {rel.episode}: {rel.title}</h4>
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 truncate">Deploying in {rel.time}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
