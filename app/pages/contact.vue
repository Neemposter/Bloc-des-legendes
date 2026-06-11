<script setup lang="ts">
useHead({ title: 'Contact — Bloc des Légendes' })

const form = reactive({ name: '', email: '', subject: '', message: '' })
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const errorMessage = ref('')

async function onSubmit() {
  status.value = 'sending'
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }
  catch (err: unknown) {
    status.value = 'error'
    const fetchError = err as { data?: { message?: string } }
    errorMessage.value = fetchError.data?.message ?? 'Une erreur est survenue, réessayez plus tard.'
  }
}
</script>

<template>
  <div class="container">
    <UiSectionTitle
      kicker="Nous écrire"
      title="Contact"
      lede="Une question sur les créneaux, une séance d'essai, un partenariat ? On vous répond rapidement."
    />

    <div class="contact-grid">
      <form class="contact-form" @submit.prevent="onSubmit">
        <UiInput v-model="form.name" label="Nom" name="name" required />
        <UiInput v-model="form.email" label="Email" name="email" type="email" required />
        <UiInput v-model="form.subject" label="Sujet" name="subject" />
        <UiTextarea v-model="form.message" label="Message" name="message" required />
        <UiButton type="submit" :class="{ 'is-sending': status === 'sending' }">
          {{ status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message' }}
        </UiButton>
        <p v-if="status === 'success'" class="form-feedback form-feedback--success" role="status">
          Message envoyé — on vous répond au plus vite !
        </p>
        <p v-if="status === 'error'" class="form-feedback form-feedback--error" role="alert">
          {{ errorMessage }}
        </p>
      </form>

      <aside class="contact-infos">
        <h3>Le club</h3>
        <p>
          Bloc des Légendes<br>
          Salle des sports Bodénès<br>
          Rue de l'Hippodrome<br>
          29260 Lesneven
        </p>
        <p>
          <a href="mailto:blocdeslegendes@gmail.com" class="contact-link">blocdeslegendes@gmail.com</a>
        </p>
        <p>
          <a href="https://www.instagram.com/blocdeslegendes/" target="_blank" rel="noopener" class="contact-link">Instagram @blocdeslegendes</a>
        </p>
        <p class="contact-extra">
          Club affilié FFME n° 029020 · Ouvert dès 6 ans · Prêt de matériel ·
          Accueil des personnes en situation de handicap
        </p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: 2.5rem;
  align-items: start;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  align-items: flex-start;
}

.contact-form > .ui-field,
.contact-form > div {
  width: 100%;
}

.form-feedback {
  margin: 0;
  font-weight: 500;
}

.form-feedback--success {
  color: var(--turquoise);
}

.form-feedback--error {
  color: var(--ambre);
}

.is-sending {
  opacity: 0.7;
  pointer-events: none;
}

.contact-infos {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 1.4rem 1.5rem;
}

.contact-infos h3 {
  margin-bottom: 0.5rem;
}

.contact-infos p {
  color: var(--ink-soft);
  margin: 0 0 0.8rem;
  line-height: 1.6;
}

.contact-link {
  color: var(--turquoise);
  font-weight: 500;
}

.contact-link:hover {
  text-decoration: underline;
}

.contact-extra {
  font-size: 0.88rem;
  padding-top: 0.6rem;
  border-top: 1px solid var(--line);
}

@media (max-width: 760px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
