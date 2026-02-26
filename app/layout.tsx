import type { Metadata } from "next";
import { Inter, Rubik } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AnimeVerse — Your Anime Social Universe",
  description:
    "Discover trending anime, share opinions, battle favorites, and join the ultimate anime community.",
};

import { AnimeModalProvider } from "@/src/context/AnimeModalContext";
import { AuthProvider } from "@/src/context/AuthContext";
import AnimeDetailModal from "@/src/components/AnimeDetailModal/AnimeDetailModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${rubik.variable} antialiased font-sans bg-[#0b0b0f]`}>
        <AuthProvider>
          <AnimeModalProvider>
            {children}
            <AnimeDetailModal />
          </AnimeModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
