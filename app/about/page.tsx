import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0b0b0f] text-white/80 font-sans selection:bg-[#e63030]/30 selection:text-white">
            <Navbar />

            {/* Cinematic Header */}
            <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-24">
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
                        About <span className="text-[#e63030]">AnimeVerse</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Your ultimate destination for discovering, discussing, and diving deep into the anime multiverse.
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <main className="relative z-20 max-w-4xl mx-auto px-6 py-16 space-y-12">
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">Our Mission</h2>
                    <p className="leading-relaxed text-[15px]">
                        AnimeVerse was born out of a profound love for animation, storytelling, and community.
                        We noticed that while there are many places to watch anime, finding a unified platform
                        where fans can genuinely connect, share insights, and discuss their favorite shows in-depth
                        was challenging. Our mission is to bridge that gap. We aim to create the most engaging,
                        comprehensive, and welcoming community for anime enthusiasts worldwide.
                    </p>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">What We Offer</h2>
                    <ul className="grid md:grid-cols-2 gap-6 mt-6">
                        <li className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <span className="text-[#e63030]">01.</span> Community
                            </h3>
                            <p className="text-sm">Join exclusive communities, participate in discussions, and connect with people who share your passion for specific genres or shows.</p>
                        </li>
                        <li className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <span className="text-[#e63030]">02.</span> Discovery
                            </h3>
                            <p className="text-sm">Explore an infinite grid of trending, popular, and top-rated anime across all genres to find your next binge-watch.</p>
                        </li>
                        <li className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <span className="text-[#e63030]">03.</span> Battles
                            </h3>
                            <p className="text-sm">Vote in interactive character and show battles to determine the ultimate fan favorites in the AnimeVerse.</p>
                        </li>
                        <li className="bg-white/[0.02] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <span className="text-[#e63030]">04.</span> Personalization
                            </h3>
                            <p className="text-sm">Create your profile, track your watch history, and curate your very own personalized anime feed.</p>
                        </li>
                    </ul>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">Join Our Journey</h2>
                    <p className="leading-relaxed text-[15px]">
                        Whether you're a seasoned otaku who has been watching anime for decades or someone who just finished
                        their very first series, there's a place for you here. AnimeVerse is built by fans, for fans.
                        We're constantly evolving and bringing new features based on community feedback.
                    </p>
                    <div className="pt-4">
                        <Link href="/auth" className="inline-flex items-center justify-center px-8 py-3 bg-[#e63030] hover:bg-[#ff4545] text-white font-bold rounded-lg transition-transform hover:scale-105">
                            Get Started Now
                        </Link>
                    </div>
                </section>
            </main>

            {/* Simple Footer just for these static pages */}
            <footer className="border-t border-white/10 mt-12 py-8 text-center text-[13px] text-white/40">
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
