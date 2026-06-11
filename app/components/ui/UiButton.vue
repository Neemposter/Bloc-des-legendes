<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
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
  gap: 0.5rem;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 1rem;
  line-height: 1;
  padding: 0.7rem 1.3rem;
  border-radius: 10px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.ui-btn--primary {
  background: var(--turquoise);
  color: #fff;
}

.ui-btn--primary:hover {
  background: #028a58;
}

.ui-btn--secondary {
  background: transparent;
  border-color: var(--turquoise);
  color: var(--turquoise);
}

.ui-btn--secondary:hover {
  background: rgba(3, 166, 105, 0.08);
}

.ui-btn--ghost {
  background: transparent;
  color: var(--ink);
  padding-inline: 0.6rem;
}

.ui-btn--ghost:hover {
  color: var(--turquoise);
}
</style>
