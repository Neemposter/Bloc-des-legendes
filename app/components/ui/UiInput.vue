<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
}>(), {
  type: 'text',
})

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="ui-field">
    <label :for="name" class="ui-field-label">
      {{ label }}<span v-if="required" class="ui-field-required" aria-hidden="true"> *</span>
    </label>
    <input
      :id="name"
      v-model="model"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      class="ui-field-input"
    >
  </div>
</template>

<style scoped>
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.ui-field-label {
  font-weight: 500;
  font-size: 0.95rem;
}

.ui-field-required {
  color: var(--ambre);
}

.ui-field-input {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--ink);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ui-field-input:focus {
  outline: none;
  border-color: var(--turquoise);
  box-shadow: 0 0 0 3px rgba(3, 166, 105, 0.15);
}
</style>
