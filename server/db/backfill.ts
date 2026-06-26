import { eq } from 'drizzle-orm'
import { datesBetween } from '../utils/dates'
import { eventDays, events } from './schema'
import type { useDb } from '../utils/db'

type Db = ReturnType<typeof useDb>

// Garantit qu'un event a ses jours (event_days). Pour les événements créés
// avant la fonctionnalité « horaires par jour » : une ligne par date de la
// plage, en reprenant les heures legacy de l'événement.
export function backfillEventDays(db: Db) {
  const all = db.select().from(events).all()
  for (const ev of all) {
    const existing = db.select().from(eventDays).where(eq(eventDays.eventId, ev.id)).all()
    if (existing.length) continue
    const dates = datesBetween(ev.date, ev.endDate)
    db.insert(eventDays).values(
      dates.map(d => ({
        eventId: ev.id,
        date: d,
        startTime: ev.startTime ?? null,
        endTime: ev.endTime ?? null,
      })),
    ).run()
  }
}
