import { AnimeCard as FrontendAnime } from './kitsu';

/**
 * Maps a backend anime object (from our DB) to the FrontendAnime (AnimeCard) type
 * Used to maintain compatibility with existing UI components while fetching from our own API.
 */
export function mapBackendToFrontend(a: any): FrontendAnime {
    if (!a) return null as any;

    return {
        id: String(a.id),
        title: a.title || "Untitled",
        slug: a.slug || a.title?.toLowerCase().replace(/\s+/g, '-'),
        posterImage: a.cover_image || a.poster_image || a.banner_image || "",
        coverImage: a.banner_image || a.cover_image || null,
        rating: a.average_score || null,
        synopsis: a.synopsis || "",
        episodeCount: a.episodes || null,
        status: a.status || "finished",
        subtype: a.subtype || "TV",
        popularityRank: a.popularity_rank || null,
        ratingRank: a.rating_rank || null,
        userCount: a.user_count || 0,
        categories: Array.isArray(a.genres) ? a.genres : [],
        ageRating: a.age_rating || "PG",
        startDate: a.start_date || a.release_date || null,
    };
}
