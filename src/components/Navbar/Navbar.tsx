"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAuth } from "@/src/context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const isLoggedIn = !!user;
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
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

    return (
        <nav className="fixed top-0 left-0 w-full h-16 z-[100] bg-[#0b0b0f]/95 backdrop-blur-xl border-b border-white/[0.04]">
            <div className="w-full max-w-[100vw] h-full flex items-center px-6 lg:px-[10%] gap-6 lg:gap-10">

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

                {/* Nav Links — text only, Netflix style */}
                <ul className="hidden lg:flex items-center gap-6">
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
                <div className="flex items-center gap-4 shrink-0">

                    {/* Search — toggle style */}
                    <div ref={searchRef} className="relative flex items-center">
                        <div className={`flex items-center overflow-hidden transition-all duration-300 ${searchOpen ? "w-52 bg-black/60 border border-white/10 rounded-sm" : "w-0"}`}>
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

                    {/* Notifications */}
                    <button className="relative p-2 text-white/70 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                        </svg>
                    </button>

                    {/* User Profile */}
                    <div className="relative" ref={dropdownRef}>
                        {isLoggedIn ? (
                            <>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 transition-all duration-200 group"
                                >
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-2 ring-white/10 group-hover:ring-white/30 transition-all">
                                        {user?.avatar_url ? (
                                            <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#e63030] flex items-center justify-center text-white font-bold text-xs">
                                                {user?.username?.[0].toUpperCase() || "U"}
                                            </div>
                                        )}
                                    </div>
                                    <svg className={`hidden lg:block w-3 h-3 text-white/40 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M19 9l-7 7-7-7" /></svg>
                                </button>

                                {profileOpen && (
                                    <div
                                        className="absolute right-2 top-[47px] w-[300px] border border-white/[0.08] shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200"
                                        style={{
                                            background: "rgba(22, 18, 16, 0.96)",
                                            backdropFilter: "blur(40px)",
                                            WebkitBackdropFilter: "blur(40px)",
                                        }}
                                    >
                                        <Link
                                            href={`/profile/${user?.username}`}
                                            onClick={() => setProfileOpen(false)}
                                            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors border-b border-white/[0.06]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-[#111] flex items-center justify-center text-white text-xl font-bold ring-1 ring-white/10 overflow-hidden">
                                                    {user?.avatar_url ? (
                                                        <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                                                    ) : (
                                                        user?.username?.[0].toUpperCase() || "U"
                                                    )}
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-white font-bold text-[18px]">{user?.username || "User"}</p>
                                                    <p className="text-white/40 text-[14px]">Go to profile</p>
                                                </div>
                                            </div>
                                            <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                                        </Link>

                                        <div className="py-2">
                                            <button onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors group text-white font-semibold text-[16px]">
                                                Account settings
                                            </button>
                                            <button
                                                onClick={() => { setProfileOpen(false); logout(); }}
                                                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors border-t border-white/[0.06] mt-2 group text-white font-semibold text-[17px]"
                                            >
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-6 mr-4">
                                <Link href="/auth" className="text-[15px] font-bold text-white hover:text-white/90 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/auth" className="inline-block px-6 py-2 text-[15px] font-bold rounded-[2px] text-white bg-[#e50914] hover:bg-[#f40612] transition-all">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-[60] bg-[#0b0b0f] animate-in fade-in duration-200">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between px-6 h-16 border-b border-white/5">
                            <span className="text-[#e63030] font-black text-xl tracking-tight">ANIMEVERSE</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/60">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <nav className="flex-1 px-6 py-8 overflow-y-auto">
                            <ul className="flex flex-col gap-1">
                                {navLinks.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`text-lg font-bold transition-colors ${link.active ? "text-white" : "text-white/40 hover:text-white"}`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </nav>
    );
}
