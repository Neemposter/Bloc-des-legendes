<script setup lang="ts">
// TODO(actualités) :
// 1. Créer GET /api/articles (status = published, tri par publishedAt desc)
// 2. Remplacer les cartes de démo ci-dessous par les données de l'API
// 3. Créer la page de lecture /actualites/[id].vue (bouton "Voir plus")
useHead({ title: 'Actualités — Bloc des Légendes' })
</script>

<template>
  <div class="container">
    <UiSectionTitle
      kicker="La vie du club"
      title="Actualités"
      lede="Compétitions, sorties falaise, événements et nouvelles du club."
    />

    <div class="articles-grid">
      <UiCard
        title="Page en construction"
        summary="Les actualités seront branchées sur l'API articles. Voir les TODO dans ce fichier."
        meta="Bientôt"
      />
    </div>
  </div>
</template>

<style scoped>
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.4rem;
}
</style>
