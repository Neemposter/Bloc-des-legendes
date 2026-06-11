<script setup lang="ts">
// Carte article : utilisée sur la page actualités et la section
// "3 derniers articles" de l'accueil.
defineProps<{
  title: string
  summary?: string
  imageUrl?: string | null
  meta?: string
  to?: string
}>()
</script>

<template>
  <article class="ui-card">
    <div class="ui-card-inner">
      <div class="ui-card-image">
        <img v-if="imageUrl" :src="imageUrl" :alt="''" loading="lazy">
        <span v-else class="ui-card-placeholder" aria-hidden="true">
          <UiWall />
        </span>
      </div>
      <div class="ui-card-body">
        <p v-if="meta" class="ui-card-meta">{{ meta }}</p>
        <h3 class="ui-card-title">{{ title }}</h3>
        <p v-if="summary" class="ui-card-summary">{{ summary }}</p>
        <NuxtLink v-if="to" :to="to" class="ui-card-link">
          Voir plus<span aria-hidden="true"> →</span>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.ui-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.ui-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(22, 36, 29, 0.10);
}

.ui-card-image {
  aspect-ratio: 16 / 9;
  background: var(--fond);
  position: relative;
  overflow: hidden;
}

.ui-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ui-card-placeholder {
  position: absolute;
  inset: 0;
}

.ui-card-placeholder :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.ui-card-body {
  padding: 1.1rem 1.2rem 1.3rem;
}

.ui-card-meta {
  font-size: 0.82rem;
  color: var(--ink-soft);
  margin: 0 0 0.35rem;
}

.ui-card-title {
  font-size: 1.15rem;
  margin: 0;
  text-transform: none;
}

.ui-card-summary {
  color: var(--ink-soft);
  font-size: 0.95rem;
  margin: 0.5rem 0 0;
}

.ui-card-link {
  display: inline-block;
  margin-top: 0.8rem;
  color: var(--turquoise);
  font-weight: 500;
}

.ui-card-link:hover {
  text-decoration: underline;
}
</style>
