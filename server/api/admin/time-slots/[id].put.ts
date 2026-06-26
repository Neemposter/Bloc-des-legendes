import { eq } from 'drizzle-orm'
import { timeSlots, WEEKDAYS } from '../../../db/schema'

interface TimeSlotBody {
  day?: string
  startTime?: string
  endTime?: string
  groupName?: string
  instructor?: string | null
  capacity?: number
  recurring?: boolean
  date?: string | null
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const body = await readBody<TimeSlotBody>(event)
  const db = useDb()

  const existing = db.select().from(timeSlots).where(eq(timeSlots.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, message: 'Créneau introuvable.' })

  const startTime = body.startTime ?? existing.startTime
  const endTime = body.endTime ?? existing.endTime
  if (!startTime.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de début invalide (HH:MM).' })
  if (!endTime.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de fin invalide (HH:MM).' })
  if (endTime <= startTime) throw createError({ statusCode: 422, message: 'L\'heure de fin doit être après l\'heure de début.' })

  const recurring = body.recurring ?? existing.recurring
  let day: string
  let date: string | null
  if (recurring) {
    day = body.day ?? existing.day
    if (!(WEEKDAYS as readonly string[]).includes(day)) throw createError({ statusCode: 422, message: 'Jour invalide.' })
    date = null
  }
  else {
    date = body.date ?? existing.date
    if (!date?.match(/^\d{4}-\d{2}-\d{2}$/)) throw createError({ statusCode: 422, message: 'Une date est requise pour un créneau ponctuel.' })
    day = weekdayOf(date)
  }

  return db.update(timeSlots).set({
    day: day as typeof WEEKDAYS[number],
    startTime,
    endTime,
    groupName: body.groupName?.trim() ?? existing.groupName,
    instructor: 'instructor' in body ? (body.instructor?.trim() || null) : existing.instructor,
    capacity: body.capacity ?? existing.capacity,
    recurring,
    date,
  }).where(eq(timeSlots.id, id)).returning().get()
})
