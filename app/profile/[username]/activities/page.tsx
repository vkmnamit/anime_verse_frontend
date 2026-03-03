"use client";

export default function ActivitiesPage() {
    return (
        <div className="flex flex-col items-center justify-center py-40 bg-white/[0.02] border border-white/[0.04] rounded-3xl animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6 shadow-xl">
                <span className="text-4xl">⚡</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">My Activities</h2>
            <p className="text-white/40 font-medium">Coming soon: Your latest interactions and updates from the Verse.</p>
        </div>
    );
}
