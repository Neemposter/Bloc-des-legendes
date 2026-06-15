<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useHead({ title: 'Paramètres — Admin Bloc des Légendes' })

// Valeur courante du lien d'inscription (endpoint public, non sensible)
const { data: registration, refresh } = await useFetch<{ url: string | null }>('/api/registration-link')

const link = ref(registration.value?.url ?? '')
const saving = ref(false)
const status = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref('')

function isValidUrl(value: string) {
  return /^https?:\/\/.+/i.test(value.trim())
}

async function save() {
  status.value = 'idle'
  if (!isValidUrl(link.value)) {
    status.value = 'error'
    errorMessage.value = 'Entrez une URL valide commençant par http:// ou https://'
    return
  }
  saving.value = true
  try {
    await $fetch('/api/admin/settings/registration_link', {
      method: 'PUT',
      body: { value: link.value.trim() },
    })
    await refresh()
    status.value = 'success'
  }
  catch (e: unknown) {
    status.value = 'error'
    errorMessage.value = (e as { data?: { message?: string } })?.data?.message ?? 'Erreur lors de l\'enregistrement.'
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Paramètres</h1>
        <p class="page-sub">Configuration du site public</p>
      </div>
    </div>

    <section class="card">
      <h2 class="card-title">Lien d'inscription</h2>
      <p class="card-desc">
        URL du formulaire d'inscription externe (HelloAsso ou équivalent).
        Ce lien apparaît sur la page Contact du site, dans le bloc « Rejoindre le club ».
      </p>

      <form class="setting-form" @submit.prevent="save">
        <div class="field">
          <label class="field-label" for="registration-link">Adresse du lien</label>
          <input
            id="registration-link"
            v-model="link"
            class="field-input"
            type="text"
            inputmode="url"
            placeholder="https://www.helloasso.com/associations/..."
          />
        </div>

        <div class="setting-actions">
          <a
            v-if="registration?.url"
            :href="registration.url"
            target="_blank"
            rel="noopener"
            class="setting-preview"
          >
            Tester le lien actuel ↗
          </a>
          <button type="submit" class="btn-primary" :disabled="saving">
            {{ saving ? 'Enregistrement…' : 'Enregistrer' }}
          </button>
        </div>

        <p v-if="status === 'success'" class="feedback feedback--success" role="status">
          Lien enregistré — il est à jour sur la page Contact.
        </p>
        <p v-if="status === 'error'" class="feedback feedback--error" role="alert">
          {{ errorMessage }}
        </p>
      </form>
    </section>
  </div>
</template>

<style scoped>
.page-header { margin-bottom: 1.8rem; }
.page-title { font-size: 2rem; margin: 0 0 0.2rem; }
.page-sub   { color: var(--ink-soft); margin: 0; font-size: 0.9rem; }

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 1.6rem 1.8rem;
  max-width: 640px;
}

.card-title { font-size: 1.2rem; margin: 0 0 0.4rem; }

.card-desc {
  color: var(--ink-soft);
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0 0 1.4rem;
}

.setting-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field-label { font-weight: 500; font-size: 0.95rem; }

.field-input {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--ink);
  background: var(--fond);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
  outline: none;
  border-color: var(--turquoise);
  box-shadow: 0 0 0 3px rgba(3, 166, 105, 0.15);
}

.setting-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.setting-preview {
  color: var(--turquoise);
  font-size: 0.9rem;
  font-weight: 500;
}

.setting-preview:hover { text-decoration: underline; }

.btn-primary {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.88rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--turquoise);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.7rem 1.3rem;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
  margin-left: auto;
}

.btn-primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--turquoise) 88%, black);
  transform: translateY(-1px);
}

.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.feedback { margin: 0; font-weight: 500; font-size: 0.92rem; }
.feedback--success { color: var(--turquoise); }
.feedback--error { color: #c0392b; }
</style>
