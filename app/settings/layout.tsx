"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/src/components/Navbar/Navbar";

const menuItems = [
    { id: "profile", label: "Profile Settings", href: "/settings/profile" },
    { id: "account", label: "Account Settings", href: "/settings/account" },
    { id: "subscriptions", label: "Subscriptions", href: "/settings/subscriptions" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-[#0b0b0f] text-white selection:bg-[#e63030]/30 selection:text-white">
            <Navbar />

            <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 lg:px-20 max-w-[1400px] mx-auto min-h-screen">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
                </header>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-56 shrink-0 relative">
                        {/* Red Accent vertical line on the very left (optional, based on image edge) */}
                        <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-[#e63030]/10" />

                        <nav className="flex flex-col gap-4">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 text-[14px] font-bold tracking-wide transition-all duration-300 ${isActive
                                            ? "bg-white/[0.08] text-white rounded-xl"
                                            : "text-white/40 hover:text-white/70"
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Vertical Divider */}
                    <div className="hidden lg:block w-[1px] bg-white/[0.05]" />

                    {/* Content */}
                    <section className="flex-1 min-w-0">
                        {children}
                    </section>
                </div>
            </main>
        </div>
    );
}
