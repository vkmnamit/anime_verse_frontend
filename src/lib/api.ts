const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

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
        create: (animeId: string, content: string, token: string, parentId?: string) =>
            fetcher("/comments", {
                method: "POST",
                body: JSON.stringify({ anime_id: animeId, content, parent_id: parentId }),
                headers: { Authorization: `Bearer ${token}` }
            }),
        delete: (commentId: string, token: string) =>
            fetcher(`/comments/${commentId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            }),
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
