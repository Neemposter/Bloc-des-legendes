<script setup lang="ts">
// En-tête de page avec le mur d'escalade en décor (repris du hero
// de l'accueil). Utilisé sur les pages internes : calendrier, actualités...
defineProps<{
  kicker?: string
  title: string
  lede?: string
}>()
</script>

<template>
  <section class="ui-page-hero">
    <div class="ui-page-hero-wall" aria-hidden="true">
      <UiWall />
    </div>
    <div class="container ui-page-hero-content">
      <p v-if="kicker" class="kicker">{{ kicker }}</p>
      <h1>{{ title }}</h1>
      <p v-if="lede" class="lede">{{ lede }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.ui-page-hero {
  position: relative;
  overflow: hidden;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.ui-page-hero-wall {
  position: absolute;
  top: 0;
  right: 0;
  width: 34%;
  height: 100%;
  clip-path: polygon(16% 0, 100% 0, 100% 100%, 0% 100%);
}

.ui-page-hero-wall svg {
  width: 100%;
  height: 100%;
  display: block;
}

.ui-page-hero-content {
  position: relative;
  z-index: 2;
  padding-block: 3.2rem 2.4rem;
  max-width: none;
}

.ui-page-hero-content > .kicker,
.ui-page-hero-content > h1,
.ui-page-hero-content > .lede {
  max-width: 56%;
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
  font-size: clamp(2rem, 5vw, 3rem);
  text-transform: uppercase;
}

.lede {
  color: var(--ink-soft);
  margin-top: 0.9rem;
}

@media (max-width: 960px) {
  .ui-page-hero-wall {
    display: none;
  }

  .ui-page-hero-content > .kicker,
  .ui-page-hero-content > h1,
  .ui-page-hero-content > .lede {
    max-width: 620px;
  }
}
</style>
