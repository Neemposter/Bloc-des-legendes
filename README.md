# Bloc des Légendes — Guide développeur

Site web du club associatif d'escalade **Bloc des Légendes** (Lesneven, 29).  
Stack : **Nuxt 4** · **SQLite** · **Drizzle ORM** · TypeScript.

---

## Sommaire

1. [Démarrage rapide](#1-démarrage-rapide)
2. [Structure du projet](#2-structure-du-projet)
3. [Base de données](#3-base-de-données)
4. [API — référence complète](#4-api--référence-complète)
5. [Authentification admin](#5-authentification-admin)
6. [Frontend — conventions](#6-frontend--conventions)
7. [Back-office admin](#7-back-office-admin)
8. [Mise en production](#8-mise-en-production)
9. [Dépannage](#9-dépannage)

---

## 1. Démarrage rapide

```bash
git clone <repo>
cd Bloc-des-legendes
npm install
npm run dev
```

L'application démarre sur **http://localhost:3000**.

Au premier lancement, le serveur :
1. crée automatiquement la base SQLite dans `.data/`
2. applique toutes les migrations
3. insère des données de démo (créneaux, articles, événements, compte admin)

Le seed est **idempotent** : il ne touche jamais aux tables déjà remplies.

### Compte admin de démo

| Email | Mot de passe |
|---|---|
| `admin@blocdeslegendes.fr` | `blocdeslegendes` |

> ⚠️ À changer **avant toute mise en ligne** (voir [section 8](#8-mise-en-production)).

### Scripts disponibles

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement avec hot-reload |
| `npm run build` | Build de production |
| `npm run preview` | Prévisualisation du build de production |
| `npm run db:generate` | Génère une migration après modification du schéma |
| `npm run db:studio` | Ouvre Drizzle Studio (interface graphique sur la base) |

---

## 2. Structure du projet

```
Bloc-des-legendes/
│
├── app/                          # Frontend (Nuxt 4 / Vue 3)
│   ├── assets/css/main.css       # Variables CSS de la charte graphique
│   ├── components/ui/            # Composants partagés (auto-importés)
│   ├── composables/
│   │   └── useAuth.ts            # État de session admin (useState)
│   ├── layouts/
│   │   ├── default.vue           # Layout public (header + footer)
│   │   └── admin.vue             # Layout back-office (barre admin)
│   ├── middleware/
│   │   └── admin.global.ts       # Garde de route : redirige /admin/* si non connecté
│   └── pages/
│       ├── index.vue             # Accueil
│       ├── actualites/           # Liste + détail des articles
│       ├── calendrier.vue        # Calendrier daté navigable (créneaux + événements)
│       ├── contact.vue           # Formulaire de contact
│       └── admin/
│           ├── login.vue         # Page de connexion
│           ├── index.vue         # Tableau de bord
│           ├── articles.vue      # Gestion des articles
│           ├── evenements.vue    # Gestion des événements (horaires par jour)
│           ├── creneaux.vue      # Gestion des créneaux (récurrents / ponctuels)
│           ├── messages.vue      # Messages de contact reçus
│           └── parametres.vue    # Config (lien d'inscription)
│
├── server/                       # Backend (Nitro)
│   ├── api/                      # Endpoints publics
│   │   ├── articles.get.ts
│   │   ├── articles/[id].get.ts
│   │   ├── events.get.ts
│   │   ├── time-slots.get.ts
│   │   ├── registration-link.get.ts
│   │   ├── contact.post.ts
│   │   └── auth/
│   │       ├── login.post.ts
│   │       ├── logout.post.ts
│   │       └── me.get.ts
│   ├── api/admin/                # Endpoints protégés (session requise)
│   │   ├── articles/
│   │   ├── events/
│   │   ├── time-slots/
│   │   ├── messages/
│   │   └── settings/
│   ├── db/
│   │   ├── schema.ts             # Source de vérité du schéma (à modifier ici)
│   │   ├── seed.ts               # Données de démo
│   │   └── migrations/           # Fichiers SQL auto-générés par Drizzle
│   ├── middleware/
│   │   └── admin-auth.ts         # Vérifie la session pour /api/admin/*
│   ├── plugins/
│   │   └── database.ts           # Lance migrations + seed au démarrage
│   └── utils/
│       ├── db.ts                 # Singleton de connexion SQLite
│       ├── password.ts           # Hash/vérification scrypt
│       └── session.ts            # useAdminSession() — wrapper H3
│
├── shared/
│   └── types.ts                  # Types TypeScript partagés front/back
│
├── nuxt.config.ts
├── drizzle.config.ts
└── package.json
```

---

## 3. Base de données

### Schéma

Le schéma est défini dans `server/db/schema.ts`. C'est la **seule source de vérité** — ne jamais modifier les fichiers SQL de migration à la main.

| Table | Rôle |
|---|---|
| `users` | Comptes admin (email + hash scrypt) |
| `articles` | Actualités du club (draft / published) |
| `events` | Événements (compétitions, sorties, stages…), sur un ou plusieurs jours |
| `event_days` | Un jour d'un événement, avec ses horaires propres (FK `event_id` cascade) |
| `time_slots` | Créneaux : récurrents (chaque semaine) ou ponctuels (`recurring` + `date`) |
| `contact_messages` | Messages du formulaire de contact |
| `settings` | Configuration clé/valeur (ex : lien d'inscription) |

> Les horaires d'un événement vivent dans `event_days` (un horaire par jour).
> Les colonnes `events.start_time/end_time` sont **legacy** (conservées pour le
> backfill au démarrage, plus écrites par le nouveau flux).

### Modifier le schéma

```bash
# 1. Éditer server/db/schema.ts
# 2. Générer la migration
npm run db:generate
# 3. Relancer le serveur (la migration s'applique au démarrage)
npm run dev
```

### Réinitialiser complètement

```bash
rm -rf .data/
npm run dev   # recrée la base et reseed
```

### Explorer la base en développement

```bash
npm run db:studio   # ouvre Drizzle Studio sur http://local.drizzle.studio
```

### Créer un compte admin manuellement

Si la base est déjà initialisée et que vous voulez ajouter un compte sans passer par le seed :

```bash
node -e "
const Database = require('better-sqlite3');
const { randomBytes, scryptSync } = require('crypto');
const db = new Database('.data/blocdeslegendes.sqlite');
const salt = randomBytes(16).toString('hex');
const hash = scryptSync('VOTRE_MOT_DE_PASSE', salt, 64).toString('hex');
db.prepare('INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)').run('email@exemple.fr', salt+':'+hash, new Date().toISOString());
db.close();
console.log('Compte créé.');
"
```

---

## 4. API — référence complète

### Endpoints publics

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/articles` | Articles publiés, triés par date de publication |
| `GET` | `/api/articles/:id` | Article publié par ID (404 si brouillon) |
| `GET` | `/api/events` | Événements à venir (visibles jusqu'à leur date de fin), chacun avec ses `days[]` |
| `GET` | `/api/time-slots` | Tous les créneaux (récurrents + ponctuels), avec `recurring` et `date` |
| `GET` | `/api/registration-link` | Lien d'inscription externe (HelloAsso) |
| `POST` | `/api/contact` | Envoie un message de contact |
| `POST` | `/api/auth/login` | Connexion admin — pose un cookie de session |
| `POST` | `/api/auth/logout` | Déconnexion — efface la session |
| `GET` | `/api/auth/me` | Retourne l'utilisateur courant ou 401 |

### Endpoints admin (session requise)

Tous les endpoints `/api/admin/*` renvoient `401` si aucune session valide n'est présente.

#### Articles

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/admin/articles` | Tous les articles (brouillons inclus) |
| `POST` | `/api/admin/articles` | Créer un article |
| `GET` | `/api/admin/articles/:id` | Article par ID |
| `PUT` | `/api/admin/articles/:id` | Modifier (mise à jour partielle) |
| `DELETE` | `/api/admin/articles/:id` | Supprimer |

Corps `POST`/`PUT` :
```json
{
  "title": "string (requis)",
  "summary": "string (requis)",
  "content": "string (requis)",
  "imageUrl": "string | null",
  "status": "draft | published"
}
```

#### Événements

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/admin/events` | Tous les événements, triés par date |
| `POST` | `/api/admin/events` | Créer un événement |
| `PUT` | `/api/admin/events/:id` | Modifier (mise à jour partielle) |
| `DELETE` | `/api/admin/events/:id` | Supprimer |

Corps `POST`/`PUT` — les horaires sont définis **par jour** dans `days` ;
`date` / `end_date` de l'événement sont déduits (min / max des jours) :
```json
{
  "title": "string (requis)",
  "location": "string | null",
  "description": "string | null",
  "days": [
    { "date": "YYYY-MM-DD", "startTime": "HH:MM | null", "endTime": "HH:MM | null" }
  ]
}
```
Un jour sans `startTime` = journée entière (affiché dans la bande « journée »
du calendrier ; sinon en bloc positionné à son heure).

#### Créneaux

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/admin/time-slots` | Tous les créneaux |
| `POST` | `/api/admin/time-slots` | Créer un créneau |
| `PUT` | `/api/admin/time-slots/:id` | Modifier |
| `DELETE` | `/api/admin/time-slots/:id` | Supprimer |

Corps `POST`/`PUT` :
```json
{
  "startTime": "HH:MM (requis)",
  "endTime": "HH:MM (requis)",
  "groupName": "string (requis)",
  "instructor": "string | null",
  "capacity": 0,
  "recurring": true,
  "day": "monday … sunday (si récurrent)",
  "date": "YYYY-MM-DD (requis si ponctuel)"
}
```
`recurring` à `true` par défaut. Si `false`, `date` est requise et le jour de
la semaine (`day`) est déduit de la date.

#### Messages de contact

| Méthode | Route | Description |
|---|---|---|
| `GET` | `/api/admin/messages` | Tous les messages (`?unread=true` pour filtrer) |
| `PATCH` | `/api/admin/messages/:id` | Marquer lu/non-lu (`{ "isRead": boolean }`) |

#### Paramètres

| Méthode | Route | Description |
|---|---|---|
| `PUT` | `/api/admin/settings/:key` | Modifier une valeur de config |

Clés autorisées : `registration_link`.  
Corps : `{ "value": "https://..." }`

### Ajouter un endpoint

```ts
// server/api/exemple.get.ts
import { articles } from '../db/schema'

export default defineEventHandler(() => {
  const db = useDb()         // auto-importé depuis server/utils/db.ts
  return db.select().from(articles).all()
})
```

Pour un endpoint admin protégé, le placer dans `server/api/admin/` — le middleware `server/middleware/admin-auth.ts` vérifie automatiquement la session.

---

## 5. Authentification admin

L'authentification repose sur des **cookies de session chiffrés** (H3 `useSession`), sans base de tokens externe.

### Flux

```
POST /api/auth/login
  → vérifie email + mot de passe (scrypt)
  → écrit un cookie de session chiffré (8h)
  → retourne { ok: true, email }

GET /api/auth/me
  → lit la session
  → retourne { userId, email } ou 401

POST /api/auth/logout
  → efface la session
```

### Secret de session

Le secret est lu depuis `runtimeConfig.sessionSecret` (minimum 32 caractères).  
En développement, une valeur par défaut est utilisée.  
En production, définir la variable d'environnement :

```bash
NUXT_SESSION_SECRET=une-chaine-aleatoire-de-au-moins-32-caracteres
```

### Côté frontend

Le composable `useAuth()` (`app/composables/useAuth.ts`) expose :

```ts
const { user, fetchUser, login, logout } = useAuth()
```

- `user` — `Ref<{ userId, email } | null>`, partagé SSR/client via `useState`
- `fetchUser()` — interroge `/api/auth/me` et met à jour `user`
- `login(email, password)` — appelle l'API puis `fetchUser()`
- `logout()` — appelle l'API, vide `user`, redirige vers `/admin/login`

Le middleware `app/middleware/admin.global.ts` protège toutes les routes `/admin/*` (sauf `/admin/login`) et redirige les visiteurs non connectés.

---

## 6. Frontend — conventions

### Design system

La référence vivante est accessible sur **`/styleguide`** (lancer le dev server).  
Palette, typographie et composants dans tous leurs états.

**Règle absolue** : toutes les couleurs passent par les variables CSS définies dans `app/assets/css/main.css`. Jamais de valeur hex en dur dans les composants.

| Variable | Usage |
|---|---|
| `--turquoise` | Couleur principale, CTAs |
| `--moutarde` / `--olive` | Accents secondaires |
| `--ambre` | Alertes, badges |
| `--ink` / `--ink-soft` | Texte |
| `--fond` | Fond de page |
| `--surface` | Fond des cartes/panels |
| `--line` | Bordures |

### Composants UI

Tous les composants du dossier `app/components/ui/` sont auto-importés.

| Composant | Usage |
|---|---|
| `UiButton` | Bouton (variants : `primary`, `secondary`, `ghost`, `inverse`) |
| `UiCard` | Carte générique |
| `UiSectionTitle` | En-tête de section (kicker + titre + lede) |
| `UiInput` | Champ texte avec label |
| `UiTextarea` | Zone de texte avec label |
| `UiArticleBanner` | Bannière d'article |
| `UiPageHero` | Hero de page |
| `UiWall` | Fond mur d'escalade |

### Layouts

| Layout | Appliqué à |
|---|---|
| `default` | Toutes les pages publiques (header nav + footer) |
| `admin` | Pages du back-office (`definePageMeta({ layout: 'admin' })`) |
| `false` | Page login (`definePageMeta({ layout: false })`) |

### Types partagés

Les interfaces TypeScript communes au frontend et au backend sont dans `shared/types.ts` : `Article`, `ClubEvent`, `EventDay`, `TimeSlot`, `ContactMessage`, `Weekday`, `ArticleStatus`.

---

## 7. Back-office admin

Accessible sur **`/admin`** (redirige vers `/admin/login` si non connecté).

| Page | Route | Fonctionnalités |
|---|---|---|
| Connexion | `/admin/login` | Formulaire email + mot de passe |
| Tableau de bord | `/admin` | Stats, derniers articles, prochains événements, messages non lus |
| Articles | `/admin/articles` | Liste, création, modification, suppression |
| Événements | `/admin/evenements` | CRUD, mono ou multi-jours avec horaires par jour |
| Créneaux | `/admin/creneaux` | CRUD, récurrent (chaque semaine) ou ponctuel (date) |
| Messages | `/admin/messages` | Lecture des messages de contact, marquer lu / non lu |
| Paramètres | `/admin/parametres` | Modification du lien d'inscription |

### Ce qui n'est pas encore dans le back-office

- Suppression d'un message de contact (API : seulement lecture + marquage lu)
- Gestion des comptes admin (pas d'interface, utiliser le script de la section 3)

---

## 8. Mise en production

### Variables d'environnement

| Variable | Obligatoire | Description |
|---|---|---|
| `NUXT_SESSION_SECRET` | ✅ | Secret de chiffrement des sessions (≥ 32 chars) |
| `DB_PATH` | Non | Chemin vers le fichier SQLite (défaut : `.data/blocdeslegendes.sqlite`) |

### Build et démarrage

```bash
npm run build
node .output/server/index.mjs
```

### Checklist avant mise en ligne

- [ ] Changer le mot de passe du compte admin de démo
- [ ] Définir `NUXT_SESSION_SECRET` avec une vraie valeur aléatoire
- [ ] S'assurer que le dossier `.data/` est persistant (non effacé entre les déploiements)
- [ ] Ajouter `.data/` au `.gitignore` (déjà fait)
- [ ] Déposer les polices de la charte dans `public/fonts/` (voir `public/fonts/README.md`)

### Polices de la charte

Les polices officielles **Moon Get** et **Coolvetica** ne sont pas incluses dans le dépôt.  
Déposer les fichiers `.woff2` et `.ttf` dans `public/fonts/`.  
En leur absence, des polices Google Fonts (Quicksand / Jost) sont utilisées en fallback.

---

## 9. Dépannage

### `Cannot find module '@rolldown/binding-...'`

Bug npm avec les dépendances optionnelles. Solution :

```bash
rm -rf node_modules package-lock.json
npm install
```

Les binaires natifs de rolldown et oxc-parser sont épinglés dans `optionalDependencies` pour éviter ce problème. Vérifier leurs versions lors d'une mise à jour de Nuxt :

```bash
npm ls rolldown oxc-parser
```

### La base ne se crée pas au démarrage

Vérifier que le dossier parent de `DB_PATH` est accessible en écriture. Par défaut `.data/` est créé automatiquement dans le répertoire du projet.

### Réinitialiser la base (dev)

```bash
rm -rf .data/
npm run dev
```

### Erreur de session en prod (`password must be at least 32 characters`)

La variable `NUXT_SESSION_SECRET` n'est pas définie ou fait moins de 32 caractères.
