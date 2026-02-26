"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAnimeModal } from "@/src/context/AnimeModalContext";
import { getTrendingAnime, getAnimeByCategory, type AnimeCard as AnimeCardType } from "@/src/lib/kitsu";
import { api } from "@/src/lib/api";
import Carousel from "../Carousel/Carousel";
import AnimeCard from "../AnimeCard/AnimeCard";

export default function AnimeDetailModal() {
    const { isOpen, selectedAnime, closeModal, openModal } = useAnimeModal();
    const [recommended, setRecommended] = useState<AnimeCardType[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // Dynamic Truncation for Synopsis
    const SYNOPSIS_THRESHOLD = 450;
    const isLongSynopsis = (selectedAnime?.synopsis?.length || 0) > SYNOPSIS_THRESHOLD;
    const displayedSynopsis = isExpanded || !isLongSynopsis
        ? selectedAnime?.synopsis
        : selectedAnime?.synopsis?.slice(0, SYNOPSIS_THRESHOLD) + "...";

    useEffect(() => {
        if (isOpen && selectedAnime) {
            setIsVisible(true);
            setLoading(true);

            // Fetch related anime based on category theme
            const primaryCategory = selectedAnime.categories[0]?.toLowerCase() || "action";

            Promise.all([
                getAnimeByCategory(primaryCategory, 20),
                api.anime.comments(selectedAnime.id).catch(() => ({ data: [] })),
                api.reactions.getForAnime(selectedAnime.id).catch(() => ({ data: { breakdown: {} } }))
            ]).then(([rec, comRes, reactRes]) => {
                setRecommended(rec);
                if (comRes && comRes.data) {
                    setComments(comRes.data);
                }
            }).finally(() => setLoading(false));
        } else {
            setIsVisible(false);
            setComments([]);
            setIsInWatchlist(false);
            setIsExpanded(false);
        }
    }, [isOpen, selectedAnime]);

    const handleWatchlist = async () => {
        if (!selectedAnime) return;
        setIsInWatchlist(!isInWatchlist);

        try {
            const token = localStorage.getItem("token") || "";
            if (!isInWatchlist) {
                await api.watchlist.add(selectedAnime.id, "watching", token);
            } else {
                await api.watchlist.remove(selectedAnime.id, token);
            }
        } catch (err) {
            console.error("Watchlist error:", err);
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
            <div className={`relative w-full lg:w-full lg:h-full lg:max-w-7xl lg:max-h-screen bg-[#0b0b0f] lg:rounded-none overflow-y-auto no-scrollbar shadow-2xl transition-all duration-500 ${isVisible ? "scale-100 translate-y-0" : "scale-[0.98] translate-y-8"}`}>

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
                <div className="relative w-full h-[45vh] lg:h-[55vh]">
                    <Image
                        src={selectedAnime.coverImage || selectedAnime.posterImage}
                        alt={selectedAnime.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    {/* Hero Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent" />

                    {/* Poster On Banner (No extra space needed) */}
                    <div className="absolute bottom-8 left-6 lg:left-12 z-30">
                        <div className="w-[140px] lg:w-[220px] aspect-[2/3] relative rounded-[12px] overflow-hidden border-[4px] border-white/10 shadow-2xl group">
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
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-16">

                    {/* LEFT COLUMN: Main Info */}
                    <div className="lg:col-span-8 space-y-8 pt-10">

                        {/* Title & Watchlist Hub (Netflix Style) */}
                        <div className="flex items-center flex-wrap gap-6 pt-2">
                            <h1
                                className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight"
                                style={{ fontFamily: 'var(--font-rubik), Rubik, sans-serif' }}
                            >
                                {selectedAnime.title}
                            </h1>

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

                    {/* RIGHT COLUMN: Community Sidebar (Redesigned per screenshot) */}
                    <div className="lg:col-span-4 self-start sticky top-10">
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

                            {/* Interactive Input (Integrated) */}
                            <div className="p-6 pt-0 mt-2">
                                <div className="border border-white/10 bg-white/[0.03] rounded-lg p-1.5 flex items-center shadow-inner">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        className="bg-transparent border-none outline-none text-[13px] text-white/80 placeholder:text-white/20 px-3 w-full font-medium"
                                    />
                                    <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-[#e63030] text-white/40 hover:text-white transition-all active:scale-90 group/send">
                                        <svg className="w-4 h-4 transition-transform group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RECOMMENDATIONS SECTION */}
                <div className="pb-24 pt-16 border-t border-white/5">
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
