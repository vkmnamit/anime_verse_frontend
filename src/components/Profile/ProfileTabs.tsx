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
        <div className="flex items-center gap-8 overflow-x-auto pt-6 pb-0 mb-8 border-b border-white/10 scrollbar-hide">
            {tabs.map((tab) => {
                const href = `/profile/${username}${tab.href}`;
                const isActive = activeTab === tab.id;

                return (
                    <Link
                        key={tab.id}
                        href={href}
                        className={`relative pb-3 text-[14px] font-medium transition-colors shrink-0 ${isActive ? "text-white" : "text-white/50 hover:text-white/80"
                            }`}
                    >
                        {tab.label}

                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-sm" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
}
