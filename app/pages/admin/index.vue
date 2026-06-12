<script setup lang="ts">
import type { Article, ClubEvent } from '~~/shared/types'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Tableau de bord — Admin Bloc des Légendes' })

const { user } = useAuth()

const { data: articles } = await useFetch<Article[]>('/api/admin/articles')
const { data: events } = await useFetch<ClubEvent[]>('/api/admin/events')
const { data: messages } = await useFetch<{ isRead: boolean }[]>('/api/admin/messages')

const today = new Date().toISOString().slice(0, 10)

const publishedCount = computed(() => (articles.value ?? []).filter(a => a.status === 'published').length)
const draftCount     = computed(() => (articles.value ?? []).filter(a => a.status === 'draft').length)
const upcomingCount  = computed(() => (events.value ?? []).filter(e => e.date >= today).length)
const unreadCount    = computed(() => (messages.value ?? []).filter(m => !m.isRead).length)

const recentArticles = computed(() =>
  [...(articles.value ?? [])].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4),
)

const nextEvents = computed(() =>
  (events.value ?? []).filter(e => e.date >= today).slice(0, 3),
)

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
})

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtEventDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}
</script>

<template>
  <div class="dashboard">

    <!-- Hero ──────────────────────────────────────── -->
    <div class="dash-hero">
      <div class="dash-hero-text">
        <p class="dash-greeting">{{ greeting }},</p>
        <h1 class="dash-name">{{ user?.email }}</h1>
      </div>
      <p class="dash-date">
        {{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
      </p>
    </div>

    <!-- Stats ─────────────────────────────────────── -->
    <div class="stats-grid">
      <NuxtLink to="/admin/articles" class="stat stat--green">
        <div class="stat-icon-wrap">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ publishedCount }}</p>
          <p class="stat-label">Articles publiés</p>
          <p class="stat-sub">{{ draftCount }} brouillon{{ draftCount !== 1 ? 's' : '' }}</p>
        </div>
        <svg class="stat-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </NuxtLink>

      <NuxtLink to="/admin/evenements" class="stat stat--yellow">
        <div class="stat-icon-wrap">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div class="stat-body">
          <p class="stat-value">{{ upcomingCount }}</p>
          <p class="stat-label">Événements à venir</p>
          <p class="stat-sub">{{ events?.length ?? 0 }} au total</p>
        </div>
        <svg class="stat-arrow" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </NuxtLink>

      <div class="stat stat--amber" :class="{ 'stat--alert': unreadCount > 0 }">
        <div class="stat-icon-wrap">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div class="stat-body">
          <p class="stat-value">
            {{ unreadCount }}
            <span v-if="unreadCount > 0" class="stat-badge">Nouveau</span>
          </p>
          <p class="stat-label">Messages non lus</p>
          <p class="stat-sub">{{ messages?.length ?? 0 }} au total</p>
        </div>
      </div>
    </div>

    <!-- Contenu principal ─────────────────────────── -->
    <div class="dash-columns">

      <!-- Derniers articles -->
      <section class="dash-panel">
        <div class="panel-head">
          <h2 class="panel-title">Derniers articles</h2>
          <NuxtLink to="/admin/articles" class="panel-link">Voir tout →</NuxtLink>
        </div>
        <ul class="article-feed">
          <li v-for="a in recentArticles" :key="a.id" class="feed-item">
            <span class="feed-dot" :class="a.status === 'published' ? 'feed-dot--green' : 'feed-dot--amber'" />
            <div class="feed-body">
              <p class="feed-title">{{ a.title }}</p>
              <p class="feed-meta">{{ a.status === 'published' ? 'Publié' : 'Brouillon' }} · {{ fmtDate(a.updatedAt) }}</p>
            </div>
          </li>
          <li v-if="!recentArticles.length" class="feed-empty">Aucun article pour l'instant.</li>
        </ul>
        <NuxtLink to="/admin/articles" class="panel-cta">+ Nouvel article</NuxtLink>
      </section>

      <!-- Prochains événements -->
      <section class="dash-panel">
        <div class="panel-head">
          <h2 class="panel-title">Prochains événements</h2>
          <NuxtLink to="/admin/evenements" class="panel-link">Voir tout →</NuxtLink>
        </div>
        <ul class="event-feed">
          <li v-for="ev in nextEvents" :key="ev.id" class="event-item">
            <div class="event-chip">
              <span class="event-chip-day">{{ ev.date.split('-')[2] }}</span>
              <span class="event-chip-month">{{ new Date(ev.date + 'T00:00:00').toLocaleDateString('fr-FR', { month: 'short' }) }}</span>
            </div>
            <div class="feed-body">
              <p class="feed-title">{{ ev.title }}</p>
              <p class="feed-meta">{{ fmtEventDate(ev.date) }}<template v-if="ev.location"> · {{ ev.location }}</template></p>
            </div>
          </li>
          <li v-if="!nextEvents.length" class="feed-empty">Aucun événement à venir.</li>
        </ul>
        <NuxtLink to="/admin/evenements" class="panel-cta">+ Nouvel événement</NuxtLink>
      </section>

    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── Hero ──────────────────────────────────────────── */
.dash-hero {
  background: var(--ink);
  border-radius: 18px;
  padding: 2rem 2.4rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  background-image:
    radial-gradient(ellipse at 80% 50%, color-mix(in srgb, var(--turquoise) 18%, transparent) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 80%, color-mix(in srgb, var(--moutarde) 12%, transparent) 0%, transparent 50%);
}

.dash-greeting {
  color: rgba(255,255,255,0.55);
  font-size: 1rem;
  margin: 0 0 0.15rem;
}

.dash-name {
  font-size: 1.7rem;
  color: #fff;
  margin: 0;
}

.dash-date {
  color: rgba(255,255,255,0.45);
  font-size: 0.9rem;
  margin: 0;
  text-transform: capitalize;
}

/* ── Stats ─────────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 1.4rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.1rem;
  text-decoration: none;
  color: var(--ink);
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
  overflow: hidden;
}

.stat::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.2s;
}

a.stat:hover {
  box-shadow: 0 8px 28px rgba(22, 36, 29, 0.1);
  transform: translateY(-2px);
}

a.stat:hover::before { opacity: 1; }

.stat--green  .stat-icon-wrap { background: color-mix(in srgb, var(--turquoise) 12%, white); color: var(--turquoise); }
.stat--yellow .stat-icon-wrap { background: color-mix(in srgb, var(--moutarde) 15%, white); color: var(--olive); }
.stat--amber  .stat-icon-wrap { background: color-mix(in srgb, var(--ambre) 14%, white); color: var(--ambre); }

.stat--alert {
  border-color: color-mix(in srgb, var(--ambre) 40%, transparent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ambre) 12%, transparent);
}

.stat-icon-wrap {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-body { flex: 1; min-width: 0; }

.stat-value {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  margin: 0 0 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-badge {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--ambre);
  color: #fff;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
  vertical-align: middle;
}

.stat-label {
  font-weight: 500;
  font-size: 0.9rem;
  margin: 0 0 0.15rem;
}

.stat-sub {
  color: var(--ink-soft);
  font-size: 0.82rem;
  margin: 0;
}

.stat-arrow {
  flex-shrink: 0;
  color: var(--ink-soft);
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.2s, transform 0.2s;
}

a.stat:hover .stat-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* ── Columns ───────────────────────────────────────── */
.dash-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}

/* ── Panels ────────────────────────────────────────── */
.dash-panel {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  font-size: 1rem;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 0;
  color: var(--ink-soft);
}

.panel-link {
  font-size: 0.85rem;
  color: var(--turquoise);
  font-weight: 500;
}

.panel-link:hover { text-decoration: underline; }

/* Feed items */
.article-feed,
.event-feed {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
}

.feed-item,
.event-item {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 0.5rem;
  border-radius: 10px;
  transition: background 0.15s;
}

.feed-item:hover,
.event-item:hover {
  background: var(--fond);
}

.feed-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.feed-dot--green { background: var(--turquoise); }
.feed-dot--amber { background: var(--ambre); }

.feed-body { min-width: 0; flex: 1; }

.feed-title {
  font-size: 0.92rem;
  font-weight: 500;
  margin: 0 0 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.feed-meta {
  font-size: 0.8rem;
  color: var(--ink-soft);
  margin: 0;
}

.feed-empty {
  color: var(--ink-soft);
  font-size: 0.9rem;
  padding: 0.5rem;
}

/* Event chip */
.event-chip {
  flex-shrink: 0;
  width: 36px;
  background: color-mix(in srgb, var(--moutarde) 13%, white);
  border-radius: 8px;
  padding: 0.3rem 0.2rem;
  text-align: center;
}

.event-chip-day {
  display: block;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1;
  color: var(--ink);
}

.event-chip-month {
  display: block;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-soft);
}

/* CTA */
.panel-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--turquoise);
  border: 1.5px dashed color-mix(in srgb, var(--turquoise) 40%, transparent);
  border-radius: 10px;
  padding: 0.6rem 1rem;
  text-align: center;
  justify-content: center;
  transition: background 0.15s, border-color 0.15s;
}

.panel-cta:hover {
  background: color-mix(in srgb, var(--turquoise) 6%, transparent);
  border-color: var(--turquoise);
}

/* ── Responsive ────────────────────────────────────── */
@media (max-width: 900px) {
  .stats-grid { grid-template-columns: 1fr; }
  .dash-columns { grid-template-columns: 1fr; }
  .stat-arrow { display: none; }
}

@media (max-width: 600px) {
  .dash-hero { padding: 1.5rem; }
  .dash-name  { font-size: 1.3rem; }
}
</style>
