import { eq } from 'drizzle-orm'
import { events } from '../../../db/schema'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const db = useDb()
  const existing = db.select().from(events).where(eq(events.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, message: 'Événement introuvable.' })

  db.delete(events).where(eq(events.id, id)).run()
  return { ok: true }
})
