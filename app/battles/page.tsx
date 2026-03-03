"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";
import { fetchTrending } from "@/lib/kitsu";
import type { AnimeCard as KitsuAnime } from "@/lib/types";

type KitsuAnimeItem = KitsuAnime;

// ─── Tournament config ────────────────────────────────────────────────────────
// 16 anime, 4 rounds over 7 days
// Round 1: Days 1-2  → 8 matches → 8 advance
// Round 2: Days 3-4  → 4 matches → 4 advance
// Semi:    Days 5-6  → 2 matches → 2 advance
// Final:   Day 7     → 1 match   → 1 CHAMPION

const ROUND_CONFIG = [
    { round: 1, label: "Round of 16", days: "Day 1 – 2", matchCount: 8, daysRange: [1, 2] },
    { round: 2, label: "Quarter-Finals", days: "Day 3 – 4", matchCount: 4, daysRange: [3, 4] },
    { round: 3, label: "Semi-Finals", days: "Day 5 – 6", matchCount: 2, daysRange: [5, 6] },
    { round: 4, label: "⚡ THE FINAL", days: "Day 7", matchCount: 1, daysRange: [7, 7] },
];

// Static 16 anime seedings — filled from Kitsu trending data
const SEED_NAMES = [
    "Attack on Titan", "Demon Slayer", "Jujutsu Kaisen", "One Piece",
    "Naruto", "Dragon Ball Z", "Hunter x Hunter", "Fullmetal Alchemist",
    "Death Note", "Bleach", "Sword Art Online", "One Punch Man",
    "My Hero Academia", "Tokyo Ghoul", "Steins;Gate", "Code Geass",
];

// Build bracket: 8 matches in R1, winners fill R2, etc.
// Match order: [0v1, 2v3, 4v5, 6v7, 8v9, 10v11, 12v13, 14v15]
const R1_PAIRS = [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15]];
const R2_PAIRS = [[0, 1], [2, 3], [4, 5], [6, 7]]; // winners of R1 matches 0-1, 2-3, 4-5, 6-7
const R3_PAIRS = [[0, 1], [2, 3]];
const R4_PAIRS = [[0, 1]];

interface AnimeSlot {
    id: string;
    title: string;
    image: string;
    seed: number; // 1-16
}

interface TournamentMatch {
    id: string;
    round: number;
    matchInRound: number; // 0-indexed
    animeA: AnimeSlot | null;
    animeB: AnimeSlot | null;
    votesA: number;
    votesB: number;
    winner: "A" | "B" | null;
    isLive: boolean; // current active round
}

interface TournamentState {
    currentRound: number; // 1-4
    currentDay: number;   // 1-7
    champion: AnimeSlot | null;
    matches: TournamentMatch[];
}

// ── Real tournament day calculation ──────────────────────────────────────────
// Tournament cycles weekly. Each cycle = 7 days. Day within cycle = 1-7.
// We use a fixed epoch Monday as the start of the first tournament.
const TOURNAMENT_EPOCH = new Date("2026-03-02T00:00:00Z"); // Monday Mar 2 2026

function getCurrentTournamentDay(): number {
    const now = new Date();
    const msSinceEpoch = now.getTime() - TOURNAMENT_EPOCH.getTime();
    const daysSinceEpoch = Math.floor(msSinceEpoch / (1000 * 60 * 60 * 24));
    const dayInCycle = (daysSinceEpoch % 7) + 1; // 1–7
    return Math.max(1, Math.min(7, dayInCycle));
}

function getRoundFromDay(day: number): number {
    if (day <= 2) return 1;
    if (day <= 4) return 2;
    if (day <= 6) return 3;
    return 4;
}

function buildInitialBracket(animeList: AnimeSlot[]): TournamentMatch[] {
    const matches: TournamentMatch[] = [];

    // Round 1 — 8 matches
    R1_PAIRS.forEach(([a, b], i) => {
        matches.push({
            id: `r1-m${i}`,
            round: 1,
            matchInRound: i,
            animeA: animeList[a] || null,
            animeB: animeList[b] || null,
            votesA: 0,
            votesB: 0,
            winner: null,
            isLive: true,
        });
    });

    // Round 2 — 4 matches (TBD until R1 done)
    R2_PAIRS.forEach((_, i) => {
        matches.push({
            id: `r2-m${i}`,
            round: 2,
            matchInRound: i,
            animeA: null,
            animeB: null,
            votesA: 0,
            votesB: 0,
            winner: null,
            isLive: false,
        });
    });

    // Round 3 — 2 matches
    R3_PAIRS.forEach((_, i) => {
        matches.push({
            id: `r3-m${i}`,
            round: 3,
            matchInRound: i,
            animeA: null,
            animeB: null,
            votesA: 0,
            votesB: 0,
            winner: null,
            isLive: false,
        });
    });

    // Round 4 — Final
    matches.push({
        id: "r4-m0",
        round: 4,
        matchInRound: 0,
        animeA: null,
        animeB: null,
        votesA: 0,
        votesB: 0,
        winner: null,
        isLive: false,
    });

    return matches;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AnimeVsCard({
    slotA,
    slotB,
    votesA,
    votesB,
    winner,
    isLive,
    matchId,
    onVote,
    votedMatch,
    isVoting,
}: {
    slotA: AnimeSlot | null;
    slotB: AnimeSlot | null;
    votesA: number;
    votesB: number;
    winner: "A" | "B" | null;
    isLive: boolean;
    matchId: string;
    onVote: (matchId: string, side: "A" | "B") => void;
    votedMatch: "A" | "B" | undefined;
    isVoting?: boolean;
}) {
    const total = votesA + votesB;
    const pctA = total ? Math.round((votesA / total) * 100) : 50;
    const pctB = 100 - pctA;

    const cardStyle = (side: "A" | "B", slot: AnimeSlot | null, isWinner: boolean, isLoser: boolean) => ({
        opacity: isLoser ? 0.35 : 1,
        filter: isLoser ? "grayscale(80%)" : "none",
        transition: "all 0.4s",
    });

    return (
        <div className="w-full flex flex-col gap-3">
            {/* Match status */}
            {isLive && (
                <div className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e63030] animate-pulse" />
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em]">Live Voting</span>
                </div>
            )}
            {winner && (
                <div className="flex items-center justify-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "#fbbf24" }}>⚡ Match Decided</span>
                </div>
            )}

            <div className="flex items-center gap-3">
                {/* Anime A */}
                <div className="flex-1 flex flex-col gap-2" style={cardStyle("A", slotA, winner === "A", winner === "B")}>
                    {slotA ? (
                        <>
                            {/* Poster */}
                            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <img src={slotA.image} alt={slotA.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                {winner === "A" && (
                                    <div className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                        style={{ background: "#e63030", color: "#fff" }}>
                                        Winner
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-0 right-0 px-2">
                                    <p className="text-[11px] font-bold text-white leading-tight text-center line-clamp-2">{slotA.title}</p>
                                </div>
                            </div>
                            {/* Vote bar */}
                            {(isLive || winner) && (
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-white/60">{pctA}%</span>
                                        <span className="text-[10px] text-white/30">{votesA.toLocaleString()} votes</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <div className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${pctA}%`, background: winner === "A" ? "#e63030" : "rgba(255,255,255,0.25)" }} />
                                    </div>
                                    {isLive && !winner && (
                                        <button
                                            onClick={() => onVote(matchId, "A")}
                                            disabled={!!votedMatch || !!isVoting}
                                            className="w-full h-8 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                            style={votedMatch === "A"
                                                ? { background: "#e63030", color: "#fff", border: "none" }
                                                : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.60)" }
                                            }
                                        >
                                            {isVoting && !votedMatch ? "..." : votedMatch === "A" ? "✓ Voted" : "Vote"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full aspect-[2/3] rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                            <span className="text-[11px] text-white/20 font-semibold">TBD</span>
                        </div>
                    )}
                </div>

                {/* VS badge */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="relative">
                        <div className="absolute inset-[-8px] bg-[#e63030]/8 blur-[12px] rounded-full" />
                        <div className="w-9 h-9 rounded-full flex items-center justify-center relative z-10"
                            style={{ background: "#0b0b0f", border: "1px solid rgba(255,255,255,0.10)" }}>
                            <span className="text-[11px] font-black italic text-white">VS</span>
                        </div>
                    </div>
                </div>

                {/* Anime B */}
                <div className="flex-1 flex flex-col gap-2" style={cardStyle("B", slotB, winner === "B", winner === "A")}>
                    {slotB ? (
                        <>
                            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                                <img src={slotB.image} alt={slotB.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                {winner === "B" && (
                                    <div className="absolute top-2 right-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                        style={{ background: "#e63030", color: "#fff" }}>
                                        Winner
                                    </div>
                                )}
                                <div className="absolute bottom-2 left-0 right-0 px-2">
                                    <p className="text-[11px] font-bold text-white leading-tight text-center line-clamp-2">{slotB.title}</p>
                                </div>
                            </div>
                            {(isLive || winner) && (
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold text-white/60">{pctB}%</span>
                                        <span className="text-[10px] text-white/30">{votesB.toLocaleString()} votes</span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <div className="h-full rounded-full transition-all duration-700"
                                            style={{ width: `${pctB}%`, background: winner === "B" ? "#e63030" : "rgba(255,255,255,0.25)" }} />
                                    </div>
                                    {isLive && !winner && (
                                        <button
                                            onClick={() => onVote(matchId, "B")}
                                            disabled={!!votedMatch || !!isVoting}
                                            className="w-full h-8 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                            style={votedMatch === "B"
                                                ? { background: "#e63030", color: "#fff", border: "none" }
                                                : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.60)" }
                                            }
                                        >
                                            {isVoting && !votedMatch ? "..." : votedMatch === "B" ? "✓ Voted" : "Vote"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full aspect-[2/3] rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                            <span className="text-[11px] text-white/20 font-semibold">TBD</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BattlesPage() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [tournament, setTournament] = useState<TournamentState | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeRound, setActiveRound] = useState(1);
    const [votedMatches, setVotedMatches] = useState<Record<string, "A" | "B">>({});
    const [loginPrompt, setLoginPrompt] = useState(false);
    const [votingMatch, setVotingMatch] = useState<string | null>(null);
    const currentDay = getCurrentTournamentDay();

    // ── Fetch live vote counts for a set of match IDs ──────────────────────────
    const refreshVotes = useCallback(async (matches: TournamentMatch[]) => {
        const liveMatches = matches.filter(m => m.isLive && m.id && !m.id.startsWith("r"));
        await Promise.allSettled(
            liveMatches.map(async (m) => {
                try {
                    const res: any = await api.battles.details(m.id);
                    const data = res?.data ?? res;
                    setTournament(prev => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            matches: prev.matches.map(pm => pm.id !== m.id ? pm : {
                                ...pm,
                                votesA: data?.votes?.A ?? pm.votesA,
                                votesB: data?.votes?.B ?? pm.votesB,
                                winner: data?.winner ?? pm.winner,
                            }),
                        };
                    });
                } catch { /* keep local */ }
            })
        );
    }, []);

    // ── Load anime & build bracket ─────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Try to get 16 anime from Kitsu trending
                const kitsuData = await fetchTrending(16);
                const slots: AnimeSlot[] = kitsuData.map((a: KitsuAnimeItem, i: number) => ({
                    id: a.id,
                    title: a.title || SEED_NAMES[i] || `Anime ${i + 1}`,
                    image: a.posterImage || a.coverImage || "",
                    seed: i + 1,
                }));

                // Pad with named stubs if less than 16
                while (slots.length < 16) {
                    const idx = slots.length;
                    slots.push({ id: `stub-${idx}`, title: SEED_NAMES[idx] || `Anime ${idx + 1}`, image: "", seed: idx + 1 });
                }

                const matches = buildInitialBracket(slots);

                // Enrich with real vote counts from backend
                try {
                    const res = await api.battles.list(1, 20);
                    const rawBattles: any[] = Array.isArray(res) ? res : (res.data || []);
                    rawBattles.slice(0, 8).forEach((raw: any, i: number) => {
                        if (matches[i]) {
                            matches[i].votesA = raw.votes?.A ?? raw.vote_count_a ?? 0;
                            matches[i].votesB = raw.votes?.B ?? raw.vote_count_b ?? 0;
                            matches[i].winner = raw.winner ?? null;
                            if (raw.id) matches[i].id = String(raw.id);
                        }
                    });
                } catch { /* fallback to 0 */ }

                const liveRound = getRoundFromDay(currentDay);
                // Mark isLive correctly per round
                matches.forEach(m => { m.isLive = m.round === liveRound; });

                const built: TournamentState = {
                    currentRound: liveRound,
                    currentDay,
                    champion: null,
                    matches,
                };
                setTournament(built);
                setActiveRound(liveRound);
            } catch (err) {
                console.error("Failed to load tournament:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // ── Vote ───────────────────────────────────────────────────────────────────
    const handleVote = useCallback(async (matchId: string, side: "A" | "B") => {
        if (!user || !token) {
            setLoginPrompt(true);
            setTimeout(() => setLoginPrompt(false), 3000);
            return;
        }
        if (votedMatches[matchId] || votingMatch === matchId) return;
        setVotingMatch(matchId);
        // Optimistic update
        setVotedMatches(prev => ({ ...prev, [matchId]: side }));
        setTournament(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                matches: prev.matches.map(m => {
                    if (m.id !== matchId) return m;
                    return {
                        ...m,
                        votesA: m.votesA + (side === "A" ? 1 : 0),
                        votesB: m.votesB + (side === "B" ? 1 : 0),
                    };
                }),
            };
        });
        try {
            await api.battles.vote(matchId, side, token);
            // Refresh real counts from DB after vote
            const updated: any = await api.battles.details(matchId);
            const d = updated?.data ?? updated;
            if (d?.votes) {
                setTournament(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        matches: prev.matches.map(m => m.id !== matchId ? m : {
                            ...m,
                            votesA: d.votes.A ?? m.votesA,
                            votesB: d.votes.B ?? m.votesB,
                        }),
                    };
                });
            }
        } catch { /* optimistic stays */ }
        finally { setVotingMatch(null); }
    }, [user, token, votedMatches, votingMatch, router]);

    const roundMatches = (round: number) =>
        tournament?.matches.filter(m => m.round === round) ?? [];

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <main className="min-h-screen bg-[#0b0b0f] relative overflow-x-hidden text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none select-none">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="bg"
                    fill
                    className="object-cover opacity-35"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(230,48,48,0.10),transparent_55%)]" />
            </div>

            {/* Login prompt toast */}
            {loginPrompt && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl"
                    style={{ background: "#1a0a0a", border: "1px solid rgba(230,48,48,0.40)" }}>
                    <span className="text-[13px] font-semibold text-white/80">You need to</span>
                    <button onClick={() => router.push("/auth")}
                        className="text-[13px] font-black text-[#e63030] underline underline-offset-2">
                        log in
                    </button>
                    <span className="text-[13px] font-semibold text-white/80">to vote</span>
                </div>
            )}

            <Navbar />

            <div className="relative z-10 pt-24 pb-32 px-4 w-full flex flex-col items-center">
                {/* ── Header ─────────────────────────────────────────────────── */}
                <div className="text-center mb-10 w-full max-w-4xl">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e63030] animate-pulse" />
                        <span className="text-[11px] font-bold text-white/45 uppercase tracking-[0.15em]">
                            Week Tournament · Day {currentDay} of 7
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter">
                        Anime <span className="text-[#e63030]">Battle Week</span>
                    </h1>
                </div>

                {/* ── Timeline bar ───────────────────────────────────────────── */}
                <div className="flex items-center justify-center gap-0 mb-24 overflow-x-auto no-scrollbar w-full max-w-3xl">
                    {ROUND_CONFIG.map((rc, i) => {
                        const isActive = rc.round === activeRound;
                        const isPast = rc.round < activeRound;
                        const isCurrentLive = currentDay >= rc.daysRange[0] && currentDay <= rc.daysRange[1];
                        return (
                            <React.Fragment key={rc.round}>
                                <button
                                    onClick={() => setActiveRound(rc.round)}
                                    className="flex flex-col items-center gap-1 px-5 py-3 rounded-xl transition-all shrink-0"
                                    style={isActive
                                        ? { background: "rgba(230,48,48,0.15)", border: "1px solid rgba(230,48,48,0.30)" }
                                        : { background: "transparent", border: "1px solid transparent" }
                                    }
                                >
                                    <div className="flex items-center gap-1.5">
                                        {isCurrentLive && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#e63030] animate-pulse" />
                                        )}
                                        <span className={`text-[12px] font-black uppercase tracking-wider ${isActive ? "text-[#e63030]" : isPast ? "text-white/30" : "text-white/50"}`}>
                                            {rc.label}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-medium text-white/30 mt-0.5">{rc.days}</span>
                                    <span className="text-[10px] font-semibold text-white/25">{rc.matchCount} match{rc.matchCount > 1 ? "es" : ""}</span>
                                </button>
                                {i < ROUND_CONFIG.length - 1 && (
                                    <div className="w-8 h-px mx-1 shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* ── Round label + grid wrapper ─────────────────────────────── */}
                <div className="w-full flex flex-col items-center">

                    {/* ── Loading ─────────────────────────────────────────────────── */}
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse w-full px-2 mt-10">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="rounded-xl bg-white/[0.04] aspect-[3/5]" />
                            ))}
                        </div>
                    )}

                    {/* ── Match grid ─────────────────────────────────────────────── */}
                    {!loading && tournament && (
                        <div className={`grid mt-14 w-full px-2 gap-6 ${activeRound === 1 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
                            activeRound === 2 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
                                activeRound === 3 ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto" :
                                    "grid-cols-1 max-w-lg mx-auto"
                            }`}>
                            {roundMatches(activeRound).map((match, idx) => (
                                <div
                                    key={match.id}
                                    className="rounded-2xl pt-3 px-4 pb-4 flex flex-col gap-3"
                                    style={{
                                        background: match.isLive
                                            ? "rgba(230,48,48,0.04)"
                                            : "rgba(18,18,18,0.70)",
                                        border: match.isLive
                                            ? "1px solid rgba(230,48,48,0.18)"
                                            : "1px solid rgba(255,255,255,0.06)",
                                        backdropFilter: "blur(12px)",
                                    }}
                                >
                                    {/* Match number — centered, white */}
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white">
                                            Match {idx + 1}
                                        </span>
                                        {match.winner && (
                                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                                style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.20)" }}>
                                                Complete
                                            </span>
                                        )}
                                    </div>

                                    <AnimeVsCard
                                        slotA={match.animeA}
                                        slotB={match.animeB}
                                        votesA={match.votesA}
                                        votesB={match.votesB}
                                        winner={match.winner}
                                        isLive={match.isLive}
                                        matchId={match.id}
                                        onVote={handleVote}
                                        votedMatch={votedMatches[match.id]}
                                        isVoting={votingMatch === match.id}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Champion banner (shown when tournament done) ──────────── */}
                    {tournament?.champion && (
                        <div className="mt-16 text-center">
                            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl"
                                style={{ background: "rgba(230,48,48,0.08)", border: "1px solid rgba(230,48,48,0.25)" }}>
                                <span className="text-4xl">🏆</span>
                                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#e63030]">Tournament Champion</span>
                                <div className="w-28 aspect-[2/3] rounded-xl overflow-hidden">
                                    <img src={tournament.champion.image} alt={tournament.champion.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">{tournament.champion.title}</h3>
                                <p className="text-[13px] text-white/40">Now featured on the Trending page</p>
                                <button
                                    onClick={() => router.push("/trending")}
                                    className="px-6 py-2.5 rounded-full text-[12px] font-black uppercase tracking-wider text-white"
                                    style={{ background: "linear-gradient(90deg,#e63030,#ff5c5c)", boxShadow: "0 4px 16px rgba(230,48,48,0.30)" }}>
                                    View on Trending →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Round nav hint ─────────────────────────────────────────── */}
                    {!loading && tournament && !tournament.champion && (
                        <div className="mt-10 flex items-center justify-center gap-6">
                            {activeRound > 1 && (
                                <button
                                    onClick={() => setActiveRound(r => r - 1)}
                                    className="flex items-center gap-2 text-[12px] font-semibold text-white/35 hover:text-white/70 transition-colors"
                                >
                                    ← Previous Round
                                </button>
                            )}
                            {activeRound < 4 && (
                                <button
                                    onClick={() => setActiveRound(r => r + 1)}
                                    className="flex items-center gap-2 text-[12px] font-semibold text-white/35 hover:text-white/70 transition-colors"
                                >
                                    Next Round →
                                </button>
                            )}
                        </div>
                    )}

                </div>{/* end centered wrapper */}
            </div>
        </main>
    );
}
