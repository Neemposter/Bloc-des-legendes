<script setup lang="ts">
import type { Article } from '~~/shared/types'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Articles — Admin Bloc des Légendes' })

const { data: articles, refresh } = await useFetch<Article[]>('/api/admin/articles')

// ── Form state ────────────────────────────────────────────
const showForm = ref(false)
const editing = ref<Article | null>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({
  title: '',
  summary: '',
  content: '',
  imageUrl: '',
  status: 'draft' as 'draft' | 'published',
})

function openCreate() {
  editing.value = null
  Object.assign(form, { title: '', summary: '', content: '', imageUrl: '', status: 'draft' })
  formError.value = ''
  showForm.value = true
}

function openEdit(article: Article) {
  editing.value = article
  Object.assign(form, {
    title: article.title,
    summary: article.summary,
    content: article.content,
    imageUrl: article.imageUrl ?? '',
    status: article.status,
  })
  formError.value = ''
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  editing.value = null
}

async function saveArticle() {
  if (!form.title.trim() || !form.summary.trim() || !form.content.trim()) {
    formError.value = 'Titre, résumé et contenu sont obligatoires.'
    return
  }
  saving.value = true
  formError.value = ''
  try {
    const body = {
      title: form.title,
      summary: form.summary,
      content: form.content,
      imageUrl: form.imageUrl || null,
      status: form.status,
    }
    if (editing.value) {
      await $fetch(`/api/admin/articles/${editing.value.id}`, { method: 'PUT', body })
    }
    else {
      await $fetch('/api/admin/articles', { method: 'POST', body })
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
const deleteTarget = ref<Article | null>(null)
const deleting = ref(false)

async function confirmDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try {
    await $fetch(`/api/admin/articles/${deleteTarget.value.id}`, { method: 'DELETE' })
    await refresh()
    deleteTarget.value = null
  }
  finally {
    deleting.value = false
  }
}

// ── Helpers ───────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Articles</h1>
        <p class="page-sub">{{ articles?.length ?? 0 }} article(s) au total</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ Nouvel article</button>
    </div>

    <!-- Liste -->
    <div class="article-list">
      <div v-for="a in articles" :key="a.id" class="article-row">
        <div class="article-row-main">
          <span class="badge" :class="a.status === 'published' ? 'badge--published' : 'badge--draft'">
            {{ a.status === 'published' ? 'Publié' : 'Brouillon' }}
          </span>
          <div>
            <p class="article-title">{{ a.title }}</p>
            <p class="article-meta">
              {{ a.publishedAt ? `Publié le ${fmtDate(a.publishedAt)}` : `Créé le ${fmtDate(a.createdAt)}` }}
            </p>
          </div>
        </div>
        <div class="article-row-actions">
          <button class="btn-ghost" @click="openEdit(a)">Modifier</button>
          <button class="btn-danger" @click="deleteTarget = a">Supprimer</button>
        </div>
      </div>
      <p v-if="!articles?.length" class="empty-msg">Aucun article pour l'instant.</p>
    </div>

    <!-- Formulaire ────────────────────────────────────── -->
    <Teleport to="body">
      <div v-if="showForm" class="overlay" @click.self="cancelForm">
        <div class="panel">
          <div class="panel-header">
            <h2 class="panel-title">{{ editing ? 'Modifier l\'article' : 'Nouvel article' }}</h2>
            <button class="panel-close" @click="cancelForm" aria-label="Fermer">✕</button>
          </div>

          <form class="panel-form" @submit.prevent="saveArticle" novalidate>
            <div class="field">
              <label class="field-label">Titre *</label>
              <input v-model="form.title" class="field-input" type="text" required placeholder="Titre de l'article" />
            </div>

            <div class="field">
              <label class="field-label">Résumé *</label>
              <textarea v-model="form.summary" class="field-input field-textarea" rows="2" placeholder="Résumé affiché sur les cartes" />
            </div>

            <div class="field">
              <label class="field-label">Contenu *</label>
              <textarea v-model="form.content" class="field-input field-textarea" rows="8" placeholder="Contenu complet de l'article" />
            </div>

            <div class="field">
              <label class="field-label">URL de l'image</label>
              <input v-model="form.imageUrl" class="field-input" type="url" placeholder="https://…" />
            </div>

            <div class="field">
              <label class="field-label">Statut</label>
              <select v-model="form.status" class="field-input field-select">
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
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
          <h2 class="dialog-title">Supprimer cet article ?</h2>
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
.article-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.article-row {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.article-row-main {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
}

.badge {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.badge--published { background: color-mix(in srgb, var(--turquoise) 15%, white); color: var(--turquoise); }
.badge--draft     { background: color-mix(in srgb, var(--ambre) 15%, white); color: var(--ambre); }

.article-title {
  font-weight: 500;
  margin: 0 0 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40ch;
}

.article-meta {
  color: var(--ink-soft);
  font-size: 0.85rem;
  margin: 0;
}

.article-row-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.empty-msg {
  color: var(--ink-soft);
  text-align: center;
  padding: 2rem;
}

/* Buttons */
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
  width: min(560px, 100vw);
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

.field-textarea { resize: vertical; min-height: 72px; }
.field-select { appearance: auto; cursor: pointer; }

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
