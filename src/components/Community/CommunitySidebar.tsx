"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";
import CreateCommunityModal from "./CreateCommunityModal";

export default function CommunitySidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { token } = useAuth();
    const [communities, setCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateCommunity, setShowCreateCommunity] = useState(false);

    const requireAuth = (e: React.MouseEvent<HTMLElement>) => {
        if (!token) {
            e.preventDefault();
            router.push('/auth');
        }
    };

    const openCreateCommunity = (e: React.MouseEvent<HTMLElement>) => {
        if (!token) {
            e.preventDefault();
            router.push('/auth');
            return;
        }
        setShowCreateCommunity(true);
    };

    const fetchCommunities = () => {
        api.community.list()
            .then(res => {
                const data = Array.isArray(res) ? res : (res.data || []);
                setCommunities(data);
            })
            .catch(err => console.error("Failed to fetch communities", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchCommunities();
    }, []);

    const navLinks = [
        {
            href: "/community", label: "Home", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            )
        },
        {
            href: "/community/popular", label: "Popular", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.5-7 3 10 0 6 0 6s-2.5-3-2.5-6c0 0 1 2 4 4a8.003 8.003 0 016.157 11.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14l2.121 2.121z" /></svg>
            )
        },
        {
            href: "/community/trending", label: "Trending", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            )
        },
        {
            href: "/community/discover", label: "Discover", icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" /></svg>
            )
        },
    ];

    return (
        <>
            {/* ── Reddit-spec sidebar: 270px, 16px h-padding, 40px item height ── */}
            <aside className="w-full h-[calc(100vh-64px)] bg-transparent text-white/80 flex flex-col pt-4 pb-6 overflow-y-auto no-scrollbar font-sans">

                {/* ── Feeds Section ── */}
                <div className="flex flex-col mb-6">
                    {/* Section label: 12px / 600 / 0.5px tracking */}
                    <p className="px-4 mb-2 text-[12px] font-semibold text-white/30 tracking-[0.05em] uppercase">Feeds</p>

                    {navLinks.map((link) => (
                        <div key={link.label} className="px-2">
                            <Link
                                href={link.href}
                                className={`h-10 px-3 text-[14px] transition-all flex items-center gap-3 group rounded-[20px] ${pathname === link.href
                                    ? "text-white bg-white/8 font-semibold"
                                    : "text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {/* Icon: 20px */}
                                <span className={`w-5 h-5 shrink-0 transition-colors duration-200 ${pathname === link.href ? "text-[#e63030]" : "text-white/40 group-hover:text-white/70"}`}>
                                    {link.icon}
                                </span>
                                <span className="leading-5 font-medium">{link.label}</span>
                            </Link>
                        </div>
                    ))}

                    {/* Start a community */}
                    <div className="px-2 mt-0.5">
                        <button
                            onClick={openCreateCommunity}
                            className="w-full h-10 px-3 text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group rounded-[20px] text-left"
                        >
                            <span className="w-5 h-5 shrink-0 text-white/40 group-hover:text-[#e63030] transition-colors duration-200">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </span>
                            <span className="leading-5 font-medium">Start a community</span>
                        </button>
                    </div>
                </div>

                {/* Divider: 1px */}
                <div className="mx-4 h-px bg-white/8 mb-6" />

                {/* ── Communities Section ── */}
                <div className="flex flex-col">
                    <p className="px-4 mb-2 text-[12px] font-semibold text-white/30 tracking-[0.05em] uppercase">Communities</p>

                    {loading ? (
                        <div className="px-4 space-y-3 pt-1">
                            <div className="h-4 w-3/4 bg-white/6 animate-pulse rounded-md" />
                            <div className="h-4 w-1/2 bg-white/6 animate-pulse rounded-md" />
                            <div className="h-4 w-2/3 bg-white/6 animate-pulse rounded-md" />
                        </div>
                    ) : communities.length === 0 ? (
                        <p className="px-4 py-2 text-[13px] text-white/30 italic">No communities yet</p>
                    ) : (
                        communities.map((comm) => (
                            <div key={comm.id} className="px-2">
                                <Link
                                    href={`/community/${comm.slug?.replace('r/', '') || comm.id}`}
                                    className="h-10 px-3 text-[14px] text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-3 group rounded-[20px]"
                                >
                                    {/* Community avatar: 20px */}
                                    <div className="w-5 h-5 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/50 shrink-0 group-hover:bg-[#e63030] group-hover:text-white group-hover:border-[#e63030] transition-all">
                                        {comm.name?.[0]?.toUpperCase() || "C"}
                                    </div>
                                    <span className="truncate leading-5 font-medium">{comm.name || comm.community_name}</span>
                                </Link>
                            </div>
                        ))
                    )}
                </div>

                {/* Bottom Meta */}
                <div className="mt-auto px-4 pt-6 border-t border-white/4">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
                        <Link href="/about" className="text-[11px] text-white/25 hover:text-white/60 transition-colors">About</Link>
                        <Link href="/privacy" className="text-[11px] text-white/25 hover:text-white/60 transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-[11px] text-white/25 hover:text-white/60 transition-colors">Terms</Link>
                        <Link href="/contact" className="text-[11px] text-white/25 hover:text-white/60 transition-colors">Contact</Link>
                    </div>
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">AnimeVerse © 2026</p>
                </div>
            </aside>

            {/* Create Community Modal */}
            <CreateCommunityModal
                isOpen={showCreateCommunity}
                onClose={() => setShowCreateCommunity(false)}
                onCommunityCreated={fetchCommunities}
            />
        </>
    );
}