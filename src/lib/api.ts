const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

async function fetcher(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "API request failed");
    }
    return res.json();
}

export const api = {
    anime: {
        list: (params: any = {}) => {
            const query = new URLSearchParams(params).toString();
            return fetcher(`/anime?${query}`);
        },
        trending: (limit = 20) => fetcher(`/anime/trending?limit=${limit}`),
        popular: (limit = 20) => fetcher(`/anime/popular?limit=${limit}`),
        details: (id: string) => fetcher(`/anime/${id}`),
        search: (q: string) => fetcher(`/anime/search?q=${encodeURIComponent(q)}`),
        comments: (animeId: string) => fetcher(`/comments/anime/${animeId}`),
    },
    watchlist: {
        add: (animeId: string, status = "watching", token: string) =>
            fetcher("/watchlist", {
                method: "POST",
                body: JSON.stringify({ anime_id: animeId, status }),
                headers: { Authorization: `Bearer ${token}` }
            }),
        remove: (animeId: string, token: string) =>
            fetcher(`/watchlist/${animeId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }),
        list: (token: string) =>
            fetcher("/watchlist", {
                headers: { Authorization: `Bearer ${token}` }
            }),
    },
    reactions: {
        create: (animeId: string, type: string, token: string) =>
            fetcher("/reactions", {
                method: "POST",
                body: JSON.stringify({ anime_id: animeId, reaction_type: type }),
                headers: { Authorization: `Bearer ${token}` }
            }),
        getForAnime: (animeId: string) => fetcher(`/reactions/anime/${animeId}`),
    },
    battles: {
        list: (page = 1, limit = 20) => fetcher(`/battles?page=${page}&limit=${limit}`),
        details: (id: string) => fetcher(`/battles/${id}`),
        vote: (id: string, vote_for: "A" | "B", token: string) =>
            fetcher(`/battles/${id}/vote`, {
                method: "POST",
                body: JSON.stringify({ vote_for }),
                headers: { Authorization: `Bearer ${token}` }
            }),
    },
    community: {
        posts: () => fetcher("/community/posts"), // Assuming this endpoint exists based on the request
    },
    auth: {
        signup: (data: any) => fetcher("/auth/signup", {
            method: "POST",
            body: JSON.stringify(data)
        }),
        login: (data: any) => fetcher("/auth/login", {
            method: "POST",
            body: JSON.stringify(data)
        }),
        logout: (token: string) => fetcher("/auth/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        }),
        me: (token: string) => fetcher("/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        }),
    }
};
