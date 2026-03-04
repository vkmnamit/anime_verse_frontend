"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/src/components/Navbar/Navbar";

const menuItems = [
    { id: "account", label: "Account", href: "/settings/account" },
    { id: "profile", label: "Profile", href: "/settings/profile" },
    { id: "subscriptions", label: "Subscriptions", href: "/settings/subscriptions" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#0b0b0f] text-white selection:bg-white/20 selection:text-white">
            <Navbar />

            <main className="relative z-10 pt-24 w-full max-w-7xl mx-auto px-6 xl:px-12 min-h-screen">

                {/* Page title */}
                <header className="pt-8 pb-6 border-b border-white/6">
                    <h1 className="text-[28px] font-bold tracking-tight text-white">Settings</h1>
                </header>

                <div className="flex gap-0 pt-0">

                    {/* ── Left sidebar nav ──────────────────────────────── */}
                    <aside className="w-52 shrink-0 pt-8 pr-8 sticky top-24 self-start">
                        <nav className="flex flex-col gap-0.5">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${isActive
                                                ? "bg-white/[0.07] text-white"
                                                : "text-white/45 hover:text-white/75 hover:bg-white/3"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* ── Divider ───────────────────────────────────────── */}
                    <div className="w-px bg-white/6 shrink-0 self-stretch" />

                    {/* ── Content ───────────────────────────────────────── */}
                    <section className="flex-1 min-w-0 pt-8 pl-10 pb-24">
                        {children}
                    </section>

                </div>
            </main>
        </div>
    );
}
