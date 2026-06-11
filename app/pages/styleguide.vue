<script setup lang="ts">
// Page de référence interne (non liée dans la nav) : palette, typos et
// composants UI dans tous leurs états. À consulter avant de créer une page.
useHead({ title: 'Styleguide — Bloc des Légendes' })

const COLORS = [
  { name: 'Turquoise (principal)', varName: '--turquoise', hex: '#03A669' },
  { name: 'Vert moutarde clair', varName: '--moutarde', hex: '#B1BF41' },
  { name: 'Vert olive', varName: '--olive', hex: '#9AA63F' },
  { name: 'Orange / ambre', varName: '--ambre', hex: '#D99923' },
  { name: 'Fond clair', varName: '--fond', hex: '#F2F2F2' },
  { name: 'Encre (texte)', varName: '--ink', hex: '#16241D' },
  { name: 'Encre douce', varName: '--ink-soft', hex: '#4A5B52' },
]

const demoInput = ref('')
const demoTextarea = ref('')
</script>

<template>
  <div class="container">
    <UiSectionTitle
      kicker="Référence interne"
      title="Styleguide"
      lede="Palette, typographies et composants partagés. Toujours utiliser les variables CSS et les composants Ui* — jamais de couleur en dur."
    />

    <section class="sg-section">
      <h2>Palette</h2>
      <div class="sg-swatches">
        <div v-for="color in COLORS" :key="color.varName" class="sg-swatch">
          <span class="sg-swatch-color" :style="{ background: `var(${color.varName})` }" />
          <p class="sg-swatch-name">{{ color.name }}</p>
          <p class="sg-swatch-code">{{ color.varName }} · {{ color.hex }}</p>
        </div>
      </div>
    </section>

    <section class="sg-section">
      <h2>Typographies</h2>
      <p class="sg-type-display">Moon get — titres (var(--font-display))</p>
      <p class="sg-type-body">Coolvetica — corps de texte et menus (var(--font-body)). Tant que les fichiers de polices ne sont pas dans public/fonts/, les fallbacks Quicksand et Jost s'affichent.</p>
    </section>

    <section class="sg-section">
      <h2>Boutons — UiButton</h2>
      <div class="sg-row">
        <UiButton>Primaire (défaut)</UiButton>
        <UiButton variant="secondary">Secondaire</UiButton>
        <UiButton variant="ghost">Ghost</UiButton>
        <UiButton to="/calendrier" variant="secondary">Lien interne (to)</UiButton>
        <UiButton href="https://example.com">Lien externe (href)</UiButton>
      </div>
    </section>

    <section class="sg-section">
      <h2>Titres de section — UiSectionTitle</h2>
      <UiSectionTitle
        kicker="Le kicker turquoise"
        title="Le titre de page"
        lede="Le texte d'introduction en encre douce, deux phrases maximum."
      />
    </section>

    <section class="sg-section">
      <h2>Cartes — UiCard</h2>
      <div class="sg-cards">
        <UiCard
          title="Carte avec lien"
          summary="Résumé court de l'article affiché sur deux ou trois lignes maximum."
          meta="11 juin 2026"
          to="/actualites"
        />
        <UiCard
          title="Carte sans image ni lien"
          summary="Le placeholder en forme de prise s'affiche quand imageUrl est vide."
        />
      </div>
    </section>

    <section class="sg-section">
      <h2>Formulaires — UiInput / UiTextarea</h2>
      <div class="sg-form">
        <UiInput v-model="demoInput" label="Champ texte" name="sg-input" placeholder="Placeholder" required />
        <UiTextarea v-model="demoTextarea" label="Zone de texte" name="sg-textarea" :rows="3" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.sg-section {
  margin-bottom: 3rem;
}

.sg-section > h2 {
  font-size: 1.3rem;
  text-transform: uppercase;
  margin-bottom: 1.1rem;
  padding-bottom: 0.4rem;
  border-bottom: 2px solid var(--moutarde);
  display: inline-block;
}

.sg-swatches {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
}

.sg-swatch-color {
  display: block;
  height: 64px;
  border-radius: 10px;
  border: 1px solid var(--line);
}

.sg-swatch-name {
  font-weight: 500;
  font-size: 0.9rem;
  margin: 0.45rem 0 0;
}

.sg-swatch-code {
  font-size: 0.8rem;
  color: var(--ink-soft);
  margin: 0.1rem 0 0;
}

.sg-type-display {
  font-family: var(--font-display);
  font-size: 1.8rem;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.sg-type-body {
  max-width: 560px;
  color: var(--ink-soft);
}

.sg-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  align-items: center;
}

.sg-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.4rem;
}

.sg-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  max-width: 480px;
}
</style>
