"use client";

export default function BattlesPage() {
    return (
        <div className="flex flex-col items-center justify-center py-40 bg-white/[0.02] border border-white/[0.04] rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(230,48,48,0.2)]">
                <span className="text-4xl">⚔️</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">My Battles</h2>
            <p className="text-white/40 font-medium">Coming soon: Track your debate wins and community impacts.</p>
        </div>
    );
}
