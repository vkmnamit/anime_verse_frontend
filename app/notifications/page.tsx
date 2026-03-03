"use client";

import React, { useState } from "react";
import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import Link from "next/link";

const sidebarItems = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "appearance", label: "Appearance", icon: "✨" },
    { id: "connected", label: "Connected Apps", icon: "🔌" },
];

const tabs = ["All", "Mentions", "Debates", "Replies"];

const notifications = [
    {
        id: 1,
        user: { name: "animefan123", avatar: "https://avatar.iran.liara.run/public/boy?username=animefan123" },
        action: "committed on",
        target: "Sword Art Online",
        comment: "SAO's writing could've been so much better",
        time: "4 minutes ago",
        status: "Hot Debate",
        statusColor: "#e63030",
    },
    {
        id: 2,
        user: { name: "OtakuSensei123", avatar: "https://avatar.iran.liara.run/public/boy?username=OtakuSensei123" },
        action: "tagged animefan123 in a comment",
        target: "AOT is way better than Demon Slayer!",
        time: "32 minutes ago",
        status: "Most Reactions",
        statusColor: "#d4915a",
    },
    {
        id: 3,
        user: { name: "BestGirlTsunade23", avatar: "https://avatar.iran.liara.run/public/girl?username=BestGirlTsunade23" },
        action: "commented on your poll 'Best girl in Chainsaw Man?'",
        target: "Power all the way! 🤩🔥",
        time: "6 hours ago",
        status: "Poll Reactions",
        statusColor: "#f59e0b",
    },
    {
        id: 4,
        user: { name: "OtakuFanatic45", avatar: "https://avatar.iran.liara.run/public/boy?username=OtakuFanatic45" },
        action: "commented on Demon Slayer battle",
        target: "Demon Slayer totally has the better fight scenes",
        time: "4 days ago",
        status: "Battle Comment",
        statusColor: "#8b5cf6",
    },
    {
        id: 5,
        user: { name: "WeebFighter06", avatar: "https://avatar.iran.liara.run/public/boy?username=WeebFighter06" },
        action: "commented 'JJK Season 2 was definitely the best!'",
        target: "JJK is a masterpiece!",
        time: "2 days ago",
        status: "Masterpiece",
        statusColor: "#3b82f6",
    },
    {
        id: 6,
        user: { name: "TopTheoristKage", avatar: "https://avatar.iran.liara.run/public/boy?username=TopTheoristKage" },
        action: "reacted to anime tastes of all time",
        target: "Love this anime list!",
        time: "1 week ago",
        status: "Taste Battle",
        statusColor: "#10b981",
    },
];

export default function NotificationsPage() {
    const [activeSidebar, setActiveSidebar] = useState("notifications");
    const [activeTab, setActiveTab] = useState("All");

    return (
        <main className="min-h-screen bg-[#0b0b0f] relative overflow-x-hidden text-white font-sans">
            {/* Background — Fiery Nebula */}
            <div className="fixed inset-0 z-0 pointer-events-none select-none">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="bg"
                    fill
                    className="object-cover opacity-40 brightness-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0b0b0f]" />
            </div>

            <Navbar />

            <div className="relative z-10 pt-32 pb-20 px-6 lg:px-12 max-w-[1400px] mx-auto">
                {/* Heading Area */}
                <div className="mb-10 pl-2">
                    <h1 className="text-4xl font-black tracking-tight mb-2">Notifications</h1>
                    <p className="text-white/40 text-sm font-medium">Manage and view your notifications across the Verse</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Sidebar Layout */}
                    <div className="lg:col-span-3 flex flex-col gap-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveSidebar(item.id)}
                                className={`flex items-center gap-4 px-6 py-4 rounded-none transition-all text-left group ${activeSidebar === item.id
                                    ? "bg-white/[0.05] border-l-2 border-[#e63030] text-white"
                                    : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
                                    }`}
                            >
                                <span className={`text-xl transition-transform group-hover:scale-110 ${activeSidebar === item.id ? "opacity-100" : "opacity-40"}`}>
                                    {item.icon}
                                </span>
                                <span className="text-[13px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area — No curves (rounded-none) */}
                    <div className="lg:col-span-9 flex flex-col">
                        {/* Tab Headers */}
                        <div className="flex items-center justify-between mb-8 border-b border-white/[0.05]">
                            <div className="flex items-center gap-8">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`relative py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all ${activeTab === tab ? "text-[#e63030]" : "text-white/20 hover:text-white/40"}`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e63030]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-none text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white/60 transition-all">
                                    Recent <span className="opacity-40">▼</span>
                                </button>
                                <button className="text-[10px] font-black uppercase tracking-widest text-[#e63030] hover:text-[#ff4d4d] transition-all">
                                    ✓ Mark all as read
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="flex flex-col gap-6">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="group relative flex gap-6 p-6 bg-white/[0.01] border border-white/[0.03] rounded-none hover:bg-white/[0.03] transition-all duration-500 cursor-pointer"
                                >
                                    {/* Fiery Accent on Hover */}
                                    <div className="absolute inset-y-0 left-0 w-[2px] bg-[#e63030] scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />

                                    {/* Avatar */}
                                    <div className="w-14 h-14 rounded-none bg-white/[0.05] border border-white/[0.08] overflow-hidden shrink-0 shadow-2xl relative">
                                        <img src={notif.user.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={notif.user.name} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pt-1">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                <span className="text-[14px] font-black tracking-tight text-white hover:text-[#e63030] transition-colors">
                                                    {notif.user.name}
                                                </span>
                                                <span className="text-[13px] font-medium text-white/30 lowercase italic">
                                                    {notif.action}
                                                </span>
                                                <span className="text-[14px] font-black tracking-wide text-white/90">
                                                    {notif.target}
                                                </span>
                                                {notif.id === 1 && <span className="text-[14px]">😊</span>}
                                            </div>

                                            {notif.comment && (
                                                <div className="text-[13px] font-medium text-white/40 leading-relaxed max-w-[85%] border-l border-white/5 pl-4 py-1 italic">
                                                    - "{notif.comment}"
                                                </div>
                                            )}

                                            <div className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/15">
                                                {notif.time}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="shrink-0 flex items-center justify-end min-w-[150px]">
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.02] border border-white/[0.05] rounded-none group-hover:border-white/[0.12] transition-colors relative">
                                            {/* Status dot */}
                                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: notif.statusColor }} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                                                {notif.status}
                                            </span>
                                            {/* Sparkle effect on right */}
                                            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 text-white/20">✨</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-center gap-6 mt-16 pt-10 border-t border-white/[0.05]">
                            <button className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white/60 transition-all">Previous</button>
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 flex items-center justify-center bg-[#e63030] text-[11px] font-black cursor-default">1</span>
                                <span className="w-8 h-8 flex items-center justify-center bg-white/[0.02] border border-white/[0.05] text-[11px] font-black hover:bg-white/[0.05] cursor-pointer">2</span>
                            </div>
                            <button className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-[#e63030] transition-all">Next →</button>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="h-24 bg-[#0b0b0f]" />
        </main>
    );
}
