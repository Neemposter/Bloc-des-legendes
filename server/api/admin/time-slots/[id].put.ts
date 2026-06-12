import { eq } from 'drizzle-orm'
import { timeSlots, WEEKDAYS } from '../../../db/schema'

interface TimeSlotBody {
  day?: string
  startTime?: string
  endTime?: string
  groupName?: string
  instructor?: string | null
  capacity?: number
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const body = await readBody<TimeSlotBody>(event)
  const db = useDb()

  const existing = db.select().from(timeSlots).where(eq(timeSlots.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, message: 'Créneau introuvable.' })

  if (body.day && !(WEEKDAYS as readonly string[]).includes(body.day)) throw createError({ statusCode: 422, message: 'Jour invalide.' })
  if (body.startTime && !body.startTime.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de début invalide (HH:MM).' })
  if (body.endTime && !body.endTime.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de fin invalide (HH:MM).' })

  return db.update(timeSlots).set({
    day: (body.day as typeof WEEKDAYS[number]) ?? existing.day,
    startTime: body.startTime ?? existing.startTime,
    endTime: body.endTime ?? existing.endTime,
    groupName: body.groupName?.trim() ?? existing.groupName,
    instructor: 'instructor' in body ? (body.instructor?.trim() || null) : existing.instructor,
    capacity: body.capacity ?? existing.capacity,
  }).where(eq(timeSlots.id, id)).returning().get()
})
