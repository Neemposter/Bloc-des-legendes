# Bloc des Légendes — Site du club d'escalade

Site vitrine du club associatif d'escalade Bloc des Légendes (Nuxt 4 + SQLite/Drizzle).

## Setup

```bash
npm install
npm run dev
```

C'est tout. Au premier démarrage, le serveur crée la base SQLite (`.data/`),
applique les migrations et insère des données de démo (créneaux, articles,
compte admin). Idempotent : ne touche jamais aux tables non vides.

**Compte admin de démo** : `admin@blocdeslegendes.fr` / `blocdeslegendes`
(⚠️ à changer avant toute mise en ligne).

## Conventions pour l'équipe

**Design** — la référence vivante est sur [`/styleguide`](http://localhost:3000/styleguide)
(palette, typos, composants dans tous leurs états).

- Couleurs **uniquement** via les variables CSS (`var(--turquoise)`, etc.) définies
  dans `app/assets/css/main.css` — jamais de hex en dur dans les pages
- Composants partagés dans `app/components/ui/` (auto-importés) :
  `UiButton`, `UiCard`, `UiSectionTitle`, `UiInput`, `UiTextarea`.
  Un besoin récurrent → nouveau composant `Ui*`, pas du copier-coller
- Chaque page commence par `UiSectionTitle` et est wrappée dans `.container`

**Pages** — les stubs existent déjà avec un bloc `TODO(...)` en tête de fichier
qui décrit ce qui reste à faire : `actualites.vue`, `contact.vue`, `admin/index.vue`
(`inscription.vue` est quasi terminée, il manque les vrais tarifs).

**Routes API** — exemple minimal avec la base :

```ts
// server/api/exemple.get.ts
import { articles } from '../db/schema'

export default defineEventHandler(() => {
  const db = useDb() // auto-importé
  return db.select().from(articles).all()
})
```

**Workflow base de données** : modifier `server/db/schema.ts` →
`npm run db:generate` → relancer le dev server (les migrations s'appliquent
au démarrage). Ne jamais éditer un fichier de migration à la main.

## Base de données

- Schéma : `server/db/schema.ts` (source de vérité, dérivé du MLD)
- Migrations : `server/db/migrations/` — générées avec `npm run db:generate`
  après modification du schéma, appliquées automatiquement au démarrage
  (`server/plugins/database.ts`)
- Seed : `server/db/seed.ts`
- Explorer la base : `npm run db:studio` (Drizzle Studio)
- Reset complet : supprimer le dossier `.data/` et relancer `npm run dev`

## Dépannage : binding natif introuvable

Si `npm install` échoue avec `Cannot find module '@rolldown/binding-...'`
([bug npm sur les dépendances optionnelles](https://github.com/npm/cli/issues/4828)) :

les binaires natifs de rolldown et oxc-parser sont épinglés en
`optionalDependencies` dans `package.json` (win32 / macOS / linux), ce qui
empêche npm de les supprimer. Si l'erreur revient malgré tout :

```bash
rm -rf node_modules package-lock.json
npm install
```

⚠️ Les versions épinglées doivent suivre celles de `rolldown` et `oxc-parser`
lors des montées de version de Nuxt (`npm ls rolldown oxc-parser`).

## Polices de la charte

Déposer les fichiers Moon get / Coolvetica dans `public/fonts/` (cf. `public/fonts/README.md`).
En leur absence, des fallbacks Google Fonts sont utilisés.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
