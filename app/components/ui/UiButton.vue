<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse'
  to?: string
  href?: string
  type?: 'button' | 'submit'
}>(), {
  variant: 'primary',
  type: 'button',
})
</script>

<template>
  <NuxtLink v-if="to" :to="to" class="ui-btn" :class="`ui-btn--${variant}`">
    <slot />
  </NuxtLink>
  <a v-else-if="href" :href="href" target="_blank" rel="noopener" class="ui-btn" :class="`ui-btn--${variant}`">
    <slot />
  </a>
  <button v-else :type="type" class="ui-btn" :class="`ui-btn--${variant}`">
    <slot />
  </button>
</template>

<style scoped>
.ui-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.92rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  line-height: 1;
  padding: 0.9rem 1.7rem;
  border-radius: 999px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

/* Puce "prise d'escalade", signature des boutons — pivote au survol */
.ui-btn::before {
  content: '';
  width: 10px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 55% 45% 60% 40% / 50% 60% 40% 50%;
  transition: transform 0.25s ease;
}

.ui-btn:hover::before {
  transform: rotate(45deg) scale(1.2);
}

.ui-btn--primary {
  background: var(--turquoise);
  color: #fff;
}

.ui-btn--primary::before {
  background: var(--moutarde);
}

.ui-btn--primary:hover {
  background: color-mix(in srgb, var(--turquoise) 88%, black);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--turquoise) 35%, transparent);
}

.ui-btn--secondary {
  background: transparent;
  border-color: var(--turquoise);
  color: var(--turquoise);
}

.ui-btn--secondary::before {
  background: var(--turquoise);
}

.ui-btn--secondary:hover {
  background: rgba(3, 166, 105, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--turquoise) 18%, transparent);
}

.ui-btn--ghost {
  background: transparent;
  color: var(--ink);
  padding-inline: 0.8rem;
}

.ui-btn--ghost::before {
  background: var(--moutarde);
}

.ui-btn--ghost:hover {
  color: var(--turquoise);
}

/* Sur fond coloré (CTA turquoise, sections sombres) */
.ui-btn--inverse {
  background: var(--surface);
  color: var(--turquoise);
}

.ui-btn--inverse::before {
  background: var(--ambre);
}

.ui-btn--inverse:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
</style>
