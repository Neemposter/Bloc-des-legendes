<script setup lang="ts">
import type { TimeSlot, Weekday } from '~~/shared/types'

useHead({ title: 'Calendrier des séances — Bloc des Légendes' })

const { data } = await useFetch<TimeSlot[]>('/api/time-slots')
const slots = computed(() => data.value ?? [])

const DAYS: { key: Weekday, label: string }[] = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
]

const PX_PER_MIN = 1.1

function toMinutes(time: string): number {
  const [h = 0, m = 0] = time.split(':').map(Number)
  return h * 60 + m
}

const slotsByDay = computed(() => {
  const map = {} as Record<Weekday, TimeSlot[]>
  for (const day of DAYS) {
    map[day.key] = slots.value
      .filter(s => s.day === day.key)
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

type Category = 'ecole' | 'ados' | 'adultes' | 'compet' | 'libre'

function slotCategory(slot: TimeSlot): Category {
  const n = slot.groupName.toLowerCase()
  if (n.includes('libre') || n.includes('famille')) return 'libre'
  if (n.includes('école') || n.includes('ecole')) return 'ecole'
  if (n.includes('ados')) return 'ados'
  if (n.includes('comp')) return 'compet'
  return 'adultes'
}

const LEGEND: { category: Category, label: string }[] = [
  { category: 'ecole', label: 'École d\'escalade' },
  { category: 'ados', label: 'Ados' },
  { category: 'adultes', label: 'Adultes' },
  { category: 'compet', label: 'Compétition' },
  { category: 'libre', label: 'Accès libre' },
]
</script>

<template>
  <div class="container">
    <section class="cal-hero">
      <span class="hero-holds" aria-hidden="true">
        <i class="hold hold-1" /><i class="hold hold-2" /><i class="hold hold-3" /><i class="hold hold-4" />
      </span>
      <p class="kicker">Planning hebdomadaire</p>
      <h1>Le calendrier des séances</h1>
      <p class="lede">
        Les créneaux se répètent chaque semaine, hors vacances scolaires.
        Les événements ponctuels (compétitions, sorties falaise) sont annoncés dans les actualités.
      </p>
    </section>

    <ul class="legend" aria-label="Légende des groupes">
      <li v-for="item in LEGEND" :key="item.category" class="legend-item">
        <span class="legend-dot" :class="`dot--${item.category}`" aria-hidden="true" />
        {{ item.label }}
      </li>
    </ul>

    <div class="cal">
      <div class="cal-axis" aria-hidden="true">
        <span
          v-for="label in hourLabels"
          :key="label.hour"
          class="cal-axis-label"
          :style="{ top: label.top }"
        >{{ label.hour }}h</span>
      </div>

      <div class="cal-days">
        <section v-for="day in DAYS" :key="day.key" class="cal-day">
          <h2 class="cal-day-name">{{ day.label }}</h2>
          <div class="cal-day-track" :style="{ height: trackHeight }">
            <p v-if="!slotsByDay[day.key].length" class="cal-empty">Fermé</p>
            <article
              v-for="slot in slotsByDay[day.key]"
              :key="slot.id"
              class="slot"
              :class="`slot--${slotCategory(slot)}`"
              :style="slotStyle(slot)"
              :title="`${slot.startTime} – ${slot.endTime} · ${slot.groupName}${slot.instructor ? ` · avec ${slot.instructor}` : ''} · ${slot.capacity} places`"
            >
              <p class="slot-time">{{ slot.startTime }} – {{ slot.endTime }}</p>
              <h3 class="slot-group">{{ slot.groupName }}</h3>
              <p class="slot-meta">
                <template v-if="slot.instructor">Avec {{ slot.instructor }} · </template>{{ slot.capacity }} places
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
</template>

<style scoped>
.cal-hero {
  position: relative;
  padding: 3.2rem 0 1.6rem;
  max-width: 620px;
}

.kicker {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.85rem;
  color: var(--turquoise);
  margin: 0 0 0.5rem;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  text-transform: uppercase;
}

.lede {
  color: var(--ink-soft);
  margin-top: 0.9rem;
}

.hero-holds {
  position: absolute;
  right: -260px;
  top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.hold {
  display: inline-block;
  border-radius: 55% 45% 60% 40% / 50% 60% 40% 50%;
}

.hold-1 { width: 26px; height: 22px; background: var(--turquoise); transform: translateX(38px) rotate(15deg); }
.hold-2 { width: 18px; height: 20px; background: var(--ambre); transform: translateX(0) rotate(-20deg); }
.hold-3 { width: 22px; height: 18px; background: var(--moutarde); transform: translateX(52px) rotate(40deg); }
.hold-4 { width: 16px; height: 16px; background: var(--olive); transform: translateX(20px); }

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

.cal {
  display: flex;
  gap: 0.6rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 1.2rem;
}

.cal-axis {
  position: relative;
  width: 2.4rem;
  flex-shrink: 0;
  margin-top: 2.4rem;
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

.cal-day-name {
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  height: 2.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
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

@media (max-width: 900px) {
  .cal {
    padding: 0.9rem;
  }

  .cal-axis {
    display: none;
  }

  .cal-days {
    grid-template-columns: 1fr;
  }

  .cal-day-name {
    justify-content: flex-start;
    height: auto;
    margin: 0.8rem 0 0.5rem;
  }

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

  .hero-holds {
    display: none;
  }
}
</style>
