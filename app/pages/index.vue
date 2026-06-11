<script setup lang="ts">
import type { Article } from '~~/shared/types'

useHead({ title: 'Bloc des Légendes — Club d\'escalade' })

const { data } = await useFetch<Article[]>('/api/articles')
const lastThree = computed(() => (data.value ?? []).slice(0, 3))

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}
</script>

<template>
  <!-- ─── Hero ─────────────────────────────────────────── -->
  <section class="hero">
    <div class="container hero-inner">
      <p class="hero-kicker">Club associatif d'escalade</p>
      <h1 class="hero-title">Bloc des<br>Légendes</h1>
      <p class="hero-sub">
        Grimpe en bloc pour tous les niveaux — enfants, ados, adultes —<br class="hero-br">
        dans une ambiance associative et bienveillante.
      </p>
      <div class="hero-actions">
        <UiButton to="/inscription">S'inscrire au club</UiButton>
        <UiButton to="/calendrier" variant="secondary">Voir les créneaux</UiButton>
      </div>
    </div>

    <div class="hero-deco" aria-hidden="true">
      <span class="deco-hold dh1" />
      <span class="deco-hold dh2" />
      <span class="deco-hold dh3" />
      <span class="deco-hold dh4" />
      <span class="deco-hold dh5" />
    </div>
  </section>

  <!-- ─── Présentation ──────────────────────────────────── -->
  <section class="features">
    <div class="container">
      <div class="features-grid">
        <div class="feature">
          <span class="feature-icon" aria-hidden="true">🧗</span>
          <h3>Tous niveaux</h3>
          <p>Des cours enfants dès 6 ans aux séances adultes loisir, en passant par l'équipe compétition.</p>
        </div>
        <div class="feature">
          <span class="feature-icon" aria-hidden="true">📅</span>
          <h3>Planning varié</h3>
          <p>Du lundi au dimanche, des créneaux encadrés et des accès libres pour grimper à votre rythme.</p>
        </div>
        <div class="feature">
          <span class="feature-icon" aria-hidden="true">🤝</span>
          <h3>Esprit asso</h3>
          <p>Une structure associative, des bénévoles passionnés et une communauté qui partage sa passion.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ─── 3 derniers articles ───────────────────────────── -->
  <section v-if="lastThree.length" class="news">
    <div class="container">
      <div class="news-header">
        <UiSectionTitle kicker="La vie du club" title="Actualités" />
        <UiButton to="/actualites" variant="ghost">Toutes les actus →</UiButton>
      </div>
      <div class="news-grid">
        <UiCard
          v-for="article in lastThree"
          :key="article.id"
          :title="article.title"
          :summary="article.summary"
          :imageUrl="article.imageUrl"
          :meta="formatDate(article.publishedAt)"
          :to="`/actualites/${article.id}`"
        />
      </div>
    </div>
  </section>

  <!-- ─── CTA rejoindre ─────────────────────────────────── -->
  <section class="join">
    <div class="container join-inner">
      <div class="join-text">
        <h2>Envie de grimper&nbsp;?</h2>
        <p>L'adhésion inclut la licence FFME, l'assurance et l'accès aux créneaux de votre groupe. Une séance d'essai est possible avant de s'engager.</p>
      </div>
      <div class="join-actions">
        <UiButton to="/inscription">Voir les tarifs</UiButton>
        <UiButton to="/contact" variant="secondary">Nous contacter</UiButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  background: var(--ink);
  color: var(--fond);
  overflow: hidden;
  padding: 5rem 0 4.5rem;
}

.hero-inner {
  position: relative;
  z-index: 1;
}

.hero-kicker {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.82rem;
  color: var(--turquoise);
  margin: 0 0 0.8rem;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 9vw, 6.5rem);
  text-transform: uppercase;
  line-height: 0.95;
  color: var(--fond);
  margin: 0 0 1.4rem;
}

.hero-sub {
  color: rgba(242, 242, 242, 0.72);
  font-size: 1.1rem;
  max-width: 480px;
  margin: 0 0 2rem;
  line-height: 1.55;
}

.hero-br { display: none; }
@media (min-width: 640px) { .hero-br { display: inline; } }

.hero-actions {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
}

.hero-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.deco-hold {
  position: absolute;
  border-radius: 55% 45% 60% 40% / 50% 60% 40% 50%;
  opacity: 0.12;
}

.dh1 { width: 220px; height: 200px; background: var(--turquoise); right: 8%;  top: -40px;  transform: rotate(-18deg); }
.dh2 { width: 140px; height: 130px; background: var(--moutarde); right: 22%; bottom: 10px; transform: rotate(30deg); }
.dh3 { width: 90px;  height: 82px;  background: var(--ambre);   right: 5%;  bottom: 60px; transform: rotate(-8deg); }
.dh4 { width: 60px;  height: 55px;  background: var(--moutarde); right: 35%; top: 20px;   transform: rotate(50deg); opacity: 0.09; }
.dh5 { width: 180px; height: 160px; background: var(--olive);   right: -30px; top: 30%;   transform: rotate(12deg); }

.features {
  padding: 3.5rem 0 2.5rem;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
}

.feature { display: flex; flex-direction: column; gap: 0.5rem; }
.feature-icon { font-size: 1.8rem; line-height: 1; }
.feature h3 { font-size: 1.1rem; margin: 0; }
.feature p { color: var(--ink-soft); font-size: 0.97rem; margin: 0; }

.news { padding: 3rem 0; }

.news-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.4rem;
}

.join {
  margin-top: 1rem;
  background: var(--turquoise);
  padding: 3.5rem 0;
}

.join-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.join-text h2 {
  color: #fff;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  text-transform: uppercase;
  margin: 0 0 0.6rem;
}

.join-text p {
  color: rgba(255, 255, 255, 0.82);
  max-width: 500px;
  margin: 0;
}

.join-actions {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.join-actions :deep(.ui-btn--primary) {
  background: #fff;
  color: var(--turquoise);
}
.join-actions :deep(.ui-btn--primary:hover) {
  background: var(--fond);
}
.join-actions :deep(.ui-btn--secondary) {
  border-color: rgba(255,255,255,0.7);
  color: #fff;
}
.join-actions :deep(.ui-btn--secondary:hover) {
  background: rgba(255,255,255,0.12);
}
</style>
