import { asc, gte } from 'drizzle-orm'
import { events } from '../db/schema'

export default defineEventHandler(() => {
  const db = useDb()
  const today = new Date().toISOString().slice(0, 10)
  return db.select().from(events)
    .where(gte(events.date, today))
    .orderBy(asc(events.date))
    .all()
})
