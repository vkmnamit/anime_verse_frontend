/* ========================================
   Kitsu API Types & Transformed Types
   ======================================== */

/** Raw Kitsu API anime resource */
export interface KitsuAnimeAttributes {
    createdAt: string;
    updatedAt: string;
    slug: string;
    synopsis: string;
    description: string;
    canonicalTitle: string;
    titles: Record<string, string>;
    abbreviatedTitles: string[];
    averageRating: string | null;
    ratingFrequencies: Record<string, string>;
    userCount: number;
    favoritesCount: number;
    startDate: string | null;
    endDate: string | null;
    popularityRank: number;
    ratingRank: number | null;
    ageRating: string | null;
    ageRatingGuide: string | null;
    subtype: string;
    status: string;
    episodeCount: number | null;
    episodeLength: number | null;
    totalLength: number | null;
    posterImage: {
        tiny: string;
        large: string;
        small: string;
        medium: string;
        original: string;
    } | null;
    coverImage: {
        tiny: string;
        large: string;
        small: string;
        original: string;
    } | null;
}

export interface KitsuAnimeResource {
    id: string;
    type: "anime";
    attributes: KitsuAnimeAttributes;
    relationships?: Record<string, { links: { self: string; related: string } }>;
}

export interface KitsuCategoryResource {
    id: string;
    type: "categories";
    attributes: {
        title: string;
        slug: string;
    };
}

export interface KitsuResponse<T> {
    data: T;
    included?: KitsuCategoryResource[];
    meta?: { count: number };
    links?: Record<string, string>;
}

/* ========================================
   Transformed Types (for UI consumption)
   ======================================== */

export interface AnimeCard {
    id: string;
    title: string;
    slug: string;
    synopsis: string;
    posterImage: string;
    coverImage: string | null;
    averageRating: number | null;
    popularityRank: number;
    ratingRank: number | null;
    userCount: number;
    episodeCount: number | null;
    status: string;
    subtype: string;
    startDate: string | null;
    categories: string[];
    /** Derived mood/vibe tags for the card */
    vibeTags: string[];
    /** Sentiment label based on rating */
    sentimentLabel: string;
    /** Loved percentage (derived from rating frequencies) */
    lovedPercentage: number;
}

/** Section types for home page */
export type HomeSection = "trending" | "popular" | "highest_rated" | "upcoming" | "underrated";
