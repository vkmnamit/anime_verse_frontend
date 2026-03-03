import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#0b0b0f] text-white/80 font-sans selection:bg-[#e63030]/30 selection:text-white pb-20">
            <Navbar />

            {/* Cinematic Header */}
            <div className="relative w-full h-[35vh] min-h-[250px] flex items-center justify-center overflow-hidden pt-24">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                        alt="Background"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0f]/90 via-[#0b0b0f]/70 to-[#0b0b0f]" />
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                        Privacy <span className="text-[#e63030]">Policy</span>
                    </h1>
                    <p className="text-sm text-white/50 uppercase tracking-widest font-bold">
                        Last Updated: March 2, 2026
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <main className="relative z-20 max-w-4xl mx-auto px-6 py-12 space-y-12">

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">1. Introduction</h2>
                    <p className="leading-relaxed text-[15px]">
                        Welcome to AnimeVerse. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">2. The Data We Collect</h2>
                    <p className="leading-relaxed text-[15px]">
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mt-4 ml-2 text-[15px]">
                        <li><strong className="text-white">Identity Data</strong> includes username, and profile picture.</li>
                        <li><strong className="text-white">Contact Data</strong> includes email address.</li>
                        <li><strong className="text-white">Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                        <li><strong className="text-white">Usage Data</strong> includes information about how you use our website, vote in battles, and participate in communities.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">3. How We Use Your Data</h2>
                    <p className="leading-relaxed text-[15px]">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 mt-4">
                        <ul className="space-y-3 text-[14px]">
                            <li className="flex gap-3">
                                <span className="text-[#e63030] shrink-0">❖</span>
                                <span>To register you as a new user.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#e63030] shrink-0">❖</span>
                                <span>To manage your relationship with us and provide seamless authentication.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#e63030] shrink-0">❖</span>
                                <span>To improve our website, services, and user experiences.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#e63030] shrink-0">❖</span>
                                <span>To keep your account secure and prevent fraud on our community boards.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">4. Data Security</h2>
                    <p className="leading-relaxed text-[15px]">
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                        In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">5. Your Legal Rights</h2>
                    <p className="leading-relaxed text-[15px]">
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data.
                        You have the right to request access, correction, erasure, or restriction of your personal data.
                        To exercise these rights, please contact us at <a href="mailto:privacy@animeverse.com" className="text-[#e63030] hover:underline">privacy@animeverse.com</a>.
                    </p>
                </section>

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
