import { eventDays, events } from '../../../db/schema'
import type { DayInput } from '../../../utils/events'

interface EventBody {
  title: string
  description?: string | null
  location?: string | null
  days: DayInput[]
}

export default defineEventHandler(async (event) => {
  const body = await readBody<EventBody>(event)

  if (!body.title?.trim()) throw createError({ statusCode: 422, message: 'Le titre est requis.' })
  const { date, endDate } = validateEventDays(body.days)

  const now = new Date().toISOString()
  const db = useDb()
  const created = db.insert(events).values({
    title: body.title.trim(),
    description: body.description?.trim() || null,
    date,
    endDate,
    startTime: null,
    endTime: null,
    location: body.location?.trim() || null,
    createdAt: now,
    updatedAt: now,
  }).returning().get()

  db.insert(eventDays).values(
    body.days.map(d => ({
      eventId: created.id,
      date: d.date,
      startTime: d.startTime?.trim() || null,
      endTime: d.endTime?.trim() || null,
    })),
  ).run()

  return attachDays(db, [created])[0]
})
