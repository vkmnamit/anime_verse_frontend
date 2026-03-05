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
        <nav className="flex items-center justify-center py-6 px-4">
            <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-full overflow-x-auto overflow-y-hidden scrollbar-hide max-w-full">
                {tabs.map((tab) => {
                    const href = `/profile/${username}${tab.href}`;
                    const isActive = activeTab === (tab.id === "profile" && pathname.endsWith(username) ? "profile" : tab.id);

                    return (
                        <Link
                            key={tab.id}
                            href={href}
                            className={`px-8 py-3 text-[14px] font-bold rounded-full transition-all shrink-0 tracking-tight ${isActive
                                    ? "bg-white text-black shadow-xl"
                                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                                }`}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
