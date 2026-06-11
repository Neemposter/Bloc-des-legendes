<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Tableau de bord — Admin Bloc des Légendes' })

const { user } = useAuth()

const { data: articles } = await useFetch('/api/admin/articles')
const { data: events } = await useFetch('/api/admin/events')
const { data: messages } = await useFetch('/api/admin/messages')

const stats = computed(() => [
  {
    label: 'Articles publiés',
    value: (articles.value as { status: string }[] ?? []).filter(a => a.status === 'published').length,
    sub: `${(articles.value as { status: string }[] ?? []).filter(a => a.status === 'draft').length} brouillon(s)`,
    to: '/admin/articles',
    color: 'turquoise',
  },
  {
    label: 'Événements à venir',
    value: (events.value as { date: string }[] ?? []).filter(e => e.date >= new Date().toISOString().slice(0, 10)).length,
    sub: `${(events.value as unknown[])?.length ?? 0} au total`,
    to: '/admin/evenements',
    color: 'moutarde',
  },
  {
    label: 'Messages non lus',
    value: (messages.value as { isRead: boolean }[] ?? []).filter(m => !m.isRead).length,
    sub: `${(messages.value as unknown[])?.length ?? 0} au total`,
    to: null,
    color: 'ambre',
  },
])
</script>

<template>
  <div>
    <div class="dash-header">
      <h1 class="dash-title">Tableau de bord</h1>
      <p class="dash-welcome">Bienvenue, <strong>{{ user?.email }}</strong></p>
    </div>

    <div class="dash-stats">
      <NuxtLink
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to ?? '#'"
        class="stat-card"
        :class="`stat-card--${stat.color}`"
        :style="{ cursor: stat.to ? 'pointer' : 'default' }"
      >
        <p class="stat-value">{{ stat.value }}</p>
        <p class="stat-label">{{ stat.label }}</p>
        <p class="stat-sub">{{ stat.sub }}</p>
      </NuxtLink>
    </div>

    <div class="dash-shortcuts">
      <h2 class="dash-section-title">Actions rapides</h2>
      <div class="shortcut-grid">
        <NuxtLink to="/admin/articles" class="shortcut">
          <span class="shortcut-icon">✏️</span>
          <span class="shortcut-label">Gérer les articles</span>
        </NuxtLink>
        <NuxtLink to="/admin/evenements" class="shortcut">
          <span class="shortcut-icon">📅</span>
          <span class="shortcut-label">Gérer les événements</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-header {
  margin-bottom: 2rem;
}

.dash-title {
  font-size: 2rem;
  margin: 0 0 0.25rem;
}

.dash-welcome {
  color: var(--ink-soft);
  margin: 0;
}

.dash-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 1.4rem 1.6rem;
  display: block;
  text-decoration: none;
  color: var(--ink);
  transition: box-shadow 0.15s, transform 0.15s;
  border-left: 4px solid;
}

.stat-card--turquoise { border-left-color: var(--turquoise); }
.stat-card--moutarde  { border-left-color: var(--moutarde); }
.stat-card--ambre     { border-left-color: var(--ambre); }

.stat-card[href]:hover {
  box-shadow: 0 6px 24px rgba(22, 36, 29, 0.1);
  transform: translateY(-2px);
}

.stat-value {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  margin: 0 0 0.1rem;
  line-height: 1;
}

.stat-label {
  font-weight: 500;
  margin: 0 0 0.25rem;
}

.stat-sub {
  color: var(--ink-soft);
  font-size: 0.85rem;
  margin: 0;
}

.dash-section-title {
  font-size: 1.1rem;
  margin: 0 0 1rem;
}

.shortcut-grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.shortcut {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.8rem 1.2rem;
  color: var(--ink);
  font-weight: 500;
  transition: box-shadow 0.15s, transform 0.15s;
}

.shortcut:hover {
  box-shadow: 0 4px 16px rgba(22, 36, 29, 0.1);
  transform: translateY(-1px);
}

.shortcut-icon {
  font-size: 1.2rem;
}
</style>
