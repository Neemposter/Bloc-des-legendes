import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { seedIfEmpty } from '../db/seed'
import { backfillEventDays } from '../db/backfill'

// Au démarrage du serveur : applique les migrations, seed les tables vides,
// puis garantit que chaque événement a ses jours (event_days).
// => `npm install && npm run dev` suffit, aucune commande DB manuelle.
export default defineNitroPlugin(() => {
  const db = useDb()
  migrate(db, { migrationsFolder: 'server/db/migrations' })
  seedIfEmpty(db)
  backfillEventDays(db)
})
