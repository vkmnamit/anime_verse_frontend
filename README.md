<![CDATA[<div align="center">

# 🌌 AnimeVerse — Frontend

**Your Anime Social Universe**

A premium, cinematic anime discovery and social platform built with **Next.js 16**, **React 19**, and **Tailwind CSS v4**.  
Browse trending anime, battle your favorites, explore community discussions, manage your watchlist, and more — all wrapped in a stunning dark + fiery UI.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 📸 Overview

AnimeVerse is a full-featured anime discovery platform that combines:

- 🎬 **Netflix-style** browsing experience with carousels and hero banners
- 🔥 **Trending & popular** anime powered by the [Kitsu API](https://kitsu.docs.apiary.io/)
- ⚔️ **Anime Battles** — vote for your favorite in head-to-head matchups
- 💬 **Community Feed** — share opinions, discuss theories, and engage with fellow fans
- 👤 **User Profiles** — track stats, badges, genres, watchlist, and schedule
- 🔍 **Discover Page** — browse by genre, category, and mood with intelligent search
- 📋 **Watchlist** — save anime with status tracking (watching, completed, plan to watch)
- 🔐 **Authentication** — full signup / login / logout with JWT-based sessions

---

## 🛠️ Tech Stack

| Layer          | Technology                                                     |
| -------------- | -------------------------------------------------------------- |
| **Framework**  | [Next.js 16](https://nextjs.org/) (App Router)                |
| **UI Library** | [React 19](https://react.dev/) with Server & Client Components |
| **Language**   | [TypeScript 5](https://www.typescriptlang.org/)               |
| **Styling**    | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config) |
| **Fonts**      | [Inter](https://fonts.google.com/specimen/Inter) & [Rubik](https://fonts.google.com/specimen/Rubik) via `next/font/google` |
| **Image CDN**  | [Kitsu Media](https://media.kitsu.app), [Unsplash](https://unsplash.com), Cloudflare R2 |
| **Data Source** | [Kitsu API](https://kitsu.io/api/edge) (anime data) + Custom Backend REST API |
| **State Mgmt** | React Context API (`AuthContext`, `AnimeModalContext`)         |
| **PostCSS**    | `@tailwindcss/postcss` + `autoprefixer`                       |

---

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (fonts, providers, global modal)
│   ├── page.tsx                  # Home page (hero, carousels, infinite grid)
│   ├── globals.css               # Global design system (dark + fiery theme)
│   ├── auth/
│   │   └── page.tsx              # Login / Signup page
│   ├── battles/
│   │   ├── page.tsx              # Active battles listing
│   │   └── [id]/
│   │       └── page.tsx          # Individual battle detail & voting
│   ├── community/
│   │   └── page.tsx              # Community feed, sidebar, trending
│   ├── discover/
│   │   └── page.tsx              # Genre browsing, category filters, search
│   ├── profile/
│   │   └── [username]/
│   │       └── page.tsx          # User profile with stats, badges, schedule
│   └── trending/
│       └── page.tsx              # Trending rankings with sidebar
│
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── AnimeCard/            # Anime poster card with hover effects
│   │   ├── AnimeDetailModal/     # Full-screen anime detail overlay
│   │   ├── BecauseYouWatched/    # Personalized "Because you watched X" section
│   │   ├── Carousel/             # Horizontal scrolling Netflix-style carousel
│   │   ├── Community/            # Community page sub-components
│   │   │   ├── CommunityFeed.tsx
│   │   │   ├── CommunitySidebar.tsx
│   │   │   └── CommunityTrending.tsx
│   │   ├── HeroBanner/           # Auto-rotating cinematic hero banner
│   │   ├── InfiniteAnimeGrid/    # Infinite scroll anime browser
│   │   ├── MostDebated/          # Most debated anime section
│   │   ├── Navbar/               # Global navigation bar with search & auth
│   │   ├── Profile/              # Profile page sub-components
│   │   │   ├── ProfileHero.tsx
│   │   │   ├── ProfileSections.tsx
│   │   │   ├── ProfileTabs.tsx
│   │   │   └── ProfileWidgets.tsx
│   │   ├── TopBanner/            # Top announcement banner
│   │   └── Trending/             # Trending page sub-components
│   │       ├── TrendingList.tsx
│   │       └── TrendingSidebar.tsx
│   │
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.tsx        # Authentication state (user, token, login/signup/logout)
│   │   └── AnimeModalContext.tsx  # Global anime detail modal state
│   │
│   └── lib/                      # Utility libraries & API services
│       ├── api.ts                # Backend REST API client (auth, watchlist, battles, reactions)
│       ├── kitsu.ts              # Kitsu API service (trending, popular, search, categories)
│       └── community.ts         # Community data utilities
│
├── lib/                          # Shared types
│   └── types.ts                  # Kitsu API & transformed UI types
│
├── public/                       # Static assets (SVG icons, favicon)
├── next.config.ts                # Next.js config (image remote patterns)
├── postcss.config.mjs            # PostCSS config (Tailwind v4)
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies & scripts
└── .env.local                    # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or **yarn** / **pnpm**)
- (Optional) AnimeVerse Backend running locally for full functionality

### Installation

```bash
# Clone the repository
git clone git@github.com:vkmnamit/anime_verse_frontend.git
cd anime_verse_frontend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env.local` file in the project root (or edit the existing one):

```env
# Backend API URL — update this to your deployed backend if applicable
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Running the Dev Server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

### Building for Production

```bash
npm run build
npm start
```

---

## 📄 Pages & Features

### 🏠 Home Page (`/`)

The landing page provides a Netflix-inspired browsing experience:

- **Hero Banner** — Auto-rotating cinematic banner showcasing top 4 trending anime with cover images, synopsis, and a call-to-action button
- **"Because You Watched"** — Personalized recommendations based on the user's watchlist (falls back to popular anime for guests)
- **Curated Carousels** — Horizontal scroll rows for:
  - 💎 Underrated Gems (Slice-of-Life picks)
  - 🔥 Trending This Season
  - 🏆 Top Rated of All Time
- **Infinite Anime Grid** — Scroll infinitely through the entire anime library, auto-loaded in batches using Intersection Observer

### 🔐 Auth Page (`/auth`)

- Toggle between **Login** and **Sign Up** modes
- Cinematic background with glassmorphism form cards
- JWT-based authentication with automatic token persistence in `localStorage`
- Redirects to home page on successful auth

### 🔍 Discover Page (`/discover`)

- **Genre / Category Filters** — Browse anime by action, romance, supernatural, dark fantasy, and more
- **Search** — Real-time anime title search powered by Kitsu API
- **Grid View** — Responsive card grid with hover effects and quick detail access

### 🔥 Trending Page (`/trending`)

- **Trending List** — Full trending rankings with detailed cards
- **Sidebar** — Top gainers, heat metrics, and popularity rankings
- Cinematic fire/nebula background aesthetic

### ⚔️ Battles (`/battles`)

- **Active Battles List** — Browse head-to-head anime matchups with split-image cards showing both contenders
- **Battle Detail** (`/battles/[id]`) — Full battle view with:
  - Side-by-side anime cards (BattleCard component)
  - Real-time vote casting (A vs B)
  - Vote count and percentage display
  - Animated VS badge

### 💬 Community (`/community`)

- **Community Feed** — User posts, discussions, and anime opinions
- **Left Sidebar** — Navigation, categories, and quick links
- **Trending Sidebar** — Hot topics and trending discussions
- Blurred cinematic background

### 👤 Profile (`/profile/[username]`)

- **Profile Hero** — Avatar, bio, VIP badge, and interest tags
- **Tab Navigation** — Switch between profile sections
- **Three-Column Layout**:
  - **Left**: About Me, Badges (🏆 Debate Champion, 🏮 Top Theorist, etc.), Favorite Genres
  - **Center**: Stats Bar (Zap Points, Debates), Top Anime, Friends
  - **Right**: Recent Reactions, Watch Progress, Upcoming Schedule

---

## 🧩 Components

### Core Components

| Component              | Description                                                                                 |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `Navbar`               | Global navigation bar with logo, page links (Trending, Battles, Community, Discover), search toggle, and auth controls (login/avatar/dropdown) |
| `HeroBanner`           | Full-width cinematic hero with auto-rotating slides (8s interval), gradient overlays, and "Explore Details" CTA |
| `AnimeCard`            | Poster card with poster image, title, rating badge, hover scale animation, and click-to-open modal |
| `AnimeDetailModal`     | Full-screen overlay showing anime details — synopsis, rating, episode count, status, categories, watchlist toggle, reactions, comments, and "More Like This" carousel |
| `Carousel`             | Horizontal scroll container with title, scrollbar-hidden track, and responsive card sizing |
| `InfiniteAnimeGrid`    | Infinite-scroll container using Intersection Observer to load batches of 20 anime at a time |
| `BecauseYouWatched`    | Personalized section — fetches user's watchlist via API, picks a random title, and shows similar recommendations |
| `MostDebated`          | Card grid showing anime with debate badges, mood tags, and engagement metrics |
| `TopBanner`            | Announcement/promotional banner at the top of the page |

### Profile Components

| Component         | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `ProfileHero`     | Large banner with avatar, username, bio, and tags     |
| `ProfileTabs`     | Tab navigation for profile sections                   |
| `ProfileWidgets`  | About, Badges, Genres, Reactions, Progress, Schedule  |
| `ProfileSections` | Stats Bar, Top Anime grid, Friends section            |

### Community Components

| Component          | Description                        |
| ------------------ | ---------------------------------- |
| `CommunityFeed`    | Main post feed with interactions   |
| `CommunitySidebar` | Left navigation and categories     |
| `CommunityTrending`| Right sidebar with hot topics      |

### Trending Components

| Component        | Description                            |
| ---------------- | -------------------------------------- |
| `TrendingList`   | Full ranked list of trending anime     |
| `TrendingSidebar`| Rankings, top gainers, heat metrics    |

---

## 🔌 API Integration

### Kitsu API (`src/lib/kitsu.ts`)

The app fetches anime data from the public [Kitsu API](https://kitsu.io/api/edge):

| Function               | Endpoint                                          | Description                        |
| ---------------------- | ------------------------------------------------- | ---------------------------------- |
| `getTrendingAnime()`   | `/trending/anime`                                 | Currently trending anime           |
| `getPopularAnime()`    | `/anime?sort=-userCount`                          | Most popular by user count         |
| `getTopRatedAnime()`   | `/anime?sort=-averageRating&filter[averageRating]=70..` | Highest rated anime          |
| `getAnimeByCategory()` | `/anime?filter[categories]=slug`                  | Anime filtered by category slug    |
| `searchAnime()`        | `/anime?filter[text]=query`                       | Search anime by title              |
| `getAnimeById()`       | `/anime/:id`                                      | Single anime with full details     |
| `getPaginatedAnime()`  | `/anime?page[offset]=N&page[limit]=N`             | Paginated anime for infinite scroll|

All responses include automatic **category fetching** per anime and **data transformation** from raw Kitsu format to clean `AnimeCard` objects.

### Backend API (`src/lib/api.ts`)

The app connects to a custom backend for authenticated features:

| Module       | Endpoints                                                           |
| ------------ | ------------------------------------------------------------------- |
| **Auth**     | `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| **Watchlist**| `GET /watchlist`, `POST /watchlist`, `DELETE /watchlist/:id`         |
| **Reactions**| `POST /reactions`, `GET /reactions/anime/:id`                       |
| **Battles**  | `GET /battles`, `GET /battles/:id`, `POST /battles/:id/vote`       |
| **Community**| `GET /community/posts`                                              |
| **Anime**    | `GET /anime`, `GET /anime/trending`, `GET /anime/popular`, `GET /anime/:id`, `GET /anime/search`, `GET /comments/anime/:id` |

---

## 🎨 Design System

The app uses a custom **Dark + Fiery + Cinematic** theme defined in `globals.css`:

### Color Palette

| Token                  | Value                        | Usage                     |
| ---------------------- | ---------------------------- | ------------------------- |
| `--bg-main`            | `#0b0b0f`                    | Page background           |
| `--bg-elevated`        | `#12121a`                    | Cards & elevated surfaces |
| `--bg-card`            | `rgba(18, 18, 26, 0.75)`    | Translucent card bg       |
| `--accent-primary`     | `#ff6b2c`                    | Primary accent (orange)   |
| `--accent-secondary`   | `#ff3d00`                    | Secondary accent (deep orange) |
| `--accent-glow`        | `rgba(255, 107, 44, 0.35)`  | Glow effects              |
| `--text-primary`       | `#ffffff`                    | Main text                 |
| `--text-secondary`     | `#b3b3c2`                    | Secondary text            |
| `--text-muted`         | `#6b6b78`                    | Muted/hint text           |
| Signature Red          | `#e63030`                    | Highlights, badges, CTAs  |

### Typography

- **Primary Font**: Inter (400–800 weights) — clean, modern UI text
- **Secondary Font**: Rubik (400–800 weights) — headings and display text
- Anti-aliased rendering for crisp text on all platforms

### Design Features

- 🪟 **Glassmorphism** — `backdrop-blur` with translucent backgrounds
- 🌊 **Gradient overlays** — Cinematic hero and card gradients
- ✨ **Micro-animations** — Hover scale, opacity transitions, shimmer loading states
- 🎯 **Custom scrollbar** — Minimal 6px scrollbar with translucent thumb
- 📱 **Fully responsive** — Mobile-first design with breakpoints for `sm`, `md`, `lg`, `xl`

---

## 🔧 Configuration

### `next.config.ts`

Configured remote image patterns for:
- `media.kitsu.app` / `media.kitsu.io` — Anime poster & cover images
- `*.r2.dev` — Cloudflare R2 hosted assets
- `images.unsplash.com` / `plus.unsplash.com` — Stock imagery
- `www.svgrepo.com` — SVG icons

### `postcss.config.mjs`

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Uses the Tailwind CSS v4 PostCSS plugin for CSS-first configuration (no `tailwind.config.js` needed).

---

## 📜 Available Scripts

| Script          | Command            | Description                          |
| --------------- | ------------------ | ------------------------------------ |
| **Dev Server**  | `npm run dev`      | Start Next.js development server     |
| **Build**       | `npm run build`    | Create optimized production build    |
| **Start**       | `npm start`        | Run the production server            |

---

## 🧪 State Management

### `AuthContext`

Manages user authentication state globally:

- **State**: `user`, `token`, `loading`
- **Actions**: `login()`, `signup()`, `logout()`
- Auto-hydrates from `localStorage` on mount
- Validates stored tokens via `GET /auth/me`
- Redirects to `/auth` on logout, to `/` on login

### `AnimeModalContext`

Controls the global anime detail modal:

- **State**: `selectedAnime`, `isOpen`
- **Actions**: `openModal(anime)`, `closeModal()`
- Prevents body scroll when modal is open
- Any component can trigger the modal via `useAnimeModal()` hook

---

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and not currently licensed for public distribution.

---

<div align="center">

**Built with ❤️ and 🔥 by the AnimeVerse Team**

*Discover. Battle. Connect.*

</div>
]]>
