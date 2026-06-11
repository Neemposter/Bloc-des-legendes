<script setup lang="ts">
// Page statique : tarifs + lien vers le formulaire d'inscription EXTERNE
// (pas d'inscription directe sur le site — décision d'équipe).
// Le lien est lu depuis la table settings, modifiable dans le futur back-office.
// TODO(inscription) : remplacer les tarifs de démo par les vrais tarifs du club.
useHead({ title: 'Inscription — Bloc des Légendes' })

const { data: registration } = await useFetch<{ url: string | null }>('/api/registration-link')

const TARIFS = [
  { label: 'Adulte', prix: '180 € / an', detail: 'Accès libre + séances encadrées' },
  { label: 'Jeune (12-17 ans)', prix: '140 € / an', detail: 'École d\'escalade hebdomadaire' },
  { label: 'Enfant (6-11 ans)', prix: '120 € / an', detail: 'École d\'escalade hebdomadaire' },
  { label: 'Réduit (étudiant, demandeur d\'emploi)', prix: '140 € / an', detail: 'Sur justificatif' },
]
</script>

<template>
  <div class="container">
    <UiSectionTitle
      kicker="Rejoindre le club"
      title="Inscription"
      lede="L'adhésion comprend la licence FFME, l'assurance et l'accès aux créneaux de votre groupe. L'inscription se fait en ligne via notre partenaire."
    />

    <div class="tarifs">
      <div v-for="tarif in TARIFS" :key="tarif.label" class="tarif">
        <h3 class="tarif-label">{{ tarif.label }}</h3>
        <p class="tarif-prix">{{ tarif.prix }}</p>
        <p class="tarif-detail">{{ tarif.detail }}</p>
      </div>
    </div>

    <div class="inscription-cta">
      <UiButton v-if="registration?.url" :href="registration.url">
        S'inscrire en ligne
      </UiButton>
      <p class="inscription-note">
        Des questions avant de vous lancer ? Venez faire une séance d'essai —
        <NuxtLink to="/contact" class="inscription-link">contactez-nous</NuxtLink>.
      </p>
    </div>
  </div>
</template>

<style scoped>
.tarifs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.2rem;
}

.tarif {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 1.3rem 1.4rem;
  border-top: 4px solid var(--turquoise);
}

.tarif-label {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 1.05rem;
}

.tarif-prix {
  font-family: var(--font-display);
  font-size: 1.7rem;
  color: var(--turquoise);
  margin: 0.4rem 0 0.2rem;
}

.tarif-detail {
  color: var(--ink-soft);
  font-size: 0.92rem;
  margin: 0;
}

.inscription-cta {
  margin-top: 2.2rem;
}

.inscription-note {
  margin-top: 1rem;
  color: var(--ink-soft);
}

.inscription-link {
  color: var(--turquoise);
  font-weight: 500;
}

.inscription-link:hover {
  text-decoration: underline;
}
</style>
