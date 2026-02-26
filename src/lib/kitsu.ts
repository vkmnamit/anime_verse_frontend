/* ============================================
   Kitsu API Service
   https://kitsu.io/api/edge
   ============================================ */

const BASE = "https://kitsu.io/api/edge";

export interface KitsuAnime {
    id: string;
    type: "anime";
    attributes: {
        slug: string;
        canonicalTitle: string;
        titles: { en?: string; en_jp?: string; ja_jp?: string };
        synopsis: string;
        averageRating: string | null;
        userCount: number;
        favoritesCount: number;
        startDate: string | null;
        endDate: string | null;
        popularityRank: number | null;
        ratingRank: number | null;
        ageRating: string | null;
        subtype: string;
        status: string;
        episodeCount: number | null;
        posterImage: {
            tiny: string;
            small: string;
            medium: string;
            large: string;
            original: string;
        } | null;
        coverImage: {
            tiny: string;
            small: string;
            large: string;
            original: string;
        } | null;
        showType: string;
    };
    relationships?: {
        categories?: { links: { related: string } };
        genres?: { links: { related: string } };
    };
}

export interface KitsuCategory {
    id: string;
    attributes: {
        title: string;
        slug: string;
    };
}

export interface AnimeCard {
    id: string;
    title: string;
    slug: string;
    posterImage: string;
    coverImage: string | null;
    rating: number | null;
    synopsis: string;
    episodeCount: number | null;
    status: string;
    subtype: string;
    popularityRank: number | null;
    ratingRank: number | null;
    userCount: number;
    categories: string[];
    ageRating: string | null;
}

/* ---- Transform raw Kitsu data into clean card ---- */
function transformAnime(anime: KitsuAnime, categories?: string[]): AnimeCard {
    const a = anime.attributes;
    return {
        id: anime.id,
        title: a.canonicalTitle,
        slug: a.slug,
        posterImage:
            a.posterImage?.large || a.posterImage?.medium || a.posterImage?.small || "",
        coverImage: a.coverImage?.large || a.coverImage?.original || null,
        rating: a.averageRating ? parseFloat(a.averageRating) : null,
        synopsis: a.synopsis || "",
        episodeCount: a.episodeCount,
        status: a.status,
        subtype: a.subtype,
        popularityRank: a.popularityRank,
        ratingRank: a.ratingRank,
        userCount: a.userCount,
        categories: categories || [],
        ageRating: a.ageRating,
    };
}

/* ---- Fetch categories for an anime ---- */
async function fetchCategories(animeId: string): Promise<string[]> {
    try {
        const res = await fetch(
            `${BASE}/anime/${animeId}/categories?fields[categories]=title&page[limit]=5`,
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) return [];
        const json = await res.json();
        return (json.data || []).map(
            (c: KitsuCategory) => c.attributes.title
        );
    } catch {
        return [];
    }
}

/* ---- Fetch a list of anime with categories ---- */
async function fetchAnimeList(
    url: string,
    limit = 20
): Promise<AnimeCard[]> {
    try {
        const res = await fetch(url, { next: { revalidate: 600 } });
        if (!res.ok) return [];
        const json = await res.json();
        const animeList: KitsuAnime[] = json.data || [];

        // Fetch categories in parallel
        const results = await Promise.all(
            animeList.slice(0, limit).map(async (anime) => {
                const cats = await fetchCategories(anime.id);
                return transformAnime(anime, cats);
            })
        );
        return results;
    } catch {
        return [];
    }
}

/* ============================================
   Public API Functions
   ============================================ */

/** Trending anime (most activity recently) */
export async function getTrendingAnime(limit = 20): Promise<AnimeCard[]> {
    return fetchAnimeList(
        `${BASE}/trending/anime?limit=${limit}`,
        limit
    );
}

/** Most popular anime (by user count) */
export async function getPopularAnime(limit = 20): Promise<AnimeCard[]> {
    return fetchAnimeList(
        `${BASE}/anime?sort=-userCount&page[limit]=${limit}&fields[anime]=slug,canonicalTitle,titles,synopsis,averageRating,userCount,favoritesCount,startDate,endDate,popularityRank,ratingRank,ageRating,subtype,status,episodeCount,posterImage,coverImage,showType`,
        limit
    );
}

/** Highest rated anime */
export async function getTopRatedAnime(limit = 20): Promise<AnimeCard[]> {
    return fetchAnimeList(
        `${BASE}/anime?sort=-averageRating&page[limit]=${limit}&filter[averageRating]=70..&fields[anime]=slug,canonicalTitle,titles,synopsis,averageRating,userCount,favoritesCount,startDate,endDate,popularityRank,ratingRank,ageRating,subtype,status,episodeCount,posterImage,coverImage,showType`,
        limit
    );
}

/** Anime by category slug (e.g. "action", "romance") */
export async function getAnimeByCategory(
    categorySlug: string,
    limit = 20
): Promise<AnimeCard[]> {
    return fetchAnimeList(
        `${BASE}/anime?filter[categories]=${categorySlug}&sort=-userCount&page[limit]=${limit}&fields[anime]=slug,canonicalTitle,titles,synopsis,averageRating,userCount,favoritesCount,startDate,endDate,popularityRank,ratingRank,ageRating,subtype,status,episodeCount,posterImage,coverImage,showType`,
        limit
    );
}

/** Search anime by title */
export async function searchAnime(
    query: string,
    limit = 20
): Promise<AnimeCard[]> {
    return fetchAnimeList(
        `${BASE}/anime?filter[text]=${encodeURIComponent(query)}&page[limit]=${limit}&fields[anime]=slug,canonicalTitle,titles,synopsis,averageRating,userCount,favoritesCount,startDate,endDate,popularityRank,ratingRank,ageRating,subtype,status,episodeCount,posterImage,coverImage,showType`,
        limit
    );
}

/** Get a single anime by ID (with full details) */
export async function getAnimeById(id: string): Promise<AnimeCard | null> {
    try {
        const res = await fetch(`${BASE}/anime/${id}`, {
            next: { revalidate: 600 },
        });
        if (!res.ok) return null;
        const json = await res.json();
        const cats = await fetchCategories(id);
        return transformAnime(json.data, cats);
    } catch {
        return null;
    }
}

/** Get all anime with pagination */
export async function getPaginatedAnime(offset = 0, limit = 20): Promise<AnimeCard[]> {
    return fetchAnimeList(
        `${BASE}/anime?page[limit]=${limit}&page[offset]=${offset}&sort=-userCount&fields[anime]=slug,canonicalTitle,titles,synopsis,averageRating,userCount,favoritesCount,startDate,endDate,popularityRank,ratingRank,ageRating,subtype,status,episodeCount,posterImage,coverImage,showType`,
        limit
    );
}
