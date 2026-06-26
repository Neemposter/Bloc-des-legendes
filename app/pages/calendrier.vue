<script setup lang="ts">
import type { ClubEvent, TimeSlot, Weekday } from '~~/shared/types'

useHead({ title: 'Calendrier des séances — Bloc des Légendes' })

const { data } = await useFetch<TimeSlot[]>('/api/time-slots')
const { data: upcomingEvents } = await useFetch<ClubEvent[]>('/api/events')
const slots = computed(() => data.value ?? [])

const WEEKDAY_KEYS: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const DOW = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// ── Dates & navigation par semaine ─────────────────────────
function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function mondayOf(d: Date): Date {
  const x = new Date(d)
  const offset = (x.getDay() + 6) % 7 // 0 = lundi
  x.setDate(x.getDate() - offset)
  x.setHours(0, 0, 0, 0)
  return x
}

const todayISO = toISO(new Date())
const weekStart = ref(mondayOf(new Date()))

const weekDays = computed(() =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart.value)
    d.setDate(d.getDate() + i)
    const iso = toISO(d)
    return { key: WEEKDAY_KEYS[i]!, label: DOW[i]!, dayNum: d.getDate(), iso, isToday: iso === todayISO }
  }),
)

const weekLabel = computed(() => {
  const start = new Date(weekStart.value)
  const end = new Date(weekStart.value)
  end.setDate(end.getDate() + 6)
  if (start.getMonth() === end.getMonth()) {
    return `Semaine du ${start.getDate()} au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
  }
  return `Du ${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
})

const isCurrentWeek = computed(() => toISO(weekStart.value) === toISO(mondayOf(new Date())))

function shiftWeek(delta: number) {
  const d = new Date(weekStart.value)
  d.setDate(d.getDate() + delta * 7)
  weekStart.value = d
}
function goToday() {
  weekStart.value = mondayOf(new Date())
}

// ── Événements posés sur la semaine affichée ───────────────
function eventsOnDay(iso: string): ClubEvent[] {
  return (upcomingEvents.value ?? []).filter(e => e.date <= iso && iso <= (e.endDate ?? e.date))
}
const weekHasEvents = computed(() => weekDays.value.some(d => eventsOnDay(d.iso).length > 0))
const maxEventsPerDay = computed(() => Math.max(0, ...weekDays.value.map(d => eventsOnDay(d.iso).length)))
// Hauteur réservée pour la bande « journée » (alignée sur toutes les colonnes)
const ALLDAY_ROW_PX = 24
const alldayHeightPx = computed(() => (weekHasEvents.value ? maxEventsPerDay.value * ALLDAY_ROW_PX + 8 : 0))

// ── Créneaux récurrents (template projeté sur chaque semaine) ──
const PX_PER_MIN = 1.1
function toMinutes(time: string): number {
  const [h = 0, m = 0] = time.split(':').map(Number)
  return h * 60 + m
}

const slotsByDay = computed(() => {
  const map = {} as Record<Weekday, TimeSlot[]>
  for (const key of WEEKDAY_KEYS) {
    map[key] = slots.value
      .filter(s => s.day === key)
      .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
  }
  return map
})

const minMinutes = computed(() => {
  if (!slots.value.length) return 9 * 60
  return Math.floor(Math.min(...slots.value.map(s => toMinutes(s.startTime))) / 60) * 60
})
const maxMinutes = computed(() => {
  if (!slots.value.length) return 22 * 60
  return Math.ceil(Math.max(...slots.value.map(s => toMinutes(s.endTime))) / 60) * 60
})
const trackHeight = computed(() => `${(maxMinutes.value - minMinutes.value) * PX_PER_MIN}px`)
const hourLabels = computed(() => {
  const labels: { hour: number, top: string }[] = []
  for (let m = minMinutes.value; m <= maxMinutes.value; m += 60) {
    labels.push({ hour: m / 60, top: `${(m - minMinutes.value) * PX_PER_MIN}px` })
  }
  return labels
})
function slotStyle(slot: TimeSlot) {
  const top = (toMinutes(slot.startTime) - minMinutes.value) * PX_PER_MIN
  const height = (toMinutes(slot.endTime) - toMinutes(slot.startTime)) * PX_PER_MIN
  return { top: `${top}px`, height: `${height}px` }
}
function slotTitle(slot: TimeSlot): string {
  const parts = [`${slot.startTime} – ${slot.endTime}`, slot.groupName]
  if (slot.instructor) parts.push(`avec ${slot.instructor}`)
  if (slot.capacity > 0) parts.push(`${slot.capacity} places`)
  return parts.join(' · ')
}

// ── Liste « Événements à venir » ───────────────────────────
function fmtEventDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}
function fmtEventRange(ev: ClubEvent) {
  if (!ev.endDate || ev.endDate === ev.date) return fmtEventDate(ev.date)
  const [sy, sm, sd] = ev.date.split('-').map(Number)
  const [ey, em, ed] = ev.endDate.split('-').map(Number)
  const end = new Date(ey!, em! - 1, ed!)
  if (sy === ey && sm === em) {
    return `Du ${sd} au ${ed} ${end.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`
  }
  const start = new Date(sy!, sm! - 1, sd!)
  return `Du ${start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
}

const LEGEND: { category: SlotCategory, label: string }[] = [
  { category: 'ecole', label: 'École d\'escalade' },
  { category: 'ados', label: 'Ados' },
  { category: 'adultes', label: 'Adultes' },
  { category: 'compet', label: 'Compétition' },
  { category: 'libre', label: 'Accès libre' },
]
</script>

<template>
  <div>
    <UiPageHero
      kicker="Planning hebdomadaire"
      title="Le calendrier des séances"
      lede="Les créneaux se répètent chaque semaine. Naviguez d'une semaine à l'autre pour voir les dates et les événements ponctuels du club."
    />

    <div class="container cal-page">
      <!-- Navigation semaine -->
      <div class="weeknav">
        <h2 class="weeknav-label">{{ weekLabel }}</h2>
        <div class="weeknav-btns">
          <button class="weeknav-btn" aria-label="Semaine précédente" @click="shiftWeek(-1)">‹</button>
          <button class="weeknav-today" :disabled="isCurrentWeek" @click="goToday">Aujourd'hui</button>
          <button class="weeknav-btn" aria-label="Semaine suivante" @click="shiftWeek(1)">›</button>
        </div>
      </div>

      <ul class="legend" aria-label="Légende des groupes">
        <li v-for="item in LEGEND" :key="item.category" class="legend-item">
          <span class="legend-dot" :class="`dot--${item.category}`" aria-hidden="true" />
          {{ item.label }}
        </li>
      </ul>

      <div class="cal">
        <!-- Colonne axe horaire -->
        <div class="cal-axis" aria-hidden="true">
          <div class="cal-axis-head" />
          <div v-if="weekHasEvents" class="cal-axis-allday" :style="{ height: `${alldayHeightPx}px` }" />
          <div class="cal-axis-hours" :style="{ height: trackHeight }">
            <span
              v-for="label in hourLabels"
              :key="label.hour"
              class="cal-axis-label"
              :style="{ top: label.top }"
            >{{ label.hour }}h</span>
          </div>
        </div>

        <div class="cal-days">
          <section v-for="day in weekDays" :key="day.iso" class="cal-day" :class="{ 'cal-day--today': day.isToday }">
            <h3 class="cal-day-head">
              <span class="cal-dow">{{ day.label }}</span>
              <span class="cal-date">{{ day.dayNum }}</span>
            </h3>

            <div v-if="weekHasEvents" class="cal-allday" :style="{ height: `${alldayHeightPx}px` }">
              <span
                v-for="ev in eventsOnDay(day.iso)"
                :key="ev.id"
                class="allday-chip"
                :title="`${ev.title}${ev.location ? ' · ' + ev.location : ''}`"
              >{{ ev.title }}</span>
            </div>

            <div class="cal-day-track" :style="{ height: trackHeight }">
              <p v-if="!slotsByDay[day.key].length" class="cal-empty">Fermé</p>
              <article
                v-for="slot in slotsByDay[day.key]"
                :key="slot.id"
                class="slot"
                :class="`slot--${slotCategory(slot.groupName)}`"
                :style="slotStyle(slot)"
                :title="slotTitle(slot)"
              >
                <p class="slot-time">{{ slot.startTime }} – {{ slot.endTime }}</p>
                <h4 class="slot-group">{{ slot.groupName }}</h4>
                <p v-if="slot.instructor || slot.capacity > 0" class="slot-meta">
                  <template v-if="slot.instructor">Avec {{ slot.instructor }}</template>
                  <template v-if="slot.instructor && slot.capacity > 0"> · </template>
                  <template v-if="slot.capacity > 0">{{ slot.capacity }} places</template>
                </p>
              </article>
            </div>
          </section>
        </div>
      </div>

      <p class="cal-footnote">
        Une question sur un créneau ou un essai gratuit ?
        <NuxtLink to="/contact" class="cal-footnote-link">Écrivez-nous</NuxtLink>.
      </p>
    </div>

    <!-- Événements ponctuels -->
    <div v-if="upcomingEvents?.length" id="evenements" class="container events-section">
      <h2 class="events-title">Événements à venir</h2>
      <ul class="events-list">
        <li v-for="ev in upcomingEvents" :key="ev.id" class="event-card">
          <div class="event-date-block">
            <span class="event-day">{{ ev.date.split('-')[2] }}</span>
            <span class="event-month">
              {{ new Date(ev.date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'short' }) }}
            </span>
          </div>
          <div class="event-info">
            <p class="event-name">
              {{ ev.title }}
              <span v-if="ev.endDate && ev.endDate !== ev.date" class="event-multiday">Plusieurs jours</span>
            </p>
            <p class="event-when">
              {{ fmtEventRange(ev) }}
              <template v-if="ev.startTime">
                · {{ ev.startTime }}<template v-if="ev.endTime"> – {{ ev.endTime }}</template>
              </template>
            </p>
            <p v-if="ev.location" class="event-where">📍 {{ ev.location }}</p>
            <p v-if="ev.description" class="event-desc">{{ ev.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.cal-page {
  padding-top: 2rem;
}

/* ── Navigation semaine ── */
.weeknav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.2rem;
}

.weeknav-label {
  font-size: 1.25rem;
  margin: 0;
  text-transform: capitalize;
}

.weeknav-btns {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weeknav-btn {
  width: 2.4rem;
  height: 2.4rem;
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: 999px;
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
  color: var(--ink);
  transition: background 0.15s, border-color 0.15s;
}

.weeknav-btn:hover {
  background: var(--fond);
  border-color: var(--turquoise);
}

.weeknav-today {
  font-family: var(--font-display);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid var(--turquoise);
  background: transparent;
  color: var(--turquoise);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
}

.weeknav-today:hover:not(:disabled) { background: rgba(3, 166, 105, 0.08); }
.weeknav-today:disabled { opacity: 0.4; cursor: default; }

/* ── Légende ── */
.legend {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  padding: 0;
  margin: 0 0 1.4rem;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.95rem;
  color: var(--ink-soft);
}

.legend-dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 55% 45% 60% 40% / 50% 60% 40% 50%;
}

.dot--ecole { background: var(--moutarde); }
.dot--ados { background: var(--olive); }
.dot--adultes { background: var(--turquoise); }
.dot--compet { background: var(--ambre); }
.dot--libre { background: transparent; border: 2px dashed var(--turquoise); }

/* ── Grille calendrier ── */
.cal {
  display: flex;
  gap: 0.6rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 1.2rem;
}

.cal-axis {
  width: 2.4rem;
  flex-shrink: 0;
}

.cal-axis-head { height: 2.8rem; }

.cal-axis-hours {
  position: relative;
}

.cal-axis-label {
  position: absolute;
  right: 0.3rem;
  transform: translateY(-50%);
  font-size: 0.78rem;
  color: var(--ink-soft);
}

.cal-days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 0.6rem;
  flex: 1;
}

.cal-day-head {
  height: 2.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
  border-radius: 8px;
}

.cal-dow {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
}

.cal-date {
  font-family: var(--font-display);
  font-size: 1.1rem;
  line-height: 1;
  color: var(--ink);
}

.cal-day--today .cal-day-head {
  background: var(--turquoise);
}
.cal-day--today .cal-dow { color: rgba(255, 255, 255, 0.85); }
.cal-day--today .cal-date { color: #fff; }

/* Bande « journée » : événements */
.cal-allday {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow: hidden;
  padding-block: 0.2rem;
}

.allday-chip {
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.2;
  color: var(--ambre);
  background: color-mix(in srgb, var(--ambre) 14%, white);
  border-left: 3px solid var(--ambre);
  border-radius: 4px;
  padding: 0.15rem 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cal-day-track {
  position: relative;
  background-image: repeating-linear-gradient(
    to bottom,
    var(--line) 0,
    var(--line) 1px,
    transparent 1px,
    transparent 66px
  );
}

.cal-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-soft);
  font-size: 0.85rem;
  opacity: 0.6;
  margin: 0;
}

.slot {
  position: absolute;
  left: 0;
  right: 0;
  border-radius: 8px;
  border-left: 4px solid;
  padding: 0.4rem 0.5rem;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.slot:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(22, 36, 29, 0.12);
  z-index: 2;
}

.slot--ecole { border-color: var(--moutarde); background: color-mix(in srgb, var(--moutarde) 16%, white); }
.slot--ados { border-color: var(--olive); background: color-mix(in srgb, var(--olive) 16%, white); }
.slot--adultes { border-color: var(--turquoise); background: color-mix(in srgb, var(--turquoise) 12%, white); }
.slot--compet { border-color: var(--ambre); background: color-mix(in srgb, var(--ambre) 16%, white); }
.slot--libre {
  border: 2px dashed var(--turquoise);
  border-radius: 8px;
  background: transparent;
}

.slot-time {
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--ink-soft);
  margin: 0;
}

.slot-group {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.85rem;
  line-height: 1.25;
  margin: 0.12rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slot-meta {
  font-size: 0.75rem;
  line-height: 1.3;
  color: var(--ink-soft);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cal-footnote {
  margin-top: 1.6rem;
  color: var(--ink-soft);
}

.cal-footnote-link {
  color: var(--turquoise);
  font-weight: 500;
  border-bottom: 1px solid currentColor;
}

/* ── Événements ponctuels (liste) ── */
.events-section {
  margin-top: 3rem;
  padding-bottom: 2rem;
  scroll-margin-top: 80px;
}

.events-title {
  font-size: 1.5rem;
  margin: 0 0 1.2rem;
}

.events-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.event-card {
  display: flex;
  gap: 1.2rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 1.1rem 1.4rem;
  align-items: flex-start;
}

.event-date-block {
  flex-shrink: 0;
  width: 3.2rem;
  background: color-mix(in srgb, var(--turquoise) 10%, white);
  border-radius: 10px;
  padding: 0.4rem 0.2rem;
  text-align: center;
}

.event-day {
  display: block;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--ink);
}

.event-month {
  display: block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
  margin-top: 0.1rem;
}

.event-info { flex: 1; min-width: 0; }

.event-name {
  font-weight: 600;
  font-size: 1.05rem;
  margin: 0 0 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.event-multiday {
  font-size: 0.66rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ambre);
  background: color-mix(in srgb, var(--ambre) 14%, white);
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
}

.event-when {
  color: var(--ink-soft);
  font-size: 0.9rem;
  margin: 0 0 0.2rem;
  text-transform: capitalize;
}

.event-where {
  color: var(--ink-soft);
  font-size: 0.88rem;
  margin: 0 0 0.35rem;
}

.event-desc {
  color: var(--ink-soft);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

/* ── Responsive : empilement par jour ── */
@media (max-width: 900px) {
  .cal {
    padding: 0.9rem;
  }

  .cal-axis {
    display: none;
  }

  .cal-days {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }

  .cal-day-head {
    height: auto !important;
    flex-direction: row;
    justify-content: flex-start;
    gap: 0.5rem;
    margin: 0.8rem 0 0.4rem;
    background: transparent !important;
  }

  .cal-day--today .cal-dow,
  .cal-day--today .cal-date {
    color: var(--turquoise);
  }

  .cal-allday {
    height: auto !important;
  }

  .allday-chip { white-space: normal; }

  .cal-day-track {
    height: auto !important;
    background-image: none;
  }

  .cal-empty {
    position: static;
    justify-content: flex-start;
  }

  .slot {
    position: static !important;
    height: auto !important;
    margin-bottom: 0.55rem;
  }

  .slot-group {
    -webkit-line-clamp: unset;
    display: block;
  }

  .slot-meta {
    white-space: normal;
  }
}
</style>
