"use client";

import Link from "next/link";

const trending = [
    { id: 1, title: "Solo Leveling", discussions: "24.5k", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=100&h=100&fit=crop", rank: 1 },
    { id: 2, title: "Jujutsu Kaisen S2", discussions: "19.8k", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=100&h=100&fit=crop", rank: 2 },
    { id: 3, title: "Demon Slayer", discussions: "17.2k", image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=100&h=100&fit=crop", rank: 3 },
];

const livePolls = [
    {
        title: "Best MC of 2024?",
        votes: "3.7k",
        options: [
            { name: "Aizen (Bleach)", percentage: 41, color: "bg-red-500" },
            { name: "Gojo (JJK)", percentage: 59, color: "bg-blue-500" }
        ],
        avatar: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=60&h=60&fit=crop"
    }
];

export default function CommunityTrending() {
    return (
        <aside className="w-80 hidden lg:flex flex-col gap-8 sticky top-24 h-fit self-start pb-10">
            {/* What's Trending (Rectangular) */}
            <div className="bg-[#111118]/80 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-6 flex flex-col gap-6 shadow-2xl">
                <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3f3f4a]">What's Trending</h3>
                    <button className="text-white/20 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>
                    </button>
                </div>
                <div className="flex flex-col gap-5">
                    {trending.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-[14px] font-black italic text-[#e63030]/60 w-6">
                                #{item.rank}
                            </div>
                            <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/[0.08] shrink-0">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-white group-hover:text-[#e63030] truncate transition-colors">{item.title}</p>
                                <p className="text-[10px] text-orange-400 font-black mt-0.5">{item.discussions} discussions</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Polls (Rectangular) */}
            <div className="bg-[#111118]/80 backdrop-blur-2xl border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl">
                <div className="p-6 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#3f3f4a]">Live Polls</h3>
                    </div>

                    {livePolls.map((poll, idx) => (
                        <div key={idx} className="flex flex-col gap-4">
                            <p className="text-[14px] font-black text-white leading-tight">{poll.title}</p>
                            <div className="flex flex-col gap-2">
                                {poll.options.map((opt) => (
                                    <div key={opt.name} className="relative h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-hidden flex items-center justify-between px-4">
                                        <div className={`absolute left-0 top-0 bottom-0 ${opt.color}/10 z-0`} style={{ width: `${opt.percentage}%` }} />
                                        <span className="text-[11px] font-bold text-white relative z-10">{opt.name}</span>
                                        <span className="text-[11px] font-black text-white relative z-10">{opt.percentage}%</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full py-3 bg-[#e63030] hover:bg-[#ff3b3b] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg transition-all">
                                Vote Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
