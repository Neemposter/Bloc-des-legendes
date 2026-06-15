<script setup lang="ts">
const { user, logout } = useAuth()
</script>

<template>
  <div class="admin-shell">
    <header class="admin-header">
      <div class="admin-header-inner">
        <NuxtLink to="/admin" class="admin-brand">
          <span class="admin-brand-holds" aria-hidden="true">
            <i class="hold hold-turquoise" /><i class="hold hold-moutarde" /><i class="hold hold-ambre" />
          </span>
          Admin
        </NuxtLink>

        <nav class="admin-nav" aria-label="Navigation admin">
          <NuxtLink to="/admin" class="admin-nav-link">Tableau de bord</NuxtLink>
          <NuxtLink to="/admin/articles" class="admin-nav-link">Articles</NuxtLink>
          <NuxtLink to="/admin/evenements" class="admin-nav-link">Événements</NuxtLink>
          <NuxtLink to="/admin/creneaux" class="admin-nav-link">Créneaux</NuxtLink>
          <NuxtLink to="/admin/messages" class="admin-nav-link">Messages</NuxtLink>
          <NuxtLink to="/admin/parametres" class="admin-nav-link">Paramètres</NuxtLink>
          <NuxtLink to="/" target="_blank" class="admin-nav-link admin-nav-link--muted">← Site public</NuxtLink>
        </nav>

        <div class="admin-user" v-if="user">
          <span class="admin-user-email">{{ user.email }}</span>
          <button class="admin-logout-btn" @click="logout">Déconnexion</button>
        </div>
      </div>
    </header>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  min-height: 100vh;
  background: var(--fond);
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: var(--ink);
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 50;
}

.admin-header-inner {
  width: min(1280px, 100% - 2rem);
  margin-inline: auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  min-height: 56px;
  flex-wrap: wrap;
  padding-block: 0.4rem;
}

.admin-brand {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--moutarde);
  flex-shrink: 0;
}

.admin-brand-holds {
  display: inline-flex;
  gap: 0.2rem;
}

.hold {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 55% 45% 60% 40% / 50% 60% 40% 50%;
  display: inline-block;
}
.hold-turquoise { background: var(--turquoise); }
.hold-moutarde  { background: var(--moutarde); }
.hold-ambre     { background: var(--ambre); }

.admin-nav {
  display: flex;
  gap: 0.25rem;
  flex: 1;
  flex-wrap: wrap;
}

.admin-nav-link {
  padding: 0.35rem 0.85rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.75);
  transition: background 0.15s, color 0.15s;
}

.admin-nav-link:hover,
.admin-nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.admin-nav-link--muted {
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.83rem;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-left: auto;
  flex-shrink: 0;
}

.admin-user-email {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
}

.admin-logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.75);
  border-radius: 6px;
  padding: 0.3rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.admin-logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.admin-main {
  flex: 1;
  width: min(1280px, 100% - 2rem);
  margin-inline: auto;
  padding-block: 2rem;
}
</style>
