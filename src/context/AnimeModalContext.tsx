"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { AnimeCard } from "@/src/lib/kitsu";

interface AnimeModalContextType {
    selectedAnime: AnimeCard | null;
    isOpen: boolean;
    openModal: (anime: AnimeCard) => void;
    closeModal: () => void;
}

const AnimeModalContext = createContext<AnimeModalContextType | undefined>(undefined);

export function AnimeModalProvider({ children }: { children: ReactNode }) {
    const [selectedAnime, setSelectedAnime] = useState<AnimeCard | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = (anime: AnimeCard) => {
        setSelectedAnime(anime);
        setIsOpen(true);
        // Prevent scrolling on body when modal is open
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setIsOpen(false);
        setSelectedAnime(null);
        document.body.style.overflow = "unset";
    };

    return (
        <AnimeModalContext.Provider value={{ selectedAnime, isOpen, openModal, closeModal }}>
            {children}
        </AnimeModalContext.Provider>
    );
}

export function useAnimeModal() {
    const context = useContext(AnimeModalContext);
    if (!context) {
        throw new Error("useAnimeModal must be used within an AnimeModalProvider");
    }
    return context;
}
