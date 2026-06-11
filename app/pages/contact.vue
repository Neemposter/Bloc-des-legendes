<script setup lang="ts">
// TODO(contact) :
// 1. Créer POST /api/contact → insert dans contact_messages (valider les champs)
// 2. Brancher onSubmit ci-dessous sur cette API ($fetch) + état succès/erreur
// 3. Ajouter les vraies coordonnées du club (adresse de la salle, email)
useHead({ title: 'Contact — Bloc des Légendes' })

const form = reactive({ name: '', email: '', subject: '', message: '' })

function onSubmit() {
  // TODO: $fetch('/api/contact', { method: 'POST', body: form })
  console.warn('Formulaire de contact pas encore branché', form)
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
        <UiButton type="submit">Envoyer le message</UiButton>
      </form>

      <aside class="contact-infos">
        <h3>Le club</h3>
        <p>
          Bloc des Légendes<br>
          Salle d'escalade — adresse à compléter<br>
          contact@blocdeslegendes.fr
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
  margin: 0;
}

@media (max-width: 760px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
