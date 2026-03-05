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
        <nav className="flex items-center justify-center w-full py-4 px-4 overflow-hidden">
            <div className="flex items-center gap-10 sm:gap-20 px-4 sm:px-12 overflow-x-auto scrollbar-hide max-w-full">
                {tabs.map((tab) => {
                    const href = `/profile/${username}${tab.href}`;
                    const isActive = activeTab === (tab.id === "profile" && (pathname.endsWith(username) || pathname.endsWith(username + "/")) ? "profile" : tab.id);

                    return (
                        <Link
                            key={tab.id}
                            href={href}
                            className={`relative py-4 text-[13px] font-black uppercase tracking-[0.22em] transition-all shrink-0 ${isActive
                                    ? "text-white scale-110"
                                    : "text-white/20 hover:text-white/50"
                                }`}
                        >
                            {tab.label}
                            {isActive && (
                                <div className="absolute -bottom-[1px] left-0 right-0 h-[2.5px] bg-[#e63030] shadow-[0_0_15px_rgba(230,48,48,0.8)] rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
