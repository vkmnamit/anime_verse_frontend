<![CDATA[<div align="center">

# 🌌 AnimeVerse Frontend

**The Cinematic Social Hub for Anime Enthusiasts**

A high-fidelity web experience for discovering, debating, and celebrating anime culture.

[![Next.js](https://img.shields.io/badge/Next.js-16.1--black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19--61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind--38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Beta--orange?style=for-the-badge)]()

[🌍 Live Demo]() • [📦 Project Roadmap](#-key-features) • [🎨 Design System](#-design--aesthetics) • [🚀 Setup](#-getting-started)

</div>

---

## 🔥 Key Features

- **🎬 Cinematic Discovery**: Netflix-inspired Infinite Grid and Auto-playing Hero Banners.
- **⚔️ Battle Engine**: Real-time voting interface for community anime matchups.
- **🔍 Intelligent Search**: Instant lookup powered by the Kitsu API with sentiment-aware result ranking.
- **👤 Elite Profiles**: Track your journey with badges, detailed statistics, and watch progress.
- **🛡️ State Architecture**: Robust Auth and Modal systems utilizing React 19 Context API.

---

## 🎨 Design & Aesthetics

AnimeVerse uses a **Dark + Fiery + Cinematic** theme, strictly enforced through a custom CSS variable system.

- **Glassmorphism**: Heavy use of `backdrop-blur-3xl` for high-performance visual depth.
- **Dynamic Glow**: Intelligent CSS-first state animations (e.g., the signature "Fiery Red" accent `#e63030`).
- **Responsive Core**: Mobile-first design architecture with customized smooth-scrolling behaviors.

---

## 🛠️ Technical Implementation

### Core Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 (PostCSS/CSS-first configuration)
- **Data Fetching**: Server Components + Client-side Axios/Fetch bridges
- **State Mgmt**: React Context (`Auth`, `AnimeModal`)

### Directory Overview
```text
app/          # Routes & Server Layers
src/
 ├── components/  # High-fidelity UI Elements
 ├── context/     # Global State Management
 ├── lib/         # API Bridges (Kitsu & Backend)
 └── utils/       # Cinematic Helpers
```

---

## 🚀 Getting Started

### Installation

```bash
git clone git@github.com:vkmnamit/anime_verse_frontend.git
cd anime_verse_frontend
npm install
```

### Environment

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

### Run
```bash
npm run dev
```

---

## 🤝 Community & Contribution

We welcome contributions to the Verse! Please see our [Contributing Guide](./CONTRIBUTING.md) to get started.

<div align="center">

**[View Backend Repo](https://github.com/vkmnamit/anime_verse_backend)**

</div>
]]>
