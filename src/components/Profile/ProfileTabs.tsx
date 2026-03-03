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
        <div className="flex items-center gap-12 overflow-x-auto pt-10 pb-0 mb-16 border-b border-white/[0.04] scrollbar-hide">
            {tabs.map((tab) => {
                const href = `/profile/${username}${tab.href}`;
                const isActive = activeTab === tab.id;

                return (
                    <Link
                        key={tab.id}
                        href={href}
                        className={`relative pb-5 text-[15px] font-semibold transition-all shrink-0 ${isActive
                            ? "text-white"
                            : "text-white/30 hover:text-white/60"
                            }`}
                    >
                        {tab.label}
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                                <div className="w-10 h-[3.5px] bg-[#e63030] rounded-t-full shadow-[0_0_15px_rgba(230,48,48,0.4)]" />
                            </div>
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
