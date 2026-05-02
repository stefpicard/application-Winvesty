# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

---

## Winvesty Mobile App (`artifacts/winvesty-app`)

**Stack**: Expo SDK 54, Expo Router 6, React Native, TypeScript

**Branding**: navy #053661, accent #3179AF, gold #C9A84C, bg #F5F7FA. Fonts: Inter.

### Auth (mock)
- `email.includes("startup")` → Startup Cockpit (`mockStartupUser`)
- `email.includes("admin")` || `email.includes("winvesty")` → Admin (`mockAdminUser`)
- Tout autre email → Investor Cockpit (`mockUser`)

### Rôles
- `investor_validated` / `investor_pending` → Investor Cockpit (Accueil)
- `startup` → Startup Cockpit (Accueil)
- `admin` → Investor Cockpit + accès back-office

### Écrans
| Fichier | Description |
|---|---|
| `app/(tabs)/index.tsx` | Investor Cockpit + Startup Cockpit (role-based) |
| `app/(tabs)/dealroom.tsx` | Deal Room 3 onglets (Pour vous / Toutes / Confidentiel) |
| `app/opportunity/[id].tsx` | Fiche détail 9 onglets |
| `app/(tabs)/submit.tsx` | Dépôt de dossier startup |
| `app/(tabs)/profile.tsx` | Profil investisseur + critères |
| `app/(tabs)/notifications.tsx` | Notifications in-app |
| `app/admin.tsx` | Back-office admin |
| `app/settings.tsx` | Paramètres + déconnexion |

### Contextes
| Fichier | Description |
|---|---|
| `context/AuthContext.tsx` | Auth mock + rôles |
| `context/WatchlistContext.tsx` | Watchlist investisseur (AsyncStorage) |
| `context/InvestorCriteriaContext.tsx` | Critères + matching |
| `context/NotificationsContext.tsx` | Notifications in-app |

### Données clés
- `data/mockData.ts` — Tous les types + 7 opportunités dont 2 confidentielles
- `utils/matching.ts` — Algorithme de scoring (secteur, pays, ticket, stade, CA, type, keywords)
- `lib/supabase.ts` — Client Supabase (EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY)

### Variables d'env requises (Supabase — optionnel)
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Rollback
Checkpoint: `b0f82551daf797aa77c0cc8f7a12247664f9c0aa` ("Add Supabase integration to the application")
Voir `ROLLBACK.md` pour la procédure complète.
