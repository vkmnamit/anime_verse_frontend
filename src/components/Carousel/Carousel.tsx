"use client";

import { useRef } from "react";

interface Props {
    title: string;
    icon?: string;
    children: React.ReactNode;
}

export default function Carousel({ title, children }: Props) {
    const trackRef = useRef<HTMLDivElement>(null);

    function scroll(direction: "left" | "right") {
        if (!trackRef.current) return;
        const amount = trackRef.current.clientWidth * 0.7;
        trackRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    }

    return (
        <section className="relative mb-8 lg:mb-12">
            {/* Header — Netflix-style small title */}
            <div className="mb-3 lg:mb-4 px-8 sm:px-12 lg:px-[60px]">
                <h2
                    className="text-sm lg:text-xl font-bold text-white/90 tracking-normal"
                    style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
                >
                    {title}
                </h2>
            </div>

            {/* Track Container */}
            <div className="relative px-8 sm:px-12 lg:px-[60px]">
                <div
                    ref={trackRef}
                    className="flex gap-2 lg:gap-3 overflow-x-auto py-1 scrollbar-hide no-scrollbar snap-x"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {children}
                </div>
            </div>
        </section>
    );
}
