import { events } from '../../../db/schema'

interface EventBody {
  title: string
  description?: string | null
  date: string
  startTime?: string | null
  endTime?: string | null
  location?: string | null
}

export default defineEventHandler(async (event) => {
  const body = await readBody<EventBody>(event)

  if (!body.title?.trim()) throw createError({ statusCode: 422, message: 'Le titre est requis.' })
  if (!body.date?.match(/^\d{4}-\d{2}-\d{2}$/)) throw createError({ statusCode: 422, message: 'Date invalide (YYYY-MM-DD).' })
  if (body.startTime && !body.startTime.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de début invalide (HH:MM).' })
  if (body.endTime && !body.endTime.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de fin invalide (HH:MM).' })

  const now = new Date().toISOString()
  const db = useDb()
  return db.insert(events).values({
    title: body.title.trim(),
    description: body.description?.trim() || null,
    date: body.date,
    startTime: body.startTime?.trim() || null,
    endTime: body.endTime?.trim() || null,
    location: body.location?.trim() || null,
    createdAt: now,
    updatedAt: now,
  }).returning().get()
})
