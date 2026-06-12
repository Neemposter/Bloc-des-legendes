import { timeSlots, WEEKDAYS } from '../../../db/schema'

interface TimeSlotBody {
  day: string
  startTime: string
  endTime: string
  groupName: string
  instructor?: string | null
  capacity?: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody<TimeSlotBody>(event)

  if (!(WEEKDAYS as readonly string[]).includes(body.day)) throw createError({ statusCode: 422, message: 'Jour invalide.' })
  if (!body.startTime?.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de début invalide (HH:MM).' })
  if (!body.endTime?.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de fin invalide (HH:MM).' })
  if (!body.groupName?.trim()) throw createError({ statusCode: 422, message: 'Le nom du groupe est requis.' })

  const db = useDb()
  return db.insert(timeSlots).values({
    day: body.day as typeof WEEKDAYS[number],
    startTime: body.startTime,
    endTime: body.endTime,
    groupName: body.groupName.trim(),
    instructor: body.instructor?.trim() || null,
    capacity: body.capacity ?? 0,
  }).returning().get()
})
