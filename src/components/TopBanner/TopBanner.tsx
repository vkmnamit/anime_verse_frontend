"use client";

import React, { useState, useEffect } from "react";

export default function TopBanner() {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const tomorrow = new Date();
            tomorrow.setHours(24, 0, 0, 0);
            const diff = tomorrow.getTime() - now.getTime();

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-white text-black py-2.5 px-6 flex items-center justify-between z-[110] relative">
            <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-[#e63030] rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
                    <span className="text-white text-[10px] font-black">!</span>
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-black">
                    Join the ultimate anime community & unlock exclusive rewards
                </p>
            </div>

            <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-3">
                    <span className="text-[9px] font-black text-black/40 uppercase tracking-[0.2em]">Offer Ends In</span>
                    <div className="flex items-center gap-1.5">
                        <span className="w-8 py-1 bg-black/5 rounded text-center font-mono text-[11px] font-black">{timeLeft.split(' ')[0]}</span>
                        <span className="w-8 py-1 bg-black/5 rounded text-center font-mono text-[11px] font-black">{timeLeft.split(' ')[1]}</span>
                        <span className="w-8 py-1 bg-black/5 rounded text-center font-mono text-[11px] font-black">{timeLeft.split(' ')[2]}</span>
                    </div>
                </div>
                <button className="bg-[#e63030] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#ff4a4a] transition-all shadow-lg shadow-red-900/20 active:scale-95">
                    Claim Now
                </button>
            </div>
        </div>
    );
}
