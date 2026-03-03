"use client";

import Image from "next/image";

const notifications = [
    {
        user: "animefan123",
        avatar: "/default-avatar.png",
        action: "committed on",
        target: "Sword Art Online",
        extra: "to 😊",
        content: "- SAO's writing could've been so much better",
        time: "4 minutes ago",
        type: "Hot Debate",
        typeIcon: "🔥"
    },
    {
        user: "OtakuSensei123",
        avatar: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=100",
        action: "tagged",
        target: "animefan123",
        extra: "two comment",
        content: "AOT is way better than Demon Slayer!",
        time: "3 minutes ago",
        type: "Most Reactions",
        typeIcon: "⭐"
    },
    {
        user: "BestGirlTsunade23",
        avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
        action: "commented on your 'poll's best girl in Chainsaw Man?'",
        target: "",
        extra: "Power all the way! 🤩 🤙",
        content: "",
        time: "6 hours ago",
        type: "Poll Reactions",
        typeIcon: "🍿"
    },
    {
        user: "OtakuFanatic45",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
        action: "commented to",
        target: "Demon Slayer battle",
        extra: "",
        content: "- Demon Slayer totally has the better fight scenes",
        time: "4 days ago",
        type: "Battle Comment",
        typeIcon: "📜"
    },
    {
        user: "WeebFighter06",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
        action: "commented '🦄 JJK Season 2 was definitely the best!",
        target: "",
        extra: "⭐ JJK Masterpiece confirmed!",
        content: "",
        time: "2 days ago",
        type: "Masterpiece",
        typeIcon: "🎖️"
    }
];

export default function NotificationsPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black italic text-white tracking-tight mb-2 uppercase">Notifications</h1>
                    <p className="text-white/40 text-sm">Manage and view your notifications</p>
                </div>
                <button className="px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[11px] font-bold text-white/50 hover:text-white hover:bg-white/[0.06] transition-all flex items-center gap-2 group">
                    <span className="opacity-40 group-hover:opacity-100 italic">🖇️</span> Mark all as read
                </button>
            </header>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-white/[0.06] mb-8 pb-px">
                {["All", "Mentions", "Debates", "Replies"].map((tab, i) => (
                    <button key={tab} className={`pb-4 px-1 text-[13px] font-bold transition-all relative ${i === 0 ? "text-[#e63030]" : "text-white/30 hover:text-white/60"}`}>
                        {tab}
                        {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e63030] shadow-[0_0_8px_rgba(230,48,48,0.4)]" />}
                    </button>
                ))}
                <div className="ml-auto pb-4">
                    <button className="flex items-center gap-2 text-[12px] font-bold text-white/40 hover:text-white transition-colors bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                        Recent <span className="text-[8px] opacity-40">▼</span>
                    </button>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.map((notif, idx) => (
                    <div key={idx} className="group p-5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-white/[0.1] rounded-2xl transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                                <Image src={notif.avatar} alt={notif.user} width={48} height={48} className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] leading-relaxed">
                                    <span className="font-bold text-white opacity-80 group-hover:opacity-100 transition-opacity">{notif.user}</span>
                                    <span className="text-white/40 mx-1.5">{notif.action}</span>
                                    <span className="font-bold text-white/80 group-hover:text-amber-500 transition-colors">{notif.target}</span>
                                    <span className="text-white/40 mx-1.5">{notif.extra}</span>
                                </p>
                                {notif.content && (
                                    <p className="mt-2 text-[13px] text-white/50 italic font-medium leading-relaxed bg-black/20 p-2.5 rounded-xl border border-white/[0.03]">
                                        {notif.content}
                                    </p>
                                )}
                                <p className="mt-1.5 text-[10px] font-bold text-white/20 uppercase tracking-wider">{notif.time}</p>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                                <span className="text-[10px] font-black text-white px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-white/[0.08] shadow-lg group-hover:scale-105 transition-transform flex items-center gap-2">
                                    <span className="text-xs">{notif.typeIcon}</span> {notif.type}
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#e63030] transition-colors" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination footer matching screenshot */}
            <div className="mt-10 pt-4 border-t border-white/[0.04] flex items-center gap-2">
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#e63030]/20 text-[#e63030] font-bold text-xs border border-[#e63030]/30 shadow-inner">1</span>
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.02] text-white/30 font-bold text-xs border border-white/[0.04] hover:bg-white/[0.05] cursor-pointer transition-all">2</span>
                <span className="text-[10px] font-black text-white/40 ml-2 cursor-pointer hover:text-white transition-colors uppercase italic tracking-widest">Next ›</span>
            </div>
        </div>
    );
}
