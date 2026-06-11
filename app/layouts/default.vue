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
          <NuxtLink to="/inscription">Inscription</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <p class="footer-brand">Bloc des Légendes</p>
        <p>Club associatif d'escalade — planning, actualités et vie du club.</p>
        <p class="footer-fineprint">© {{ new Date().getFullYear() }} Bloc des Légendes · Mentions légales (à venir)</p>
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
  padding-block: 0.85rem;
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

.site-main {
  flex: 1;
}

.site-footer {
  margin-top: 4rem;
  background: var(--ink);
  color: rgba(255, 255, 255, 0.85);
  padding-block: 2.2rem;
}

.footer-brand {
  font-family: var(--font-display);
  text-transform: uppercase;
  font-size: 1.1rem;
  color: var(--moutarde);
  margin: 0 0 0.4rem;
}

.footer-inner p {
  margin: 0.2rem 0;
}

.footer-fineprint {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 1rem;
}

@media (max-width: 640px) {
  .site-nav {
    gap: 0.9rem;
    font-size: 0.95rem;
  }
}
</style>
