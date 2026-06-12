<script setup lang="ts">
import type { ClubEvent } from '~~/shared/types'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Événements — Admin Bloc des Légendes' })

const { data: events, refresh } = await useFetch<ClubEvent[]>('/api/admin/events')

// ── Form state ────────────────────────────────────────────
const showForm = ref(false)
const editing = ref<ClubEvent | null>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  title: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  location: '',
})

function openCreate() {
  editing.value = null
  Object.assign(form, { title: '', description: '', date: '', startTime: '', endTime: '', location: '' })
  formError.value = ''
  showForm.value = true
}

function openEdit(ev: ClubEvent) {
  editing.value = ev
  Object.assign(form, {
    title: ev.title,
    description: ev.description ?? '',
    date: ev.date,
    startTime: ev.startTime ?? '',
    endTime: ev.endTime ?? '',
    location: ev.location ?? '',
  })
  formError.value = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editing.value = null
}

async function saveEvent() {
  if (!form.title.trim()) {
    formError.value = 'Le titre est obligatoire.'
    return
  }
  if (!form.date) {
    formError.value = 'La date est obligatoire.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const body = {
      title: form.title,
      description: form.description || null,
      date: form.date,
      startTime: form.startTime || null,
      endTime: form.endTime || null,
      location: form.location || null,
    }
    if (editing.value) {
      await $fetch(`/api/admin/events/${editing.value.id}`, { method: 'PUT', body })
    }
    else {
      await $fetch('/api/admin/events', { method: 'POST', body })
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
const deleteTarget = ref<ClubEvent | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await $fetch(`/api/admin/events/${deleteTarget.value.id}`, { method: 'DELETE' })
    await refresh()
    deleteTarget.value = null
  }
  finally {
    deleting.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10)

function isPast(date: string) {
  return date < today
}

function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Pastille date : jour + mois abrégé (le mois complet + année déborde des 3.5rem)
function chipDay(iso: string) {
  return Number(iso.split('-')[2])
}

function chipMonth(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('fr-FR', { month: 'short' })
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Événements</h1>
        <p class="page-sub">{{ events?.length ?? 0 }} événement(s) au total</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Nouvel événement</button>
    </div>

    <!-- Liste -->
    <div class="event-list">
      <div v-for="ev in events" :key="ev.id" class="event-row" :class="{ 'event-row--past': isPast(ev.date) }">
        <div class="event-date-col" :title="fmtDate(ev.date)">
          <span class="event-day">{{ chipDay(ev.date) }}</span>
          <span class="event-month">{{ chipMonth(ev.date) }}</span>
        </div>
        <div class="event-body">
          <p class="event-title">{{ ev.title }}</p>
          <p class="event-meta">
            <template v-if="ev.startTime">{{ ev.startTime }}<template v-if="ev.endTime"> – {{ ev.endTime }}</template></template>
            <template v-if="ev.location"><template v-if="ev.startTime"> · </template>{{ ev.location }}</template>
          </p>
          <p v-if="isPast(ev.date)" class="event-past-badge">Passé</p>
        </div>
        <div class="event-actions">
          <button class="btn-ghost" @click="openEdit(ev)">Modifier</button>
          <button class="btn-danger" @click="deleteTarget = ev">Supprimer</button>
        </div>
      </div>
      <p v-if="!events?.length" class="empty-msg">Aucun événement pour l'instant.</p>
    </div>

    <!-- Formulaire ────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showForm" class="overlay" @click.self="cancelForm">
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">{{ editing ? 'Modifier l\'événement' : 'Nouvel événement' }}</h2>
            <button class="panel-close" @click="cancelForm" aria-label="Fermer">✕</button>
          </div>

          <form class="panel-form" @submit.prevent="saveEvent" novalidate>
            <div class="field">
              <label class="field-label">Titre *</label>
              <input v-model="form.title" class="field-input" type="text" required placeholder="Ex : Sortie falaise côte nord" />
            </div>

            <div class="field">
              <label class="field-label">Date *</label>
              <input v-model="form.date" class="field-input" type="date" required />
            </div>

            <div class="field-row">
              <div class="field">
                <label class="field-label">Heure de début</label>
                <input v-model="form.startTime" class="field-input" type="time" />
              </div>
              <div class="field">
                <label class="field-label">Heure de fin</label>
                <input v-model="form.endTime" class="field-input" type="time" />
              </div>
            </div>

            <div class="field">
              <label class="field-label">Lieu</label>
              <input v-model="form.location" class="field-input" type="text" placeholder="Ex : Salle des sports Bodénès" />
            </div>

            <div class="field">
              <label class="field-label">Description</label>
              <textarea v-model="form.description" class="field-input field-textarea" rows="4" placeholder="Détails, informations pratiques…" />
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
          <h2 class="dialog-title">Supprimer cet événement ?</h2>
          <p class="dialog-body">« {{ deleteTarget.title }} » sera définitivement supprimé.</p>
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

/* Liste */
.event-list { display: flex; flex-direction: column; gap: 0.6rem; }

.event-row {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.event-row--past { opacity: 0.55; }

.event-date-col {
  flex-shrink: 0;
  width: 3.5rem;
  text-align: center;
  background: color-mix(in srgb, var(--moutarde) 12%, white);
  border-radius: 10px;
  padding: 0.45rem 0.2rem;
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
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
  margin-top: 0.1rem;
}

.event-body { flex: 1; min-width: 0; }

.event-title {
  font-weight: 500;
  margin: 0 0 0.15rem;
}

.event-meta {
  color: var(--ink-soft);
  font-size: 0.85rem;
  margin: 0;
}

.event-past-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--line);
  color: var(--ink-soft);
  border-radius: 999px;
  padding: 0.15rem 0.5rem;
  margin-top: 0.3rem;
}

.event-actions { display: flex; gap: 0.5rem; flex-shrink: 0; }

.empty-msg {
  color: var(--ink-soft);
  text-align: center;
  padding: 2rem;
}

/* Buttons — identiques à la page articles */
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

.field-textarea { resize: vertical; min-height: 90px; }

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
