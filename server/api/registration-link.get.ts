import { eq } from 'drizzle-orm'
import { settings } from '../db/schema'

// Lien d'inscription externe (HelloAsso ou équivalent), modifiable en admin.
export default defineEventHandler(() => {
  const db = useDb()
  const row = db.select().from(settings).where(eq(settings.key, 'registration_link')).get()
  return { url: row?.value ?? null }
})
