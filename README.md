# 📅 Kalender - Interactive Calendar Component

A polished, responsive Interactive Calendar Component built with Next.js and Tailwind CSS. It features date range selection, persistent notes, and a premium UI with animations and dark mode support.

![Kalender Preview](./public/hero.png) *(Preview Hero Image)*

## ✨ Features

- **Wall Calendar UI**: Designed to resemble a beautiful physical wall calendar.
- **Dynamic Hero Image**: A beautiful hero image with gradient overlays that intelligently change based on the selected month to represent the season.
- **Date Range Selection**: Select start and end dates with clear visual feedback for the range, edge case handling, and tooltip highlights.
- **Persistent Notes via LocalStorage**: Add, edit, and delete notes for specific dates or ranges. Notes are saved directly in your browser.
- **Light / Dark Mode**: Fully supported dark and light themes with smooth transitions and system preference detection.
- **Micro-Interactions**: Clean animations using Framer Motion including calendar flips, hover shimmers, and scale effects.
- **Holidays**: Built-in highlights for basic holidays with emoji support.
- **Fully Responsive**: Adapts layout seamlessly from desktop side-by-side to vertical mobile stacking.

## 🚀 Tech Stack

- **Framework**: [Next.js 14+] (App Router)
- **Styling**: [Tailwind CSS v4] (with custom CSS variables for theming)
- **State & Logic**: React Hooks (`useState`, `useEffect`, `useCallback`)
- **Date Utilities**: `date-fns` for robust date math
- **Animations**: `framer-motion` & standard CSS transitions

## 📦 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router (Layout, Page, Global CSS)
├── components/           # Reusable UI Components
│   ├── Calendar.tsx      # Main Monthly Grid & logic wrapper
│   ├── DayCell.tsx       # Individual day block with visual states
│   ├── HeroImage.tsx     # Dynamic aesthetic image
│   ├── NotesPanel.tsx    # Note CRUD UI
│   └── ThemeToggle.tsx   # Dark/Light mode switch
├── hooks/                # Custom React Hooks
│   ├── useNotes.ts       # LocalStorage note management
│   └── useTheme.ts       # Theme synchronization
├── utils/                # Helper functions
│   ├── constants.ts      # Holidays, Month Themes
│   └── dateUtils.ts      # date-fns wrapper abstractions
└── types/                # TypeScript Interfaces
```

## 🛠️ Implementation Details

- **No Backend**: All notes persist entirely via client-side `localStorage`.
- **CSS Architecture**: Uses standard `@theme inline` features of Tailwind v4 to map abstract logical design tokens (like `--foreground`, `--accent`, etc.) to actual colors depending on whether the dark or light theme is active.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
