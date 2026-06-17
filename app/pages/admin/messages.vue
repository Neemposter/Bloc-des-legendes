<script setup lang="ts">
import type { ContactMessage } from '~~/shared/types'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Messages — Admin Bloc des Légendes' })

const { data: messages, refresh } = await useFetch<ContactMessage[]>('/api/admin/messages')

const filter = ref<'all' | 'unread'>('all')

const unreadCount = computed(() => (messages.value ?? []).filter(m => !m.isRead).length)

const visible = computed(() => {
  const list = messages.value ?? []
  return filter.value === 'unread' ? list.filter(m => !m.isRead) : list
})

const busy = ref<number | null>(null)

async function setRead(msg: ContactMessage, isRead: boolean) {
  busy.value = msg.id
  try {
    await $fetch(`/api/admin/messages/${msg.id}`, { method: 'PATCH', body: { isRead } })
    await refresh()
  }
  finally {
    busy.value = null
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function mailtoLink(msg: ContactMessage) {
  const subject = msg.subject ? `Re: ${msg.subject}` : 'Votre message au Bloc des Légendes'
  return `mailto:${msg.email}?subject=${encodeURIComponent(subject)}`
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Messages</h1>
        <p class="page-sub">
          {{ messages?.length ?? 0 }} message(s) ·
          <span :class="{ 'page-sub--alert': unreadCount > 0 }">{{ unreadCount }} non lu(s)</span>
        </p>
      </div>
      <div class="filter">
        <button class="filter-btn" :class="{ 'filter-btn--active': filter === 'all' }" @click="filter = 'all'">
          Tous
        </button>
        <button class="filter-btn" :class="{ 'filter-btn--active': filter === 'unread' }" @click="filter = 'unread'">
          Non lus<span v-if="unreadCount" class="filter-count">{{ unreadCount }}</span>
        </button>
      </div>
    </div>

    <div class="msg-list">
      <article
        v-for="msg in visible"
        :key="msg.id"
        class="msg"
        :class="{ 'msg--unread': !msg.isRead }"
      >
        <div class="msg-head">
          <div class="msg-from">
            <span v-if="!msg.isRead" class="msg-dot" aria-label="Non lu" />
            <span class="msg-name">{{ msg.name }}</span>
            <a :href="`mailto:${msg.email}`" class="msg-email">{{ msg.email }}</a>
          </div>
          <span class="msg-date">{{ fmtDate(msg.createdAt) }}</span>
        </div>

        <p v-if="msg.subject" class="msg-subject">{{ msg.subject }}</p>
        <p class="msg-body">{{ msg.message }}</p>

        <div class="msg-actions">
          <a :href="mailtoLink(msg)" class="btn-primary btn-primary--sm">Répondre par email</a>
          <button
            v-if="!msg.isRead"
            class="btn-ghost"
            :disabled="busy === msg.id"
            @click="setRead(msg, true)"
          >
            {{ busy === msg.id ? '…' : 'Marquer comme lu' }}
          </button>
          <button
            v-else
            class="btn-ghost"
            :disabled="busy === msg.id"
            @click="setRead(msg, false)"
          >
            {{ busy === msg.id ? '…' : 'Marquer comme non lu' }}
          </button>
        </div>
      </article>

      <p v-if="!visible.length" class="empty-msg">
        {{ filter === 'unread' ? 'Aucun message non lu.' : 'Aucun message pour l\'instant.' }}
      </p>
    </div>
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
.page-sub--alert { color: var(--ambre); font-weight: 500; }

/* Filtre */
.filter {
  display: inline-flex;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 0.2rem;
}

.filter-btn {
  background: transparent;
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-size: 0.88rem;
  cursor: pointer;
  color: var(--ink-soft);
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.15s, color 0.15s;
}

.filter-btn--active {
  background: var(--ink);
  color: #fff;
}

.filter-count {
  background: var(--ambre);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.05rem 0.4rem;
  min-width: 1.2rem;
  text-align: center;
}

/* Liste */
.msg-list { display: flex; flex-direction: column; gap: 0.7rem; }

.msg {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1.2rem 1.4rem;
}

.msg--unread {
  border-left: 4px solid var(--ambre);
}

.msg-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.msg-from {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.msg-dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: var(--ambre);
  flex-shrink: 0;
}

.msg-name { font-weight: 500; }

.msg-email {
  color: var(--turquoise);
  font-size: 0.9rem;
}

.msg-email:hover { text-decoration: underline; }

.msg-date {
  color: var(--ink-soft);
  font-size: 0.82rem;
  flex-shrink: 0;
}

.msg-subject {
  font-weight: 500;
  margin: 0 0 0.3rem;
}

.msg-body {
  color: var(--ink-soft);
  line-height: 1.6;
  margin: 0 0 1rem;
  white-space: pre-wrap;
}

.msg-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.empty-msg {
  color: var(--ink-soft);
  text-align: center;
  padding: 2.5rem;
}

/* Buttons — alignés sur les autres pages admin */
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
  display: inline-block;
  text-decoration: none;
}

.btn-primary:hover {
  background: color-mix(in srgb, var(--turquoise) 88%, black);
  transform: translateY(-1px);
}

.btn-primary--sm {
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
}

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

.btn-ghost:hover:not(:disabled) { background: var(--fond); }
.btn-ghost:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
