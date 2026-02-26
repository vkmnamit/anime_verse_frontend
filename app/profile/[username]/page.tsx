"use client";

import { useParams } from "next/navigation";
import Navbar from "@/src/components/Navbar/Navbar";
import ProfileHero from "@/src/components/Profile/ProfileHero";
import ProfileTabs from "@/src/components/Profile/ProfileTabs";
import {
    AboutWidget,
    BadgesWidget,
    GenresWidget,
    ReactionsWidget,
    ProgressWidget,
    ScheduleWidget
} from "@/src/components/Profile/ProfileWidgets";
import {
    StatsBar,
    TopAnimeSection,
    FriendsSection
} from "@/src/components/Profile/ProfileSections";

export default function ProfilePage() {
    const params = useParams();
    const username = params.username as string;

    // Mock dynamic data based on the username
    // In a real app, this would be: const user = await fetchUser(username);
    const user = {
        username: username || "animefan123",
        avatar: "https://pub-b2620e54712941dbbdba57bdbcde64f7.r2.dev/ChatGPT%20Image%20Feb%2013%2C%202026%2C%2006_55_34%20PM.png",
        bio: "Anime enthusiast. Love discussing theories and finding underrrated gems!",
        tags: ["Action", "Dark Fantasy", "Underrated"],
        isVip: true,
        aboutMe: "Huge shounen fan but exploring all genres. Hit me up if you want to chat about plot twists, power-ups, or hidden gems.",
        zapPoints: 942,
        debates: 568
    };

    const badges = [
        { name: "Debate Champion", icon: "🏆" },
        { name: "Top Theorist", icon: "🏮" },
        { name: "First Responder", icon: "💬" },
    ];

    const genres = [
        { name: "Shounen", icon: "🥦" },
        { name: "Action", icon: "🧊" },
        { name: "Supernatural", icon: "🔮" },
        { name: "Dark Fantasy", icon: "🍷" },
    ];

    const reactions = [
        { anime: "Jujutsu Kaisen", time: "1 day ago", icon: "💙" },
        { anime: "Frieren", time: "2 days ago", icon: "💎" },
        { anime: "Good 🔥", time: "3 days ago", icon: "" },
    ];

    const schedule = [
        { title: "Solo Leveling", episode: 15, time: "2 days" },
        { title: "Wind Breaker", episode: 4, time: "3 days" },
        { title: "Mission: Yozakura Family 4", episode: 4, time: "3 days" },
    ];

    return (
        <div className="relative min-h-screen bg-[#0b0b0f] text-white">
            <Navbar />

            {/* Main Content Container */}
            <main className="pt-24 pb-20 px-6 lg:px-10 max-w-[1600px] mx-auto">

                {/* Profile Hero Section */}
                <ProfileHero user={user} />

                {/* Tabs Navigation */}
                <ProfileTabs />

                {/* Grid Layout: [About/Badges] [Main Stats/Anime] [Reactions/Schedule] */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Left Sidebar (Col 3) */}
                    <div className="md:col-span-3 flex flex-col gap-6 order-2 md:order-1">
                        <AboutWidget text={user.aboutMe} />
                        <BadgesWidget badges={badges} />
                        <GenresWidget genres={genres} />
                    </div>

                    {/* Middle Column (Col 6) */}
                    <div className="md:col-span-6 flex flex-col order-1 md:order-2">
                        <StatsBar zapPoints={user.zapPoints} debates={user.debates} />
                        <TopAnimeSection />
                        <FriendsSection />
                    </div>

                    {/* Right Sidebar (Col 3) */}
                    <div className="md:col-span-3 flex flex-col gap-6 order-3">
                        <ReactionsWidget reactions={reactions} />
                        <ProgressWidget percentage={64} />
                        <ScheduleWidget releases={schedule} />
                    </div>

                </div>
            </main>

            {/* Footer space */}
            <footer className="h-20" />
        </div>
    );
}
