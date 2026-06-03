# Muzeon Admin

Административная панель для управления контентом музея.

## Документация

- Архитектура: **[architecture.md](./architecture.md)**
- Design System (UI Kit v1.0): **[design-system.md](./design-system.md)**

## Быстрый старт

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Структура

Слои FSD в `src/`: `app` → `widgets` → `features` → `entities` → `shared`, Redux в `src/store/`.
