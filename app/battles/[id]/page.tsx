import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/src/components/Navbar/Navbar";
import { api } from "@/src/lib/api";
import { useParams } from "next/navigation";

const BattleCard = ({ side, anime, onVote, voted }: { side: "left" | "right", anime: any, onVote: (side: "A" | "B") => void, voted: boolean }) => {
    return (
        <div className="relative flex-1">
            {/* Main Card Background with Glassmorphism */}
            <div className={`relative overflow-hidden rounded-[24px] bg-[#111118]/40 backdrop-blur-3xl border border-white/10 shadow-2xl transition-all duration-500 overflow-hidden`}>

                {/* Image Section */}
                <div className="relative h-[400px] w-full">
                    <Image
                        src={anime.image}
                        alt={anime.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent opacity-90" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                        <div className="flex flex-col gap-4">
                            {anime.leads && (
                                <div className="w-fit bg-red-600 px-4 py-1.5 rounded-md flex items-center gap-2 shadow-xl">
                                    <span className="text-xs">🔥</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Leads by {anime.votes} Votes</span>
                                </div>
                            )}
                            <h2 className="text-4xl font-black text-white italic tracking-tighter leading-tight drop-shadow-2xl">
                                {anime.title}
                            </h2>
                            <div className="flex gap-2">
                                {anime.tags.map((tag: string) => (
                                    <div key={tag} className="flex items-center gap-2 px-3 py-1 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
                                        {tag === 'Iconic' ? <span className="text-orange-500 text-xs">🔥</span> : <span className="text-emerald-500 text-xs">✓</span>}
                                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vote Info Section */}
                <div className="p-8 pt-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <span className="text-white/20 text-[11px] font-black uppercase tracking-[0.2em]">Vote for Vicels!</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-6xl font-black italic text-white tracking-tighter">{anime.percentage}%</span>
                        </div>
                    </div>

                    {/* Progress Bar Group */}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 h-14 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden group cursor-pointer" onClick={() => onVote(side === 'left' ? 'A' : 'B')}>
                            <div
                                className={`absolute top-0 bottom-0 ${side === 'left' ? 'right-0' : 'left-0'} ${side === 'left' ? 'bg-[#e63030]' : 'bg-[#3b82f6]'} transition-all duration-1000 shadow-[0_0_30px_rgba(230,48,48,0.3)]`}
                                style={{ width: `${anime.percentage}%` }}
                            />
                            <div className="relative z-10 flex items-center justify-between h-full px-6">
                                <span className="text-[12px] font-black text-white uppercase tracking-widest group-hover:scale-105 transition-transform">
                                    {voted ? 'Voted' : (side === 'left' ? 'Vote Left' : 'Vote Right')}
                                </span>
                                <span className="text-white font-black text-sm italic">{anime.votes} Votes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function BattlePage() {
    const params = useParams();
    const [battle, setBattle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [votedSide, setVotedSide] = useState<"A" | "B" | null>(null);

    useEffect(() => {
        const fetchBattle = async () => {
            try {
                const res = await api.battles.details(params.id as string);
                // Transform API data to match UI needs if necessary
                setBattle(res.data || {
                    id: "aot-vs-ds",
                    animeA: {
                        title: "Attack on Titan",
                        image: "https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png",
                        votes: "2.3k",
                        percentage: 64,
                        tags: ["Dark & Intense", "Iconic"],
                        leads: true
                    },
                    animeB: {
                        title: "Demon Slayer: Kimetsu no Yaiba",
                        image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1200",
                        votes: "2.8k",
                        percentage: 36,
                        tags: ["Shounen", "Adventure", "Beautiful"],
                    },
                    opinionHighlights: [
                        { side: "left", author: "Supporters Say", content: "AOT just has a grittier, more intense story. It's hard to top that feeling of dread when against the Titans!", comments: 324 },
                        { side: "right", author: "Supporters Say", content: "By far the better animation and more lovable characters. Demon Slayer is a visual masterpiece.", comments: 532 }
                    ]
                });
            } catch (err) {
                console.error("Failed to fetch battle:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBattle();
    }, [params.id]);

    const handleVote = async (side: "A" | "B") => {
        setVotedSide(side);
        // api.battles.vote(battle.id, side, token)
    };

    if (loading || !battle) {
        return <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center text-white font-black uppercase tracking-[0.3em]">Loading Battle...</div>;
    }

    return (
        <main className="min-h-screen bg-[#0b0b0f] relative overflow-hidden">
            {/* Cinematic Background — Enhanced Fire/Nebula */}
            <div className="fixed inset-0 z-0 select-none pointer-events-none">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="Trending Background"
                    fill
                    className="object-cover opacity-80"
                    sizes="100vw"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(230,48,48,0.15),transparent_60%)]" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>

            <Navbar />

            <div className="relative z-10 pt-40 pb-24 px-4 md:px-12 lg:px-24">
                <div className="max-w-[1600px] mx-auto">

                    {/* Page Header */}
                    <div className="text-center mb-24">
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-4 italic">
                            Comparison Battle
                        </h1>
                        <p className="text-white/40 font-black uppercase tracking-[0.4em] text-[14px]">
                            Which anime is better?
                        </p>
                    </div>

                    {/* Battle Layout */}
                    <div className="relative flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-32">
                        <BattleCard side="left" anime={battle.animeA} onVote={handleVote} voted={votedSide === 'A'} />

                        {/* VS Divider - Enhanced Glory */}
                        <div className="relative shrink-0 z-20">
                            <div className="absolute inset-[-60px] bg-blue-500/20 blur-[80px] rounded-full animate-pulse" />
                            <div className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center bg-[#0b0b0f] shadow-[0_0_50px_rgba(59,130,246,0.3)] relative group">
                                <span className="text-3xl font-black italic text-white group-hover:scale-125 transition-transform">VS</span>
                                {/* Electric Rings */}
                                <div className="absolute inset-[-6px] border border-blue-500/30 rounded-full animate-ping" />
                                <div className="absolute inset-[-12px] border border-blue-500/10 rounded-full" />
                            </div>
                        </div>

                        <BattleCard side="right" anime={battle.animeB} onVote={handleVote} voted={votedSide === 'B'} />
                    </div>

                    {/* Opinion Highlights Section */}
                    <section className="mt-32">
                        <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5">
                            <div className="flex items-center gap-16">
                                <h3 className="text-2xl font-black text-white italic tracking-tighter">Opinion Highlights</h3>
                                <div className="hidden md:flex items-center gap-10">
                                    {['Stats', 'Gonts', 'Polls', 'Characters'].map(tab => (
                                        <button key={tab} className="text-[11px] font-black text-white/30 hover:text-white uppercase tracking-[0.3em] transition-colors">{tab}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em]">Hot Takes</span>
                                <div className="flex gap-3">
                                    {[764, 974, 991, 783].map(n => (
                                        <span key={n} className="px-4 py-1.5 bg-white/5 rounded-md text-[11px] font-black text-white/60 border border-white/5">{n}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {battle.opinionHighlights.map((highlight: any, i: number) => (
                                <div key={i} className="bg-[#111118]/40 backdrop-blur-3xl border border-white/10 rounded-[32px] p-12 relative overflow-hidden group hover:bg-[#111118]/60 transition-all border shadow-2xl">
                                    <div className="flex justify-between items-start mb-8">
                                        <h4 className="text-[13px] font-black uppercase tracking-[0.3em] text-white">Supporters Say</h4>
                                        <div className="flex items-center gap-3 text-white/40">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                            <span className="text-sm font-black">{highlight.comments}</span>
                                        </div>
                                    </div>
                                    <p className="text-xl text-white/80 leading-relaxed font-medium">
                                        "{highlight.content}"
                                    </p>
                                    <div className={`absolute top-0 bottom-0 ${highlight.side === 'left' ? 'left-0' : 'right-0'} w-[4px] ${highlight.side === 'left' ? 'bg-[#e63030]' : 'bg-[#3b82f6]'} opacity-60 shadow-[0_0_20px_rgba(230,48,48,0.5)]`} />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
