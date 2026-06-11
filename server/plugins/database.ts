import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { seedIfEmpty } from '../db/seed'

// Au démarrage du serveur : applique les migrations puis seed les tables vides.
// => `npm install && npm run dev` suffit, aucune commande DB manuelle.
export default defineNitroPlugin(() => {
  const db = useDb()
  migrate(db, { migrationsFolder: 'server/db/migrations' })
  seedIfEmpty(db)
})
