import { eventDays } from '../db/schema'
import type { useDb } from './db'

type Db = ReturnType<typeof useDb>
interface EventRow { id: number }

export interface DayInput {
  date: string
  startTime?: string | null
  endTime?: string | null
}

// Valide la liste des jours et renvoie la plage (date début / fin).
export function validateEventDays(days: DayInput[]): { date: string, endDate: string | null } {
  if (!Array.isArray(days) || days.length === 0) {
    throw createError({ statusCode: 422, message: 'Au moins une journée est requise.' })
  }
  for (const d of days) {
    if (!d.date || !/^\d{4}-\d{2}-\d{2}$/.test(d.date)) throw createError({ statusCode: 422, message: 'Date de jour invalide (YYYY-MM-DD).' })
    if (d.startTime && !/^\d{2}:\d{2}$/.test(d.startTime)) throw createError({ statusCode: 422, message: 'Heure de début invalide (HH:MM).' })
    if (d.endTime && !/^\d{2}:\d{2}$/.test(d.endTime)) throw createError({ statusCode: 422, message: 'Heure de fin invalide (HH:MM).' })
    if (d.startTime && d.endTime && d.endTime <= d.startTime) throw createError({ statusCode: 422, message: 'L\'heure de fin doit être après l\'heure de début.' })
  }
  const dates = days.map(d => d.date).sort()
  const date = dates[0]!
  const endDate = dates[dates.length - 1]! !== date ? dates[dates.length - 1]! : null
  return { date, endDate }
}

// Attache à chaque événement ses jours (event_days), triés par date.
export function attachDays<T extends EventRow>(db: Db, rows: T[]) {
  const all = db.select().from(eventDays).all()
  return rows.map(e => ({
    ...e,
    days: all
      .filter(d => d.eventId === e.id)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({ date: d.date, startTime: d.startTime, endTime: d.endTime })),
  }))
}
