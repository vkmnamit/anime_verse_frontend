export const communityPosts = [
    {
        id: 1,
        author: {
            name: "Ryuuji",
            handle: "ryuuji_san",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
            isVerified: true,
        },
        time: "2 hours ago",
        content: "Which anime had the <span class='text-[#e63030] font-bold'>BEST Ending</span>?",
        poll: {
            title: "Anime Finale Showdown",
            options: [
                { name: "Attack on Titan", percentage: 68, image: "https://images.unsplash.com/photo-1541562232579-512a21360020?w=500&h=300&fit=crop" },
                { name: "Fullmetal Alchemist", percentage: 32, image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=500&h=300&fit=crop" },
            ],
            totalVotes: "2.4k",
        },
        stats: {
            votes: "2.4k",
            comments: "1.8k",
            shares: "332",
        },
        topComment: {
            author: "Hikari",
            content: "AoT gave me chills! 🔥 What about you? 😄😅",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop",
            likes: 428,
            time: "1 hour ago"
        }
    },
    {
        id: 2,
        author: {
            name: "AnimeNews",
            handle: "animenews_off",
            avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
            isVerified: true,
        },
        time: "5 hours ago",
        content: "Top 10 Underrated Anime You Missed!",
        type: "article",
        images: [
            "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=200&h=300&fit=crop",
            "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=200&h=300&fit=crop",
            "https://images.unsplash.com/photo-1560972550-aba3456b5564?w=200&h=300&fit=crop",
            "https://images.unsplash.com/photo-1542451313-a11b03b51d6d?w=200&h=300&fit=crop",
            "https://images.unsplash.com/photo-1541562232579-512a21360020?w=200&h=300&fit=crop",
        ],
        extraImages: "+6",
        stats: {
            likes: "1.2k",
            comments: "320",
            shares: "45",
        },
    }
];

export const trendingTopics = [
    { title: "Solo Leveling Finale", count: "14.2k", trend: "up" },
    { title: "Mappa vs Wit", count: "8.5k", trend: "down" },
    { title: "One Piece 1111", count: "22.1k", trend: "up" },
    { title: "Frieren Season 2", count: "12.8k", trend: "up" },
];

export const communityGenres = [
    { label: "Action", color: "bg-emerald-500/20 text-emerald-400" },
    { label: "Romance", color: "bg-rose-500/20 text-rose-400" },
    { label: "Psychological", color: "bg-indigo-500/20 text-indigo-400" },
    { label: "Fantasy", color: "bg-amber-500/20 text-amber-400" },
    { label: "Slice of Life", color: "bg-orange-500/20 text-orange-400" },
    { label: "Isekai", color: "bg-purple-500/20 text-purple-400" },
];
