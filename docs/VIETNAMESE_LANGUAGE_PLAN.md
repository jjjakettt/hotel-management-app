# Vietnamese Language Option — Implementation Plan

## Approach
Use a React Context (mirroring the existing ThemeContext pattern) with localStorage persistence. No i18n library — just a simple translation dictionary for EN/VI. All UI elements use the central design system (CSS variables from `globals.css`, utility classes like `btn-primary`, `font-heading`, etc.).

## Files to Create

### 1. `/src/context/languageContext.ts`
- Create `LanguageContext` with `language` state (`"en" | "vi"`) and `setLanguage`
- Read/write `localStorage` key `"hotel-language"` (mirrors `"hotel-theme"` pattern)

### 2. `/src/components/LanguageProvider/LanguageProvider.tsx`
- Context provider wrapping the app (alongside ThemeProvider/AuthProvider)
- Handles hydration (default to `"en"` on SSR, read localStorage on mount)

### 3. `/src/libs/translations.ts`
- Dictionary: `{ en: { key: "English text" }, vi: { key: "Vietnamese text" } }`
- Export `useTranslation()` hook returning `t(key)` function
- All user-facing strings extracted here

## Files to Modify

### 4. `/src/app/(web)/layout.tsx`
- Wrap children with `<LanguageProvider>`

### 5. `/src/components/Header/Header.tsx`
- Add language toggle button next to the theme toggle
- Style using design system: `text-[var(--foreground)]`, `bg-[var(--background-secondary)]`, existing hover/transition patterns (`hover:scale-110 duration-300 transition-all`)
- Replace hardcoded strings with `t()` calls

### 6. All components with user-facing strings:
- `Footer/Footer.tsx`
- `NewsLetter/NewsLetter.tsx`
- `BookRoomCta/BookRoomCta.tsx`
- `Search/Search.tsx`
- `RatingModal/RatingModal.tsx`
- `HeroSection/HeroSection.tsx`
- `RoomCard/RoomCard.tsx`
- `Table/Table.tsx`
- `/src/app/(web)/page.tsx`
- `/src/app/(web)/users/[id]/page.tsx`
- `/src/app/(web)/auth/page.tsx`
- `/src/app/(web)/rooms/[slug]/page.tsx`

Replace hardcoded English strings with `t("key")` calls.

## Design System Compliance
- Language toggle uses CSS custom properties (`--foreground`, `--background-secondary`, `--border`, `--primary`) for colors
- Follow existing Tailwind patterns: responsive classes, dark mode compatibility via CSS variables
- Button styling consistent with existing icon buttons in Header (theme toggle pattern)
- No new colors or styles outside the existing design tokens

## CMS (Sanity) — Dual-Language Fields

### 7. `/schemaTypes/hotelRoom.ts`
- Add Vietnamese variants for text fields:
  - `name_vi` (string) — Vietnamese room name
  - `description_vi` (text) — Vietnamese room description
  - `specialNote_vi` (text) — Vietnamese special note
- Add Vietnamese variant for amenities: each amenity object gets an `amenity_vi` field
- Keep original fields as English defaults; Vietnamese fields are optional so existing rooms still work

### 8. `/src/libs/sanityQueries.ts`
- Update GROQ queries (`getRoomsQuery`, `getFeaturedRoomQuery`, `getRoom`) to also fetch `name_vi`, `description_vi`, `specialNote_vi`, and `amenity_vi`

### 9. Components displaying CMS content
- `RoomCard/RoomCard.tsx`, `FeaturedRoom/FeaturedRoom.tsx`, room detail page (`/rooms/[slug]/page.tsx`), `BookRoomCta/BookRoomCta.tsx`
- Use language context to pick `name` vs `name_vi`, `description` vs `description_vi`, etc.
- Fallback: if Vietnamese field is empty, show English

### 10. `/src/models/room.ts` (or equivalent type file)
- Add optional `name_vi`, `description_vi`, `specialNote_vi` fields to the Room type

## Implementation Order
1. Create translation dictionary + `useTranslation` hook
2. Create LanguageContext + LanguageProvider
3. Wire provider into layout
4. Add language toggle to Header
5. Update Sanity schema with `_vi` fields
6. Update GROQ queries + Room type
7. Migrate all components to use `t()` for UI strings + language-aware CMS field selection

## Verification
- Toggle language in header → all static UI text switches between EN/VI
- CMS content (room name, description) shows Vietnamese when `_vi` fields are populated, falls back to English when empty
- Refresh page → language persists (localStorage)
- Dark/light mode still works alongside language toggle
- No hydration mismatch warnings in console
- Language toggle visually matches the existing theme toggle styling
- Admin can add Vietnamese content in Sanity Studio without breaking existing English content
