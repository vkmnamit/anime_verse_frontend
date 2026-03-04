"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileHeroProps {
    user: {
        username: string;
        avatar: string;
        bio: string;
        tags: string[];
        isVip?: boolean;
    };
    isOwnProfile?: boolean;
    onProfileUpdated?: () => void;
}

export default function ProfileHero({ user, isOwnProfile }: ProfileHeroProps) {
    const router = useRouter();

    return (
        <div className="relative w-full rounded-none overflow-hidden mb-6 group border border-white/[0.04]">
            {/* Banner Background — Cosmic Galaxy */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1462331940025-496df975641f?w=1600&h=600&fit=crop&q=100"
                    alt="Cover"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                />

                {/* Multi-layered premium overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/40 to-transparent" />
                <div className="absolute inset-0 bg-[#e63030]/10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0f]/80 via-[#0b0b0f]/30 to-transparent" />
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8">
                    {/* Avatar with Status */}
                    <div className="relative shrink-0 group/avatar">
                        <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-[6px] border-[#0b0b0f] shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 transition-transform group-hover/avatar:scale-105 duration-500">
                            <Image
                                src={user?.avatar || "/default-avatar.png"}
                                alt={user?.username || "Profile Avatar"}
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Status/Indicator - Rectangular */}
                        <div className="absolute bottom-2 right-2 w-7 h-7 bg-[#e63030] rounded-none border-4 border-[#0b0b10] z-20 flex items-center justify-center shadow-lg">
                            <span className="text-white text-[10px] transform rotate-45 font-black">✕</span>
                        </div>
                    </div>

                    {/* Text Info */}
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md">
                                {user?.username || "Unknown User"}
                            </h1>
                            <span className="text-yellow-400 text-xl drop-shadow-sm">⭐</span>
                        </div>
                        <p className="text-white/50 text-base font-medium">@{user?.username || "unknown"}</p>
                        <p className="text-[#c0c0d8] text-base md:text-lg max-w-2xl leading-relaxed mt-1 font-medium drop-shadow-sm italic">
                            {user.bio}
                        </p>
                        <div className="flex flex-wrap gap-2.5 mt-2">
                            {user.tags.map((tag, i) => (
                                <span
                                    key={tag}
                                    className="px-4 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest transition-all bg-white/[0.05] border border-white/10 text-[#b3b3c2] hover:bg-white/[0.08] hover:text-white cursor-default"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Edit Profile Button */}
                    <div className="self-start md:self-end">
                        {isOwnProfile ? (
                            <button
                                onClick={() => router.push("/settings/profile")}
                                className="px-8 py-3 bg-[#e63030] hover:bg-[#ff3b3b] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-none transition-all active:scale-95 shadow-[0_8px_25px_-5px_rgba(230,48,48,0.5)] hover:shadow-[0_12px_30px_-5px_rgba(230,48,48,0.6)]"
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button className="px-8 py-3 bg-white hover:bg-white/90 text-black text-[11px] font-black uppercase tracking-[0.2em] rounded-none transition-all active:scale-95">
                                Follow
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
