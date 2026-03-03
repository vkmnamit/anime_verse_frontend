import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-[#0b0b0f] text-white/80 font-sans selection:bg-[#e63030]/30 selection:text-white pb-20">
            <Navbar />

            {/* Cinematic Header */}
            <div className="relative w-full h-[35vh] min-h-[250px] flex items-center justify-center overflow-hidden pt-16">
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
                        Terms of <span className="text-[#e63030]">Service</span>
                    </h1>
                    <p className="text-sm text-white/50 uppercase tracking-widest font-bold">
                        Last Updated: March 2, 2026
                    </p>
                </div>
            </div>

            {/* Content Container */}
            <main className="relative z-20 max-w-4xl mx-auto px-6 py-12 space-y-12">

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">1. Agreement to Terms</h2>
                    <p className="leading-relaxed text-[15px]">
                        By accessing our website at AnimeVerse, you agree to be bound by these terms of service, all applicable laws and regulations,
                        and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms,
                        you are prohibited from using or accessing this site.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">2. User Accounts</h2>
                    <ul className="list-disc list-inside space-y-2 mt-4 ml-2 text-[15px]">
                        <li><strong className="text-white">Eligibility:</strong> You must be at least 12 years old to use our service.</li>
                        <li><strong className="text-white">Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account and password.</li>
                        <li><strong className="text-white">Accuracy:</strong> You agree to accept responsibility for all activities that occur under your account and you must provide accurate and complete information during registration.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">3. Community Guidelines</h2>
                    <p className="leading-relaxed text-[15px]">
                        AnimeVerse is a place for fans. To ensure the best experience for everyone, you agree NOT to:
                    </p>
                    <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 mt-4">
                        <ul className="space-y-3 text-[14px]">
                            <li className="flex gap-3">
                                <span className="text-[#e63030] shrink-0">❖</span>
                                <span>Harass, abuse, or engage in hate speech against other users.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#e63030] shrink-0">❖</span>
                                <span>Post spam, malicious links, or engage in promotional activities without authorization.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#e63030] shrink-0">❖</span>
                                <span>Upload explicit or sexually graphic content.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[#e63030] shrink-0">❖</span>
                                <span>Spoil major plot points for currently airing anime without proper spoiler warnings.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">4. Content Ownership</h2>
                    <p className="leading-relaxed text-[15px]">
                        All posts, comments, and reviews you submit to AnimeVerse remain your intellectual property. However, by posting content to AnimeVerse, you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content in any and all media or distribution methods.
                    </p>
                    <p className="leading-relaxed text-[15px]">
                        All anime metadata, posters, and imagery belong to their respective copyright holders. AnimeVerse does not claim ownership over any licensed anime content or IP displayed on the site.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white border-l-4 border-[#e63030] pl-4">5. Modifications</h2>
                    <p className="leading-relaxed text-[15px]">
                        AnimeVerse may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
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
