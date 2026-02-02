# Translation System Guide

This guide explains how to use the PGNexus translation system to support English and Simplified Chinese throughout the application.

## Overview

The translation system uses:
- **Translation Dictionary** (`lib/translations/index.ts`) - Centralized translation definitions
- **Enhanced LanguageProvider** - React Context for language state and translation helper
- **Type-safe translations** - Full TypeScript support with autocomplete

## Quick Start

### 1. Import what you need

```tsx
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
```

### 2. Use the `t()` function in your component

```tsx
export function MyComponent() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div>
      <h1>{t(trans.nav.home)}</h1>
      <p>{t(trans.common.loading)}</p>
    </div>
  );
}
```

## Translation Function Usage

The `t()` function supports two formats for backward compatibility:

### New Format (Recommended)
```tsx
t(trans.nav.home)  // Returns "Home" or "首页" based on current language
```

### Old Format (Still supported)
```tsx
t("Home", "首页")  // Returns "Home" or "首页" based on current language
```

## Adding New Translations

### 1. Add to the translation dictionary

Edit `lib/translations/index.ts`:

```typescript
export const translations = {
  // ... existing translations

  myNewSection: {
    title: { en: "My Title", zh: "我的标题" },
    subtitle: { en: "My Subtitle", zh: "我的副标题" },
    buttonLabel: { en: "Click Here", zh: "点击这里" },
  },
} as const;
```

### 2. Use in your components

```tsx
import { translations as trans } from "@/lib/translations";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function MyComponent() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t(trans.myNewSection.title)}</h1>
      <h2>{t(trans.myNewSection.subtitle)}</h2>
      <button>{t(trans.myNewSection.buttonLabel)}</button>
    </div>
  );
}
```

## Translation Organization

Translations are organized by category in `lib/translations/index.ts`:

```
translations/
├── nav              - Navigation menu items
├── auth             - Authentication (sign in, sign up, etc.)
├── common           - Common UI elements (buttons, loading, etc.)
├── feedTypes        - Content type names
├── explorePage      - Explore/Feeds page specific
├── techBlogsPage    - Tech Blogs page specific
├── techNewsPage     - Tech News page specific
├── hackerDiscussionsPage - Hacker Discussions page specific
├── dailyUpdatesPage - Daily Updates page specific
├── comingSoon       - Coming Soon pages
├── footer           - Footer content
├── dateTime         - Date/time related text
├── filterSort       - Filter and sort options
├── errors           - Error messages
├── success          - Success messages
└── subscription     - Subscription/bookmark features
```

## Best Practices

### 1. Always use the global language context

❌ **Don't** create local language state:
```tsx
const [language, setLanguage] = useState<"en" | "zh">("en");  // Bad!
```

✅ **Do** use the global context:
```tsx
const { language, setLanguage, t } = useLanguage();  // Good!
```

### 2. Keep translations centralized

❌ **Don't** hardcode translations in components:
```tsx
<h1>{language === "en" ? "Home" : "首页"}</h1>  // Bad!
```

✅ **Do** use the translation dictionary:
```tsx
<h1>{t(trans.nav.home)}</h1>  // Good!
```

### 3. Use descriptive translation keys

❌ **Don't** use generic keys:
```tsx
trans.text1, trans.label2  // Bad!
```

✅ **Do** use descriptive names:
```tsx
trans.techBlogsPage.title, trans.common.loading  // Good!
```

### 4. Group related translations

When adding page-specific translations, group them under a namespace:

```typescript
myPage: {
  title: { en: "...", zh: "..." },
  subtitle: { en: "...", zh: "..." },
  searchPlaceholder: { en: "...", zh: "..." },
  noResults: { en: "...", zh: "..." },
}
```

## Dynamic Arrays (Menu Items, etc.)

When working with arrays that need translation:

```tsx
const { t } = useLanguage();

// Define array with translation objects
const menuItems = [
  { href: "/home", label: t(trans.nav.home) },
  { href: "/explore", label: t(trans.nav.explore) },
  { href: "/about", label: t(trans.nav.about) },
];

// Render
return (
  <nav>
    {menuItems.map(item => (
      <Link key={item.href} href={item.href}>
        {item.label}
      </Link>
    ))}
  </nav>
);
```

## Database Content Translation

For dynamic content stored in the database (like `summary` and `summary_zh`):

```tsx
const { language } = useLanguage();

// Display appropriate summary based on language
<p>
  {language === "en"
    ? feed.summary || "No summary available"
    : feed.summary_zh || "暂无摘要"
  }
</p>
```

Or use the translation dictionary for fallback text:

```tsx
const { language, t } = useLanguage();

<p>
  {language === "en"
    ? feed.summary || t(trans.techBlogsPage.noSummary)
    : feed.summary_zh || t(trans.techBlogsPage.noSummary)
  }
</p>
```

## Client vs Server Components

Since the LanguageProvider uses React Context with `useState` and `localStorage`, components using translations must be **client components**.

Add `"use client"` directive at the top of files that use translations:

```tsx
"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

export function MyComponent() {
  const { t } = useLanguage();
  // ... rest of component
}
```

## Migration Checklist

When migrating a page to use the new translation system:

- [ ] Add `"use client"` directive if not already present
- [ ] Import `useLanguage` and `translations`
- [ ] Replace hardcoded English text with `t(trans.*.*)` calls
- [ ] Remove any local `language` state management
- [ ] Update dynamic arrays (menu items, etc.) to use translations
- [ ] Test language switching functionality
- [ ] Verify all text switches correctly between English and Chinese

## Examples

### Example 1: Simple Component

```tsx
"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

export function WelcomeMessage() {
  const { t } = useLanguage();

  return (
    <div>
      <h1>{t(trans.common.welcome)}</h1>
      <button>{t(trans.common.getStarted)}</button>
    </div>
  );
}
```

### Example 2: Page with Multiple Sections

```tsx
"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

export default function BlogsPage() {
  const { language, t } = useLanguage();
  const [blogs, setBlogs] = useState([]);

  return (
    <div>
      <header>
        <h1>{t(trans.techBlogsPage.title)}</h1>
        <p>{t(trans.techBlogsPage.subtitle)}</p>
      </header>

      <main>
        {blogs.map(blog => (
          <article key={blog.id}>
            <h2>{blog.title}</h2>
            <p>
              {language === "en" ? blog.summary : blog.summary_zh}
            </p>
            <button>{t(trans.common.readMore)}</button>
          </article>
        ))}
      </main>
    </div>
  );
}
```

### Example 3: Form with Labels

```tsx
"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

export function LoginForm() {
  const { t } = useLanguage();

  return (
    <form>
      <label>
        {t(trans.auth.email)}
        <input type="email" placeholder={t(trans.auth.email)} />
      </label>

      <label>
        {t(trans.auth.password)}
        <input type="password" placeholder={t(trans.auth.password)} />
      </label>

      <button type="submit">{t(trans.auth.signIn)}</button>
    </form>
  );
}
```

## Language Selector

The global language selector is already implemented in `DashboardNav.tsx`. Users can switch languages using the language button in the navigation bar.

To programmatically change language:

```tsx
const { setLanguage } = useLanguage();

// Switch to Chinese
setLanguage("zh");

// Switch to English
setLanguage("en");

// Toggle
const { language, setLanguage } = useLanguage();
setLanguage(language === "en" ? "zh" : "en");
```

## TypeScript Support

The translation system is fully typed. TypeScript will:
- Autocomplete available translation keys
- Catch typos in translation keys at compile time
- Ensure all translation objects have both `en` and `zh` properties

```typescript
// TypeScript knows these are valid:
t(trans.nav.home)
t(trans.common.loading)

// TypeScript will error on these:
t(trans.nav.invalidKey)  // Error: Property 'invalidKey' does not exist
t({ en: "Hello" })       // Error: Property 'zh' is missing
```

## Testing

When testing components with translations:

```tsx
import { render } from '@testing-library/react';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

test('component renders in English', () => {
  const { getByText } = render(
    <LanguageProvider>
      <MyComponent />
    </LanguageProvider>
  );

  expect(getByText('Home')).toBeInTheDocument();
});
```

## Need Help?

- Check existing implementations in:
  - `components/dashboard/DashboardNav.tsx`
  - `components/Footer.tsx`
  - `app/feeds/page.tsx`

- Review the full translation dictionary in `lib/translations/index.ts`

- Follow the migration checklist above when updating components
