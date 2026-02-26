"use client";

import Image from "next/image";

interface ProfileHeroProps {
    user: {
        username: string;
        avatar: string;
        bio: string;
        tags: string[];
        isVip?: boolean;
    };
}

export default function ProfileHero({ user }: ProfileHeroProps) {
    return (
        <div className="relative w-full rounded-3xl overflow-hidden mb-8 group">
            {/* Banner Background */}
            <div className="relative h-64 md:h-80 w-full">
                <Image
                    src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=400&fit=crop"
                    alt="Cover"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/20 to-transparent" />
            </div>

            {/* Profile Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden border-4 border-[#0b0b0f] shadow-2xl relative z-10">
                        <Image
                            src={user.avatar}
                            alt={user.username}
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* Badge */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black/80 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center z-20">
                        <span className="text-red-500 text-xs">🔴</span>
                    </div>
                </div>

                {/* Text Info */}
                <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                            {user.username}
                        </h1>
                        {user.isVip && (
                            <span className="w-6 h-6 bg-yellow-400 rounded-lg flex items-center justify-center text-[10px] transform rotate-12">
                                ⭐
                            </span>
                        )}
                    </div>
                    <p className="text-[#8a8a9a] text-sm md:text-base max-w-xl leading-relaxed">
                        {user.bio}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {user.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-white/[0.05] border border-white/10 rounded-lg text-[10px] font-bold text-[#b3b3c2] hover:bg-white/[0.1] transition-colors cursor-default"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 self-start md:self-end">
                    <button className="px-6 py-2.5 bg-[#e63030] hover:bg-[#ff3b3b] text-white text-sm font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20">
                        Edit Profile
                    </button>
                    <button className="p-2.5 bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] text-white rounded-xl transition-all">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
