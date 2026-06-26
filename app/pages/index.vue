<script setup lang="ts">
import type { Article, ClubEvent, TimeSlot, Weekday } from '~~/shared/types'

useHead({ title: 'Bloc des Légendes — Club d\'escalade' })

const { data: articlesData } = await useFetch<Article[]>('/api/articles')
const { data: slotsData } = await useFetch<TimeSlot[]>('/api/time-slots')
// /api/events ne renvoie que les événements à venir, triés par date
const { data: eventsData } = await useFetch<ClubEvent[]>('/api/events')
const { data: registration } = await useFetch<{ url: string | null }>('/api/registration-link')

const nextEvents = computed(() => (eventsData.value ?? []).slice(0, 3))

function eventDay(date: string) {
  return Number(date.split('-')[2])
}
function eventMonth(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('fr-FR', { month: 'short' })
}
function eventFullDate(date: string) {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y!, m! - 1, d!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}
// Date ou plage (« 26–28 octobre ») pour un événement multi-jours
function eventDateLabel(ev: ClubEvent) {
  if (!ev.endDate || ev.endDate === ev.date) return eventFullDate(ev.date)
  const [sy, sm, sd] = ev.date.split('-').map(Number)
  const [ey, em, ed] = ev.endDate.split('-').map(Number)
  if (sy === ey && sm === em) {
    return `${sd}–${ed} ${new Date(ey!, em! - 1, ed!).toLocaleDateString('fr-FR', { month: 'long' })}`
  }
  return `${eventFullDate(ev.date)} – ${eventFullDate(ev.endDate)}`
}

const articles = computed(() => (articlesData.value ?? []).slice(0, 3))
const featured = computed(() => articles.value[0] ?? null)
const secondary = computed(() => articles.value.slice(1))

const WEEKDAYS: { key: Weekday; label: string }[] = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
  { key: 'saturday', label: 'Samedi' },
  { key: 'sunday', label: 'Dimanche' },
]

const slotCount = computed(() => slotsData.value?.length ?? 0)

const slotsByDay = computed(() => {
  const map = {} as Record<Weekday, TimeSlot[]>
  for (const day of WEEKDAYS) {
    map[day.key] = (slotsData.value ?? [])
      .filter(s => s.day === day.key)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }
  return map
})

// formatDateFr + slotCategory : utils partagés (app/utils/)
function slotClass(slot: TimeSlot): string {
  return `creneau--${slotCategory(slot.groupName)}`
}
</script>

<template>
  <!-- ─── HERO ─────────────────────────────────────────────── -->
  <section class="hero">
    <!-- Mur d'escalade schématisé : panneau incliné + prises + sol -->
    <div class="hero-wall" aria-hidden="true">
      <UiWall />
    </div>

    <div class="container hero-content">
      <p class="hero-kicker">Club d'escalade · Lesneven · Bretagne</p>
      <h1 class="hero-title">
        GRIMPE,
        <span class="hero-title-accent">PROGRESSE,</span>
        DEVIENS<br>UNE LÉGENDE.
      </h1>
      <p class="hero-desc">
        Débutants ou confirmés, rejoignez la communauté du Bloc des Légendes.
        Coaching, blocs techniques, ambiance unique.
      </p>
      <div class="hero-actions">
        <UiButton to="/calendrier">Voir le calendrier</UiButton>
        <UiButton to="/contact" variant="secondary">Nous contacter</UiButton>
      </div>
      <div class="hero-stats">
        <div class="stat stat--turquoise">
          <span class="stat-num">2013</span>
          <span class="stat-label">Création du club</span>
        </div>
        <div class="stat stat--ambre">
          <span class="stat-num">{{ slotCount }}</span>
          <span class="stat-label">Créneaux / semaine</span>
        </div>
        <div class="stat stat--moutarde">
          <span class="stat-num">6+</span>
          <span class="stat-label">Ouvert dès 6 ans</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ─── VALEURS ───────────────────────────────────────────── -->
  <section class="valeurs">
    <div class="container valeurs-intro">
      <p class="section-kicker">Notre ADN</p>
      <h2>Plus qu'un club,<br>une communauté</h2>
      <p class="section-sub">Le Bloc des Légendes, c'est un espace où chacun progresse à son rythme, quel que soit son niveau.</p>
    </div>
    <div class="valeurs-grid">
      <div class="valeur valeur--turquoise">
        <span class="valeur-num" aria-hidden="true">01</span>
        <h3>Progression</h3>
        <p>Des encadrants diplômés adaptent chaque séance à ton niveau sur des blocs régulièrement renouvelés.</p>
      </div>
      <div class="valeur valeur--ambre">
        <span class="valeur-num" aria-hidden="true">02</span>
        <h3>Communauté</h3>
        <p>Une ambiance bienveillante et soudée. On se challenge, on se conseille et on fête chaque victoire ensemble.</p>
      </div>
      <div class="valeur valeur--moutarde">
        <span class="valeur-num" aria-hidden="true">03</span>
        <h3>Accessibilité</h3>
        <p>Ouvert à tous dès 6 ans, prêt de matériel, accueil des personnes en situation de handicap. L'escalade de bloc est pour tout le monde.</p>
      </div>
    </div>
  </section>

  <!-- ─── ACTUALITÉS ────────────────────────────────────────── -->
  <section v-if="articles.length" class="news">
    <div class="container">
      <div class="news-header">
        <div>
          <p class="section-kicker">La vie du club</p>
          <h2>Dernières actualités</h2>
          <p class="section-sub">Compétitions, nouveaux blocs, événements… tout ce qui se passe au club.</p>
        </div>
        <UiButton to="/actualites" variant="ghost">Toutes les actus →</UiButton>
      </div>

      <div class="news-layout">
        <UiArticleBanner v-if="featured" :article="featured" />
        <div v-if="secondary.length" class="news-cards">
          <UiCard
            v-for="article in secondary"
            :key="article.id"
            :title="article.title"
            :summary="article.summary"
            :image-url="article.imageUrl"
            :meta="formatDateFr(article.publishedAt)"
            :to="`/actualites/${article.id}`"
          />
        </div>
      </div>
    </div>
  </section>

  <!-- ─── CALENDRIER TEASER ─────────────────────────────────── -->
  <section class="cal-teaser">
    <div class="container">
      <p class="section-kicker">Planning</p>
      <h2>Les créneaux de la semaine</h2>
      <p class="section-sub">Un planning adapté à chaque niveau, toute la semaine.</p>

      <div class="cal-grid">
        <div v-for="day in WEEKDAYS" :key="day.key" class="cal-day">
          <div class="cal-day-head">{{ day.label }}</div>
          <div class="cal-day-body">
            <p v-if="!slotsByDay[day.key].length" class="cal-empty">—</p>
            <div
              v-for="slot in slotsByDay[day.key]"
              :key="slot.id"
              class="creneau"
              :class="slotClass(slot)"
            >
              <p class="creneau-heure">{{ slot.startTime }} – {{ slot.endTime }}</p>
              <p class="creneau-groupe">{{ slot.groupName }}</p>
              <p v-if="slot.instructor" class="creneau-enc">{{ slot.instructor }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="nextEvents.length" class="events-teaser">
        <h3 class="events-title">Événements à venir</h3>
        <div class="events-list">
          <NuxtLink v-for="ev in nextEvents" :key="ev.id" to="/calendrier#evenements" class="event-item">
            <div class="event-chip">
              <span class="event-chip-day">{{ eventDay(ev.date) }}</span>
              <span class="event-chip-month">{{ eventMonth(ev.date) }}</span>
            </div>
            <div class="event-info">
              <p class="event-name">{{ ev.title }}</p>
              <p class="event-meta">{{ eventDateLabel(ev) }}<template v-if="ev.location"> · {{ ev.location }}</template></p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div class="cal-cta">
        <UiButton to="/calendrier">Voir le calendrier complet</UiButton>
      </div>
    </div>
  </section>

  <!-- ─── CTA INSCRIPTION ───────────────────────────────────── -->
  <section v-if="registration?.url" class="cta-join">
    <div class="container cta-join-inner">
      <div>
        <p class="section-kicker section-kicker--light">Rejoindre le club</p>
        <h2>Prêt à grimper avec nous ?</h2>
        <p class="cta-join-text">Débutant ou confirmé, l'adhésion se fait en ligne en quelques minutes via notre partenaire.</p>
      </div>
      <UiButton :href="registration.url" variant="inverse">S'inscrire en ligne</UiButton>
    </div>
  </section>

</template>

<style scoped>
/* ─── Utilitaires partagés ─── */
.section-kicker {
  font-family: var(--font-display);
  font-size: 0.85rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--turquoise);
  margin: 0 0 0.7rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.section-kicker::before {
  content: '';
  display: block;
  width: 18px;
  height: 2px;
  background: var(--turquoise);
  flex-shrink: 0;
}
.section-sub {
  font-size: 1rem;
  color: var(--ink-soft);
  max-width: 480px;
  line-height: 1.7;
  margin: 0.5rem 0 0;
}

/* ─── HERO ─── */
.hero {
  background: var(--surface);
  /* Le bas du hero tombe exactement au bord de l'écran (header sticky déduit) */
  min-height: calc(100vh - var(--header-height));
  min-height: calc(100svh - var(--header-height));
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.hero-wall {
  position: absolute;
  top: 0;
  right: 0;
  width: 42%;
  height: 100%;
  clip-path: polygon(18% 0, 100% 0, 100% 100%, 0% 100%);
  z-index: 1;
}

.hero-wall svg {
  width: 100%;
  height: 100%;
  display: block;
}

.hero-content {
  position: relative;
  z-index: 4;
  padding-block: 1.25rem;
}

.hero-kicker {
  font-family: var(--font-display);
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--surface);
  background: var(--moutarde);
  display: inline-block;
  padding: 0.3rem 0.85rem;
  border-radius: 6px;
  margin: 0 0 1.2rem;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 7vw, 6rem);
  line-height: 0.92;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--ink);
  max-width: 580px;
  margin: 0 0 1.2rem;
}

.hero-title-accent {
  color: var(--turquoise);
  display: block;
}

.hero-desc {
  font-size: 1.06rem;
  color: var(--ink-soft);
  max-width: 400px;
  line-height: 1.7;
  margin: 0 0 1.6rem;
}

.hero-actions {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  margin-bottom: 2.2rem;
}

.hero-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat {
  background: var(--fond);
  border-left: 4px solid;
  padding: 0.85rem 1.2rem;
  border-radius: 0 6px 6px 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.stat--turquoise { border-left-color: var(--turquoise); }
.stat--ambre     { border-left-color: var(--ambre); }
.stat--moutarde  { border-left-color: var(--moutarde); }

.stat-num {
  font-family: var(--font-display);
  font-size: 2.1rem;
  line-height: 1;
}

.stat--turquoise .stat-num { color: var(--turquoise); }
.stat--ambre .stat-num     { color: var(--ambre); }
.stat--moutarde .stat-num  { color: var(--moutarde); }

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-soft);
}

/* ─── VALEURS ─── */
.valeurs {
  background: var(--ink);
}

.valeurs-intro {
  padding: 4.5rem 0 2.8rem;
}

.valeurs-intro h2 {
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  letter-spacing: 0.02em;
  line-height: 0.95;
  color: var(--surface);
  margin: 0 0 0.8rem;
}

.valeurs-intro .section-kicker {
  color: var(--moutarde);
}

.valeurs-intro .section-kicker::before {
  background: var(--moutarde);
}

.valeurs-intro .section-sub {
  color: rgba(242, 242, 242, 0.5);
}

.valeurs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
}

.valeur {
  padding: 2.2rem 1.9rem;
  position: relative;
  overflow: hidden;
}

.valeur::after {
  content: '';
  position: absolute;
  bottom: -30px;
  right: -30px;
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.08);
  transform: rotate(45deg);
}

.valeur--turquoise { background: var(--turquoise); }
.valeur--ambre     { background: var(--ambre); }
.valeur--moutarde  { background: var(--moutarde); }

.valeur-num {
  font-family: var(--font-display);
  font-size: 3.5rem;
  color: rgba(255, 255, 255, 0.2);
  line-height: 1;
  display: block;
  margin-bottom: 1rem;
}

.valeur h3 {
  font-family: var(--font-display);
  font-size: 1.7rem;
  letter-spacing: 0.04em;
  color: #fff;
  margin: 0 0 0.6rem;
}

.valeur p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin: 0;
}

/* ─── ACTUALITÉS ─── */
.news {
  background: var(--fond);
  padding: 5rem 0;
}

.news-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.news-header h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.5vw, 3rem);
  letter-spacing: 0.02em;
  line-height: 0.95;
  color: var(--ink);
  margin: 0 0 0.5rem;
}

.news-layout {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.news-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.25rem;
}

/* ─── CALENDRIER TEASER ─── */
.cal-teaser {
  background: var(--surface);
  padding: 5rem 0;
}

.cal-teaser h2 {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3.5vw, 3rem);
  letter-spacing: 0.02em;
  line-height: 0.95;
  color: var(--ink);
  margin: 0 0 0.5rem;
}

.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.75rem;
  margin: 2.2rem 0 2rem;
}

.cal-day {
  background: var(--fond);
  border-radius: 14px;
  overflow: hidden;
}

.cal-day-head {
  background: var(--ink);
  padding: 0.6rem 0.9rem;
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.06em;
  color: var(--surface);
  text-transform: uppercase;
}

.cal-day-body {
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cal-empty {
  color: var(--ink-soft);
  font-size: 0.9rem;
  text-align: center;
  padding: 0.5rem 0;
  margin: 0;
  opacity: 0.5;
}

.creneau {
  border-left: 3px solid;
  padding: 0.5rem 0.6rem;
  border-radius: 0 4px 4px 0;
}

.creneau--adultes { border-left-color: var(--turquoise); background: color-mix(in srgb, var(--turquoise) 10%, white); }
.creneau--ecole   { border-left-color: var(--moutarde); background: color-mix(in srgb, var(--moutarde) 12%, white); }
.creneau--ados    { border-left-color: var(--olive);    background: color-mix(in srgb, var(--olive) 12%, white); }
.creneau--compet  { border-left-color: var(--ambre);    background: color-mix(in srgb, var(--ambre) 12%, white); }
.creneau--libre   { border-left-color: var(--turquoise); background: transparent; border-style: dashed; }

.creneau-heure {
  font-size: 0.68rem;
  font-weight: 500;
  color: var(--ink-soft);
  letter-spacing: 0.04em;
  margin: 0 0 0.15rem;
}

.creneau-groupe {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 0.1rem;
}

.creneau-enc {
  font-size: 0.7rem;
  color: var(--ink-soft);
  margin: 0;
}

.cal-cta {
  text-align: center;
  margin-top: 2.4rem;
}

/* ─── ÉVÉNEMENTS À VENIR (sous le planning) ─── */
.events-teaser {
  margin-top: 2.6rem;
}

.events-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 1rem;
}

.events-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.8rem;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--fond);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 0.85rem 1.1rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.event-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(22, 36, 29, 0.1);
}

.event-chip {
  flex-shrink: 0;
  width: 3rem;
  text-align: center;
  background: color-mix(in srgb, var(--ambre) 14%, white);
  border-radius: 10px;
  padding: 0.4rem 0.2rem;
}

.event-chip-day {
  display: block;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
  color: var(--ink);
}

.event-chip-month {
  display: block;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ink-soft);
  margin-top: 0.1rem;
}

.event-info { min-width: 0; }

.event-name {
  font-weight: 500;
  margin: 0 0 0.1rem;
}

.event-meta {
  font-size: 0.82rem;
  color: var(--ink-soft);
  margin: 0;
}

/* ─── CTA INSCRIPTION ─── */
.cta-join {
  background: var(--turquoise);
  padding: 4rem 0;
}

.cta-join-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.cta-join h2 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 0.95;
  color: #fff;
  margin: 0 0 0.5rem;
}

.cta-join-text {
  color: rgba(255, 255, 255, 0.85);
  max-width: 440px;
  line-height: 1.6;
  margin: 0;
}

.section-kicker--light {
  color: #fff;
}

.section-kicker--light::before {
  background: #fff;
}

/* ─── RESPONSIVE ─── */
/* Écrans peu hauts (laptops 768px) : compacter le hero pour tenir dans le pli */
@media (max-height: 840px) and (min-width: 961px) {
  .hero-title {
    font-size: clamp(2.8rem, 5.5vw, 4.5rem);
  }

  .hero-kicker {
    margin-bottom: 0.9rem;
  }

  .hero-desc {
    margin-bottom: 1.2rem;
  }

  .hero-actions {
    margin-bottom: 1.6rem;
  }
}

@media (max-width: 960px) {
  .hero-wall {
    display: none;
  }

  .hero {
    min-height: auto;
  }

  .cal-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 640px) {
  .valeurs-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    gap: 0.6rem;
  }

  .cal-grid {
    grid-template-columns: 1fr 1fr;
  }

}
</style>
