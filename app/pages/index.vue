<script setup lang="ts">
import type { Article, TimeSlot, Weekday } from '~~/shared/types'

useHead({ title: 'Bloc des Légendes — Club d\'escalade' })

const { data: articlesData } = await useFetch<Article[]>('/api/articles')
const { data: slotsData } = await useFetch<TimeSlot[]>('/api/time-slots')

const articles = computed(() => (articlesData.value ?? []).slice(0, 3))
const featured = computed(() => articles.value[0] ?? null)
const secondary = computed(() => articles.value.slice(1))

const WEEKDAYS: { key: Weekday; label: string }[] = [
  { key: 'monday', label: 'Lundi' },
  { key: 'tuesday', label: 'Mardi' },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday', label: 'Jeudi' },
  { key: 'friday', label: 'Vendredi' },
]

const slotsByDay = computed(() => {
  const map = {} as Record<Weekday, TimeSlot[]>
  for (const day of WEEKDAYS) {
    map[day.key] = (slotsData.value ?? [])
      .filter(s => s.day === day.key)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }
  return map
})

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}

function slotClass(slot: TimeSlot): string {
  const n = slot.groupName.toLowerCase()
  if (n.includes('libre') || n.includes('famille')) return 'creneau--libre'
  if (n.includes('école') || n.includes('ecole') || n.includes('enfant') || n.includes('jeune') || n.includes('6') || n.includes('12')) return 'creneau--ecole'
  if (n.includes('ados')) return 'creneau--ados'
  if (n.includes('comp')) return 'creneau--compet'
  return 'creneau--adultes'
}
</script>

<template>
  <!-- ─── HERO ─────────────────────────────────────────────── -->
  <section class="hero">
    <!-- Mur d'escalade schématisé : panneau incliné + prises + sol -->
    <div class="hero-wall" aria-hidden="true">
      <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Grille de T-nuts (trous de vissage des prises) -->
          <pattern id="tnuts" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="8" r="1.5" fill="rgba(0,0,0,0.11)"/>
          </pattern>
        </defs>

        <!-- Fond du panneau mural -->
        <rect width="400" height="700" fill="#03A669"/>
        <!-- Grille T-nuts -->
        <rect width="400" height="700" fill="url(#tnuts)"/>

        <!-- Joints de panneaux (contreplaqué) -->
        <g stroke="rgba(0,0,0,0.09)" stroke-width="1.5" fill="none">
          <line x1="0" y1="172" x2="400" y2="160"/>
          <line x1="0" y1="344" x2="400" y2="332"/>
          <line x1="0" y1="516" x2="400" y2="504"/>
          <line x1="133" y1="0" x2="133" y2="700"/>
          <line x1="267" y1="0" x2="267" y2="700"/>
        </g>

        <!-- Sol / tapis de réception -->
        <path d="M 0,615 L 400,596 L 400,700 L 0,700 Z" fill="#D99923" opacity="0.72"/>

        <!-- ── VOIE A (moutarde) ── 6 prises, milieu gauche, bas→haut -->
        <!-- tape de départ -->
        <rect x="80" y="661" width="38" height="4" rx="2" fill="#B1BF41"/>
        <g transform="translate(99,648) rotate(-22)">
          <ellipse rx="15" ry="9" fill="#B1BF41"/>
          <ellipse rx="9" ry="4" cy="-2.5" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.5" fill="rgba(0,0,0,0.32)"/>
        </g>
        <g transform="translate(175,558) rotate(28)">
          <ellipse rx="13" ry="8" fill="#B1BF41"/>
          <ellipse rx="8" ry="3.5" cy="-2" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.3" fill="rgba(0,0,0,0.32)"/>
        </g>
        <g transform="translate(140,453) rotate(-18)">
          <ellipse rx="14" ry="9" fill="#B1BF41"/>
          <ellipse rx="8.5" ry="4" cy="-2.5" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.5" fill="rgba(0,0,0,0.32)"/>
        </g>
        <g transform="translate(206,344) rotate(32)">
          <ellipse rx="12" ry="7.5" fill="#B1BF41"/>
          <ellipse rx="7" ry="3.5" cy="-2" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.2" fill="rgba(0,0,0,0.32)"/>
        </g>
        <g transform="translate(162,238) rotate(-28)">
          <ellipse rx="13" ry="8" fill="#B1BF41"/>
          <ellipse rx="8" ry="4" cy="-2" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.3" fill="rgba(0,0,0,0.32)"/>
        </g>
        <!-- top hold voie A -->
        <g transform="translate(224,128) rotate(12)">
          <ellipse rx="16" ry="10" fill="#B1BF41"/>
          <ellipse rx="10" ry="4.5" cy="-2.5" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.5" fill="rgba(0,0,0,0.32)"/>
        </g>

        <!-- ── VOIE B (ambre) ── 4 prises, droite -->
        <rect x="307" y="657" width="36" height="4" rx="2" fill="#D99923"/>
        <g transform="translate(325,643) rotate(18)">
          <ellipse rx="14" ry="9" fill="#D99923"/>
          <ellipse rx="8.5" ry="4" cy="-2" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.5" fill="rgba(0,0,0,0.32)"/>
        </g>
        <g transform="translate(357,528) rotate(-32)">
          <ellipse rx="12" ry="7.5" fill="#D99923"/>
          <ellipse rx="7" ry="3.5" cy="-2" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.2" fill="rgba(0,0,0,0.32)"/>
        </g>
        <g transform="translate(321,413) rotate(22)">
          <ellipse rx="13" ry="8" fill="#D99923"/>
          <ellipse rx="8" ry="4" cy="-2" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.3" fill="rgba(0,0,0,0.32)"/>
        </g>
        <g transform="translate(367,298) rotate(-15)">
          <ellipse rx="14" ry="9" fill="#D99923"/>
          <ellipse rx="8.5" ry="4" cy="-2.5" fill="rgba(255,255,255,0.28)"/>
          <circle r="2.5" fill="rgba(0,0,0,0.32)"/>
        </g>

        <!-- ── PRISES BLANCHES (éparpillées, neutres) ── -->
        <g transform="translate(62,582) rotate(40)">
          <ellipse rx="11" ry="7" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="6.5" ry="3" cy="-1.5" fill="rgba(255,255,255,0.3)"/>
          <circle r="2" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(268,620) rotate(-25)">
          <ellipse rx="13" ry="8" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="8" ry="3.5" cy="-2" fill="rgba(255,255,255,0.3)"/>
          <circle r="2.3" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(47,488) rotate(-38)">
          <ellipse rx="12" ry="7.5" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="7" ry="3.5" cy="-2" fill="rgba(255,255,255,0.3)"/>
          <circle r="2.2" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(311,490) rotate(28)">
          <ellipse rx="14" ry="8.5" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="8.5" ry="4" cy="-2" fill="rgba(255,255,255,0.3)"/>
          <circle r="2.4" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(82,380) rotate(-15)">
          <ellipse rx="11" ry="7" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="6.5" ry="3" cy="-1.5" fill="rgba(255,255,255,0.3)"/>
          <circle r="2" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(255,398) rotate(35)">
          <ellipse rx="13" ry="8" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="7.5" ry="3.5" cy="-2" fill="rgba(255,255,255,0.3)"/>
          <circle r="2.3" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(47,280) rotate(20)">
          <ellipse rx="12" ry="7.5" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="7" ry="3.5" cy="-2" fill="rgba(255,255,255,0.3)"/>
          <circle r="2.2" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(310,190) rotate(-30)">
          <ellipse rx="14" ry="8.5" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="8.5" ry="4" cy="-2" fill="rgba(255,255,255,0.3)"/>
          <circle r="2.4" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(87,178) rotate(25)">
          <ellipse rx="11" ry="7" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="6.5" ry="3" cy="-1.5" fill="rgba(255,255,255,0.3)"/>
          <circle r="2" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(370,170) rotate(-20)">
          <ellipse rx="12" ry="7.5" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="7" ry="3.5" cy="-2" fill="rgba(255,255,255,0.3)"/>
          <circle r="2.2" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(47,90) rotate(42)">
          <ellipse rx="10" ry="6.5" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="6" ry="3" cy="-1.5" fill="rgba(255,255,255,0.3)"/>
          <circle r="1.9" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(340,72) rotate(-12)">
          <ellipse rx="13" ry="8" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="8" ry="3.5" cy="-2" fill="rgba(255,255,255,0.3)"/>
          <circle r="2.3" fill="rgba(0,0,0,0.25)"/>
        </g>
        <g transform="translate(184,68) rotate(22)">
          <ellipse rx="11" ry="7" fill="rgba(255,255,255,0.88)"/>
          <ellipse rx="6.5" ry="3" cy="-1.5" fill="rgba(255,255,255,0.3)"/>
          <circle r="2" fill="rgba(0,0,0,0.25)"/>
        </g>
      </svg>
    </div>

    <div class="container hero-content">
      <p class="hero-kicker">Club d'escalade · Lesneven · Bretagne</p>
      <h1 class="hero-title">
        GRIMPE,<br>
        <span class="hero-title-accent">PROGRESSE,</span><br>
        DEVIENS<br>UNE LÉGENDE.
      </h1>
      <p class="hero-desc">
        Débutants ou confirmés, rejoignez la communauté du Bloc des Légendes.
        Coaching, blocs techniques, ambiance unique.
      </p>
      <div class="hero-actions">
        <UiButton to="/inscription">Rejoindre le club</UiButton>
        <UiButton to="/calendrier" variant="secondary">Voir le calendrier</UiButton>
      </div>
      <div class="hero-stats">
        <div class="stat stat--turquoise">
          <span class="stat-num">120+</span>
          <span class="stat-label">Adhérents</span>
        </div>
        <div class="stat stat--ambre">
          <span class="stat-num">8</span>
          <span class="stat-label">Créneaux / semaine</span>
        </div>
        <div class="stat stat--moutarde">
          <span class="stat-num">3</span>
          <span class="stat-label">Niveaux encadrés</span>
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
        <p>Tarifs adaptés, créneaux variés, ouvert à tous dès 6 ans. L'escalade de bloc est pour tout le monde.</p>
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

      <div class="news-grid">
        <NuxtLink v-if="featured" :to="`/actualites/${featured.id}`" class="article-card article-card--featured">
          <div class="article-img">
            <img v-if="featured.imageUrl" :src="featured.imageUrl" :alt="featured.title" loading="lazy">
            <div v-else class="article-img-ph article-img-ph--0" aria-hidden="true" />
            <span class="article-tag article-tag--turquoise">Événement</span>
          </div>
          <div class="article-body">
            <p class="article-meta">{{ formatDate(featured.publishedAt) }}</p>
            <h3>{{ featured.title }}</h3>
            <p>{{ featured.summary }}</p>
            <span class="article-lire">Lire l'article</span>
          </div>
        </NuxtLink>

        <NuxtLink
          v-for="(article, i) in secondary"
          :key="article.id"
          :to="`/actualites/${article.id}`"
          class="article-card"
        >
          <div class="article-img">
            <img v-if="article.imageUrl" :src="article.imageUrl" :alt="article.title" loading="lazy">
            <div v-else class="article-img-ph" :class="`article-img-ph--${i + 1}`" aria-hidden="true" />
            <span class="article-tag" :class="i === 0 ? 'article-tag--olive' : 'article-tag--ambre'">Actualité</span>
          </div>
          <div class="article-body">
            <p class="article-meta">{{ formatDate(article.publishedAt) }}</p>
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
            <span class="article-lire">Lire l'article</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ─── CALENDRIER TEASER ─────────────────────────────────── -->
  <section class="cal-teaser">
    <div class="container">
      <p class="section-kicker">Planning</p>
      <h2>Les créneaux de la semaine</h2>
      <p class="section-sub">Un planning adapté à chaque niveau, du lundi au vendredi.</p>

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

      <div class="cal-cta">
        <UiButton to="/calendrier">Voir le calendrier complet</UiButton>
      </div>
    </div>
  </section>

  <!-- ─── CTA INSCRIPTION ───────────────────────────────────── -->
  <section class="cta-join">
    <div class="cta-join-deco cta-join-deco--tl" aria-hidden="true" />
    <div class="cta-join-deco cta-join-deco--br" aria-hidden="true" />
    <div class="container cta-join-inner">
      <div class="cta-join-text">
        <h2>PRÊT À REJOINDRE<br>L'AVENTURE ?</h2>
        <p>Cotisation annuelle, accès à tous les créneaux de ton groupe, encadrement inclus. Inscriptions ouvertes pour la saison 2025–2026.</p>
      </div>
      <NuxtLink to="/inscription" class="btn-white">Voir les tarifs et s'inscrire</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
/* ─── Utilitaires partagés ─── */
.section-kicker {
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
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
  min-height: 88vh;
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
  padding-block: 5rem;
}

.hero-kicker {
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--surface);
  background: var(--moutarde);
  display: inline-block;
  padding: 0.3rem 0.85rem;
  border-radius: 3px;
  margin: 0 0 1.2rem;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(3.8rem, 8vw, 7rem);
  line-height: 0.92;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: var(--ink);
  max-width: 580px;
  margin: 0 0 1.4rem;
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
  margin: 0 0 2.2rem;
}

.hero-actions {
  display: flex;
  gap: 0.85rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
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
  font-size: 0.7rem;
  font-weight: 800;
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

.news-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 1.25rem;
}

.article-card {
  background: var(--surface);
  border-radius: 8px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(22, 36, 29, 0.1);
}

.article-card--featured {
  grid-row: 1 / 3;
}

.article-img {
  width: 100%;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  aspect-ratio: 16 / 9;
}

.article-card--featured .article-img {
  aspect-ratio: 3 / 2;
}

.article-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.article-img-ph {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.article-img-ph--0 { background: linear-gradient(135deg, #027a4e, var(--turquoise)); }
.article-img-ph--1 { background: linear-gradient(135deg, var(--olive), var(--moutarde)); }
.article-img-ph--2 { background: linear-gradient(135deg, #b07a10, var(--ambre)); }

.article-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
  padding: 0.22rem 0.55rem;
  border-radius: 3px;
}

.article-tag--turquoise { background: var(--turquoise); }
.article-tag--olive     { background: var(--olive); }
.article-tag--ambre     { background: var(--ambre); }

.article-body {
  padding: 1.3rem 1.4rem 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-meta {
  font-size: 0.72rem;
  color: rgba(22, 36, 29, 0.38);
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 0.5rem;
}

.article-body h3 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: 0.02em;
  line-height: 1.1;
  color: var(--ink);
  margin: 0 0 0.5rem;
}

.article-card--featured .article-body h3 {
  font-size: 1.7rem;
}

.article-body p {
  font-size: 0.9rem;
  color: var(--ink-soft);
  line-height: 1.65;
  flex: 1;
  margin: 0;
}

.article-lire {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--turquoise);
  margin-top: 0.9rem;
  letter-spacing: 0.04em;
}

.article-lire::after {
  content: '→';
  transition: transform 0.15s ease;
}

.article-card:hover .article-lire::after {
  transform: translateX(4px);
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
  grid-template-columns: repeat(5, 1fr);
  gap: 0.75rem;
  margin: 2.2rem 0 2rem;
}

.cal-day {
  background: var(--fond);
  border-radius: 8px;
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
.creneau--ambre   { border-left-color: var(--ambre);    background: color-mix(in srgb, var(--ambre) 10%, white); }
.creneau--ecole   { border-left-color: var(--moutarde); background: color-mix(in srgb, var(--moutarde) 12%, white); }
.creneau--ados    { border-left-color: var(--olive);    background: color-mix(in srgb, var(--olive) 12%, white); }
.creneau--compet  { border-left-color: var(--ambre);    background: color-mix(in srgb, var(--ambre) 12%, white); }
.creneau--libre   { border-left-color: var(--turquoise); background: transparent; border-style: dashed; }

.creneau-heure {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--ink-soft);
  letter-spacing: 0.04em;
  margin: 0 0 0.15rem;
}

.creneau-groupe {
  font-size: 0.78rem;
  font-weight: 700;
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
}

/* ─── CTA INSCRIPTION ─── */
.cta-join {
  background: var(--turquoise);
  position: relative;
  overflow: hidden;
  padding: 5rem 0;
}

.cta-join-deco {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.cta-join-deco--tl {
  top: 0;
  right: 0;
  border-top: 320px solid rgba(2, 122, 78, 0.4);
  border-left: 300px solid transparent;
}

.cta-join-deco--br {
  bottom: 0;
  left: 0;
  border-bottom: 200px solid rgba(177, 191, 65, 0.4);
  border-right: 240px solid transparent;
}

.cta-join-inner {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: wrap;
}

.cta-join-text h2 {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 3.2rem);
  letter-spacing: 0.04em;
  line-height: 0.95;
  color: #fff;
  margin: 0 0 0.75rem;
}

.cta-join-text p {
  font-size: 1.06rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 460px;
  line-height: 1.6;
  margin: 0;
}

.btn-white {
  display: inline-block;
  background: #fff;
  color: var(--turquoise);
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  padding: 1rem 2.2rem;
  border-radius: 6px;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}

/* ─── RESPONSIVE ─── */
@media (max-width: 960px) {
  .hero-wall {
    display: none;
  }

  .hero {
    min-height: auto;
  }

  .news-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .article-card--featured {
    grid-row: auto;
  }

  .cal-grid {
    grid-template-columns: repeat(3, 1fr);
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

  .cta-join-inner {
    flex-direction: column;
    text-align: center;
  }
}
</style>
