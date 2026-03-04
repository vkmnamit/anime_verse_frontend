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
const TOURNAMENT_EPOCH = new Date("2026-03-04T00:00:00Z"); // Wednesday March 4, 2026

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
                        <div className="relative w-full aspect-2/3 rounded-none overflow-hidden"
                            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            <img src={slot.image} alt={slot.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
                            {isWinner && (
                                <div className={`absolute top-0 ${side === "A" ? "left-0" : "right-0"} text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-none`}
                                    style={{ background: "#e63030", color: "#fff" }}>
                                    Winner
                                </div>
                            )}
                            <div className="absolute bottom-2 left-0 right-0 px-2">
                                <p className="text-[10px] font-black uppercase tracking-wider text-white leading-tight text-center line-clamp-2">{slot.title}</p>
                            </div>
                        </div>
                        {(isLive || winner) && (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-white/50">{pct}%</span>
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{votes.toLocaleString()} votes</span>
                                </div>
                                <div className="w-full h-1 rounded-none overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                                    <div className="h-full rounded-none transition-all duration-700"
                                        style={{ width: `${pct}%`, background: isWinner ? "#e63030" : "rgba(255,255,255,0.15)" }} />
                                </div>
                                {isLive && !winner && (
                                    <button
                                        onClick={() => onVote(matchId, side)}
                                        disabled={!!votedMatch || !!isVoting}
                                        className="w-full h-9 rounded-none text-[10px] font-black uppercase tracking-[0.2em] transition-all disabled:opacity-30"
                                        style={votedMatch === side
                                            ? { background: "#e63030", color: "#fff", border: "none" }
                                            : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.40)" }
                                        }
                                    >
                                        {isVoting && !votedMatch ? "..." : votedMatch === side ? "Selected" : "Vote"}
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full aspect-2/3 rounded-none flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.05)" }}>
                        <span className="text-[9px] text-white/10 font-black uppercase tracking-widest">TBD</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {isLive && (
                <div className="flex items-center justify-center gap-2">
                    <span className="w-1 h-1 rounded-none bg-[#e63030] animate-pulse" />
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.25em]">Live Match</span>
                </div>
            )}
            <div className="flex items-center gap-3">
                {renderSlot(slotA, "A", pctA, votesA)}
                <div className="flex flex-col items-center gap-1 shrink-0">
                    <div className="w-8 h-8 rounded-none flex items-center justify-center transition-all bg-[#0b0b0f] border border-white/10">
                        <span className="text-[10px] font-black italic text-white/60">VS</span>
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

    const [allMatches, setAllMatches] = useState<TournamentMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [votedMatches, setVotedMatches] = useState<Record<string, "A" | "B">>({});
    const [loginPrompt, setLoginPrompt] = useState(false);
    const [votingMatch, setVotingMatch] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState<number>(1);
    const [currentTournamentDay, setCurrentTournamentDay] = useState<number>(1);

    // ── Load all battles ──────────────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res: any = await api.battles.all();
                const data = res?.data ?? res;

                if (!data) {
                    setAllMatches([]);
                    setLoading(false);
                    return;
                }

                const matches: TournamentMatch[] = (data.battles || []).map((b: any) => ({
                    id: String(b.id),
                    round: b.round ?? 1,
                    dayNumber: b.day_number ?? 1,
                    matchInRound: 0,
                    animeA: b.animeA ? { id: String(b.id) + "-a", title: b.animeA.name || "Unknown", image: b.animeA.image || "" } : null,
                    animeB: b.animeB ? { id: String(b.id) + "-b", title: b.animeB.name || "Unknown", image: b.animeB.image || "" } : null,
                    votesA: b.votes?.A ?? 0,
                    votesB: b.votes?.B ?? 0,
                    winner: b.winner ?? null,
                    isLive: (b.status ?? "active") === "active",
                }));

                setAllMatches(matches);
                setCurrentTournamentDay(data.currentDay || getCurrentTournamentDay());
                setSelectedDay(data.currentDay || getCurrentTournamentDay());

                // Fetch user votes if logged in
                if (token) {
                    const votesRes: any = await api.battles.myVotes(token);
                    const votesObj = votesRes?.data ?? votesRes ?? {};
                    if (votesObj && typeof votesObj === "object") {
                        setVotedMatches(votesObj);
                    }
                }
            } catch (err) {
                console.error("Failed to load battles:", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token]);

    // ── Auto-refresh live matches only ────────────────────────────────────────
    useEffect(() => {
        if (allMatches.length === 0) return;
        const interval = setInterval(() => {
            const liveMatches = allMatches.filter(m => m.isLive && m.dayNumber === currentTournamentDay);
            if (liveMatches.length === 0) return;

            Promise.allSettled(
                liveMatches.map(async (m) => {
                    try {
                        const res: any = await api.battles.details(m.id, token || undefined);
                        const d = res?.data ?? res;
                        if (!d?.votes) return;
                        setAllMatches(prev => prev.map(pm => pm.id !== m.id ? pm : {
                            ...pm,
                            votesA: d.votes.A ?? pm.votesA,
                            votesB: d.votes.B ?? pm.votesB,
                            winner: d.winner ?? pm.winner,
                        }));
                    } catch { /* silent */ }
                })
            );
        }, 15_000);
        return () => clearInterval(interval);
    }, [allMatches, token, currentTournamentDay]);

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
        setAllMatches(prev => prev.map(m => m.id !== matchId ? m : {
            ...m,
            votesA: m.votesA + (side === "A" ? 1 : 0),
            votesB: m.votesB + (side === "B" ? 1 : 0),
        }));
        try {
            await api.battles.vote(matchId, side, token);
        } catch { /* optimistic stays */ }
        finally { setVotingMatch(null); }
    }, [user, token, votedMatches, votingMatch]);

    const activeDayMatches = allMatches.filter(m => m.dayNumber === selectedDay);

    // Find champion
    const finalMatch = allMatches.find(m => m.round === 4 && m.winner);
    const champion: AnimeSlot | null = finalMatch?.winner
        ? (finalMatch.winner === "A" ? finalMatch.animeA : finalMatch.animeB)
        : null;

    return (
        <main className="min-h-screen bg-black relative overflow-x-hidden text-white">
            <div className="fixed inset-0 z-0 pointer-events-none select-none">
                <Image src="/discover_fire_bg.png" alt="Fire Background" fill className="object-cover opacity-[0.15] mix-blend-screen" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/90 to-black" />
            </div>

            {loginPrompt && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-none shadow-2xl"
                    style={{ background: "#000", border: "1px solid rgba(230,48,48,0.5)" }}>
                    <span className="text-[12px] font-black uppercase tracking-widest text-white/80">Auth Required</span>
                    <button onClick={() => router.push("/auth")}
                        className="text-[12px] font-black text-[#e63030] underline underline-offset-4 uppercase tracking-widest">
                        Login
                    </button>
                </div>
            )}

            <Navbar />

            <div className="relative w-full overflow-hidden" style={{ height: "340px" }}>
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="Anime Battle Week"
                    fill
                    className="object-cover object-center opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#e63030]/20 via-black/50 to-black" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pt-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[0.3em] leading-none mb-3 drop-shadow-[0_0_40px_rgba(230,48,48,0.8)] text-center">
                        Verse <span className="text-[#e63030]">Battles</span>
                    </h1>
                    <div className="h-1.5 w-32 bg-[#e63030] mb-4 shadow-[0_0_30px_#e63030]" />
                    <p className="text-white/90 text-[11px] md:text-[13px] uppercase tracking-[0.6em] font-black drop-shadow-md text-center">March 2026 Tournament</p>
                </div>
            </div>

            <div className="relative z-10 pb-32 px-4 sm:px-6 w-full flex flex-col items-center">

                {/* ── Day Navigation ────────────────────────────────────────── */}
                <div className="w-full max-w-xl flex items-center justify-between gap-0 p-1.5 rounded-none bg-black border border-white/5 mb-12 overflow-x-auto no-scrollbar pt-28 md:pt-0">
                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <button
                            key={d}
                            onClick={() => setSelectedDay(d)}
                            className={`flex flex-col items-center gap-1 px-4 py-3 rounded-none transition-all flex-1 ${selectedDay === d
                                ? "bg-white text-black font-black"
                                : "hover:bg-white/5 text-white/30"
                                }`}
                        >
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Day</span>
                            <span className="text-xl font-black">{d}</span>
                            {currentTournamentDay === d && (
                                <div className={`w-1 h-1 rounded-none ${selectedDay === d ? "bg-black" : "bg-[#e63030]"}`} />
                            )}
                        </button>
                    ))}
                </div>

                <div className="w-full flex flex-col items-center">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-black uppercase tracking-[0.15em] mb-2">{DAY_CONFIG[selectedDay].label}</h2>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                                {DAY_CONFIG[selectedDay].sublabel}
                            </span>
                            {selectedDay === currentTournamentDay && (
                                <div className="mt-2 px-3 py-1 rounded-none bg-[#e63030]/10 border border-[#e63030]/40 text-[#e63030] text-[9px] font-black uppercase tracking-[0.25em]">
                                    Live matches
                                </div>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col gap-8 animate-pulse w-full max-w-md">
                            {[1, 2].map(i => <div key={i} className="h-72 rounded-none bg-white/5" />)}
                        </div>
                    ) : activeDayMatches.length === 0 ? (
                        <div className="mt-10 py-24 flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-1 bg-white/10 mb-2" />
                            <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em]">
                                Matches Pending
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10 w-full max-w-lg mx-auto">
                            {activeDayMatches.map((match, idx) => (
                                <div
                                    key={match.id}
                                    className="rounded-none p-8 flex flex-col gap-8 relative overflow-hidden"
                                    style={{
                                        background: "rgba(0,0,0,0.6)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        backdropFilter: "blur(40px)",
                                    }}
                                >
                                    <div className="flex items-center justify-between border-b border-white/5 pb-5">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
                                                Battle {idx + 1}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-black text-[#e63030] uppercase tracking-[0.3em]">
                                            {ROUND_LABELS[match.round]}
                                        </span>
                                    </div>

                                    <AnimeVsCard
                                        slotA={match.animeA}
                                        slotB={match.animeB}
                                        votesA={match.votesA}
                                        votesB={match.votesB}
                                        winner={match.winner}
                                        isLive={match.isLive && selectedDay === currentTournamentDay}
                                        matchId={match.id}
                                        onVote={handleVote}
                                        votedMatch={votedMatches[match.id]}
                                        isVoting={votingMatch === match.id}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {champion && (
                        <div className="mt-32 text-center">
                            <div className="relative inline-flex flex-col items-center gap-8 p-16 rounded-none"
                                style={{ background: "rgba(0,0,0,0.8)", border: "1px solid #e63030", backdropFilter: "blur(60px)" }}>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#e63030] text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.4em]">
                                    Champion
                                </div>
                                <div className="w-36 aspect-2/3 rounded-none overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(230,48,48,0.2)]">
                                    <img src={champion.image} alt={champion.title} className="w-full h-full object-cover transition-all duration-700 hover:scale-110" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-4xl font-black text-white tracking-[0.1em] uppercase">{champion.title}</h3>
                                    <span className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em]">Winter 2026 winner</span>
                                </div>
                                <button
                                    onClick={() => router.push("/trending")}
                                    className="mt-4 px-10 py-4 rounded-none text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all border border-white/20 hover:bg-white hover:text-black">
                                    Browse Records
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </main>
    );
}
