// Liste des dates (YYYY-MM-DD) entre start et end inclus.
export function datesBetween(start: string, end: string | null): string[] {
  if (!start) return []
  const last = end && end >= start ? end : start
  const out: string[] = []
  const [sy, sm, sd] = start.split('-').map(Number)
  const cur = new Date(sy!, sm! - 1, sd!)
  const [ey, em, ed] = last.split('-').map(Number)
  const stop = new Date(ey!, em! - 1, ed!)
  while (cur <= stop) {
    out.push(`${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`)
    cur.setDate(cur.getDate() + 1)
  }
  return out
}

// Libellé court d'un jour : « lun. 26 oct. »
export function dayLabel(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}
