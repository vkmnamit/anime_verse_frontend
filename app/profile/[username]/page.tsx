"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import {
    AboutWidget,
    GenresWidget,
    ReactionsWidget,
    ProgressWidget,
    ScheduleWidget
} from "@/src/components/Profile/ProfileWidgets";
import {
    StatsBar,
    TopAnimeSection
} from "@/src/components/Profile/ProfileSections";

export default function ProfilePage() {
    const params = useParams();
    const profileUsername = params.username as string;
    const { user: currentUser } = useAuth();

    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const statsRes = await api.user.getStats(profileUsername);
                if (statsRes) {
                    setStats(statsRes.data || statsRes);
                }
            } catch (err) { }
            setLoading(false);
        };
        fetchStats();
    }, [profileUsername]);

    // Use stats bio/genres if available, otherwise check if it's currentUser to potentially use their local state
    const isOwnProfile = currentUser?.username === profileUsername;
    const userAboutMe = stats?.bio || (isOwnProfile ? currentUser?.bio : "");
    const userGenres = stats?.genres || (isOwnProfile ? currentUser?.genres : []) || [];
    const userDebates = stats?.battles_voted || 0;

    // Mapping genres to icons for visual consistency
    const genreIcons: Record<string, string> = {
        "Action": "🥊", "Adventure": "🗺️", "Comedy": "😂", "Drama": "🎭",
        "Fantasy": "🪄", "Horror": "👻", "Mystery": "🔍", "Romance": "💖",
        "Sci-Fi": "🚀", "Slice of Life": "🍰", "Sports": "⚽",
        "Supernatural": "🔮", "Thriller": "🔪", "Psychological": "🧠", "Isekai": "⛩️"
    };

    const formattedGenres = userGenres.map((g: string) => ({
        name: g,
        icon: genreIcons[g] || "🏷️"
    }));

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

    if (loading) return (
        <div className="flex items-center justify-center py-40">
            <div className="w-10 h-10 border-2 border-white/5 border-t-[#e63030] animate-spin rounded-none" />
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-700">
            {/* Left Sidebar (Col 3) */}
            <div className="lg:col-span-3 flex flex-col gap-8 order-2 lg:order-1">
                {userAboutMe && <AboutWidget text={userAboutMe} />}
                {formattedGenres.length > 0 && <GenresWidget genres={formattedGenres} />}
            </div>

            {/* Middle Column (Col 6) */}
            <div className="lg:col-span-6 flex flex-col gap-1 order-1 lg:order-2">
                <StatsBar debates={userDebates} />
                <TopAnimeSection />
            </div>

            {/* Right Sidebar (Col 3) */}
            <div className="lg:col-span-3 flex flex-col gap-10 order-3">
                <ReactionsWidget reactions={reactions} />
                <ProgressWidget percentage={64} />
                <ScheduleWidget releases={schedule} />
            </div>
        </div>
    );
}
