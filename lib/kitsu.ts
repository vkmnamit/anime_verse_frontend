import {
    KitsuAnimeResource,
    KitsuResponse,
    KitsuCategoryResource,
    AnimeCard,
} from "./types";

const KITSU_BASE = "https://kitsu.io/api/edge";
const HEADERS = { Accept: "application/vnd.api+json" };

/* ========================================
   Kitsu API Fetcher
   ======================================== */

async function kitsuFetch<T>(path: string): Promise<T> {
    const res = await fetch(`${KITSU_BASE}${path}`, {
        headers: HEADERS,
        next: { revalidate: 300 }, // cache 5 minutes
    });
    if (!res.ok) throw new Error(`Kitsu API error: ${res.status}`);
    return res.json();
}

/* ========================================
   Category genre-to-vibe mapping
   ======================================== */

const VIBE_MAP: Record<string, string> = {
    Action: "Action",
    Adventure: "Adventure",
    Fantasy: "Fantasy",
    Horror: "Dark & Intense",
    Drama: "Drama",
    Romance: "Romance",
    Comedy: "Comedy",
    "Sci-Fi": "Sci-Fi",
    "Science Fiction": "Sci-Fi",
    Thriller: "Thriller",
    Mystery: "Mystery",
    "Slice of Life": "Slice of Life",
    "Super Power": "Super Power",
    Violence: "Dark & Intense",
    Psychological: "Mind-bending",
    "Mahou Shoujo": "Magical Girl",
    Mecha: "Mecha",
    Sports: "Sports",
    Music: "Music",
    "Post Apocalypse": "Dark & Intense",
    Angst: "Dark & Intense",
    "Martial Arts": "Action",
    "High School": "High School",
};

function categoriesToVibes(categories: string[]): string[] {
    const vibes = new Set<string>();
    for (const cat of categories) {
        const vibe = VIBE_MAP[cat];
        if (vibe) vibes.add(vibe);
    }
    return Array.from(vibes).slice(0, 2);
}

/* ========================================
   Sentiment & Rating helpers
   ======================================== */

function computeLovedPercentage(ratingFreqs: Record<string, string>): number {
    let total = 0;
    let loved = 0;
    for (const [key, val] of Object.entries(ratingFreqs)) {
        const count = parseInt(val, 10);
        total += count;
        // Ratings 14-20 (7-10 on 10-point scale) count as "loved"
        if (parseInt(key, 10) >= 14) loved += count;
    }
    return total > 0 ? Math.round((loved / total) * 100) : 0;
}

function deriveSentimentLabel(rating: number | null, lovedPct: number): string {
    if (!rating) return "New";
    if (rating >= 85 && lovedPct >= 85) return "Masterpiece";
    if (rating >= 80) return "Fire";
    if (rating >= 70) return "Solid";
    if (rating >= 60) return "Mid";
    if (lovedPct < 40) return "Controversial";
    return "Mixed";
}

/* ========================================
   Transform Kitsu data → AnimeCard
   ======================================== */

function transformAnime(
    raw: KitsuAnimeResource,
    includedCategories?: KitsuCategoryResource[]
): AnimeCard {
    const a = raw.attributes;
    const rating = a.averageRating ? parseFloat(a.averageRating) : null;
    const lovedPct = computeLovedPercentage(a.ratingFrequencies);

    // Extract categories for this anime from included data
    const categories: string[] = [];
    if (includedCategories) {
        categories.push(...includedCategories.map((c) => c.attributes.title));
    }

    return {
        id: raw.id,
        title: a.canonicalTitle,
        slug: a.slug,
        synopsis: a.synopsis || a.description || "",
        posterImage: a.posterImage?.large || a.posterImage?.medium || "",
        coverImage: a.coverImage?.large || a.coverImage?.original || null,
        averageRating: rating,
        popularityRank: a.popularityRank,
        ratingRank: a.ratingRank,
        userCount: a.userCount,
        episodeCount: a.episodeCount,
        status: a.status,
        subtype: a.subtype,
        startDate: a.startDate,
        categories,
        vibeTags: categoriesToVibes(categories),
        sentimentLabel: deriveSentimentLabel(rating, lovedPct),
        lovedPercentage: lovedPct,
    };
}

/* ========================================
   Public API functions
   ======================================== */

/** Fetch trending anime (Kitsu trending endpoint) */
export async function fetchTrending(limit = 10): Promise<AnimeCard[]> {
    const data = await kitsuFetch<KitsuResponse<KitsuAnimeResource[]>>(
        `/trending/anime?limit=${limit}`
    );
    return data.data.map((a) => transformAnime(a));
}

/** Fetch popular anime (sorted by user count) */
export async function fetchPopular(limit = 20): Promise<AnimeCard[]> {
    const data = await kitsuFetch<KitsuResponse<KitsuAnimeResource[]>>(
        `/anime?sort=-userCount&page%5Blimit%5D=${limit}`
    );
    return data.data.map((a) => transformAnime(a));
}

/** Fetch highest rated anime */
export async function fetchHighestRated(limit = 20): Promise<AnimeCard[]> {
    const data = await kitsuFetch<KitsuResponse<KitsuAnimeResource[]>>(
        `/anime?sort=-averageRating&page%5Blimit%5D=${limit}`
    );
    return data.data.map((a) => transformAnime(a));
}

/** Fetch a single anime by ID with categories included */
export async function fetchAnimeById(id: string): Promise<AnimeCard> {
    const data = await kitsuFetch<KitsuResponse<KitsuAnimeResource>>(
        `/anime/${id}?include=categories&fields%5Bcategories%5D=title,slug`
    );
    const included = data.included || [];
    return transformAnime(data.data, included);
}

/** Fetch multiple anime by IDs */
export async function fetchAnimeByIds(ids: string[]): Promise<AnimeCard[]> {
    const idStr = ids.join(",");
    const data = await kitsuFetch<KitsuResponse<KitsuAnimeResource[]>>(
        `/anime?filter%5Bid%5D=${idStr}&include=categories&fields%5Bcategories%5D=title,slug`
    );

    // Build a map of anime ID → categories from included data
    const categoryMap = new Map<string, KitsuCategoryResource[]>();

    // For the include approach, categories are linked via relationships
    // We need to do per-anime category fetching for accurate data
    // For now, attach all included categories (shared pool)
    const allCats = data.included || [];

    return data.data.map((a) => transformAnime(a, allCats));
}

/** Fetch categories for a specific anime */
export async function fetchAnimeCategories(animeId: string): Promise<string[]> {
    const data = await kitsuFetch<KitsuResponse<KitsuCategoryResource[]>>(
        `/anime/${animeId}/categories?fields%5Bcategories%5D=title`
    );
    return data.data.map((c) => c.attributes.title);
}

/** Fetch anime with categories enriched (batch of anime cards) */
export async function fetchTrendingWithCategories(limit = 10): Promise<AnimeCard[]> {
    const trending = await fetchTrending(limit);

    // Enrich top anime with categories in parallel (limit to avoid rate limiting)
    const enriched = await Promise.all(
        trending.map(async (anime) => {
            try {
                const categories = await fetchAnimeCategories(anime.id);
                return {
                    ...anime,
                    categories,
                    vibeTags: categoriesToVibes(categories),
                };
            } catch {
                return anime;
            }
        })
    );

    return enriched;
}

/** Fetch popular anime with categories enriched */
export async function fetchPopularWithCategories(limit = 20): Promise<AnimeCard[]> {
    const popular = await fetchPopular(limit);

    const enriched = await Promise.all(
        popular.map(async (anime) => {
            try {
                const categories = await fetchAnimeCategories(anime.id);
                return {
                    ...anime,
                    categories,
                    vibeTags: categoriesToVibes(categories),
                };
            } catch {
                return anime;
            }
        })
    );

    return enriched;
}

/** Search anime by text */
export async function searchAnime(query: string, limit = 20): Promise<AnimeCard[]> {
    const data = await kitsuFetch<KitsuResponse<KitsuAnimeResource[]>>(
        `/anime?filter%5Btext%5D=${encodeURIComponent(query)}&page%5Blimit%5D=${limit}`
    );
    return data.data.map((a) => transformAnime(a));
}

/** Fetch "underrated gems" — high rating but low popularity */
export async function fetchUnderratedGems(limit = 20): Promise<AnimeCard[]> {
    // Get highly rated anime that aren't in the top popular
    const data = await kitsuFetch<KitsuResponse<KitsuAnimeResource[]>>(
        `/anime?sort=-averageRating&page%5Blimit%5D=${limit}&page%5Boffset%5D=50`
    );

    const gems = data.data
        .filter((a) => a.attributes.userCount < 100000 && a.attributes.averageRating)
        .map((a) => transformAnime(a));

    // Enrich with categories
    const enriched = await Promise.all(
        gems.map(async (anime) => {
            try {
                const categories = await fetchAnimeCategories(anime.id);
                return {
                    ...anime,
                    categories,
                    vibeTags: categoriesToVibes(categories),
                    sentimentLabel: "Underrated",
                };
            } catch {
                return { ...anime, sentimentLabel: "Underrated" };
            }
        })
    );

    return enriched;
}

/** Fetch upcoming anime */
export async function fetchUpcoming(limit = 10): Promise<AnimeCard[]> {
    const data = await kitsuFetch<KitsuResponse<KitsuAnimeResource[]>>(
        `/anime?filter%5Bstatus%5D=upcoming&sort=-userCount&page%5Blimit%5D=${limit}`
    );
    return data.data.map((a) => transformAnime(a));
}
