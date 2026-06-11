<script setup lang="ts">
defineProps<{
  kicker?: string
  title: string
  lede?: string
}>()
</script>

<template>
  <section class="ui-section-title">
    <p v-if="kicker" class="kicker">{{ kicker }}</p>
    <h1>{{ title }}</h1>
    <p v-if="lede" class="lede">{{ lede }}</p>
  </section>
</template>

<style scoped>
.ui-section-title {
  padding: 3.2rem 0 1.6rem;
  max-width: 620px;
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
</style>
