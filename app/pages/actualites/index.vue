<script setup lang="ts">
import type { Article } from '~~/shared/types'

useHead({ title: 'Actualités — Bloc des Légendes' })

const { data } = await useFetch<Article[]>('/api/articles')
const articles = computed(() => data.value ?? [])

// La dernière actu en vedette, le reste en grille
const latest = computed(() => articles.value[0] ?? null)
const others = computed(() => articles.value.slice(1))
</script>

<template>
  <div>
    <UiPageHero
      kicker="La vie du club"
      title="Actualités"
      lede="Compétitions, sorties falaise, événements et nouvelles du club."
    />

    <div class="container articles-page">
      <template v-if="latest">
        <UiArticleBanner :article="latest" />
        <div v-if="others.length" class="articles-grid">
          <UiCard
            v-for="article in others"
            :key="article.id"
            :title="article.title"
            :summary="article.summary"
            :image-url="article.imageUrl"
            :meta="formatDateFr(article.publishedAt)"
            :to="`/actualites/${article.id}`"
          />
        </div>
      </template>
      <p v-else class="articles-empty">
        Aucune actualité publiée pour le moment — revenez bientôt !
      </p>
    </div>
  </div>
</template>

<style scoped>
.articles-page {
  padding-top: 2.4rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.4rem;
  margin-top: 1.4rem;
}

.articles-empty {
  color: var(--ink-soft);
  padding: 2rem 0;
}
</style>
