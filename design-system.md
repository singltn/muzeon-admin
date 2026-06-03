# Design System

Документ синхронизирован с UI Kit проекта. Реализация: **shadcn/ui**, **Tailwind CSS v4**, **Lucide Icons**.

## Палитра

| Токен | HEX | CSS variable | Использование |
|-------|-----|--------------|---------------|
| Primary | `#3B82F6` | `--primary` | CTA, focus ring, ссылки |
| Secondary | `#F4F4F5` | `--secondary` | Нейтральные кнопки, фон auth |
| Success | `#10B981` | `--success` | Статус «Активен», success alert |
| Error | `#EF4444` | `--destructive` | Удаление, ошибки форм |
| Warning | `#F59E0B` | `--warning` | Статус «Архив», предупреждения |
| Foreground | `#09090B` | `--foreground` | Основной текст |
| Background | `#FFFFFF` | `--background` | Фон приложения |
| Muted FG | `#71717A` | `--muted-foreground` | Вторичный текст |
| Border | `#E4E4E7` | `--border` | Разделители, инпуты |
| Chart 1 | `#F97316` | `--chart-1` | Акцент на карточках метрик |

Источник правды в коде: `src/app/globals.css`, справочник: `src/shared/config/design-tokens.ts`.

## Типографика

- Шрифт: **Inter** (`next/font/google`, кириллица + латиница)
- Заголовки страниц: `text-2xl font-semibold tracking-tight`
- Подзаголовки: `text-sm text-muted-foreground`

## Компоненты (`src/shared/ui/`)

| Компонент | Файл | Варианты по макету |
|-----------|------|-------------------|
| Button | `button.tsx` | default, secondary, outline, ghost, destructive, link; sm/default/lg/icon |
| Badge | `badge.tsx` | default, secondary, success, warning, destructive, outline |
| Alert | `alert.tsx` | success, destructive, warning, info |
| Input / Textarea | `input.tsx`, `textarea.tsx` | focus ring primary, error via `aria-invalid` |
| Card | `card.tsx` | stat cards, auth card, content cards |
| Dialog | `dialog.tsx` | подтверждение удаления |
| StatusBadge | `status-badge.tsx` | Черновик / Опубликовано / Активен / Архив |
| ContentTypeLabel | `content-type-label.tsx` | Выставка, Лекция, … |

## Статусы контента

| Slug | UI label | Badge variant |
|------|----------|---------------|
| `draft` | Черновик | secondary |
| `published` | Опубликовано | default (blue) |
| `active` | Активен | success |
| `archived` | Архив | warning |

Типы: `src/entities/content/model/types.ts`.

## Таблица данных

- Компонент: `widgets/data-table`
- Колонки по макету: Название, Тип, Дата, Статус, Билеты, Доход
- Пагинация: кнопки «Назад» / «Вперёд»
- Пример: `widgets/exhibitions-page`

## Карточки метрик

- `widgets/stat-card` + `widgets/dashboard-overview`
- Иконки Lucide: Ticket, Wallet, Users, BarChart3

## Auth-экраны

- Фон: `src/assets/auth-bg.png` (интерьер музея) + лёгкий градиент для контраста
- Карточка: **liquid glass** — `backdrop-blur-2xl`, `bg-white/45`, градиентная кромка
- Типографика на auth: `stone-900` / `stone-600` (светлый фон)
- OTP: вариант `variant="glass"` у `OtpInput`
- Бренд: **МУЗЕОН** (без иконки-билетика)
- Оболочка: `widgets/auth-screen` — `min-h-[100dvh]`, safe-area insets, max-width 400px
- Логин: email + пароль (toggle видимости), валидация on blur
- 2FA: 6 ячеек OTP (`shared/ui/otp-input`), paste, auto-submit, resend 60s, маска email

## Иконки (Lucide)

Навигация: Home, LayoutGrid, Image, Users, Settings, Bell, PanelLeft.  
Действия: Plus, Download, Filter, Trash2, ChevronLeft/Right.

## Добавление компонента shadcn

```bash
npx shadcn@latest add <component>
```

Алиасы в `components.json` указывают на `@/shared/ui`.
