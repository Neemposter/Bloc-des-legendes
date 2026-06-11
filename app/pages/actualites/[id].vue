<script setup lang="ts">
import type { Article } from '~~/shared/types'

const route = useRoute()
const { data: article, error } = await useFetch<Article>(`/api/articles/${route.params.id}`)

if (error.value || !article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article introuvable', fatal: true })
}

useHead({ title: `${article.value.title} — Bloc des Légendes` })
</script>

<template>
  <article v-if="article" class="container article-page">
    <NuxtLink to="/actualites" class="article-back">← Toutes les actualités</NuxtLink>

    <p class="kicker">{{ formatDateFr(article.publishedAt) }}</p>
    <h1>{{ article.title }}</h1>
    <p class="article-summary">{{ article.summary }}</p>

    <img
      v-if="article.imageUrl"
      :src="article.imageUrl"
      :alt="article.title"
      class="article-image"
    >

    <div class="article-content">
      <p v-for="(paragraph, i) in article.content.split('\n').filter(p => p.trim())" :key="i">
        {{ paragraph }}
      </p>
    </div>
  </article>
</template>

<style scoped>
.article-page {
  max-width: 760px;
  padding-block: 3rem;
}

.article-back {
  display: inline-block;
  color: var(--turquoise);
  font-weight: 500;
  margin-bottom: 2rem;
}

.article-back:hover {
  text-decoration: underline;
}

.kicker {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.85rem;
  color: var(--turquoise);
  margin: 0 0 0.5rem;
}

h1 {
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  text-transform: uppercase;
}

.article-summary {
  color: var(--ink-soft);
  font-size: 1.1rem;
  margin-top: 0.9rem;
}

.article-image {
  width: 100%;
  border-radius: 14px;
  margin-top: 1.8rem;
  display: block;
}

.article-content {
  margin-top: 1.8rem;
}

.article-content p {
  margin: 0 0 1.1rem;
  line-height: 1.75;
}
</style>
