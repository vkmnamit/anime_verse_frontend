"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { useAuth } from "@/src/context/AuthContext";
import {
    IdentityHub,
    ReactionsWidget,
    ProgressWidget,
    ScheduleWidget
} from "@/src/components/Profile/ProfileWidgets";
import {
    TopAnimeSection
} from "@/src/components/Profile/ProfileSections";

export default function ProfilePage() {
    const params = useParams();
    const profileUsername = params.username as string;
    const { user: currentUser, token } = useAuth();

    const [stats, setStats] = useState<any>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, activitiesRes, watchlistRes] = await Promise.all([
                    api.user.getStats(profileUsername),
                    api.user.getComments(profileUsername),
                    api.watchlist.getPublicList(profileUsername)
                ]);

                if (statsRes) setStats(statsRes.data || statsRes);

                const actsRaw = activitiesRes?.data || activitiesRes || [];
                setActivities(actsRaw.slice(0, 5));

                // Map watchlist to top anime format safely
                const rawList = watchlistRes?.data || watchlistRes || [];
                const mappedList = Array.isArray(rawList) ? rawList.map((item: any) => ({
                    id: item.anime_id,
                    title: item.anime?.title || "Unknown Signal",
                    posterImage: item.anime?.cover_image || "/placeholder.png",
                    rating: item.anime?.average_score || 0
                })) : [];
                setWatchlist(mappedList);

            } catch (err) {
                console.error("Failed to fetch profile data", err);
            }
            setLoading(false);
        };
        fetchData();
    }, [profileUsername]);

    const isOwnProfile = currentUser?.username === profileUsername;
    const userAboutMe = stats?.bio || (isOwnProfile ? currentUser?.bio : "");
    const userGenres = stats?.genres || (isOwnProfile ? currentUser?.genres : []) || [];

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

    const formattedReactions = activities.map((act: any) => ({
        anime: act.anime?.title || "Unknown Terminal",
        time: act.created_at ? new Date(act.created_at).toLocaleDateString() : "RECENT",
        icon: act.content?.length > 20 ? "💭" : "💬"
    }));

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in duration-700">
            {/* Left Column (Col 4) */}
            <div className="lg:col-span-4 flex flex-col gap-12 order-2 lg:order-1">
                <IdentityHub bio={userAboutMe} genres={formattedGenres} />
                <ScheduleWidget releases={schedule} />
            </div>

            {/* Middle Column (Col 8) */}
            <div className="lg:col-span-8 flex flex-col gap-16 order-1 lg:order-2">
                <TopAnimeSection anime={watchlist} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <ReactionsWidget reactions={formattedReactions} />
                    <ProgressWidget percentage={64} />
                </div>
            </div>
        </div>
    );
}
