"use client";

export default function SubscriptionsPage() {
    return (
        <div className="max-w-4xl space-y-12 animate-in fade-in duration-500">

            {/* Subscription Info */}
            <section>
                <h2 className="text-[18px] font-bold text-white mb-2">Premium status</h2>

                <div className="flex flex-col py-5 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-white/90">Get Premium</span>
                            <span className="text-[13px] text-white/50">Unlock exclusive features and support the platform</span>
                        </div>
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <span className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-[14px] font-medium rounded-full transition-colors">
                                Subscribe
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between py-5 border-b border-white/10">
                    <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-white/90">Gift Premium</span>
                        <span className="text-[13px] text-white/50">Gift a subscription to another user</span>
                    </div>
                    <div className="flex items-center gap-4 cursor-pointer group">
                        <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </section>

        </div>
    );
}
