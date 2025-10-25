# Copilot Instructions for VYAAS Mobile App

## Project Overview
VYAAS is an **AI-driven yield optimization platform** for oilseed crops in India. It's a **mobile-first progressive web app** built with Next.js 14 (App Router), React 18, TypeScript, and Tailwind CSS. The app provides personalized farming advisories using ML models, remote sensing data, and IoT sensors to help smallholder farmers increase yield and reduce India's edible oil import dependency.

### Problem Statement Context
**Background**: India's oilseed yields are significantly lower than global leaders (USA, Brazil). Nearly 72% of cultivation is rainfed with limited advanced practices adoption. This yield gap perpetuates heavy import dependency (>56%) for edible oils, costing $16+ billion annually.

**Mission**: Bridge the productivity gap through technology-driven solutions to ensure Atmanirbhar Bharat (self-reliant India) and reduce vulnerability to global shocks.

**Target Users**: Smallholder farmers growing mustard, sunflower, soybean, groundnut, sesame, and other oilseed crops across India's diverse agro-climatic zones.

**Key Metrics**: 
- Close yield gap vs global standards (USA/Brazil benchmarking)
- Increase farmer income through optimized practices
- Reduce India's $16B+ edible oil import bill
- Scale to millions of farmers with multilingual accessibility

## Architecture & Core Patterns

### High-Level System Architecture (Future Implementation)
```
Farmer/Field Data + Remote Sensing 
    ↓
Ingestion & Feature Store 
    ↓
Two-Stage ML Pipeline:
  1. Crop Recommendation/Yield Prediction
  2. Market Analysis/Benchmarking
    ↓
SHAP Explainability Layer
    ↓
Actionable Advisories
    ↓
Farmer Implements → Feedback Loop
```

**Key Architectural Components (Planned)**:
1. **Edge/Data Collection**: Manual farmer inputs, IoT sensors, satellite imagery (Sentinel-2/Landsat), weather APIs (IMD), market price feeds
2. **Ingestion Layer**: API gateway, stream buffers (Kafka/Kinesis), batch image processing (Airflow)
3. **Storage**: Raw data lake (S3/GCS), processed feature store (Feast/Timescale), relational DB (PostgreSQL + PostGIS)
4. **ML Models**: 
   - Stage 1: Crop recommendation/yield prediction (CatBoost/XGBoost + LSTM for time series)
   - Stage 2: Market analysis & global benchmarking
5. **Explainability**: SHAP integration for transparency
6. **Advisory Engine**: Business rules + model outputs → personalized recommendations
7. **App Layer**: React Native + React (current PWA implementation)

### Current MVP State (Client-Side Only)
This is a **high-fidelity prototype** with:

### State Management Philosophy
- **Client-side only, no backend** - All state lives in React state + localStorage
- Page navigation uses `useState<"landing" | "auth" | "home">` in `app/page.tsx`
- Tab navigation dispatches custom events: `window.dispatchEvent(new CustomEvent("switchTab", { detail: tabName }))`
- Auth state flows via React Context (`auth-provider.tsx`)

### Component Structure
```
app/page.tsx → orchestrates pages (landing, auth, home)
  ↓
components/home-page.tsx → manages tabs (home, data-collection, crop-recommendation, market-insights, profile)
  ↓
components/tabs/*.tsx → individual feature tabs
```

### Key Conventions
1. **"use client" everywhere** - This is a CSR-only app (no SSR/SSG)
2. **Mobile-first responsive** - All components wrapped in `<MobileContainer>` (375px max-width)
3. **Multilingual by default** - Use `useTranslation()` hook, keys in `src/locales/{en,hi,mr,ta}.json`
4. **shadcn/ui components** - Pre-installed in `components/ui/`, customized with Tailwind
5. **Data persistence** - Use `localStorage.setItem("farmData", JSON.stringify(data))` for user data

## Critical Developer Workflows

### Running the App
```bash
pnpm dev          # Start dev server on http://localhost:3000
pnpm build        # Production build
pnpm lint         # ESLint (build ignores errors via next.config.mjs)
```

### Adding a New Feature Tab
1. Create `components/tabs/your-feature-tab.tsx` with `"use client"`
2. Import in `home-page.tsx` and add to `TabType` union
3. Add case to `renderActiveTab()` switch statement
4. Add icon + label to `bottom-navigation.tsx`
5. Add translations to all 4 locale JSON files

### Adding i18n Translations
Keys use nested structure: `t("home.insights.soilHealth")`
- **Always update all 4 files**: `en.json`, `hi.json`, `mr.json`, `ta.json`
- Fallback language: English
- Provider initialized in `app/layout.tsx` via `I18nProvider`

## AI-Specific Context

### ML Model Integration Points
Currently **mocked** - Replace when backend is ready:
- **Yield prediction**: `components/tabs/crop-recommendation-tab.tsx` → `recommendations` state
- **Soil health analysis**: `components/tabs/data-collection-tab.tsx` → form submission
- **Market price forecasting**: `components/tabs/market-insights-tab.tsx` → price data
- **Remote sensing (NDVI)**: Mentioned in `archi.md` but not implemented

### Data Flow for Advisories
```
Farmer inputs (form) → localStorage → Tab component state → UI cards/charts
                                          ↓
                                   [Future: POST to ML API]
```

### Problem Statement Alignment
- **Soil health**: Tracked via data collection forms (pH, NPK, EC)
- **Weather integration**: Placeholder cards (connect to IMD API)
- **Crop recommendation**: Decision trees based on soil + season
- **Market insights**: Price trends + demand forecasts
- **Benchmarking**: Compare farmer yields vs global standards (USA/Brazil)
- **Yield Gap Analysis**: Focus on closing 40-50% productivity gap
- **Technology Stack**: ML + Remote Sensing + IoT + Mobile-first design

### Future Data Flow (When Backend is Implemented)
1. **Farmer Registration** → Collect geo-polygon and metadata
2. **Satellite Tile Fetch** → Compute baseline NDVI timeseries
3. **Sensor/Photo Upload** → Farmer inputs + questionnaire
4. **Data Enrichment** → Add weather forecasts, soil cards → Feature store
5. **Stage 1 ML** → Crop/variety recommendation with yield prediction
6. **Stage 2 ML** → Global benchmarking + profitability simulation
7. **SHAP Explanation** → Feature contribution analysis
8. **Advisory Generation** → Irrigation schedule, fertilizer doses, pest monitoring
9. **Monitoring** → NDVI + sensor telemetry throughout season
10. **Harvest Feedback** → Actual yield data → Model improvement loop

### Key Metrics to Track (Future)
- Prediction error (MAE/RMSE) vs reported yield
- % farmers following advisories
- Yield increase (q/ha) for adopters vs control
- Time-to-alert for pest/drought events
- App retention & sync success in low-connectivity zones

## External Dependencies & Integrations

### UI Component Library
- **shadcn/ui** (Radix primitives + Tailwind) - See `components.json` for config
- Custom theme in `app/globals.css` with CSS variables
- Dark mode via `next-themes` (`theme-provider.tsx`)

### Icons
- `lucide-react` for all icons (e.g., `import { Sun, Droplets } from "lucide-react"`)

### Charts
- `recharts` for yield graphs/market trends
- Example: `<LineChart data={...}><Line dataKey="yield" /></LineChart>`

### Forms
- `react-hook-form` + `zod` validation (see example in data collection tab)

## Styling Conventions

### Tailwind Patterns
- Spacing: Use `space-y-6` for vertical stacks, `gap-4` for grids
- Cards: Always use `<Card><CardHeader><CardTitle>` structure
- Colors: Semantic tokens (`bg-primary`, `text-muted-foreground`) defined in `globals.css`
- Mobile breakpoints: Default mobile, `sm:` for tablet, `md:` for desktop

### Typography
```tsx
<h2 className="text-2xl font-bold text-foreground">  // Page titles
<p className="text-muted-foreground">               // Subtitles
<CardDescription>                                    // Card subtitles
```

## Testing & Quality

### Type Safety
- **Strict mode enabled** in `tsconfig.json`
- Build errors ignored via `next.config.mjs` (fix these eventually!)
- Use proper TypeScript interfaces (see `TabType`, `HomeTabProps`)

### Common Pitfalls
1. **Forgetting "use client"** → Will cause hydration errors
2. **Missing translation keys** → Shows key name as fallback
3. **localStorage in SSR** → Always check `typeof window !== "undefined"`
4. **Tab navigation** → Use custom events, not React Router (there's no router!)

## Production Readiness Gaps

### What's Missing (Future Work)
- [ ] Backend API integration (FastAPI/Flask recommended per `archi.md`)
- [ ] Authentication (JWT/OAuth) - currently just mock state
- [ ] Database for user/farm data (PostgreSQL + PostGIS for geo data)
- [ ] ML model serving (TensorFlow Serving / SageMaker)
- [ ] IoT sensor data ingestion (Kafka/AWS Kinesis pipeline)
- [ ] Satellite imagery processing (Sentinel-2 NDVI calculations)
- [ ] PWA manifest + service workers for offline support
- [ ] E2E tests (Playwright/Cypress)

### Current State
This is a **high-fidelity prototype/MVP** - functional UI with realistic data flow, but all AI/backend features are mocked.

## File Organization Cheatsheet

```
app/               → Next.js App Router pages
  layout.tsx       → Root layout with providers
  page.tsx         → Main app entry (landing/auth/home router)
  globals.css      → Tailwind + theme CSS variables

components/
  auth-*.tsx       → Auth flow components
  home-page.tsx    → Tab container
  tabs/*.tsx       → Feature tabs (main app logic here)
  ui/*.tsx         → shadcn/ui primitives

src/locales/       → i18n translation JSON files
lib/utils.ts       → Tailwind cn() utility
```

## Quick Reference

**Add a new UI component**:
```bash
# Use shadcn CLI (if component not already added)
npx shadcn-ui@latest add button
```

**Switch between tabs programmatically**:
```tsx
window.dispatchEvent(new CustomEvent("switchTab", { detail: "crop-recommendation" }))
```

**Check auth state**:
```tsx
const { isAuthenticated } = useAuth()
```

**Persist data**:
```tsx
localStorage.setItem("farmData", JSON.stringify(data))
const saved = JSON.parse(localStorage.getItem("farmData") || "{}")
```

---

**Last Updated**: Based on codebase analysis from October 2025. Update this file as backend/ML integration progresses.
