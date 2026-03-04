"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";

// ─── Tournament config ────────────────────────────────────────────────────────
// 2 battles per day, 7-day bracket (tennis style)
//   Days 1–4 → Round of 16  (8 matches, 2 per day)
//   Days 5–6 → Quarter-Finals (4 matches, 2 per day)
//   Day 7    → Semi-Finals + Final (Sunday)
const DAY_CONFIG: Record<number, { label: string; round: number; sublabel: string }> = {
    1: { label: "Day 1", round: 1, sublabel: "Round of 16" },
    2: { label: "Day 2", round: 1, sublabel: "Round of 16" },
    3: { label: "Day 3", round: 1, sublabel: "Round of 16" },
    4: { label: "Day 4", round: 1, sublabel: "Round of 16" },
    5: { label: "Day 5", round: 2, sublabel: "Quarter-Finals" },
    6: { label: "Day 6", round: 2, sublabel: "Quarter-Finals" },
    7: { label: "Day 7 ⚡", round: 3, sublabel: "Finals Day" },
};

const ROUND_LABELS: Record<number, string> = {
    1: "Round of 16",
    2: "Quarter-Finals",
    3: "Semi-Finals",
    4: "⚡ THE FINAL",
};

// ─── Types ─────────────────────────────────────────────────────────────────────
interface AnimeSlot {
    id: string;
    title: string;
    image: string;
}

interface TournamentMatch {
    id: string;
    round: number;
    dayNumber: number;
    matchInRound: number;
    animeA: AnimeSlot | null;
    animeB: AnimeSlot | null;
    votesA: number;
    votesB: number;
    winner: "A" | "B" | null;
    isLive: boolean;
}

// ── Tournament day calculation ────────────────────────────────────────────────
const TOURNAMENT_EPOCH = new Date("2026-03-02T00:00:00Z"); // Monday

function getCurrentTournamentDay(): number {
    const now = new Date();
    const msSinceEpoch = now.getTime() - TOURNAMENT_EPOCH.getTime();
    const daysSinceEpoch = Math.floor(msSinceEpoch / (1000 * 60 * 60 * 24));
    const dayInCycle = (daysSinceEpoch % 7) + 1;
    return Math.max(1, Math.min(7, dayInCycle));
}

// ─── AnimeVsCard ──────────────────────────────────────────────────────────────
function AnimeVsCard({
    slotA, slotB, votesA, votesB, winner, isLive, matchId, onVote, votedMatch, isVoting,
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

    const dimStyle = (isLoser: boolean) => ({
        opacity: isLoser ? 0.35 : 1,
        filter: isLoser ? "grayscale(80%)" : "none",
        transition: "all 0.4s",
    });

    const renderSlot = (slot: AnimeSlot | null, side: "A" | "B", pct: number, votes: number) => {
        const isWinner = winner === side;
        const isLoser = winner !== null && winner !== side;
        return (
            <div className="flex-1 flex flex-col gap-2" style={dimStyle(isLoser)}>
                {slot ? (
                    <>
                        <div className="relative w-full aspect-2/3 rounded-xl overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <img src={slot.image} alt={slot.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                            {isWinner && (
                                <div className={`absolute top-2 ${side === "A" ? "left-2" : "right-2"} text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full`}
                                    style={{ background: "#e63030", color: "#fff" }}>
                                    Winner
                                </div>
                            )}
                            <div className="absolute bottom-2 left-0 right-0 px-2">
                                <p className="text-[11px] font-bold text-white leading-tight text-center line-clamp-2">{slot.title}</p>
                            </div>
                        </div>
                        {(isLive || winner) && (
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-white/60">{pct}%</span>
                                    <span className="text-[10px] text-white/30">{votes.toLocaleString()} votes</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                                    <div className="h-full rounded-full transition-all duration-700"
                                        style={{ width: `${pct}%`, background: isWinner ? "#e63030" : "rgba(255,255,255,0.25)" }} />
                                </div>
                                {isLive && !winner && (
                                    <button
                                        onClick={() => onVote(matchId, side)}
                                        disabled={!!votedMatch || !!isVoting}
                                        className="w-full h-8 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                                        style={votedMatch === side
                                            ? { background: "#e63030", color: "#fff", border: "none" }
                                            : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.60)" }
                                        }
                                    >
                                        {isVoting && !votedMatch ? "..." : votedMatch === side ? "✓ Voted" : "Vote"}
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full aspect-2/3 rounded-xl flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                        <span className="text-[11px] text-white/20 font-semibold">TBD</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-3">
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
                {renderSlot(slotA, "A", pctA, votesA)}
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="relative">
                        <div className="absolute -inset-2 bg-[#e63030]/8 blur-md rounded-full" />
                        <div className="w-9 h-9 rounded-full flex items-center justify-center relative z-10"
                            style={{ background: "#0b0b0f", border: "1px solid rgba(255,255,255,0.10)" }}>
                            <span className="text-[11px] font-black italic text-white">VS</span>
                        </div>
                    </div>
                </div>
                {renderSlot(slotB, "B", pctB, votesB)}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BattlesPage() {
    const { user, token } = useAuth();
    const router = useRouter();

    const [todayMatches, setTodayMatches] = useState<TournamentMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [votedMatches, setVotedMatches] = useState<Record<string, "A" | "B">>({});
    const [loginPrompt, setLoginPrompt] = useState(false);
    const [votingMatch, setVotingMatch] = useState<string | null>(null);

    const currentDay = getCurrentTournamentDay();

    // Find champion (round 4 winner) from today's matches if applicable
    const finalMatch = todayMatches.find(m => m.round === 4);
    const champion: AnimeSlot | null = finalMatch?.winner
        ? (finalMatch.winner === "A" ? finalMatch.animeA : finalMatch.animeB)
        : null;

    // ── Load today's battles only ─────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res: any = await api.battles.today();
                const raw = res?.data ?? res;
                const rawBattles: any[] = Array.isArray(raw?.battles) ? raw.battles : Array.isArray(raw) ? raw : [];

                const matches: TournamentMatch[] = rawBattles.map((b: any) => ({
                    id: String(b.id),
                    round: b.round ?? 1,
                    dayNumber: b.day_number ?? currentDay,
                    matchInRound: 0,
                    animeA: b.animeA ? { id: String(b.id) + "-a", title: b.animeA.name || "Unknown", image: b.animeA.image || "" } : null,
                    animeB: b.animeB ? { id: String(b.id) + "-b", title: b.animeB.name || "Unknown", image: b.animeB.image || "" } : null,
                    votesA: b.votes?.A ?? 0,
                    votesB: b.votes?.B ?? 0,
                    winner: b.winner ?? null,
                    isLive: (b.status ?? "active") === "active",
                }));
                matches.forEach((m, i) => { m.matchInRound = i; });

                // Fetch per-battle vote details + user votes
                const collectedVotes: Record<string, "A" | "B"> = {};
                const currentToken = token || undefined;
                await Promise.allSettled(
                    matches.filter(m => m.isLive).map(async (m) => {
                        try {
                            const d: any = await api.battles.details(m.id, currentToken);
                            const detail = d?.data ?? d;
                            if (!detail) return;
                            const idx = matches.findIndex(x => x.id === m.id);
                            if (idx === -1) return;
                            matches[idx].votesA = detail.votes?.A ?? matches[idx].votesA;
                            matches[idx].votesB = detail.votes?.B ?? matches[idx].votesB;
                            matches[idx].winner = detail.winner ?? matches[idx].winner;
                            if (detail.userVote === "A" || detail.userVote === "B") {
                                collectedVotes[m.id] = detail.userVote;
                            }
                        } catch { /* keep zeros */ }
                    })
                );

                setTodayMatches(matches);
                if (Object.keys(collectedVotes).length > 0) {
                    setVotedMatches(prev => ({ ...prev, ...collectedVotes }));
                }
            } catch (err) {
                console.error("Failed to load today's battles:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Load user votes when token available ──────────────────────────────────
    useEffect(() => {
        if (!token) return;
        const fetchMyVotes = async () => {
            try {
                const res: any = await api.battles.myVotes(token);
                const votesObj: Record<string, "A" | "B"> = res?.data ?? res ?? {};
                if (votesObj && typeof votesObj === "object" && !Array.isArray(votesObj)) {
                    setVotedMatches(prev => ({ ...votesObj, ...prev }));
                }
            } catch { /* no-op */ }
        };
        fetchMyVotes();
    }, [token]);

    // ── Auto-refresh live votes every 30s ─────────────────────────────────────
    useEffect(() => {
        if (todayMatches.length === 0) return;
        const interval = setInterval(() => {
            const liveMatches = todayMatches.filter(m => m.isLive);
            if (liveMatches.length === 0) return;
            Promise.allSettled(
                liveMatches.map(async (m) => {
                    try {
                        const res: any = await api.battles.details(m.id, token || undefined);
                        const d = res?.data ?? res;
                        if (!d?.votes) return;
                        setTodayMatches(prev => prev.map(pm => pm.id !== m.id ? pm : {
                            ...pm,
                            votesA: d.votes.A ?? pm.votesA,
                            votesB: d.votes.B ?? pm.votesB,
                            winner: d.winner ?? pm.winner,
                        }));
                    } catch { /* silent */ }
                })
            );
        }, 30_000);
        return () => clearInterval(interval);
    }, [todayMatches, token]);

    // ── Vote ───────────────────────────────────────────────────────────────────
    const handleVote = useCallback(async (matchId: string, side: "A" | "B") => {
        if (!user || !token) {
            setLoginPrompt(true);
            setTimeout(() => setLoginPrompt(false), 3000);
            return;
        }
        if (votedMatches[matchId] || votingMatch === matchId) return;
        setVotingMatch(matchId);
        setVotedMatches(prev => ({ ...prev, [matchId]: side }));
        setTodayMatches(prev => prev.map(m => m.id !== matchId ? m : {
            ...m,
            votesA: m.votesA + (side === "A" ? 1 : 0),
            votesB: m.votesB + (side === "B" ? 1 : 0),
        }));
        try {
            await api.battles.vote(matchId, side, token);
            const updated: any = await api.battles.details(matchId, token);
            const d = updated?.data ?? updated;
            if (d?.votes) {
                setTodayMatches(prev => prev.map(m => m.id !== matchId ? m : {
                    ...m,
                    votesA: d.votes.A ?? m.votesA,
                    votesB: d.votes.B ?? m.votesB,
                }));
            }
        } catch { /* optimistic stays */ }
        finally { setVotingMatch(null); }
    }, [user, token, votedMatches, votingMatch]);

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <main className="min-h-screen bg-[#0b0b0f] relative overflow-x-hidden text-white">
            {/* ── Background — mobile only ───────────────────────────────── */}
            <div className="fixed inset-0 z-0 pointer-events-none select-none md:hidden">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="bg"
                    fill
                    className="object-cover opacity-35"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-black/90" />
            </div>
            <div className="fixed inset-0 z-0 pointer-events-none select-none hidden md:block bg-[#0b0b0f]" />

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

            {/* ── Desktop Hero Banner ─────────────────────────────────────── */}
            <div className="hidden md:block relative w-full" style={{ height: "340px" }}>
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="Anime Battle Week"
                    fill
                    className="object-cover object-center"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/95" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(230,48,48,0.15),transparent_60%)]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pt-10">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e63030] animate-pulse" />
                        <span className="text-[11px] font-bold text-white/60 uppercase tracking-[0.15em]">
                            Day {currentDay} of 7 · {DAY_CONFIG[currentDay]?.sublabel}
                        </span>
                    </div>
                    <h1 className="text-6xl xl:text-7xl font-black tracking-tighter drop-shadow-2xl">
                        Anime <span className="text-[#e63030]">Battle Week</span>
                    </h1>
                </div>
            </div>

            <div className="relative z-10 pb-32 px-4 sm:px-6 w-full flex flex-col items-center">

                {/* ── Mobile Header ───────────────────────────────────────── */}
                <div className="md:hidden text-center pt-28 mb-10 w-full max-w-lg px-2">
                    <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e63030] animate-pulse" />
                        <span className="text-[11px] font-bold text-white/45 uppercase tracking-[0.15em]">
                            Day {currentDay} of 7 · {DAY_CONFIG[currentDay]?.sublabel}
                        </span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter">
                        Anime <span className="text-[#e63030]">Battle Week</span>
                    </h1>
                </div>

                {/* ── Match grid ─────────────────────────────────────────────── */}
                <div className="w-full flex flex-col items-center px-2 sm:px-0 mt-8 md:mt-10">

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="flex flex-col gap-6 animate-pulse w-full max-w-lg">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="rounded-xl bg-white/4 aspect-3/5" />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && todayMatches.length === 0 && (
                        <div className="mt-20 flex flex-col items-center gap-4 text-center">
                            <span className="text-5xl">⚔️</span>
                            <p className="text-[15px] font-black text-white/60 uppercase tracking-widest">No battles today</p>
                            <p className="text-[12px] text-white/30 max-w-xs">
                                Today&apos;s battles haven&apos;t been set up yet.
                            </p>
                        </div>
                    )}

                    {/* Battle cards */}
                    {!loading && todayMatches.length > 0 && (
                        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto">
                            {todayMatches.map((match, idx) => (
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
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white">
                                            Match {idx + 1}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-semibold text-white/25 uppercase tracking-wider">
                                                {ROUND_LABELS[match.round]}
                                            </span>
                                            {match.winner && (
                                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                                    style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.20)" }}>
                                                    Done
                                                </span>
                                            )}
                                        </div>
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

                    {/* ── Champion banner ─────────────────────────────────────── */}
                    {champion && (
                        <div className="mt-16 text-center">
                            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl"
                                style={{ background: "rgba(230,48,48,0.08)", border: "1px solid rgba(230,48,48,0.25)" }}>
                                <span className="text-4xl">🏆</span>
                                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#e63030]">Tournament Champion</span>
                                <div className="w-28 aspect-2/3 rounded-xl overflow-hidden">
                                    <img src={champion.image} alt={champion.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">{champion.title}</h3>
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

                </div>
            </div>
        </main>
    );
}
