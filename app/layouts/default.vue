<template>
  <div class="site">
    <header class="site-header">
      <div class="container header-inner">
        <NuxtLink to="/" class="brand">
          <span class="brand-holds" aria-hidden="true">
            <i class="hold hold-turquoise" /><i class="hold hold-moutarde" /><i class="hold hold-ambre" />
          </span>
          Bloc des Légendes
        </NuxtLink>
        <nav class="site-nav" aria-label="Navigation principale">
          <NuxtLink to="/">Accueil</NuxtLink>
          <NuxtLink to="/actualites">Actualités</NuxtLink>
          <NuxtLink to="/calendrier">Calendrier</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
          <NuxtLink to="/admin" class="nav-admin">Admin</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <p class="footer-brand">Bloc des Légendes</p>
            <p class="footer-desc">
              Association d'escalade fondée en 2013 à Lesneven. Bloc en salle toute
              l'année, falaise sur les côtes finistériennes à la belle saison.
            </p>
            <a
              href="https://www.instagram.com/blocdeslegendes/"
              target="_blank"
              rel="noopener"
              class="footer-insta"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
              </svg>
              @blocdeslegendes
            </a>
          </div>
          <div>
            <p class="footer-heading">Nous trouver</p>
            <p>
              Salle des sports Bodénès<br>
              Rue de l'Hippodrome<br>
              29260 Lesneven
            </p>
          </div>
          <div>
            <p class="footer-heading">Contact</p>
            <p>
              <a href="mailto:blocdeslegendes@gmail.com" class="footer-link">blocdeslegendes@gmail.com</a>
            </p>
            <p class="footer-ffme">
              Club affilié FFME n° 029020<br>
              Escalade &amp; escalade bloc
            </p>
          </div>
        </div>
        <p class="footer-fineprint">
          © {{ new Date().getFullYear() }} Bloc des Légendes · Association loi 1901 · Mentions légales (à venir)
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.site {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: var(--header-height);
  padding-block: 0.5rem;
  flex-wrap: wrap;
}

.brand {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.35rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-holds {
  display: inline-flex;
  gap: 0.25rem;
}

.hold {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 55% 45% 60% 40% / 50% 60% 40% 50%;
  display: inline-block;
}

.hold-turquoise { background: var(--turquoise); }
.hold-moutarde { background: var(--moutarde); }
.hold-ambre { background: var(--ambre); }

.site-nav {
  display: flex;
  gap: 1.4rem;
  font-size: 1rem;
}

.site-nav a {
  padding-block: 0.25rem;
  border-bottom: 3px solid transparent;
  transition: border-color 0.15s ease;
}

.site-nav a:hover {
  border-bottom-color: var(--moutarde);
}

.site-nav a.router-link-active {
  border-bottom-color: var(--turquoise);
  font-weight: 500;
}

.nav-admin {
  color: var(--ink-soft);
  font-size: 0.88rem;
}

.site-main {
  flex: 1;
}

.site-footer {
  margin-top: 4rem;
  background: var(--ink);
  color: rgba(255, 255, 255, 0.85);
  padding-block: 2.6rem 1.6rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 2.5rem;
}

.footer-grid p {
  margin: 0.2rem 0;
  line-height: 1.6;
}

.footer-brand {
  font-family: var(--font-display);
  text-transform: uppercase;
  font-size: 1.1rem;
  color: var(--moutarde);
  margin: 0 0 0.4rem;
}

.footer-desc {
  color: rgba(255, 255, 255, 0.65);
  max-width: 340px;
}

.footer-heading {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.85rem;
  color: var(--turquoise);
  margin: 0 0 0.5rem;
}

.footer-insta {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.9rem;
  font-weight: 500;
  color: var(--moutarde);
}

.footer-insta:hover {
  color: var(--surface);
}

.footer-link {
  color: rgba(255, 255, 255, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.footer-link:hover {
  color: var(--moutarde);
  border-bottom-color: var(--moutarde);
}

.footer-ffme {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
  margin-top: 0.7rem;
}

.footer-fineprint {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 2.2rem 0 0;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

@media (max-width: 760px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 1.6rem;
  }
}

@media (max-width: 640px) {
  .site-nav {
    gap: 0.9rem;
    font-size: 0.95rem;
  }
}
</style>
