import Link from "next/link";
import Image from "next/image";
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
    const [trending, action, romance, fantasy, adventure, topRated] = await Promise.all([
        getTrendingAnime(10),
        getAnimeByCategory("action", 10),
        getAnimeByCategory("romance", 10),
        getAnimeByCategory("fantasy", 10),
        getAnimeByCategory("adventure", 10),
        getTopRatedAnime(10),
    ]);

    const heroAnimeList = trending.slice(0, 4);

    return (
        <div className="relative min-h-screen bg-[#0b0b0f]">
            <div className="relative z-10 w-full">
                <Navbar noSpacer />

                <main>
                    {/* Hero Banner — Full width, overlaps behind navbar */}
                    <div className="w-full">
                        {heroAnimeList.length > 0 && <HeroBanner animeList={heroAnimeList} />}
                    </div>

                    {/* Carousels — Netflix-style tight rows */}
                    <div className="relative z-20 -mt-20 lg:-mt-32 space-y-6 lg:space-y-10 pb-12">
                        <Carousel title="Trending Now">
                            {trending.map((anime, i) => (
                                <AnimeCard key={anime.id} anime={anime} index={i} />
                            ))}
                        </Carousel>

                        <Carousel title="Adrenaline: Top Action Anime">
                            {action.map((anime, i) => (
                                <AnimeCard key={anime.id} anime={anime} index={i + 5} />
                            ))}
                        </Carousel>

                        <Carousel title="Heartfelt Romance">
                            {romance.map((anime, i) => (
                                <AnimeCard key={anime.id} anime={anime} index={i + 10} />
                            ))}
                        </Carousel>

                        <Carousel title="Epic Fantasy Worlds">
                            {fantasy.map((anime, i) => (
                                <AnimeCard key={anime.id} anime={anime} index={i + 15} />
                            ))}
                        </Carousel>

                        <Carousel title="Grand Adventures">
                            {adventure.map((anime, i) => (
                                <AnimeCard key={anime.id} anime={anime} index={i + 20} />
                            ))}
                        </Carousel>

                        <Carousel title="Top Rated of All Time">
                            {topRated.map((anime, i) => (
                                <AnimeCard key={anime.id} anime={anime} index={i + 25} />
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
