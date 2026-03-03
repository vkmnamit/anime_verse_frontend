import CommunitySidebar from "@/src/components/Community/CommunitySidebar";
import TrendingSidebar from "@/src/components/Trending/TrendingSidebar";
import Navbar from "@/src/components/Navbar/Navbar";
import Image from "next/image";

export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <div className="relative min-h-screen bg-[#0b0b0f] text-white selection:bg-[#e63030]/30 selection:text-white font-sans w-full max-w-[100vw]">
                {/* Cinematic Nebula Background — enhanced visibility */}
                <div className="fixed inset-0 z-0 opacity-60">
                    <Image
                        src="https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png"
                        alt="Space Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0f]/20 via-[#0b0b0f]/50 to-[#0b0b0f]" />
                </div>


                {/* Reddit-style 3-column layout: Sidebar + Centered Feed + Right Sidebar */}
                <div className="relative z-10 flex w-full justify-center max-w-[1700px] mx-auto">
                    {/* Left Sidebar — navigation */}
                    <div className="w-[260px] shrink-0 sticky top-16 xl:block hidden h-[calc(100vh-64px)]">
                        <CommunitySidebar />
                    </div>

                    {/* Main Content Area: Feed + Right Widgets */}
                    <main className="flex-1 flex gap-8 py-6 md:py-8 min-w-0 px-4 md:px-10 justify-center">
                        {/* Feed Column */}
                        <div className="flex-1 min-w-0 max-w-[850px]">
                            {children}
                        </div>

                        {/* Right Sidebar — visible on larger screens */}
                        <div className="hidden lg:block">
                            <TrendingSidebar />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
