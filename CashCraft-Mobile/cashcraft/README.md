# CashCraft

A financial literacy mobile app built with Expo (React Native).

## Features

- **Home** — Hero card, quick-access grid, financial wisdom quotes, continue learning
- **Articles** — Searchable & filterable financial articles
- **Videos** — Searchable & filterable video library
- **Quizzes** — Interactive quizzes with explanations and scoring
- **Dashboard** — Balance card, income/expenses, savings goals, donut chart, transactions
- **Profile** — Dark mode, theme picker, language switcher (English / Arabic RTL)

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Tech Stack

- [Expo](https://expo.dev) ~54
- [Expo Router](https://expo.github.io/router) — file-based routing
- React Native 0.81
- TypeScript
- Cairo font (Google Fonts)
- AsyncStorage — persists language & theme settings
- React Query — ready for API integration
- react-native-svg — donut chart

## Project Structure

```
cashcraft/
├── app/
│   ├── (tabs)/          # Tab screens: home, articles, videos, quizzes, dashboard
│   ├── article/[id].tsx
│   ├── video/[id].tsx
│   ├── quiz/[id].tsx
│   ├── profile.tsx
│   └── _layout.tsx
├── assets/images/       # App images
├── components/          # ErrorBoundary, ErrorFallback, KeyboardAwareScrollViewCompat
├── constants/colors.ts  # Light & dark color palette
├── contexts/            # SettingsContext (language, theme)
├── data/                # Mock data (articles, videos, quizzes, dashboard, quotes)
├── hooks/useColors.ts   # Theme-aware color hook
└── i18n/translations.ts # EN + Arabic (Egyptian) translations
```

## Notes

- All data files in `data/` are mock data with comments indicating where to add API calls.
- The app supports iOS 26 liquid glass tabs via `expo-glass-effect` and falls back to classic tabs on older iOS / Android / web.
