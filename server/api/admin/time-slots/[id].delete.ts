import { eq } from 'drizzle-orm'
import { timeSlots } from '../../../db/schema'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const db = useDb()
  const existing = db.select().from(timeSlots).where(eq(timeSlots.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, message: 'Créneau introuvable.' })

  db.delete(timeSlots).where(eq(timeSlots.id, id)).run()
  return { ok: true }
})
