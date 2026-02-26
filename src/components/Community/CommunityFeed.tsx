"use client";

import { useState, useEffect } from "react";
import { communityPosts } from "@/src/lib/community";

export default function CommunityFeed() {
    const [activeTab, setActiveTab] = useState("For You");
    const [posts, setPosts] = useState(communityPosts);

    return (
        <div className="flex-1 flex flex-col gap-8 max-w-[720px]">
            {/* Nav Tabs (Screenshot style) */}
            <div className="flex items-center gap-10 border-b border-white/[0.08] px-4 sticky top-[64px] bg-[#0b0b0f]/80 backdrop-blur-3xl z-20">
                {["For You", "Following", "Latest", "Hot"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-5 text-[15px] font-bold relative transition-all duration-300 ${activeTab === tab ? "text-white" : "text-[#5a5a6a] hover:text-white"}`}
                    >
                        {tab === "Hot" && <span className="mr-2 animate-pulse">🔥</span>}
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#e63030] shadow-[0_0_10px_#e63030]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Post Creator (Screenshot style) */}
            <div className="bg-[#111118]/80 backdrop-blur-2xl border border-white/10 rounded-[24px] p-6 flex flex-col gap-6 shadow-2xl">
                <div className="flex items-start gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop"
                        alt="My profile"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10"
                    />
                    <div className="flex-1">
                        <textarea
                            placeholder="What's on your mind?"
                            rows={1}
                            className="w-full bg-transparent border-none text-[16px] text-white outline-none placeholder:text-white/20 px-0 py-2 resize-none min-h-[40px] font-medium"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-[12px] font-black uppercase tracking-wider">
                            <span className="text-indigo-400">🖼️</span> Image
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-[12px] font-black uppercase tracking-wider">
                            <span className="text-amber-400">📊</span> Poll
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-[12px] font-black uppercase tracking-wider">
                            <span className="text-emerald-400">🏷️</span> Tag Anime
                        </button>
                    </div>
                    <button className="bg-[#e63030] hover:bg-[#ff3b3b] text-white text-[11px] font-black uppercase tracking-[0.2em] px-10 py-3.5 rounded-xl transition-all shadow-xl shadow-red-900/40 active:scale-95">
                        Post
                    </button>
                </div>
            </div>

            {/* Posts Feed */}
            <div className="flex flex-col gap-10">
                {posts.map((post) => (
                    <div key={post.id} className="bg-[#111118]/40 backdrop-blur-md border border-white/[0.08] rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative group">

                        {/* Post Header */}
                        <div className="p-7 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white/10" />
                                    {post.author.isVerified && (
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0b0b0f] rounded-full flex items-center justify-center border border-white/10">
                                            <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-[7px] text-white font-black">✓</div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-[15px] font-black text-white hover:text-[#e63030] cursor-pointer transition-colors tracking-tight">{post.author.name}</p>
                                        {post.author.isVerified && <span className="text-blue-500 text-[9px] font-black uppercase tracking-[0.1em] px-1.5 py-0.5 bg-blue-500/10 rounded">Verified</span>}
                                    </div>
                                    <p className="text-[12px] text-white/30 font-bold mt-0.5 uppercase tracking-tighter">{post.time} ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="bg-white/5 hover:bg-white/10 text-white text-[11px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl border border-white/10 transition-all shadow-xl">
                                    Follow
                                </button>
                                <button className="p-2.5 text-white/20 hover:text-white transition-colors">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="7" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="17" r="1.5" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Text Content */}
                        <div className="px-8 pb-6">
                            <p className="text-[18px] lg:text-[22px] font-bold text-white leading-tight tracking-tight mb-2" dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>

                        {/* Poll Visuals (Screenshot style VS) */}
                        {post.poll && (
                            <div className="px-8 pb-8 flex flex-col gap-6">
                                <div className="relative grid grid-cols-2 gap-4 rounded-[32px] overflow-hidden">
                                    {post.poll.options.map((opt, i) => (
                                        <div key={opt.name} className="relative aspect-[16/10] group cursor-pointer border border-white/10 overflow-hidden shadow-2xl">
                                            <img src={opt.image} alt={opt.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                                            <div className="absolute bottom-6 left-0 right-0 text-center">
                                                <p className="text-[13px] font-black text-white uppercase tracking-[0.2em] shadow-black drop-shadow-lg">{opt.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#0b0b0f] border-[3px] border-white/10 rounded-2xl flex items-center justify-center text-[18px] font-black italic text-white z-10 shadow-[0_0_50px_rgba(0,0,0,1)]">VS</div>
                                </div>

                                {/* Cinematic Poll Bars */}
                                <div className="bg-black/40 backdrop-blur-3xl p-6 rounded-[28px] border border-white/5 flex flex-col gap-6 shadow-inner">
                                    <div className="flex items-center gap-6">
                                        <div className="flex-1 relative h-3 bg-white/5 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-gradient-to-r from-[#e63030] to-[#ff4a4a] relative" style={{ width: `${post.poll.options[0].percentage}%` }}>
                                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                            </div>
                                            <div className="h-full bg-gradient-to-l from-blue-600 to-blue-400 relative" style={{ width: `${post.poll.options[1].percentage}%` }}>
                                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-3">
                                            <span className="w-3 h-3 rounded-full bg-[#e63030] shadow-[0_0_10px_#e63030]" />
                                            <span className="text-[13px] font-black text-white uppercase tracking-widest">{post.poll.options[0].name} — {post.poll.options[0].percentage}%</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[13px] font-black text-white uppercase tracking-widest">{post.poll.options[1].percentage}% — {post.poll.options[1].name}</span>
                                            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgb(59,130,246)]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Article Type Post (Screenshot style) */}
                        {post.type === "article" && post.images && (
                            <div className="px-8 pb-8">
                                <div className="grid grid-cols-5 gap-3 h-[240px]">
                                    {post.images.slice(0, 5).map((img, i) => (
                                        <div key={i} className={`relative rounded-2xl overflow-hidden border border-white/10 shadow-xl ${i === 0 ? 'col-span-1' : 'col-span-1'}`}>
                                            <img src={img} className="w-full h-full object-cover" />
                                            {i === 4 && post.extraImages && (
                                                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                                                    <p className="text-2xl font-black text-white">{post.extraImages}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Stats Section */}
                        <div className="px-8 pb-6 flex items-center gap-6 text-[12px] font-black text-white/30 uppercase tracking-[0.1em]">
                            <span>{post.stats.votes || post.stats.likes} {post.stats.votes ? 'Votes' : 'Likes'}</span>
                            <div className="w-1 h-1 bg-white/10 rounded-full" />
                            <span>{post.stats.comments} Comments</span>
                            <div className="w-1 h-1 bg-white/10 rounded-full" />
                            <span>{post.stats.shares} Shares</span>
                        </div>

                        {/* Action Bar */}
                        <div className="px-8 py-5 border-t border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 px-6 py-3 bg-[#e63030] text-white text-[12px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-red-900/30 active:scale-95">
                                    <span>🥊</span> Vote
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 hover:bg-white/5 text-white/40 hover:text-white text-[12px] font-black uppercase tracking-widest rounded-xl transition-all">
                                    <span>💬</span> Comment
                                </button>
                                <button className="flex items-center gap-2 px-6 py-3 hover:bg-white/5 text-white/40 hover:text-white text-[12px] font-black uppercase tracking-widest rounded-xl transition-all">
                                    <span>🔄</span> Share
                                </button>
                            </div>
                            <button className="p-3.5 text-white/20 hover:text-white hover:bg-white/5 transition-all rounded-xl">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                            </button>
                        </div>

                        {/* Featured Comment */}
                        {post.topComment && (
                            <div className="px-8 py-7 border-t border-white/[0.05] bg-white/[0.01]">
                                <div className="flex gap-4">
                                    <img src={post.topComment.avatar} className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[13px] font-black text-white italic">{post.topComment.author}</span>
                                            <span className="text-[11px] text-white/20 font-bold uppercase">{post.topComment.time}</span>
                                        </div>
                                        <p className="text-[15px] text-white/70 leading-relaxed font-medium">
                                            {post.topComment.content}
                                        </p>
                                        <div className="flex items-center gap-6 mt-4">
                                            <button className="flex items-center gap-1.5 text-[11px] font-black text-white/30 hover:text-[#e63030] transition-colors uppercase">
                                                <span>❤️</span> {post.topComment.likes}
                                            </button>
                                            <button className="text-[11px] font-black text-white/30 hover:text-white transition-colors uppercase">Reply</button>
                                        </div>
                                        <button className="mt-6 text-[12px] font-black text-[#e63030] hover:underline uppercase tracking-widest flex items-center gap-2">
                                            View 1.8k more replies <span className="text-lg">↓</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
