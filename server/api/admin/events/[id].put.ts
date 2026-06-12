import { eq } from 'drizzle-orm'
import { events } from '../../../db/schema'

interface EventBody {
  title?: string
  description?: string | null
  date?: string
  startTime?: string | null
  endTime?: string | null
  location?: string | null
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const body = await readBody<EventBody>(event)
  const db = useDb()

  const existing = db.select().from(events).where(eq(events.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, message: 'Événement introuvable.' })

  if (body.date && !body.date.match(/^\d{4}-\d{2}-\d{2}$/)) throw createError({ statusCode: 422, message: 'Date invalide (YYYY-MM-DD).' })
  if (body.startTime && !body.startTime.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de début invalide (HH:MM).' })
  if (body.endTime && !body.endTime.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de fin invalide (HH:MM).' })

  return db.update(events).set({
    title: body.title?.trim() ?? existing.title,
    description: 'description' in body ? (body.description?.trim() || null) : existing.description,
    date: body.date ?? existing.date,
    startTime: 'startTime' in body ? (body.startTime?.trim() || null) : existing.startTime,
    endTime: 'endTime' in body ? (body.endTime?.trim() || null) : existing.endTime,
    location: 'location' in body ? (body.location?.trim() || null) : existing.location,
    updatedAt: new Date().toISOString(),
  }).where(eq(events.id, id)).returning().get()
})
