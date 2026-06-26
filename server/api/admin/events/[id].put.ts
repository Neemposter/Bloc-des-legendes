import { eq } from 'drizzle-orm'
import { eventDays, events } from '../../../db/schema'
import type { DayInput } from '../../../utils/events'

interface EventBody {
  title?: string
  description?: string | null
  location?: string | null
  days: DayInput[]
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const body = await readBody<EventBody>(event)
  const db = useDb()

  const existing = db.select().from(events).where(eq(events.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, message: 'Événement introuvable.' })

  const { date, endDate } = validateEventDays(body.days)

  db.update(events).set({
    title: body.title?.trim() ?? existing.title,
    description: 'description' in body ? (body.description?.trim() || null) : existing.description,
    location: 'location' in body ? (body.location?.trim() || null) : existing.location,
    date,
    endDate,
    updatedAt: new Date().toISOString(),
  }).where(eq(events.id, id)).run()

  // Remplace les jours
  db.delete(eventDays).where(eq(eventDays.eventId, id)).run()
  db.insert(eventDays).values(
    body.days.map(d => ({
      eventId: id,
      date: d.date,
      startTime: d.startTime?.trim() || null,
      endTime: d.endTime?.trim() || null,
    })),
  ).run()

  const updated = db.select().from(events).where(eq(events.id, id)).get()!
  return attachDays(db, [updated])[0]
})
