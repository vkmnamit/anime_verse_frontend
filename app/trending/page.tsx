import Image from "next/image";
import Navbar from "@/src/components/Navbar/Navbar";
import TrendingList from "@/src/components/Trending/TrendingList";
import TrendingSidebar from "@/src/components/Trending/TrendingSidebar";

export default function TrendingPage() {
    return (
        <div className="relative min-h-screen bg-[#0b0b0f] text-white selection:bg-[#e63030]/30 selection:text-white">
            {/* Cinematic Background — Enhanced Fire/Nebula */}
            <div className="fixed inset-0 z-0 select-none pointer-events-none">
                <Image
                    src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                    alt="Trending Background"
                    fill
                    className="object-cover opacity-80"
                    sizes="100vw"
                    priority
                />
                {/* Layered dark & fiery overlays for cinematic depth */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(230,48,48,0.15),transparent_60%)]" />
                <div className="absolute inset-0 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 w-full">
                <Navbar />

                {/* Header Area */}
                <header className="flex items-end justify-between pt-24">
                    {/* This header is intentionally left empty for now, but provides a consistent top padding */}
                </header>

                {/* Spacer to push content down */}
                <div className="h-24" />

                <main className="pb-40 px-6 lg:px-12 max-w-[1500px] mx-auto flex flex-col lg:flex-row gap-20">
                    {/* Main Content Area: Trending List */}
                    <div className="flex-1 min-w-0">
                        <TrendingList />
                    </div>

                    {/* Right Sidebar: Rankings & Gained Heat */}
                    <TrendingSidebar />
                </main>
            </div>
        </div>
    );
}
