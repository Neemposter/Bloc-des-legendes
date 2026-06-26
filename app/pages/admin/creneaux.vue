<script setup lang="ts">
import type { TimeSlot, Weekday } from '~~/shared/types'
import { slotCategory } from '~/utils/slots'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Créneaux — Admin Bloc des Légendes' })

const { data: slots, refresh } = await useFetch<TimeSlot[]>('/api/admin/time-slots')

const DAYS: { key: Weekday, label: string }[] = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
]

const slotsByDay = computed(() => {
  const map = {} as Record<Weekday, TimeSlot[]>
  for (const d of DAYS) {
    map[d.key] = (slots.value ?? [])
      .filter(s => s.day === d.key)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }
  return map
})

// ── Form state ────────────────────────────────────────────
const showForm = ref(false)
const editing = ref<TimeSlot | null>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  day: 'monday' as Weekday,
  startTime: '',
  endTime: '',
  groupName: '',
  instructor: '',
  capacity: 0,
  recurring: true,
  date: '',
})

function openCreate(day: Weekday = 'monday') {
  editing.value = null
  Object.assign(form, { day, startTime: '', endTime: '', groupName: '', instructor: '', capacity: 0, recurring: true, date: '' })
  formError.value = ''
  showForm.value = true
}

function openEdit(slot: TimeSlot) {
  editing.value = slot
  Object.assign(form, {
    day: slot.day,
    startTime: slot.startTime,
    endTime: slot.endTime,
    groupName: slot.groupName,
    instructor: slot.instructor ?? '',
    capacity: slot.capacity,
    recurring: slot.recurring,
    date: slot.date ?? '',
  })
  formError.value = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editing.value = null
}

async function saveSlot() {
  if (!form.startTime || !form.endTime) {
    formError.value = 'Les heures de début et de fin sont obligatoires.'
    return
  }
  if (form.endTime <= form.startTime) {
    formError.value = 'L\'heure de fin doit être après l\'heure de début.'
    return
  }
  if (!form.groupName.trim()) {
    formError.value = 'Le nom du groupe est obligatoire.'
    return
  }
  if (!form.recurring && !form.date) {
    formError.value = 'Une date est requise pour un créneau ponctuel.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const body = {
      day: form.day,
      startTime: form.startTime,
      endTime: form.endTime,
      groupName: form.groupName,
      instructor: form.instructor || null,
      capacity: Number(form.capacity) || 0,
      recurring: form.recurring,
      date: form.recurring ? null : form.date,
    }
    if (editing.value) {
      await $fetch(`/api/admin/time-slots/${editing.value.id}`, { method: 'PUT', body })
    }
    else {
      await $fetch('/api/admin/time-slots', { method: 'POST', body })
    }
    await refresh()
    cancelForm()
  }
  catch (e: unknown) {
    formError.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erreur lors de la sauvegarde.'
  }
  finally {
    saving.value = false
  }
}

// ── Delete ────────────────────────────────────────────────
const deleteTarget = ref<TimeSlot | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await $fetch(`/api/admin/time-slots/${deleteTarget.value.id}`, { method: 'DELETE' })
    await refresh()
    deleteTarget.value = null
  }
  finally {
    deleting.value = false
  }
}

function fmtSlotDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Créneaux</h1>
        <p class="page-sub">{{ slots?.length ?? 0 }} créneau(x) sur la semaine</p>
      </div>
      <button class="btn-primary" @click="openCreate()">+ Nouveau créneau</button>
    </div>

    <!-- Planning par jour -->
    <div class="week">
      <section v-for="d in DAYS" :key="d.key" class="day">
        <div class="day-head">
          <h2 class="day-name">{{ d.label }}</h2>
          <button class="day-add" :title="`Ajouter un créneau le ${d.label.toLowerCase()}`" @click="openCreate(d.key)">+ Ajouter</button>
        </div>

        <div v-if="slotsByDay[d.key].length" class="slot-list">
          <div
            v-for="slot in slotsByDay[d.key]"
            :key="slot.id"
            class="slot-row"
            :class="`slot-row--${slotCategory(slot.groupName)}`"
          >
            <div class="slot-time">{{ slot.startTime }}<br>{{ slot.endTime }}</div>
            <div class="slot-body">
              <p class="slot-group">
                {{ slot.groupName }}
                <span v-if="!slot.recurring && slot.date" class="slot-oneoff">Ponctuel · {{ fmtSlotDate(slot.date) }}</span>
              </p>
              <p class="slot-meta">
                <template v-if="slot.instructor">{{ slot.instructor }}</template>
                <template v-if="slot.instructor && slot.capacity > 0"> · </template>
                <template v-if="slot.capacity > 0">{{ slot.capacity }} places</template>
                <template v-if="!slot.instructor && slot.capacity === 0">—</template>
              </p>
            </div>
            <div class="slot-actions">
              <button class="btn-ghost" @click="openEdit(slot)">Modifier</button>
              <button class="btn-danger" @click="deleteTarget = slot">Supprimer</button>
            </div>
          </div>
        </div>
        <p v-else class="day-empty">Aucun créneau ce jour-là.</p>
      </section>
    </div>

    <!-- Formulaire ────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showForm" class="overlay" @click.self="cancelForm">
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">{{ editing ? 'Modifier le créneau' : 'Nouveau créneau' }}</h2>
            <button class="panel-close" @click="cancelForm" aria-label="Fermer">✕</button>
          </div>

          <form class="panel-form" @submit.prevent="saveSlot" novalidate>
            <label class="recurring-toggle">
              <input v-model="form.recurring" type="checkbox" />
              <span>Se répète chaque semaine</span>
            </label>

            <div v-if="form.recurring" class="field">
              <label class="field-label">Jour *</label>
              <select v-model="form.day" class="field-input">
                <option v-for="d in DAYS" :key="d.key" :value="d.key">{{ d.label }}</option>
              </select>
            </div>
            <div v-else class="field">
              <label class="field-label">Date *</label>
              <input v-model="form.date" class="field-input" type="date" required />
              <p class="field-hint">Le créneau n'apparaîtra que ce jour-là.</p>
            </div>

            <div class="field-row">
              <div class="field">
                <label class="field-label">Heure de début *</label>
                <input v-model="form.startTime" class="field-input" type="time" required />
              </div>
              <div class="field">
                <label class="field-label">Heure de fin *</label>
                <input v-model="form.endTime" class="field-input" type="time" required />
              </div>
            </div>

            <div class="field">
              <label class="field-label">Groupe *</label>
              <input v-model="form.groupName" class="field-input" type="text" required placeholder="Ex : Adultes, Jeunes — école d'escalade…" />
            </div>

            <div class="field-row">
              <div class="field">
                <label class="field-label">Encadrant</label>
                <input v-model="form.instructor" class="field-input" type="text" placeholder="Optionnel" />
              </div>
              <div class="field">
                <label class="field-label">Places</label>
                <input v-model.number="form.capacity" class="field-input" type="number" min="0" placeholder="0 = non précisé" />
              </div>
            </div>

            <p v-if="formError" class="form-error">{{ formError }}</p>

            <div class="panel-actions">
              <button type="button" class="btn-ghost" @click="cancelForm">Annuler</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Confirmation suppression ────────────────────── -->
    <Teleport to="body">
      <div v-if="deleteTarget" class="overlay" @click.self="deleteTarget = null">
        <div class="dialog">
          <h2 class="dialog-title">Supprimer ce créneau ?</h2>
          <p class="dialog-body">
            « {{ deleteTarget.groupName }} » ({{ deleteTarget.startTime }} – {{ deleteTarget.endTime }})
            sera définitivement supprimé.
          </p>
          <div class="dialog-actions">
            <button class="btn-ghost" @click="deleteTarget = null">Annuler</button>
            <button class="btn-danger" :disabled="deleting" @click="confirmDelete">
              {{ deleting ? 'Suppression…' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.8rem;
  flex-wrap: wrap;
}

.page-title { font-size: 2rem; margin: 0 0 0.2rem; }
.page-sub   { color: var(--ink-soft); margin: 0; font-size: 0.9rem; }

/* Semaine */
.week { display: flex; flex-direction: column; gap: 1.4rem; }

.day-head {
  display: flex;
  align-items: baseline;
  gap: 0.9rem;
  margin-bottom: 0.6rem;
}

.day-name {
  font-family: var(--font-display);
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.day-add {
  background: transparent;
  border: none;
  color: var(--turquoise);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.1rem 0.3rem;
  border-radius: 6px;
  transition: background 0.15s;
}

.day-add:hover { background: rgba(3, 166, 105, 0.08); }

.day-empty {
  color: var(--ink-soft);
  font-size: 0.88rem;
  opacity: 0.65;
  margin: 0 0 0 0.1rem;
}

.slot-list { display: flex; flex-direction: column; gap: 0.5rem; }

.slot-row {
  background: var(--surface);
  border: 1px solid var(--line);
  border-left: 4px solid var(--line);
  border-radius: 12px;
  padding: 0.8rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  flex-wrap: wrap;
}

.slot-row--adultes { border-left-color: var(--turquoise); }
.slot-row--ecole   { border-left-color: var(--moutarde); }
.slot-row--ados    { border-left-color: var(--olive); }
.slot-row--compet  { border-left-color: var(--ambre); }
.slot-row--libre   { border-left-color: var(--turquoise); border-left-style: dashed; }

.slot-time {
  flex-shrink: 0;
  font-family: var(--font-display);
  font-size: 0.95rem;
  line-height: 1.2;
  color: var(--ink);
  text-align: center;
  min-width: 3.2rem;
}

.slot-body { flex: 1; min-width: 0; }

.slot-group {
  font-weight: 500;
  margin: 0 0 0.1rem;
}

.slot-oneoff {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--ambre);
  background: color-mix(in srgb, var(--ambre) 14%, white);
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
  margin-left: 0.4rem;
  white-space: nowrap;
}

.slot-meta {
  color: var(--ink-soft);
  font-size: 0.85rem;
  margin: 0;
}

.slot-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }

/* Buttons — identiques aux pages articles / événements */
.btn-primary {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.88rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--turquoise);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.3rem;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}

.btn-primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--turquoise) 88%, black);
  transform: translateY(-1px);
}

.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-ghost {
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
  font-size: 0.88rem;
  cursor: pointer;
  color: var(--ink);
  transition: background 0.15s;
}

.btn-ghost:hover { background: var(--fond); }

.btn-danger {
  background: transparent;
  border: 1px solid rgba(192, 57, 43, 0.35);
  color: #c0392b;
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
  font-size: 0.88rem;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-danger:hover:not(:disabled) { background: rgba(192, 57, 43, 0.07); }
.btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

/* Overlay + Panel */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(22, 36, 29, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  z-index: 200;
}

.panel {
  background: var(--surface);
  width: min(520px, 100vw);
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(22, 36, 29, 0.15);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 1.8rem;
  border-bottom: 1px solid var(--line);
  position: sticky;
  top: 0;
  background: var(--surface);
  z-index: 1;
}

.panel-title { font-size: 1.3rem; margin: 0; }

.panel-close {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--ink-soft);
  padding: 0.3rem;
  border-radius: 6px;
  transition: background 0.15s;
}

.panel-close:hover { background: var(--fond); }

.panel-form {
  padding: 1.6rem 1.8rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  flex: 1;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
}

.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-weight: 500; font-size: 0.95rem; }

.field-hint {
  font-size: 0.82rem;
  color: var(--ink-soft);
  margin: 0.1rem 0 0;
}

.recurring-toggle {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 500;
  cursor: pointer;
}

.recurring-toggle input {
  width: 1.1rem;
  height: 1.1rem;
  accent-color: var(--turquoise);
  cursor: pointer;
}

.field-input {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--ink);
  background: var(--fond);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
  outline: none;
  border-color: var(--turquoise);
  box-shadow: 0 0 0 3px rgba(3, 166, 105, 0.15);
}

.form-error {
  color: #c0392b;
  font-size: 0.9rem;
  background: rgba(192, 57, 43, 0.08);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  margin: 0;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  padding-top: 0.5rem;
}

/* Dialog */
.dialog {
  background: var(--surface);
  border-radius: 16px;
  padding: 2rem;
  width: min(420px, calc(100vw - 2rem));
  margin: auto;
  box-shadow: 0 16px 48px rgba(22, 36, 29, 0.2);
}

.dialog-title { font-size: 1.2rem; margin: 0 0 0.5rem; }
.dialog-body  { color: var(--ink-soft); margin: 0 0 1.5rem; }

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}
</style>
