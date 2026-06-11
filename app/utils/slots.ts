export type SlotCategory = 'ecole' | 'ados' | 'adultes' | 'compet' | 'libre'

// Catégorisation d'un créneau par son nom de groupe → couleur de la charte.
// Source unique partagée entre la page calendrier et le teaser de l'accueil.
export function slotCategory(groupName: string): SlotCategory {
  const n = groupName.toLowerCase()
  if (n.includes('libre') || n.includes('famille') || n.includes('tous niveaux')) return 'libre'
  if (n.includes('école') || n.includes('ecole') || n.includes('enfant') || n.includes('jeune')) return 'ecole'
  if (n.includes('ados')) return 'ados'
  if (n.includes('comp')) return 'compet'
  return 'adultes'
}
