"use client";

export default function SubscriptionsPage() {
    return (
        <div className="max-w-3xl animate-in fade-in duration-500 space-y-12">
            <header className="space-y-4">
                <h2 className="text-xl font-black text-white tracking-widest uppercase">Subscription Matrix</h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent" />
            </header>

            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-white/[0.04] border border-white/[0.06] rounded-full flex items-center justify-center mx-auto text-4xl grayscale opacity-20">
                    💎
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-black text-white/80">Premium Access</h3>
                    <p className="text-white/30 text-sm font-medium">Coming soon: Enhancement packages for enhanced terminal output.</p>
                </div>
                <button className="px-8 py-3 bg-white/[0.04] text-white/20 text-[12px] font-black uppercase tracking-widest border border-white/[0.06] rounded-full cursor-not-allowed">
                    Initialize Transmission
                </button>
            </div>
        </div>
    );
}
