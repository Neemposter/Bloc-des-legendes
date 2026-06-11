<script setup lang="ts">
// TODO(admin) — back-office réservé aux comptes admin :
// 1. Auth : POST /api/auth/login (verifyPassword de server/utils/password.ts
//    + session) puis middleware de protection des routes /admin/** et /api/admin/**
// 2. CRUD articles : liste + création/édition/suppression (POC vendredi)
// 3. CRUD créneaux, lecture des messages de contact, édition du lien d'inscription
// Compte de démo seedé : admin@blocdeslegendes.fr / blocdeslegendes
useHead({ title: 'Administration — Bloc des Légendes' })
</script>

<template>
  <div class="container">
    <UiSectionTitle
      kicker="Back-office"
      title="Administration"
      lede="Espace réservé aux bénévoles : gestion des actualités, du calendrier, des messages et du lien d'inscription."
    />
    <p class="admin-todo">Page en construction — voir les TODO dans ce fichier.</p>
  </div>
</template>

<style scoped>
.admin-todo {
  color: var(--ink-soft);
}
</style>
