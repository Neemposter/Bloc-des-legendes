import { asc } from 'drizzle-orm'
import { events } from '../../../db/schema'

export default defineEventHandler(() => {
  const db = useDb()
  const rows = db.select().from(events).orderBy(asc(events.date)).all()
  return attachDays(db, rows)
})
