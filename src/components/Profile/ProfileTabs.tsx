"use client";

import { useState } from "react";

const tabs = [
    { id: "profile", label: "Profile" },
    { id: "watchlist", label: "Watchlist" },
    { id: "activities", label: "Activities" },
    { id: "battles", label: "Battles" },
    { id: "following", label: "Following" },
    { id: "followers", label: "Followers" },
];

export default function ProfileTabs() {
    const [activeTab, setActiveTab] = useState("profile");

    return (
        <div className="flex items-center gap-1 overflow-x-auto pb-4 mb-8 border-b border-white/[0.06] scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all relative shrink-0 ${activeTab === tab.id
                            ? "text-white bg-white/[0.05]"
                            : "text-[#6b6b78] hover:text-white hover:bg-white/[0.02]"
                        }`}
                >
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#e63030] rounded-full" />
                    )}
                </button>
            ))}
        </div>
    );
}
