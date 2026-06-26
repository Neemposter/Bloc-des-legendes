import { timeSlots, WEEKDAYS } from '../../../db/schema'

interface TimeSlotBody {
  day: string
  startTime: string
  endTime: string
  groupName: string
  instructor?: string | null
  capacity?: number
  recurring?: boolean
  date?: string | null
}

export default defineEventHandler(async (event) => {
  const body = await readBody<TimeSlotBody>(event)

  if (!body.startTime?.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de début invalide (HH:MM).' })
  if (!body.endTime?.match(/^\d{2}:\d{2}$/)) throw createError({ statusCode: 422, message: 'Heure de fin invalide (HH:MM).' })
  if (body.endTime <= body.startTime) throw createError({ statusCode: 422, message: 'L\'heure de fin doit être après l\'heure de début.' })
  if (!body.groupName?.trim()) throw createError({ statusCode: 422, message: 'Le nom du groupe est requis.' })

  const recurring = body.recurring !== false // récurrent par défaut
  let day: string
  let date: string | null
  if (recurring) {
    if (!(WEEKDAYS as readonly string[]).includes(body.day)) throw createError({ statusCode: 422, message: 'Jour invalide.' })
    day = body.day
    date = null
  }
  else {
    if (!body.date?.match(/^\d{4}-\d{2}-\d{2}$/)) throw createError({ statusCode: 422, message: 'Une date est requise pour un créneau ponctuel.' })
    date = body.date
    day = weekdayOf(body.date) // le jour découle de la date
  }

  const db = useDb()
  return db.insert(timeSlots).values({
    day: day as typeof WEEKDAYS[number],
    startTime: body.startTime,
    endTime: body.endTime,
    groupName: body.groupName.trim(),
    instructor: body.instructor?.trim() || null,
    capacity: body.capacity ?? 0,
    recurring,
    date,
  }).returning().get()
})
