"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { api } from "@/src/lib/api";
import Image from "next/image";

export default function ProfileSettingsPage() {
    const { user, token, setUser } = useAuth();
    const [profileState, setProfileState] = useState({
        username: "",
        bio: "",
        avatar_url: "",
        twitter: "",
        instagram: "",
        facebook: ""
    });
    const [savedState, setSavedState] = useState({ ...profileState });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            const newState = {
                username: user.username || "",
                bio: user.bio || "",
                avatar_url: user.avatar_url || "",
                twitter: user.twitter || "",
                instagram: user.instagram || "",
                facebook: user.facebook || ""
            };
            setProfileState(newState);
            setSavedState(newState);
        }
    }, [user]);

    const handleSaveField = async (field: keyof typeof profileState) => {
        if (!token || !user) return;
        if (profileState[field] === savedState[field]) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const updates: any = { [field]: profileState[field] };

            // If it's a social field, we might need a specific endpoint or just include it in profile update
            // For now, let's try updating via the standard profile update
            const res = await api.user.updateProfile(updates, token);

            const updatedUser = res.data || res;
            setUser((prev: any) => ({ ...prev, ...updatedUser }));
            setSavedState(prev => ({ ...prev, [field]: profileState[field] }));
            setSuccess(`${field} updated successfully`);
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message || `Failed to update ${field}`);
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const bioCount = profileState.bio.length;

    return (
        <div className="w-full max-w-2xl space-y-12 animate-in fade-in duration-500">

            {/* General Section */}
            <section>
                <h2 className="text-[18px] font-bold text-white mb-2">General</h2>

                {/* Display Name */}
                <div className="flex flex-col py-5 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-white/90">Display name</span>
                            <span className="text-[13px] text-white/50">Changing your display name won't change your username</span>
                        </div>
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <input
                                type="text"
                                value={profileState.username}
                                onChange={(e) => setProfileState(prev => ({ ...prev, username: e.target.value }))}
                                onBlur={() => handleSaveField("username")}
                                className="bg-transparent text-right text-[14px] text-white/70 outline-none w-48 focus:text-white"
                                placeholder="..."
                            />
                            <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* About Description */}
                <div className="flex flex-col py-5 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-white/90">About description</span>
                        </div>
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <span className="text-[14px] text-white/70 max-w-[200px] truncate">{profileState.bio || "..."}</span>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <textarea
                        value={profileState.bio}
                        onChange={(e) => setProfileState(prev => ({ ...prev, bio: e.target.value }))}
                        onBlur={() => handleSaveField("bio")}
                        placeholder="Write something about yourself..."
                        className="w-full bg-white/[0.03] border border-white/10 mt-4 px-4 py-3 text-[14px] text-white/90 outline-none resize-none rounded-xl"
                        rows={3}
                    />
                </div>

                {/* Avatar */}
                <div className="flex flex-col py-5 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-white/90">Avatar</span>
                            <span className="text-[13px] text-white/50">Edit your avatar or upload an image</span>
                        </div>
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <input
                                type="text"
                                value={profileState.avatar_url}
                                onChange={(e) => setProfileState(prev => ({ ...prev, avatar_url: e.target.value }))}
                                onBlur={() => handleSaveField("avatar_url")}
                                className="bg-transparent text-right text-[14px] text-white/70 outline-none w-48 focus:text-white"
                                placeholder={"URL..."}
                            />
                            <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* Social Links */}
                <div className="flex flex-col py-5 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[15px] font-medium text-white/90">Social links</span>
                        </div>
                        <div className="flex items-center gap-4 cursor-pointer group">
                            <span className="text-[14px] text-white/70">X (Twitter), Instagram, Facebook</span>
                            <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <input
                            type="text"
                            value={profileState.twitter}
                            onChange={(e) => setProfileState(prev => ({ ...prev, twitter: e.target.value }))}
                            onBlur={() => handleSaveField("twitter")}
                            placeholder="X (Twitter) URL"
                            className="bg-white/[0.03] border border-white/10 px-4 py-2 text-[14px] text-white/90 outline-none rounded-xl"
                        />
                        <input
                            type="text"
                            value={profileState.instagram}
                            onChange={(e) => setProfileState(prev => ({ ...prev, instagram: e.target.value }))}
                            onBlur={() => handleSaveField("instagram")}
                            placeholder="Instagram URL"
                            className="bg-white/[0.03] border border-white/10 px-4 py-2 text-[14px] text-white/90 outline-none rounded-xl"
                        />
                        <input
                            type="text"
                            value={profileState.facebook}
                            onChange={(e) => setProfileState(prev => ({ ...prev, facebook: e.target.value }))}
                            onBlur={() => handleSaveField("facebook")}
                            placeholder="Facebook URL"
                            className="bg-white/[0.03] border border-white/10 px-4 py-2 text-[14px] text-white/90 outline-none rounded-xl"
                        />
                    </div>
                </div>

                {/* Mark as Mature */}
                <div className="flex items-center justify-between py-5 border-b border-white/10">
                    <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-white/90">Mark as mature (18+)</span>
                        <span className="text-[13px] text-white/50">Label your profile as Not Safe for Work (NSFW)</span>
                    </div>
                    <div className="w-11 h-6 bg-white/20 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                </div>
            </section>

            {/* Curate Profile Section */}
            <section className="pt-4">
                <h2 className="text-[18px] font-bold text-white mb-2">Curate your profile</h2>
                <p className="text-[13px] text-white/50 mb-6">Manage what content shows on your profile.</p>

                <div className="flex items-center justify-between py-5 border-b border-white/10">
                    <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-white/90">Content and activity</span>
                        <span className="text-[13px] text-white/50">Posts, comments, and communities you're active in</span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-[14px] font-bold text-white/90">Show all</span>
                        <svg className="w-5 h-5 text-white/40 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center justify-between py-5 border-b border-white/10">
                    <div className="flex flex-col">
                        <span className="text-[15px] font-medium text-white/90">NSFW</span>
                        <span className="text-[13px] text-white/50">Show all NSFW posts and comments</span>
                    </div>
                    <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

