"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────
type NotifType = "follow" | "mention" | "battle" | "comment" | "reaction" | "system" | string;

interface Notification {
    id: string | number;
    type: NotifType;
    is_read: boolean;
    created_at: string;
    actor_username?: string;
    actor_avatar?: string;
    message?: string;
    reference_id?: string | number;
    reference_type?: string;
    meta?: Record<string, any>;
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d}d ago`;
    return `${Math.floor(d / 30)}mo ago`;
}

function notifMeta(n: Notification): { label: string; color: string; icon: string; text: string } {
    switch (n.type) {
        case "follow": return { label: "New Follower", color: "#3b82f6", icon: "👤", text: `${n.actor_username || "Someone"} started following you` };
        case "mention": return { label: "Mention", color: "#f59e0b", icon: "💬", text: n.message || `${n.actor_username} mentioned you` };
        case "battle": return { label: "Battle", color: "#8b5cf6", icon: "⚔️", text: n.message || `${n.actor_username} voted in a battle` };
        case "comment": return { label: "Comment", color: "#10b981", icon: "🗨️", text: n.message || `${n.actor_username} commented` };
        case "reaction": return { label: "Reaction", color: "#e63030", icon: "🔥", text: n.message || `${n.actor_username} reacted` };
        default: return { label: "Notification", color: "#6b7280", icon: "🔔", text: n.message || "You have a new notification" };
    }
}

const DEMO: Notification[] = [
    { id: 1, type: "follow", is_read: false, created_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(), actor_username: "animefan123", actor_avatar: "https://avatar.iran.liara.run/public/boy?username=animefan123" },
    { id: 2, type: "mention", is_read: false, created_at: new Date(Date.now() - 32 * 60 * 1000).toISOString(), actor_username: "OtakuSensei123", message: "OtakuSensei123 mentioned you in a debate on Attack on Titan", actor_avatar: "https://avatar.iran.liara.run/public/boy?username=OtakuSensei123" },
    { id: 3, type: "battle", is_read: true, created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), actor_username: "BestGirlTsunade23", message: "BestGirlTsunade23 voted against you in 'Best girl in Chainsaw Man?'", actor_avatar: "https://avatar.iran.liara.run/public/girl?username=BestGirlTsunade23" },
    { id: 4, type: "comment", is_read: true, created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), actor_username: "OtakuFanatic45", message: "OtakuFanatic45 replied to your Demon Slayer comment", actor_avatar: "https://avatar.iran.liara.run/public/boy?username=OtakuFanatic45" },
    { id: 5, type: "reaction", is_read: true, created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), actor_username: "WeebFighter06", message: "WeebFighter06 reacted 🔥 to your opinion on JJK S2", actor_avatar: "https://avatar.iran.liara.run/public/boy?username=WeebFighter06" },
    { id: 6, type: "follow", is_read: true, created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), actor_username: "TopTheoristKage", actor_avatar: "https://avatar.iran.liara.run/public/boy?username=TopTheoristKage" },
];

const TABS = ["All", "Follows", "Mentions", "Battles"] as const;
type Tab = typeof TABS[number];

export default function NotificationsPage() {
    const { user, token } = useAuth() as any;
    const [activeTab, setActiveTab] = useState<Tab>("All");
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [markingAll, setMarkingAll] = useState(false);

    const load = useCallback(async (p = 1) => {
        setLoading(true);
        try {
            if (token) {
                const res = await api.notifications.getAll(token, p, 15);
                if (res?.data) {
                    setNotifications(res.data);
                    setTotalPages(res.meta?.totalPages || 1);
                } else {
                    setNotifications(DEMO);
                }
            } else {
                setNotifications(DEMO);
            }
        } catch {
            setNotifications(DEMO);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { load(page); }, [load, page]);

    const markRead = async (id: string | number) => {
        if (!token) return;
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        try { await api.notifications.markRead(id, token); } catch { }
    };

    const markAllRead = async () => {
        if (!token) return;
        setMarkingAll(true);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        try { await api.notifications.markAllRead(token); } catch { }
        setMarkingAll(false);
    };

    const filtered = notifications.filter(n => {
        if (activeTab === "All") return true;
        if (activeTab === "Follows") return n.type === "follow";
        if (activeTab === "Mentions") return n.type === "mention" || n.type === "comment";
        if (activeTab === "Battles") return n.type === "battle";
        return true;
    });

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <main className="min-h-screen bg-[#0b0b0f] relative overflow-x-hidden text-white font-sans">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none select-none">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="bg" fill className="object-cover opacity-30 brightness-[0.4]" priority
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5), #0b0b0f)" }} />
            </div>

            <Navbar />

            <div className="relative z-10 pt-28 pb-20 px-4 sm:px-8 lg:px-16 max-w-[1100px] mx-auto">

                {/* Header */}
                <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Notifications</h1>
                        <p className="text-white/40 text-sm mt-1">
                            {unreadCount > 0
                                ? <span className="text-[#e63030] font-bold">{unreadCount} unread</span>
                                : "All caught up"
                            }
                            {" "}· Your activity across the Verse
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            disabled={markingAll}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[12px] font-bold uppercase tracking-widest text-white/50 hover:text-white hover:border-white/20 transition-all disabled:opacity-40"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 mb-6 border-b border-white/[0.07] overflow-x-auto pb-px">
                    {TABS.map(tab => {
                        const count = tab === "All" ? notifications.filter(n => !n.is_read).length
                            : tab === "Follows" ? notifications.filter(n => n.type === "follow" && !n.is_read).length
                                : tab === "Mentions" ? notifications.filter(n => (n.type === "mention" || n.type === "comment") && !n.is_read).length
                                    : notifications.filter(n => n.type === "battle" && !n.is_read).length;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative flex items-center gap-2 px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] transition-all shrink-0 ${activeTab === tab ? "text-white" : "text-white/25 hover:text-white/50"}`}
                            >
                                {tab}
                                {count > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#e63030] text-white">
                                        {count}
                                    </span>
                                )}
                                {activeTab === tab && (
                                    <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#e63030] rounded-t-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-20 rounded-2xl bg-white/[0.03] animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="text-5xl mb-4">🔕</div>
                        <p className="text-white/30 font-bold text-lg">
                            No {activeTab !== "All" ? activeTab.toLowerCase() : ""} notifications yet
                        </p>
                        <p className="text-white/20 text-sm mt-1">
                            Engage with the Verse to start seeing activity here
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {filtered.map(notif => {
                            const meta = notifMeta(notif);
                            return (
                                <div
                                    key={notif.id}
                                    onClick={() => !notif.is_read && markRead(notif.id)}
                                    className={`group relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${!notif.is_read
                                        ? "bg-white/[0.04] border-white/10 hover:bg-white/[0.07]"
                                        : "bg-white/[0.01] border-white/[0.04] hover:bg-white/[0.03]"
                                        }`}
                                >
                                    {/* Unread dot */}
                                    {!notif.is_read && (
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#e63030] shrink-0" />
                                    )}

                                    {/* Avatar */}
                                    <div className="relative shrink-0 ml-2">
                                        {notif.actor_avatar ? (
                                            <img
                                                src={notif.actor_avatar}
                                                alt={notif.actor_username || "user"}
                                                className="w-11 h-11 rounded-full object-cover border-2 border-white/10"
                                            />
                                        ) : (
                                            <div className="w-11 h-11 rounded-full bg-white/[0.06] border-2 border-white/10 flex items-center justify-center text-xl">
                                                {meta.icon}
                                            </div>
                                        )}
                                        <div
                                            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border-2 border-[#0b0b0f]"
                                            style={{ background: meta.color }}
                                        >
                                            {meta.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <p className={`text-[13px] sm:text-[14px] leading-snug ${!notif.is_read ? "text-white font-semibold" : "text-white/60 font-medium"}`}>
                                            {meta.text}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-white/20">
                                                {timeAgo(notif.created_at)}
                                            </span>
                                            <span
                                                className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                                                style={{ background: meta.color + "22", color: meta.color }}
                                            >
                                                {meta.label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Read indicator */}
                                    {notif.is_read ? (
                                        <svg className="w-4 h-4 text-white/10 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    ) : (
                                        <div className="w-4 h-4 shrink-0 mt-1 rounded-full border border-white/20 group-hover:border-[#e63030] transition-colors" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-12">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 disabled:opacity-20 transition-all"
                        >
                            ← Prev
                        </button>
                        {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                className={`w-9 h-9 rounded-xl text-[12px] font-black transition-all ${page === i + 1 ? "bg-[#e63030] text-white" : "bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white"}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 disabled:opacity-20 transition-all"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            <footer className="h-20 bg-[#0b0b0f]" />
        </main>
    );
}
