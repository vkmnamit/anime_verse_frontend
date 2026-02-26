"use client";

import React from "react";
import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function BattlesListingPage() {
    // Mock list of battles
    const activeBattles = [
        {
            id: "aot-vs-ds",
            animeA: { title: "Attack on Titan", image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=600&h=400&fit=crop" },
            animeB: { title: "Demon Slayer", image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=600&h=400&fit=crop" },
            category: "Action / Shounen",
            status: "Hot",
            totalVotes: "4.1k"
        }
    ];

    return (
        <main className="min-h-screen bg-[#0b0b0f] relative overflow-hidden">
            <Navbar />

            <div className="relative z-10 pt-40 pb-24 px-4 md:px-12 lg:px-24">
                <div className="max-w-[1400px] mx-auto">
                    <header className="mb-16">
                        <h1 className="text-6xl font-black text-white italic tracking-tighter mb-4">
                            Active <span className="text-[#e63030]">Battles</span>
                        </h1>
                        <p className="text-white/40 text-lg font-medium">Decide the ultimate champion of the season.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {activeBattles.map(battle => (
                            <Link
                                href={`/battles/${battle.id}`}
                                key={battle.id}
                                className="group relative bg-white/[0.03] border border-white/10 rounded-[40px] overflow-hidden hover:border-[#e63030]/40 hover:bg-white/[0.05] transition-all duration-500 shadow-2xl"
                            >
                                <div className="flex h-[280px]">
                                    <div className="relative flex-1">
                                        <Image src={battle.animeA.image} alt={battle.animeA.title} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                                    </div>
                                    <div className="relative flex-1">
                                        <Image src={battle.animeB.image} alt={battle.animeB.title} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-l from-black/80 to-transparent" />
                                    </div>

                                    {/* VS Badge */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-black rounded-full border border-white/10 flex items-center justify-center z-10 shadow-2xl">
                                        <span className="text-xs font-black italic text-white">VS</span>
                                    </div>
                                </div>

                                <div className="p-10 flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2.5 py-1 bg-red-600/20 text-[#e63030] text-[9px] font-black uppercase tracking-widest rounded-md border border-red-600/20">
                                                {battle.status}
                                            </span>
                                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{battle.category}</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white tracking-tight">
                                            {battle.animeA.title} <span className="text-white/20 font-light mx-2">vs</span> {battle.animeB.title}
                                        </h3>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-white font-black text-xl italic">{battle.totalVotes}</span>
                                        <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">Votes Cast</span>
                                    </div>
                                </div>

                                <div className="absolute inset-0 border-2 border-[#e63030] opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none rounded-[40px]" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
