<script setup lang="ts">
import type { Article } from '~~/shared/types'

// Carte bannière pour l'article vedette : pleine largeur, image à gauche.
// Utilisée sur l'accueil et en tête de la page actualités.
defineProps<{
  article: Article
}>()
</script>

<template>
  <NuxtLink :to="`/actualites/${article.id}`" class="banner">
    <div class="banner-media">
      <img v-if="article.imageUrl" :src="article.imageUrl" :alt="article.title" loading="lazy">
      <div v-else class="banner-wall" aria-hidden="true">
        <UiWall />
      </div>
    </div>
    <div class="banner-body">
      <p class="banner-meta">{{ formatDateFr(article.publishedAt) }}</p>
      <h3 class="banner-title">{{ article.title }}</h3>
      <p class="banner-summary">{{ article.summary }}</p>
      <span class="banner-link">Lire l'article<span aria-hidden="true"> →</span></span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.banner {
  display: grid;
  grid-template-columns: minmax(260px, 42%) 1fr;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.banner:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(22, 36, 29, 0.1);
}

.banner-media {
  position: relative;
  min-height: 240px;
}

.banner-media img,
.banner-wall {
  position: absolute;
  inset: 0;
}

.banner-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-wall :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

.banner-body {
  padding: 2rem 2.2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.banner-meta {
  font-size: 0.75rem;
  color: var(--ink-soft);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.banner-title {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.5vw, 1.9rem);
  letter-spacing: 0.02em;
  line-height: 1.1;
  margin: 0 0 0.6rem;
}

.banner-summary {
  color: var(--ink-soft);
  line-height: 1.65;
  margin: 0;
}

.banner-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--turquoise);
  margin-top: 1rem;
}

.banner-link span {
  transition: transform 0.15s ease;
}

.banner:hover .banner-link span {
  transform: translateX(4px);
}

@media (max-width: 760px) {
  .banner {
    grid-template-columns: 1fr;
  }

  .banner-media {
    min-height: 180px;
  }

  .banner-body {
    padding: 1.4rem 1.5rem;
  }
}
</style>
