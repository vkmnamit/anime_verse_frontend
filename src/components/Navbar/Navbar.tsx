"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAuth } from "@/src/context/AuthContext";
import { useSearch } from "@/src/context/SearchContext";

export default function Navbar({ noSpacer = false }: { noSpacer?: boolean }) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { searchQuery, setSearchQuery } = useSearch();
    const isLoggedIn = !!user;
    const [searchOpen, setSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchOpen]);

    const navLinks = [
        { href: "/", label: "Home", active: pathname === "/" },
        { href: "/community", label: "Community", active: pathname === "/community" },
        { href: "/battles", label: "Battles", active: pathname === "/battles" },
        { href: "/trending", label: "Trending", active: pathname === "/trending" },
        { href: "/discover", label: "Discover", active: pathname === "/discover" },
    ];

    const handleLogout = () => {
        setProfileOpen(false);
        logout();
    };

    return (
        <>
            {/* ===== Top Navbar ===== */}
            <nav className="fixed top-0 left-0 w-full h-16 z-[999] bg-black border-b border-white/[0.04]">
                <div className="w-full h-full flex items-center px-4 md:px-8 lg:px-12 gap-3 lg:gap-8">

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 text-white/60 hover:text-white transition-colors shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>

                    {/* Logo */}
                    <Link href="/" className="shrink-0 flex items-center gap-2">
                        <span className="text-[#e63030] font-black text-2xl tracking-tight">
                            ANIMEVERSE
                        </span>
                    </Link>

                    {/* Nav Links — desktop only */}
                    <ul className="hidden lg:flex items-center gap-6 shrink-0">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`text-[14px] font-medium transition-colors ${link.active
                                        ? "text-white font-semibold"
                                        : "text-white/70 hover:text-white/90"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Spacer */}
                    <div className="flex-1" />

                    {/* Right Side */}
                    <div className="flex items-center gap-2 lg:gap-4 shrink-0">

                        {/* Notifications */}
                        <button className="relative p-2 text-white/70 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                            </svg>
                        </button>

                        {/* Search — toggle style */}
                        <div ref={searchRef} className="relative flex items-center">
                            <div className={`flex items-center overflow-hidden transition-all duration-300 ${searchOpen ? "w-40 lg:w-52 bg-black/60 border border-white/10 rounded-sm" : "w-0"}`}>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Titles, people, genres"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`bg-transparent text-sm text-white placeholder:text-white/30 outline-none transition-all ${searchOpen ? "w-full px-3 py-1.5" : "w-0 px-0 py-0"}`}
                                />
                            </div>
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 text-white/70 hover:text-white transition-colors shrink-0"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                        </div>

                        {/* Sign Up — visible on mobile + desktop when logged out */}
                        {!isLoggedIn && (
                            <Link href="/auth" className="px-7 lg:px-10 py-2.5 text-[12px] lg:text-[15px] font-bold rounded-sm text-white bg-[#e63030] hover:bg-[#ff4545] transition-all whitespace-nowrap">
                                Sign up
                            </Link>
                        )}

                        {/* User Profile */}
                        <div className="relative" ref={dropdownRef}>
                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 transition-all duration-200 group"
                                    >
                                        <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#e63030]/50 transition-all">
                                            <Image
                                                src={user.avatar_url || "/default-avatar.png"}
                                                alt="Profile"
                                                width={36}
                                                height={36}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <svg className={`w-4 h-4 text-white/40 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* ===== Enhanced Profile Dropdown ===== */}
                                    {profileOpen && (
                                        <div
                                            className="absolute right-0 mt-3 w-72 rounded-2xl overflow-hidden z-[110] shadow-2xl shadow-black/60"
                                            style={{
                                                background: 'linear-gradient(180deg, rgba(30,28,35,0.97) 0%, rgba(18,16,22,0.98) 100%)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                backdropFilter: 'blur(20px)',
                                                animation: 'profileDropdownIn 0.25s ease-out'
                                            }}
                                        >
                                            {/* User Info Header */}
                                            <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
                                                <div className="flex items-start gap-3.5">
                                                    {/* Avatar */}
                                                    <div className="relative shrink-0">
                                                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 shadow-lg shadow-black/40">
                                                            <Image
                                                                src={user.avatar_url || "/default-avatar.png"}
                                                                alt={user.username}
                                                                width={56}
                                                                height={56}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        {/* Online indicator */}
                                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1e1c23]" />
                                                    </div>
                                                    {/* Name + Handle */}
                                                    <div className="flex-1 min-w-0 pt-0.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <h4 className="text-[15px] font-bold text-white truncate">{user.username}</h4>
                                                            <span className="text-yellow-400 text-sm">⭐</span>
                                                        </div>
                                                        <p className="text-xs text-white/40 mt-0.5 truncate">@{user.username}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2 px-2">
                                                <Link
                                                    href={`/profile/${user.username}`}
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                                                        <svg className="w-[18px] h-[18px] text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    </div>
                                                    Profile
                                                </Link>

                                                <Link
                                                    href={`/profile/${user.username}?tab=watchlist`}
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                                                        <svg className="w-[18px] h-[18px] text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                        </svg>
                                                    </div>
                                                    Watchlist
                                                </Link>

                                                <Link
                                                    href="/settings"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[13px] font-medium text-white/70 hover:text-white hover:bg-white/[0.06] transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                                                        <svg className="w-[18px] h-[18px] text-white/50 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                    Settings
                                                </Link>

                                                <div className="h-px bg-white/[0.06] mx-2 my-1.5" />

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[13px] font-medium text-white/50 hover:text-[#ff4545] hover:bg-[#ff4545]/[0.06] transition-all group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-[#ff4545]/10 transition-colors">
                                                        <svg className="w-[18px] h-[18px] text-white/40 group-hover:text-[#ff4545] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                                        </svg>
                                                    </div>
                                                    Log out
                                                </button>
                                            </div>

                                            {/* Footer — Gender Only */}
                                            <div className="px-5 py-3.5 border-t border-white/[0.06] flex items-center justify-end bg-white/[0.01]">
                                                <span className="text-[12px] font-semibold text-white/30">Male</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link href="/auth" className="flex items-center gap-2 text-white/50 hover:text-white text-[14px] font-bold transition-all">
                                    Sign In
                                </Link>
                            )}
                        </div>

                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Navigation — KissChat premium style */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[120] lg:hidden">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div
                        className="absolute left-0 top-0 bottom-0 w-[260px] flex flex-col overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-300"
                        style={{
                            background: "radial-gradient(circle at top left, rgba(230,48,48,0.18) 0%, transparent 45%), linear-gradient(180deg, #1a0000 0%, #0e0000 60%, #0a0000 100%)",
                            borderRight: "1px solid rgba(255,255,255,0.07)",
                        }}
                    >
                        {/* Header — Logo + Close */}
                        <div className="flex items-center justify-between px-5 pt-5 pb-4">
                            <span className="text-[#e63030] font-black text-xl tracking-tight">ANIMEVERSE</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-white/30 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* CTA Button */}
                        {!isLoggedIn && (
                            <div className="px-4 mb-5">
                                <Link
                                    href="/auth"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center py-3 rounded-full text-[14px] font-bold text-white transition-all active:scale-95"
                                    style={{
                                        background: "linear-gradient(90deg, #e63030, #ff5c5c)",
                                        boxShadow: "0 8px 24px rgba(230,48,48,0.35)",
                                    }}
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Nav Links */}
                        <div className="px-3 flex flex-col gap-0.5">
                            <p className="px-2 mb-2 text-[11px] font-semibold text-white/25 tracking-[0.08em] uppercase">Navigation</p>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all"
                                    style={link.active ? {
                                        background: "linear-gradient(90deg, rgba(230,48,48,0.28), rgba(230,48,48,0.06))",
                                        color: "#ff6b6b",
                                    } : { color: "rgba(255,255,255,0.55)" }}
                                >
                                    <span className="w-4 h-4 shrink-0" style={{ color: link.active ? "#ff6b6b" : "rgba(255,255,255,0.3)" }}>
                                        {link.href === "/" && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                                        {link.href === "/community" && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                                        {link.href === "/battles" && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                        {link.href === "/trending" && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                                        {link.href === "/discover" && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                                    </span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="mx-4 my-4 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

                        {/* Secondary links */}
                        <div className="px-3 flex flex-col gap-0.5">
                            <p className="px-2 mb-2 text-[11px] font-semibold text-white/25 tracking-[0.08em] uppercase">More</p>
                            {[
                                { href: "/settings", label: "Settings", icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                                { href: "/about", label: "About", icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all hover:bg-white/5"
                                    style={{ color: "rgba(255,255,255,0.45)" }}
                                >
                                    <span className="w-4 h-4 shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Bottom community card */}
                        <div className="px-4 pb-6 pt-2">
                            <div
                                className="rounded-2xl p-4 border"
                                style={{
                                    background: "rgba(230,48,48,0.09)",
                                    backdropFilter: "blur(12px)",
                                    borderColor: "rgba(255,255,255,0.07)",
                                }}
                            >
                                <p className="text-[12px] font-semibold text-white/60 mb-3 text-center">Join our community</p>
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    {/* Discord */}
                                    <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center text-white/35 hover:text-white transition-all"
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.04.032.05a19.9 19.9 0 005.993 3.03.08.08 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" /></svg>
                                    </a>
                                    {/* Reddit */}
                                    <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center text-white/35 hover:text-white transition-all"
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" /></svg>
                                    </a>
                                    {/* X */}
                                    <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center text-white/35 hover:text-white transition-all"
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)" }}>
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.907-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    </a>
                                </div>
                                <p className="text-[9px] text-white/15 text-center font-bold uppercase tracking-widest">AnimeVerse © 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Navbar Spacer — Ensures content starts below the fixed nav */}
            {!noSpacer && <div className="h-16 w-full" aria-hidden="true" />}
        </>
    );
}
