const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

let onAuthErrorCallback: (() => void) | null = null;

export const setOnAuthError = (callback: () => void) => {
    onAuthErrorCallback = callback;
};

async function fetcher(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    console.log(`[API] Fetching: ${url}`);
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    if (!res.ok) {
        let errorMessage = "API request failed";
        try {
            const errorData = await res.clone().json();
            errorMessage = errorData.error?.message || errorData.message || errorMessage;

            // If there are specific validation errors in details, append them
            const details = errorData.error?.details || errorData.details;
            if (details && Array.isArray(details)) {
                errorMessage = `${errorMessage}: ${details.join(", ")}`;
            }
        } catch (e) {
            try {
                const text = await res.text();
                if (text) errorMessage = text;
            } catch (e2) { }
        }

        // Handle 404s gracefully for demo purposes
        if (res.status === 404) {
            console.warn(`[API] 404 Not Found: ${url}`);
            return null; // Return null so the frontend can use fallbacks
        }

        // Handle 401s (expired/invalid tokens)
        if (res.status === 401) {
            console.warn(`[API] 401 Unauthorized: ${url}`);
            if (onAuthErrorCallback) onAuthErrorCallback();
        }

        throw new Error(errorMessage);
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
    comments: {
        create: (animeId: string, content: string, token: string, parentId?: string, animeData?: any) =>
            fetcher("/comments", {
                method: "POST",
                body: JSON.stringify({ anime_id: animeId, content, parent_id: parentId, anime_data: animeData }),
                headers: { Authorization: `Bearer ${token}` }
            }),
        delete: (commentId: string, token: string) =>
            fetcher(`/comments/${commentId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }),
    },
    watchlist: {
        add: (animeId: string | number, status = "watching", token: string, animeData?: any) =>
            fetcher("/watchlist", {
                method: "POST",
                body: JSON.stringify({ anime_id: String(animeId), status, anime_data: animeData }),
                headers: { Authorization: `Bearer ${token}` }
            }),
        remove: (animeId: string | number, token: string) =>
            fetcher(`/watchlist/${String(animeId)}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }),
        list: (token: string) =>
            fetcher("/watchlist", {
                headers: { Authorization: `Bearer ${token}` }
            }),
        getPublicList: (username: string) => fetcher(`/watchlist/${username}`),
    },
    reactions: {
        create: (animeId: string | number, type: string, token: string) =>
            fetcher("/reactions", {
                method: "POST",
                body: JSON.stringify({ anime_id: String(animeId), reaction_type: type }),
                headers: { Authorization: `Bearer ${token}` }
            }),
        getForAnime: (animeId: string | number) => fetcher(`/reactions/anime/${String(animeId)}`),
        getMine: (animeId: string | number, token: string) => fetcher(`/reactions/me/${String(animeId)}`, {
            headers: { Authorization: `Bearer ${token}` }
        }),
        remove: (animeId: string | number, token: string) => fetcher(`/reactions/${String(animeId)}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        }),
    },
    battles: {
        list: (page = 1, limit = 20) => fetcher(`/battles?page=${page}&limit=${limit}`),
        today: () => fetcher(`/battles/today`),
        details: (id: string, token?: string) => fetcher(`/battles/${id}`, token ? {
            headers: { Authorization: `Bearer ${token}` }
        } : {}),
        vote: (id: string, vote_for: "A" | "B", token: string) =>
            fetcher(`/battles/${id}/vote`, {
                method: "POST",
                body: JSON.stringify({ vote_for }),
                headers: { Authorization: `Bearer ${token}` }
            }),
        myVotes: (token: string) => fetcher("/battles/my-votes", {
            headers: { Authorization: `Bearer ${token}` }
        }),
        advance: (day_number: number, token: string) =>
            fetcher("/battles/advance", {
                method: "POST",
                body: JSON.stringify({ day_number }),
                headers: { Authorization: `Bearer ${token}` }
            }),
    },
    user: {
        getProfile: (username: string) => fetcher(`/users/${username}`),
        getStats: (username: string) => fetcher(`/users/${username}/stats`),
        getMyStats: (token: string) => fetcher("/users/me/stats", {
            headers: { Authorization: `Bearer ${token}` }
        }),
        updateProfile: (data: { username?: string; bio?: string; avatar_url?: string; genres?: string[] }, token: string) =>
            fetcher("/users/me", {
                method: "PATCH",
                body: JSON.stringify(data),
                headers: { Authorization: `Bearer ${token}` }
            }),
        getComments: (username: string) => fetcher(`/users/${username}/comments`),
        getVotedBattles: (username: string) => fetcher(`/users/${username}/battles`),
    },
    community: {
        posts: (params: any = {}) => {
            const query = new URLSearchParams(params).toString();
            return fetcher(`/posts?${query}`);
        },
        list: () => fetcher("/community"),
        details: (slug: string) => fetcher(`/community/${slug}`),
        create: (data: { name: string; description?: string }, token: string) =>
            fetcher("/community", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { Authorization: `Bearer ${token}` }
            }),
        toggleLike: (id: string | number, token: string) => fetcher(`/posts/${id}/like`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        }),
        getLikedPosts: (token: string) => fetcher("/posts/likes/me", {
            headers: { Authorization: `Bearer ${token}` }
        }),
        createPost: (data: { title: string; content?: string; image_url?: string; community_id?: string; community_name?: string; is_spoiler?: boolean; meta_tag?: string }, token: string) =>
            fetcher("/posts", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { Authorization: `Bearer ${token}` }
            }),
        getPostComments: (postId: string | number) => fetcher(`/posts/${postId}/comments`),
        addComment: (postId: string | number, content: string, token: string) =>
            fetcher(`/posts/${postId}/comment`, {
                method: "POST",
                body: JSON.stringify({ content }),
                headers: { Authorization: `Bearer ${token}` }
            }),
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
