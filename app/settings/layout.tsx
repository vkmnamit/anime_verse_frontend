"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/src/components/Navbar/Navbar";

const menuItems = [
    { id: "profile", label: "Settings", href: "/settings/profile" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-bg-main text-white selection:bg-white/20 selection:text-white">
            <Navbar />

            <main className="relative z-10 pt-20 w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-10 xl:px-16 min-h-screen">

                {/* Page title */}
                <header className="pt-8 sm:pt-10 pb-5 sm:pb-7 border-b border-white/6">
                    <h1 className="text-[26px] sm:text-[34px] font-bold tracking-tight text-white">Settings</h1>
                </header>

                <div className="flex flex-col md:flex-row gap-0 pt-0">

                    {/* ── Sidebar nav — horizontal scroll on mobile, vertical on md+ ── */}
                    <aside className="md:w-52 md:shrink-0 md:pt-10 md:pr-8 md:sticky md:top-24 md:self-start">
                        {/* Mobile: horizontal scrolling pill nav */}
                        <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar pt-4 pb-2 md:pt-0 md:pb-0 md:gap-2">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center whitespace-nowrap px-4 py-3 md:py-3.5 rounded-xl text-[15px] md:text-[16px] font-medium transition-all shrink-0 ${isActive
                                            ? "bg-white/8 text-white"
                                            : "text-white/40 hover:text-white/70 hover:bg-white/4"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* ── Divider — hidden on mobile, vertical on md+ ── */}
                    <div className="hidden md:block w-px bg-white/6 shrink-0 self-stretch" />
                    {/* Mobile divider */}
                    <div className="md:hidden h-px bg-white/6 w-full mb-2" />

                    {/* ── Content ─────────────────────────────────────── */}
                    <section className="flex-1 min-w-0 pt-6 md:pt-10 md:pl-10 xl:pl-16 pb-20 sm:pb-28">
                        {children}
                    </section>

                </div>
            </main>
        </div>
    );
}
