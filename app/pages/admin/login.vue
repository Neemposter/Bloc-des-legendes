<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Connexion — Admin Bloc des Légendes' })

const { user, login } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

if (user.value) {
  await navigateTo('/admin')
}

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    await navigateTo('/admin')
  }
  catch (e: unknown) {
    const msg = (e as { data?: { message?: string } })?.data?.message
    error.value = msg ?? 'Identifiants incorrects.'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <span class="login-holds" aria-hidden="true">
          <i class="hold hold-turquoise" /><i class="hold hold-moutarde" /><i class="hold hold-ambre" />
        </span>
        <span class="login-brand-name">Bloc des Légendes</span>
      </div>
      <h1 class="login-title">Connexion</h1>
      <p class="login-subtitle">Espace réservé aux bénévoles.</p>

      <form class="login-form" @submit.prevent="submit" novalidate>
        <div class="field">
          <label for="email" class="field-label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            required
            class="field-input"
            placeholder="admin@blocdeslegendes.fr"
          >
        </div>

        <div class="field">
          <label for="password" class="field-label">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            name="password"
            autocomplete="current-password"
            required
            class="field-input"
          >
        </div>

        <p v-if="error" class="login-error" role="alert">{{ error }}</p>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading">Connexion…</span>
          <span v-else>Se connecter</span>
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: var(--fond);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.login-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 2.5rem;
  width: min(420px, 100%);
  box-shadow: 0 8px 32px rgba(22, 36, 29, 0.08);
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.8rem;
}

.login-holds {
  display: inline-flex;
  gap: 0.22rem;
}

.hold {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 55% 45% 60% 40% / 50% 60% 40% 50%;
  display: inline-block;
}
.hold-turquoise { background: var(--turquoise); }
.hold-moutarde  { background: var(--moutarde); }
.hold-ambre     { background: var(--ambre); }

.login-brand-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.login-title {
  font-size: 1.6rem;
  margin: 0 0 0.25rem;
}

.login-subtitle {
  color: var(--ink-soft);
  margin: 0 0 2rem;
  font-size: 0.95rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field-label {
  font-weight: 500;
  font-size: 0.95rem;
}

.field-input {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--ink);
  background: var(--fond);
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
  outline: none;
  border-color: var(--turquoise);
  box-shadow: 0 0 0 3px rgba(3, 166, 105, 0.15);
}

.login-error {
  color: #c0392b;
  font-size: 0.9rem;
  background: rgba(192, 57, 43, 0.08);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  margin: 0;
}

.login-btn {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--turquoise);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.9rem 1.5rem;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  margin-top: 0.4rem;
}

.login-btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--turquoise) 88%, black);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--turquoise) 35%, transparent);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
