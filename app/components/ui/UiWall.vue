<script setup lang="ts">
// Mur d'escalade schématisé (panneau + prises + tapis), extrait du hero
// de la page d'accueil pour être réutilisé en décor sur les autres pages.
// id unique pour le pattern : évite les collisions si deux murs coexistent.
const uid = useId()
</script>

<template>
  <svg viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <!-- Grille de T-nuts (trous de vissage des prises) -->
      <pattern :id="`tnuts-${uid}`" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="8" r="1.5" fill="rgba(0,0,0,0.11)"/>
      </pattern>
    </defs>

    <!-- Fond du panneau mural -->
    <rect width="400" height="700" fill="var(--turquoise)"/>
    <rect width="400" height="700" :fill="`url(#tnuts-${uid})`"/>

    <!-- Joints de panneaux (contreplaqué) -->
    <g stroke="rgba(0,0,0,0.09)" stroke-width="1.5" fill="none">
      <line x1="0" y1="172" x2="400" y2="160"/>
      <line x1="0" y1="344" x2="400" y2="332"/>
      <line x1="0" y1="516" x2="400" y2="504"/>
      <line x1="133" y1="0" x2="133" y2="700"/>
      <line x1="267" y1="0" x2="267" y2="700"/>
    </g>

    <!-- Sol / tapis de réception -->
    <path d="M 0,615 L 400,596 L 400,700 L 0,700 Z" fill="var(--ambre)" opacity="0.72"/>

    <!-- ── VOIE A (moutarde) ── 6 prises, milieu gauche, bas→haut -->
    <rect x="80" y="661" width="38" height="4" rx="2" fill="var(--moutarde)"/>
    <g transform="translate(99,648) rotate(-22)">
      <ellipse rx="15" ry="9" fill="var(--moutarde)"/>
      <ellipse rx="9" ry="4" cy="-2.5" fill="rgba(255,255,255,0.28)"/>
      <circle r="2.5" fill="rgba(0,0,0,0.32)"/>
    </g>
    <g transform="translate(175,558) rotate(28)">
      <ellipse rx="13" ry="8" fill="var(--moutarde)"/>
      <ellipse rx="8" ry="3.5" cy="-2" fill="rgba(255,255,255,0.28)"/>
      <circle r="2.3" fill="rgba(0,0,0,0.32)"/>
    </g>
    <g transform="translate(140,453) rotate(-18)">
      <ellipse rx="14" ry="9" fill="var(--moutarde)"/>
      <ellipse rx="8.5" ry="4" cy="-2.5" fill="rgba(255,255,255,0.28)"/>
      <circle r="2.5" fill="rgba(0,0,0,0.32)"/>
    </g>
    <g transform="translate(206,344) rotate(32)">
      <ellipse rx="12" ry="7.5" fill="var(--moutarde)"/>
      <ellipse rx="7" ry="3.5" cy="-2" fill="rgba(255,255,255,0.28)"/>
      <circle r="2.2" fill="rgba(0,0,0,0.32)"/>
    </g>
    <g transform="translate(162,238) rotate(-28)">
      <ellipse rx="13" ry="8" fill="var(--moutarde)"/>
      <ellipse rx="8" ry="4" cy="-2" fill="rgba(255,255,255,0.28)"/>
      <circle r="2.3" fill="rgba(0,0,0,0.32)"/>
    </g>
    <g transform="translate(224,128) rotate(12)">
      <ellipse rx="16" ry="10" fill="var(--moutarde)"/>
      <ellipse rx="10" ry="4.5" cy="-2.5" fill="rgba(255,255,255,0.28)"/>
      <circle r="2.5" fill="rgba(0,0,0,0.32)"/>
    </g>

    <!-- ── VOIE B (ambre) ── 4 prises, droite -->
    <rect x="307" y="657" width="36" height="4" rx="2" fill="var(--ambre)"/>
    <g transform="translate(325,643) rotate(18)">
      <ellipse rx="14" ry="9" fill="var(--ambre)"/>
      <ellipse rx="8.5" ry="4" cy="-2" fill="rgba(255,255,255,0.28)"/>
      <circle r="2.5" fill="rgba(0,0,0,0.32)"/>
    </g>
    <g transform="translate(357,528) rotate(-32)">
      <ellipse rx="12" ry="7.5" fill="var(--ambre)"/>
      <ellipse rx="7" ry="3.5" cy="-2" fill="rgba(255,255,255,0.28)"/>
      <circle r="2.2" fill="rgba(0,0,0,0.32)"/>
    </g>
    <g transform="translate(321,413) rotate(22)">
      <ellipse rx="13" ry="8" fill="var(--ambre)"/>
      <ellipse rx="8" ry="4" cy="-2" fill="rgba(255,255,255,0.28)"/>
      <circle r="2.3" fill="rgba(0,0,0,0.32)"/>
    </g>
    <g transform="translate(367,298) rotate(-15)">
      <ellipse rx="14" ry="9" fill="var(--ambre)"/>
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
</template>
