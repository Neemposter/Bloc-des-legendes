import { asc } from 'drizzle-orm'
import { events } from '../db/schema'

export default defineEventHandler(() => {
  const db = useDb()
  const today = new Date().toISOString().slice(0, 10)
  // Un événement reste « à venir » tant que sa date de fin (ou de début si
  // mono-jour) n'est pas passée → on filtre sur end_date ?? date.
  const rows = db.select().from(events)
    .orderBy(asc(events.date))
    .all()
    .filter(e => (e.endDate ?? e.date) >= today)
  return attachDays(db, rows)
})
