"use client";

import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#0b0b0f] text-white/80 font-sans selection:bg-[#e63030]/30 selection:text-white pb-20">
            <Navbar />

            {/* Cinematic Header */}
            <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-16">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                        alt="Background"
                        fill
                        className="object-cover opacity-30"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0f]/80 via-[#0b0b0f]/60 to-[#0b0b0f]" />
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                        Contact <span className="text-[#e63030]">Us</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Got a question, bug report, or business inquiry? We'd love to hear from you.
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <main className="relative z-20 max-w-4xl mx-auto px-6 py-16">

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left Column - Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4 border-l-4 border-[#e63030] pl-4">Get In Touch</h2>
                            <p className="text-[15px] leading-relaxed">
                                Whether you have questions about using AnimeVerse, need help troubleshooting a community issue, or just want to tell us what you think, our team is always ready to assist.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#e63030]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    General Support
                                </h3>
                                <p className="text-[14px] text-white/60 mb-1">For help with your account or general inquiries.</p>
                                <a href="mailto:support@animeverse.com" className="text-[#e63030] hover:text-[#ff4545] font-bold text-[15px] hover:underline">
                                    support@animeverse.com
                                </a>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#e63030]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                                    Business & Press
                                </h3>
                                <p className="text-[14px] text-white/60 mb-1">For partnerships, media, or business matters.</p>
                                <a href="mailto:business@animeverse.com" className="text-[#e63030] hover:text-[#ff4545] font-bold text-[15px] hover:underline">
                                    business@animeverse.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Contact Form UI Mockup */}
                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e63030]/50 transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e63030]/50 transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[12px] font-bold text-white/50 uppercase tracking-wider mb-2">Message</label>
                                <textarea
                                    className="w-full bg-[#0b0b0f] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#e63030]/50 transition-colors min-h-[120px] resize-y"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button
                                className="w-full bg-[#e63030] hover:bg-[#ff4545] text-white font-bold py-3.5 rounded-lg transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(230,48,48,0.2)]"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

            </main>

            {/* Simple Footer just for these static pages */}
            <footer className="border-t border-white/10 max-w-4xl mx-auto pt-8 mt-12 text-center text-[13px] text-white/40">
                <div className="flex items-center justify-center gap-6 mb-4">
                    <Link href="/about" className="hover:text-white transition-colors">About</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                </div>
                <p>AnimeVerse © 2026. All rights reserved.</p>
            </footer>
        </div>
    );
}
