import { asc } from 'drizzle-orm'
import { events } from '../../../db/schema'

export default defineEventHandler(() => {
  const db = useDb()
  return db.select().from(events).orderBy(asc(events.date)).all()
})
