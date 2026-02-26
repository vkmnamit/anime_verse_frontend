import Image from "next/image";
import Navbar from "@/src/components/Navbar/Navbar";
import CommunitySidebar from "@/src/components/Community/CommunitySidebar";
import CommunityFeed from "@/src/components/Community/CommunityFeed";
import CommunityTrending from "@/src/components/Community/CommunityTrending";

export default function CommunityPage() {
    return (
        <main className="min-h-screen bg-[#0b0b0f] relative overflow-x-hidden">
            {/* Background Aesthetic */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=1920&h=1080&fit=crop"
                    alt="Background"
                    fill
                    className="object-cover opacity-20 blur-[100px]"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0f] via-transparent to-[#0b0b0f]" />
            </div>

            <Navbar />

            {/* Main Content Container */}
            <div className="relative z-10 pt-36 pb-20 px-4 md:px-8 lg:px-12">
                <div className="max-w-[1600px] mx-auto flex gap-10">
                    {/* Left Sidebar */}
                    <CommunitySidebar />

                    {/* Main Feed */}
                    <div className="flex-1 flex justify-center">
                        <CommunityFeed />
                    </div>

                    {/* Right Sidebar */}
                    <CommunityTrending />
                </div>
            </div>
        </main>
    );
}
