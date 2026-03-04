"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type WatchStatus = "watching" | "on_hold" | "completed" | "plan_to_watch" | "dropped";

interface WatchEntry {
    id: string | number;
    anime_id: string;
    status: WatchStatus;
    episodes_watched: number | null;
    score: number | null;
    notes: string | null;
    updated_at: string;
    anime: {
        id: string;
        title: string;
        cover_image: string;
        synopsis: string;
        average_score: number | null;
        status: string;
        genres: string[];
        episode_count?: number | null;
    } | null;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const TABS: { key: WatchStatus | "all"; label: string; icon: string; color: string }[] = [
    { key: "watching", label: "Watching", icon: "▶", color: "#e63030" },
    { key: "on_hold", label: "On Hold", icon: "⏸", color: "#f59e0b" },
    { key: "completed", label: "Completed", icon: "✓", color: "#10b981" },
    { key: "plan_to_watch", label: "Plan to Watch", icon: "☰", color: "#3b82f6" },
    { key: "dropped", label: "Dropped", icon: "✕", color: "#6b7280" },
];

const STATUS_OPTS: { key: WatchStatus; label: string }[] = [
    { key: "watching", label: "Watching" },
    { key: "on_hold", label: "On Hold" },
    { key: "completed", label: "Completed" },
    { key: "plan_to_watch", label: "Plan to Watch" },
    { key: "dropped", label: "Dropped" },
];

function timeAgo(d: string) {
    const diff = Date.now() - new Date(d).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
}

function ScoreStars({ score, onChange }: { score: number | null; onChange: (s: number) => void }) {
    const [hover, setHover] = useState<number | null>(null);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                <button
                    key={v}
                    onMouseEnter={() => setHover(v)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => onChange(v === score ? 0 : v)}
                    className="text-[14px] transition-all hover:scale-110"
                    title={`${v}/10`}
                >
                    <span style={{ color: (hover ?? score ?? 0) >= v ? "#f59e0b" : "rgba(255,255,255,0.15)" }}>★</span>
                </button>
            ))}
            {score ? <span className="ml-1 text-[11px] font-bold text-[#f59e0b]">{score}/10</span> : null}
        </div>
    );
}

// ─── Edit Drawer ──────────────────────────────────────────────────────────────
function EditDrawer({
    entry,
    onClose,
    onSave,
    onRemove,
}: {
    entry: WatchEntry;
    onClose: () => void;
    onSave: (id: string | number, data: Partial<WatchEntry>) => Promise<void>;
    onRemove: (id: string | number) => Promise<void>;
}) {
    const [status, setStatus] = useState<WatchStatus>(entry.status);
    const [eps, setEps] = useState<number>(entry.episodes_watched ?? 0);
    const [score, setScore] = useState<number | null>(entry.score);
    const [notes, setNotes] = useState<string>(entry.notes ?? "");
    const [saving, setSaving] = useState(false);
    const [removing, setRemoving] = useState(false);
    const totalEps = entry.anime?.episode_count ?? null;

    const handleSave = async () => {
        setSaving(true);
        await onSave(entry.anime_id, { status, episodes_watched: eps, score, notes });
        setSaving(false);
        onClose();
    };

    const handleRemove = async () => {
        setRemoving(true);
        await onRemove(entry.anime_id);
        setRemoving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-[520px] mx-4 mb-0 sm:mb-0 bg-[#111116] border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                {/* Cover banner */}
                <div className="relative h-28 overflow-hidden">
                    {entry.anime?.cover_image ? (
                        <img src={entry.anime.cover_image} alt="" className="w-full h-full object-cover opacity-60" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-[#1a0000] to-[#0d0d1a]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111116] to-transparent" />
                    <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="px-6 pb-6 pt-2 flex flex-col gap-5">
                    <h3 className="text-[17px] font-black tracking-tight text-white leading-tight">
                        {entry.anime?.title || "Unknown Anime"}
                    </h3>

                    {/* Status */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Status</label>
                        <div className="grid grid-cols-3 gap-2">
                            {STATUS_OPTS.map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => setStatus(opt.key)}
                                    className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all ${status === opt.key
                                        ? "bg-[#e63030] border-[#e63030] text-white"
                                        : "bg-white/[0.04] border-white/10 text-white/50 hover:text-white"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Episodes */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Episodes Watched</label>
                            <span className="text-[13px] font-bold text-white">
                                {eps}{totalEps ? ` / ${totalEps}` : ""}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={() => setEps(Math.max(0, eps - 1))} className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 text-white/60 hover:text-white flex items-center justify-center font-bold transition-all">−</button>
                            <div className="flex-1 relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                                    style={{
                                        width: totalEps ? `${Math.min(100, (eps / totalEps) * 100)}%` : "0%",
                                        background: "linear-gradient(to right, #e63030, #ff6060)"
                                    }}
                                />
                                <input
                                    type="range"
                                    min={0}
                                    max={totalEps ?? 100}
                                    value={eps}
                                    onChange={e => setEps(Number(e.target.value))}
                                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                />
                            </div>
                            <button onClick={() => setEps(eps + 1)} className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10 text-white/60 hover:text-white flex items-center justify-center font-bold transition-all">+</button>
                        </div>
                        {totalEps && eps === totalEps && status !== "completed" && (
                            <p className="text-[11px] text-[#10b981] font-semibold mt-1.5">
                                🎉 All episodes watched! Change status to Completed?{" "}
                                <button onClick={() => setStatus("completed")} className="underline hover:no-underline">Yes</button>
                            </p>
                        )}
                    </div>

                    {/* Score */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Your Score</label>
                        <ScoreStars score={score} onChange={v => setScore(v === 0 ? null : v)} />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2 block">Notes</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={2}
                            placeholder="Add a personal note..."
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-[13px] text-white placeholder-white/20 focus:outline-none focus:border-[#e63030]/50 resize-none transition-colors"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 h-11 bg-[#e63030] hover:bg-[#f04040] text-white font-bold rounded-xl text-[14px] transition-all disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            onClick={handleRemove}
                            disabled={removing}
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 text-white/40 hover:text-[#ff4545] hover:border-[#ff4545]/30 transition-all disabled:opacity-40"
                            title="Remove from watchlist"
                        >
                            {removing ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Row Card ──────────────────────────────────────────────────────────────────
function WatchRow({ entry, onEdit }: { entry: WatchEntry; onEdit: () => void }) {
    const tabCfg = TABS.find(t => t.key === entry.status);
    const totalEps = entry.anime?.episode_count ?? null;
    const progress = totalEps && (entry.episodes_watched ?? 0) > 0
        ? Math.min(100, ((entry.episodes_watched ?? 0) / totalEps) * 100)
        : 0;

    return (
        <div
            onClick={onEdit}
            className="group flex items-center gap-4 p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-200 cursor-pointer"
        >
            {/* Poster */}
            <div className="w-12 h-16 sm:w-14 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-white/[0.04] relative">
                {entry.anime?.cover_image ? (
                    <img src={entry.anime.cover_image} alt={entry.anime.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 text-xs">?</div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                    <p className="text-[14px] font-bold text-white leading-tight truncate max-w-[280px] sm:max-w-none">
                        {entry.anime?.title || "Unknown"}
                    </p>
                    {entry.score && (
                        <span className="text-[10px] font-black text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-1.5 py-0.5 rounded-md shrink-0">
                            ★ {entry.score}/10
                        </span>
                    )}
                </div>

                {/* Progress bar */}
                <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-white/[0.07] overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${progress}%`, background: tabCfg?.color || "#e63030" }}
                        />
                    </div>
                    <span className="text-[11px] font-bold text-white/30 shrink-0">
                        Ep {entry.episodes_watched ?? 0}{totalEps ? `/${totalEps}` : ""}
                    </span>
                </div>

                {entry.notes && (
                    <p className="mt-1 text-[11px] text-white/25 italic truncate">{entry.notes}</p>
                )}
            </div>

            {/* Right meta */}
            <div className="shrink-0 flex flex-col items-end gap-1.5 ml-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: (tabCfg?.color || "#e63030") + "22", color: tabCfg?.color || "#e63030" }}>
                    {tabCfg?.icon} {tabCfg?.label}
                </span>
                <span className="text-[10px] text-white/20">{timeAgo(entry.updated_at)}</span>

                {/* Edit hint */}
                <svg className="w-3.5 h-3.5 text-white/10 group-hover:text-white/40 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function WatchlistPage() {
    const { user, token } = useAuth() as any;
    const [entries, setEntries] = useState<WatchEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<WatchStatus>("watching");
    const [editEntry, setEditEntry] = useState<WatchEntry | null>(null);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"updated" | "title" | "score" | "progress">("updated");

    const load = useCallback(async () => {
        if (!token) { setLoading(false); return; }
        setLoading(true);
        try {
            const res = await api.watchlist.list(token);
            const items: WatchEntry[] = res?.data || res || [];
            setEntries(items);
        } catch {
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { load(); }, [load]);

    const handleSave = async (animeId: string | number, data: Partial<WatchEntry>) => {
        if (!token) return;
        try {
            await api.watchlist.update(animeId, {
                status: data.status,
                episodes_watched: data.episodes_watched ?? undefined,
                score: data.score ?? undefined,
                notes: data.notes ?? undefined,
            }, token);
            // Optimistic update
            setEntries(prev => prev.map(e =>
                e.anime_id === String(animeId)
                    ? { ...e, ...data, updated_at: new Date().toISOString() }
                    : e
            ));
        } catch (err) {
            console.error("Save failed", err);
        }
    };

    const handleRemove = async (animeId: string | number) => {
        if (!token) return;
        try {
            await api.watchlist.remove(animeId, token);
            setEntries(prev => prev.filter(e => e.anime_id !== String(animeId)));
        } catch (err) {
            console.error("Remove failed", err);
        }
    };

    // Counts per tab
    const counts: Record<string, number> = {};
    TABS.forEach(t => { counts[t.key] = entries.filter(e => e.status === t.key).length; });

    // Filter + search + sort
    let displayed = entries.filter(e => e.status === activeTab);
    if (search) {
        const q = search.toLowerCase();
        displayed = displayed.filter(e => (e.anime?.title || "").toLowerCase().includes(q));
    }
    displayed = [...displayed].sort((a, b) => {
        if (sortBy === "title") return (a.anime?.title || "").localeCompare(b.anime?.title || "");
        if (sortBy === "score") return (b.score ?? 0) - (a.score ?? 0);
        if (sortBy === "progress") {
            const pA = a.anime?.episode_count ? (a.episodes_watched ?? 0) / a.anime.episode_count : 0;
            const pB = b.anime?.episode_count ? (b.episodes_watched ?? 0) / b.anime.episode_count : 0;
            return pB - pA;
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return (
        <main className="min-h-screen bg-[#0b0b0f] relative overflow-x-hidden text-white font-sans">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none select-none">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="bg" fill className="object-cover opacity-25 brightness-[0.35]" priority
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.5), #0b0b0f)" }} />
            </div>

            <Navbar />

            <div className="relative z-10 pt-28 pb-20 px-4 sm:px-8 lg:px-16 max-w-[1100px] mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Watchlist</h1>
                    <p className="text-white/40 text-sm mt-1">Track your anime progress — {entries.length} titles</p>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as WatchStatus)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all ${activeTab === tab.key
                                ? "border-white/20 bg-white/[0.06]"
                                : "border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04]"
                                }`}
                        >
                            <span className="text-[20px]">{tab.icon}</span>
                            <span className="text-[18px] font-black" style={{ color: tab.color }}>{counts[tab.key] ?? 0}</span>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab + search + sort bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                    {/* Active tab label */}
                    <div className="flex items-center gap-2">
                        {TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as WatchStatus)}
                                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold transition-all ${activeTab === tab.key
                                    ? "text-white"
                                    : "text-white/25 hover:text-white/50"
                                    }`}
                                style={activeTab === tab.key ? { background: tab.color + "22", border: `1px solid ${tab.color}44` } : { background: "transparent", border: "1px solid transparent" }}
                            >
                                <span>{tab.icon}</span>
                                <span className="hidden sm:inline">{tab.label}</span>
                                {counts[tab.key] > 0 && (
                                    <span className="text-[9px] font-black opacity-60">{counts[tab.key]}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 sm:w-52">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search..."
                                className="w-full h-9 pl-9 pr-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                            />
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as any)}
                            className="h-9 px-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-[12px] text-white/60 focus:outline-none transition-colors appearance-none cursor-pointer"
                        >
                            <option value="updated">Sort: Recent</option>
                            <option value="title">Sort: Title</option>
                            <option value="score">Sort: Score</option>
                            <option value="progress">Sort: Progress</option>
                        </select>
                    </div>
                </div>

                {/* Not logged in */}
                {!token && !loading && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-5xl mb-4">📋</div>
                        <p className="text-white/40 font-bold text-lg">Sign in to manage your watchlist</p>
                        <Link href="/auth" className="mt-4 px-6 py-2.5 bg-[#e63030] text-white font-bold rounded-xl text-sm hover:bg-[#f04040] transition-all">Sign In</Link>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-20 rounded-2xl bg-white/[0.03] animate-pulse" />
                        ))}
                    </div>
                )}

                {/* List */}
                {!loading && token && (
                    <>
                        {displayed.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="text-5xl mb-4">
                                    {TABS.find(t => t.key === activeTab)?.icon || "📋"}
                                </div>
                                <p className="text-white/30 font-bold text-lg">
                                    {search ? "No results found" : `Nothing in ${TABS.find(t => t.key === activeTab)?.label} yet`}
                                </p>
                                <p className="text-white/20 text-sm mt-1">
                                    {!search && "Browse anime and add them to your watchlist"}
                                </p>
                                {!search && (
                                    <Link href="/discover" className="mt-5 px-6 py-2.5 bg-[#e63030] text-white font-bold rounded-xl text-sm hover:bg-[#f04040] transition-all">
                                        Discover Anime
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {displayed.map(entry => (
                                    <WatchRow
                                        key={entry.id}
                                        entry={entry}
                                        onEdit={() => setEditEntry(entry)}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Summary footer */}
                        {displayed.length > 0 && (
                            <div className="mt-8 flex items-center gap-6 flex-wrap">
                                <div className="text-[12px] text-white/25">
                                    <span className="font-bold text-white/50">{displayed.length}</span> titles · {" "}
                                    <span className="font-bold text-white/50">
                                        {displayed.filter(e => e.score).length}
                                    </span> rated · {" "}
                                    {displayed.reduce((sum, e) => sum + (e.episodes_watched ?? 0), 0)} eps watched
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Edit Drawer */}
            {editEntry && (
                <EditDrawer
                    entry={editEntry}
                    onClose={() => setEditEntry(null)}
                    onSave={handleSave}
                    onRemove={handleRemove}
                />
            )}

            <footer className="h-20 bg-[#0b0b0f]" />
        </main>
    );
}
