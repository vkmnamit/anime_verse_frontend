"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAnimeModal } from "@/src/context/AnimeModalContext";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";
import { getTrendingAnime, getAnimeByCategory, type AnimeCard as AnimeCardType } from "@/src/lib/kitsu";
import { api } from "@/src/lib/api";
import Carousel from "../Carousel/Carousel";
import AnimeCard from "../AnimeCard/AnimeCard";

export default function AnimeDetailModal() {
    const { isOpen, selectedAnime, closeModal, openModal } = useAnimeModal();
    const { user, token } = useAuth();
    const router = useRouter();
    const [recommended, setRecommended] = useState<AnimeCardType[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [commentText, setCommentText] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Dynamic Truncation for Synopsis
    const SYNOPSIS_THRESHOLD = 450;
    const isLongSynopsis = (selectedAnime?.synopsis?.length || 0) > SYNOPSIS_THRESHOLD;
    const displayedSynopsis = isExpanded || !isLongSynopsis
        ? selectedAnime?.synopsis
        : selectedAnime?.synopsis?.slice(0, SYNOPSIS_THRESHOLD) + "...";

    useEffect(() => {
        if (isOpen && selectedAnime) {
            document.body.style.overflow = 'hidden';
            setIsVisible(true);
            setLoading(true);

            // Fetch more diverse related anime by using multiple categories
            const primaryCategories = selectedAnime.categories.slice(0, 2);
            const recommendationFetches = primaryCategories.length > 0
                ? primaryCategories.map(cat => getAnimeByCategory(cat.toLowerCase(), 20))
                : [getTrendingAnime(20)];

            Promise.all([
                Promise.all(recommendationFetches),
                api.anime.comments(selectedAnime.id).catch(() => ({ data: [] })),
                token ? api.watchlist.list(token).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
                token ? api.reactions.getMine(selectedAnime.id, token).catch(() => ({ data: null })) : Promise.resolve({ data: null })
            ]).then(([recArrays, comRes, watchRes, reactRes]) => {
                // Flatten, deduplicate, and filter out current anime
                const allRecs = recArrays.flat();
                const uniqueRecs = Array.from(new Map(allRecs.map(a => [a.id, a])).values())
                    .filter(a => a.id !== selectedAnime.id);

                setRecommended(uniqueRecs.slice(0, 40));

                if (comRes && comRes.data) {
                    setComments(comRes.data);
                }

                // Sync watchlist state
                const watchlistItems = watchRes?.data || watchRes || [];
                const isSaved = watchlistItems.some((item: any) => String(item.anime_id) === String(selectedAnime.id));
                setIsInWatchlist(isSaved);

                // Sync like state
                setIsLiked(!!reactRes?.data);
            }).finally(() => setLoading(false));
        } else {
            document.body.style.overflow = 'unset';
            setIsVisible(false);
            setComments([]);
            setIsInWatchlist(false);
            setIsLiked(false);
            setIsExpanded(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, selectedAnime]);

    const handleWatchlist = async () => {
        if (!selectedAnime) return;
        if (!user || !token) {
            closeModal();
            router.push("/auth");
            return;
        }

        const nextState = !isInWatchlist;
        setIsInWatchlist(nextState);

        try {
            if (nextState) {
                await api.watchlist.add(selectedAnime.id, "planned", token, selectedAnime);
            } else {
                await api.watchlist.remove(selectedAnime.id, token);
            }
        } catch (err) {
            console.error("Watchlist error:", err);
            setIsInWatchlist(!nextState);
        }
    };

    const handleLike = async () => {
        if (!selectedAnime) return;
        if (!user || !token) {
            closeModal();
            router.push("/auth");
            return;
        }

        const nextState = !isLiked;
        setIsLiked(nextState);

        try {
            if (nextState) {
                await api.reactions.create(selectedAnime.id, "fire", token);
            } else {
                await api.reactions.remove(selectedAnime.id, token);
            }
        } catch (err) {
            console.error("Like error:", err);
            setIsLiked(!nextState);
        }
    };

    const handleCommentSubmit = async () => {
        if (!user || !token) {
            closeModal();
            router.push("/auth");
            return;
        }
        if (!commentText.trim() || !selectedAnime) return;

        try {
            await api.comments.create(selectedAnime.id, commentText.trim(), token, undefined, selectedAnime);

            // Refresh comments
            const comRes = await api.anime.comments(selectedAnime.id).catch(() => ({ data: [] }));
            if (comRes && comRes.data) {
                setComments(comRes.data);
            }

            setCommentText(""); // Clear input
        } catch (err) {
            console.error("Comment submission error:", err);
            alert("Failed to post comment.");
        }
    };

    if (!isOpen || !selectedAnime) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-0 transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                onClick={closeModal}
            />

            {/* Modal Content */}
            <div className={`relative w-full lg:w-[92%] h-full lg:h-[92vh] lg:max-w-[1400px] lg:rounded-[24px] bg-[#0b0b0f] overflow-y-auto no-scrollbar shadow-2xl transition-all duration-500 border border-white/5 ${isVisible ? "scale-100 translate-y-0" : "scale-[0.98] translate-y-8"}`}>

                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="fixed top-8 right-8 z-[60] w-12 h-12 rounded-full bg-black/50 hover:bg-[#e63030] text-white transition-all border border-white/10 flex items-center justify-center backdrop-blur-md group"
                >
                    <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* HERO BANNER SECTION */}
                <div className="relative w-full h-[35vh] sm:h-[45vh] lg:h-[60vh]">
                    <Image
                        src={selectedAnime.coverImage || selectedAnime.posterImage}
                        alt={selectedAnime.title}
                        fill
                        className="object-cover opacity-50 sm:opacity-60"
                        priority
                    />
                    {/* Hero Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

                    {/* Poster On Banner (No extra space needed) */}
                    <div className="absolute bottom-6 left-6 lg:bottom-8 lg:left-12 z-30">
                        <div className="w-[100px] sm:w-[140px] lg:w-[220px] aspect-[2/3] relative rounded-[8px] lg:rounded-[12px] overflow-hidden border-[2px] lg:border-[4px] border-white/10 shadow-2xl group">
                            <Image
                                src={selectedAnime.posterImage}
                                alt={selectedAnime.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>
                </div>

                {/* CONTENT SECTION */}
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 pb-16 grid grid-cols-1 xl:grid-cols-12 gap-8 xl:gap-16">

                    {/* LEFT COLUMN: Main Info */}
                    <div className="xl:col-span-8 space-y-6 sm:space-y-8 pt-6 sm:pt-10">

                        {/* Title & Watchlist Hub (Netflix Style) */}
                        <div className="flex items-center flex-wrap gap-6 pt-2">
                            <h1
                                className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight"
                                style={{ fontFamily: 'var(--font-rubik), Rubik, sans-serif' }}
                            >
                                {selectedAnime.title}
                            </h1>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleWatchlist}
                                    className={`px-6 py-2.5 rounded-sm font-bold text-[13px] uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0 ${isInWatchlist
                                        ? "bg-white text-black"
                                        : "bg-[#e63030] text-white hover:bg-[#ff4a4a]"
                                        }`}
                                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                                >
                                    <svg className={`w-4 h-4 transition-transform ${isInWatchlist ? "rotate-45" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    {isInWatchlist ? "In My List" : "Add to List"}
                                </button>

                                <button
                                    onClick={handleLike}
                                    className={`w-[45px] h-[45px] rounded-sm flex items-center justify-center transition-all active:scale-90 border ${isLiked
                                        ? "bg-[#e63030]/10 border-[#e63030] text-[#e63030]"
                                        : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20"
                                        }`}
                                >
                                    <svg
                                        className={`w-6 h-6 ${isLiked ? "fill-current" : "fill-none"}`}
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                    >
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Overview */}
                        <section className="space-y-4 pt-4 border-t border-white/5 group">
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                Overview
                                <span className="w-1.5 h-1.5 rounded-full bg-[#e63030] animate-pulse" />
                            </h2>
                            <div className="relative">
                                <p className="text-white/60 text-[15px] leading-relaxed transition-all duration-500">
                                    {displayedSynopsis}
                                </p>

                                {isLongSynopsis && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="mt-4 text-[13px] font-black text-white/40 hover:text-white uppercase tracking-[0.2em] transition-all flex items-center gap-2 group/btn"
                                    >
                                        {isExpanded ? "Show Less" : "Read Full Synopsis"}
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </section>

                        {/* Anime Stats */}
                        <section className="pt-10 border-t border-white/5">
                            <h2 className="text-xl font-bold text-white tracking-tight mb-8">Production Specs</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: "Episodes", value: selectedAnime.episodeCount || "???" },
                                    { label: "Status", value: selectedAnime.status },
                                    { label: "Genres", value: selectedAnime.categories.slice(0, 3).join(", ") },
                                    { label: "Rating", value: selectedAnime.rating ? (selectedAnime.rating / 10).toFixed(1) : "N/A", color: "text-[#F5A623]" }
                                ].map(item => (
                                    <div key={item.label} className="space-y-1">
                                        <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest">{item.label}</p>
                                        <p className={`text-[15px] font-semibold ${item.color || 'text-white/80'}`}>{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Community Sidebar */}
                    <div className="xl:col-span-4 self-start sticky top-10">
                        <div className="bg-[#0b0b0f]/60 backdrop-blur-2xl border border-white/10 rounded-[12px] shadow-2xl overflow-hidden shadow-black/50">
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                                <h3 className="text-[17px] font-bold text-white">Hot Takes & Reactions</h3>
                                <button className="text-white/40 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                                    </svg>
                                </button>
                            </div>

                            {/* Comments List */}
                            <div className="p-0">
                                {comments.length > 0 ? (
                                    <div className="divide-y divide-white/10">
                                        {comments.slice(0, 3).map((comment: any) => (
                                            <div key={comment.id} className="px-6 py-6 flex gap-4 hover:bg-white/[0.02] transition-colors group">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0 shadow-lg">
                                                    <img
                                                        src={comment.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${comment.profiles?.username || 'U'}&background=random`}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex flex-col justify-center">
                                                    <p className="text-[14.5px] text-white/90 leading-relaxed font-normal">
                                                        {comment.content}
                                                    </p>
                                                    <p className="text-[13px] text-white/40 mt-1 font-medium italic">
                                                        — {comment.profiles?.username || 'anon'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center">
                                        <p className="text-[12px] font-bold uppercase tracking-[0.3em] text-white/20">NO REACTIONS YET.</p>
                                    </div>
                                )}
                            </div>

                            {/* Interactive Input (Slack/Discord Redesign) */}
                            <div className="p-6 pt-2">
                                <div className="bg-white/[0.03] border border-white/10 rounded-sm overflow-hidden focus-within:border-[#e63030]/50 transition-all">
                                    <textarea
                                        placeholder="Add a hot take..."
                                        className="w-full bg-transparent border-none outline-none text-[15px] text-white/90 placeholder:text-white/20 px-4 py-4 min-h-[80px] resize-none font-medium no-scrollbar"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleCommentSubmit();
                                            }
                                        }}
                                    />

                                    {/* Action Bar — Simplified Rectangle */}
                                    <div className="px-3 py-2 bg-white/[0.02] border-t border-white/5 flex items-center justify-end">


                                        <button
                                            onClick={handleCommentSubmit}
                                            disabled={!commentText.trim()}
                                            className={`px-6 py-2 flex items-center justify-center rounded-sm transition-all active:scale-95 group/send text-[12px] font-bold uppercase tracking-widest ${commentText.trim()
                                                ? "bg-[#e63030] text-white"
                                                : "bg-white/5 text-white/20"
                                                }`}
                                        >
                                            Post Reaction
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECOMMENDATIONS SECTION */}
                <div className="pb-24 pt-16 border-t border-white/5 relative">
                    <div className="flex items-center justify-between px-6 lg:px-12 mb-2 absolute top-18 right-0 z-10 w-full">
                        <div className="flex-1" />
                        <Link
                            href={`/discover?genre=${selectedAnime.categories[0]?.toLowerCase() || 'action'}`}
                            className="text-[12px] font-bold text-[#e63030] hover:underline uppercase tracking-widest"
                            onClick={closeModal}
                        >
                            Explore More →
                        </Link>
                    </div>
                    <Carousel title="You Might Also Like">
                        {recommended.map((anime, idx) => (
                            <AnimeCard key={anime.id} anime={anime} index={idx} />
                        ))}
                    </Carousel>
                </div>

            </div>
        </div>
    );
}
