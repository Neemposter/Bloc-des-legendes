<script setup lang="ts">
// Stub temporaire — la vraie page d'accueil (présentation + 3 derniers articles)
// est développée séparément. Ce fichier évite un 404 sur / pendant le POC.
useHead({ title: 'Bloc des Légendes — Club d\'escalade' })
</script>

<template>
  <div class="container home-stub">
    <h1>Bloc des Légendes</h1>
    <p>Page d'accueil en construction.</p>
    <NuxtLink to="/calendrier" class="home-cta">Voir le calendrier des séances</NuxtLink>
  </div>
</template>

<style scoped>
.home-stub {
  padding-block: 4rem;
}

.home-cta {
  display: inline-block;
  margin-top: 1rem;
  background: var(--turquoise);
  color: white;
  font-weight: 500;
  padding: 0.7rem 1.3rem;
  border-radius: 10px;
}
</style>
