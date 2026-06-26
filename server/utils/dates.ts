const WEEKDAY_BY_GETDAY = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

// Jour de la semaine (clé EN) d'une date YYYY-MM-DD.
export function weekdayOf(iso: string): typeof WEEKDAY_BY_GETDAY[number] {
  const [y, m, d] = iso.split('-').map(Number)
  return WEEKDAY_BY_GETDAY[new Date(y!, m! - 1, d!).getDay()]!
}

// Liste des dates (YYYY-MM-DD) entre start et end inclus.
export function datesBetween(start: string, end: string | null): string[] {
  const last = end ?? start
  if (last < start) return [start]
  const out: string[] = []
  const [sy, sm, sd] = start.split('-').map(Number)
  const cur = new Date(sy!, sm! - 1, sd!)
  const stop = (() => {
    const [ey, em, ed] = last.split('-').map(Number)
    return new Date(ey!, em! - 1, ed!)
  })()
  while (cur <= stop) {
    out.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`)
    cur.setDate(cur.getDate() + 1)
  }
  return out
}
