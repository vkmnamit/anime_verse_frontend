"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { id: "profile", label: "Profile", href: "" },
    { id: "watchlist", label: "Watchlist", href: "/watchlist" },
    { id: "activities", label: "Activities", href: "/activities" },
    { id: "battles", label: "Battles", href: "/battles" },
    { id: "following", label: "Following", href: "/following" },
    { id: "followers", label: "Followers", href: "/followers" },
];

export default function ProfileTabs({ username }: { username: string }) {
    const pathname = usePathname();

    const getActiveTab = () => {
        if (pathname.endsWith(`/profile/${username}`)) return "profile";
        const parts = pathname.split("/");
        return parts[parts.length - 1];
    };

    const activeTab = getActiveTab();

    return (
        <div className="flex flex-col items-center gap-6 pt-12 pb-12 transition-all">
            <div className="flex items-center justify-center gap-10 overflow-x-auto scrollbar-hide w-full">
                {tabs.map((tab) => {
                    const href = `/profile/${username}${tab.href}`;
                    const isActive = activeTab === tab.id;

                    return (
                        <Link
                            key={tab.id}
                            href={href}
                            className={`relative py-2 text-[15px] font-bold transition-all shrink-0 tracking-tight ${isActive ? "text-[#e63030]" : "text-white/40 hover:text-white/80"
                                }`}
                        >
                            {tab.label}

                            {isActive && (
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#e63030] shadow-[0_0_15px_rgba(230,48,48,0.5)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
