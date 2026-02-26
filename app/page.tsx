import Navbar from "@/src/components/Navbar/Navbar";
import HeroBanner from "@/src/components/HeroBanner/HeroBanner";
import Carousel from "@/src/components/Carousel/Carousel";
import AnimeCard from "@/src/components/AnimeCard/AnimeCard";
import InfiniteAnimeGrid from "@/src/components/InfiniteAnimeGrid/InfiniteAnimeGrid";
import {
    getTrendingAnime,
    getPopularAnime,
    getTopRatedAnime,
    getAnimeByCategory,
} from "@/src/lib/kitsu";
import { BecauseYouWatchedSection } from "@/src/components/BecauseYouWatched/BecauseYouWatched";

export default async function HomePage() {
    const [trending, popular, topRated, underrated] = await Promise.all([
        getTrendingAnime(10),
        getPopularAnime(10),
        getTopRatedAnime(10),
        getAnimeByCategory("slice-of-life", 10),
    ]);

    const heroAnimeList = trending.slice(0, 4);

    return (
        <div className="relative min-h-screen bg-[#0b0b0f]">
            <div className="relative z-10 w-full">
                <Navbar />

                <main>
                    {/* Hero Banner — Full width, overlaps behind navbar */}
                    <div className="w-full">
                        {heroAnimeList.length > 0 && <HeroBanner animeList={heroAnimeList} />}
                    </div>

                    {/* Carousels — Netflix-style tight rows */}
                    <div className="relative z-20 -mt-20 lg:-mt-32 space-y-6 lg:space-y-10 pb-12">
                        {/* Dynamic "Because you watched" — fetches from user's watchlist */}
                        <BecauseYouWatchedSection fallbackAnime={popular.slice(0, 10)} />

                        <Carousel title="Underrated Gems">
                            {underrated.map((anime, i) => (
                                <AnimeCard key={anime.id} anime={anime} index={i + 5} />
                            ))}
                        </Carousel>

                        <Carousel title="Trending This Season">
                            {trending.slice(1).map((anime, i) => (
                                <AnimeCard key={anime.id} anime={anime} index={i + 2} />
                            ))}
                        </Carousel>

                        <Carousel title="Top Rated of All Time">
                            {topRated.map((anime, i) => (
                                <AnimeCard key={anime.id} anime={anime} index={i + 8} />
                            ))}
                        </Carousel>
                    </div>

                    {/* Infinite Grid — See "All" Cards */}
                    <div className="pb-24">
                        <InfiniteAnimeGrid />
                    </div>
                </main>
            </div>
        </div>
    );
}
