import { hashPassword } from '../utils/password'
import { articles, events, settings, timeSlots, users } from './schema'
import type { useDb } from '../utils/db'

type Db = ReturnType<typeof useDb>

// Seed idempotent : ne remplit que les tables vides.
// Données de démonstration pour le POC — à remplacer par les vraies infos du club.
export function seedIfEmpty(db: Db) {
  const now = new Date().toISOString()

  if (db.select().from(users).all().length === 0) {
    db.insert(users).values({
      email: 'admin@blocdeslegendes.fr',
      // Mot de passe par défaut du POC — à changer dès la mise en ligne
      passwordHash: hashPassword('blocdeslegendes'),
      createdAt: now,
    }).run()
  }

  if (db.select().from(settings).all().length === 0) {
    db.insert(settings).values({
      key: 'registration_link',
      value: 'https://www.helloasso.com/associations/bloc-des-legendes',
      updatedAt: now,
    }).run()
  }

  if (db.select().from(timeSlots).all().length === 0) {
    // Créneaux officiels du club (source FFME, fiche club n° 029020)
    db.insert(timeSlots).values([
      { day: 'monday', startTime: '21:00', endTime: '23:00', groupName: 'Adultes', instructor: null, capacity: 0 },
      { day: 'tuesday', startTime: '18:30', endTime: '20:30', groupName: 'Jeunes — école d\'escalade', instructor: null, capacity: 0 },
      { day: 'thursday', startTime: '21:00', endTime: '23:00', groupName: 'Adultes', instructor: null, capacity: 0 },
      { day: 'saturday', startTime: '09:00', endTime: '12:00', groupName: 'Tous niveaux', instructor: null, capacity: 0 },
    ]).run()
  }

  if (db.select().from(events).all().length === 0) {
    db.insert(events).values([
      {
        title: 'Sortie falaise — Côte nord',
        description: 'Sortie annuelle en falaise sur les côtes du Finistère nord. Tous niveaux, encadrement assuré par les bénévoles diplômés.',
        date: '2026-09-13',
        startTime: '09:00',
        endTime: '18:00',
        location: 'Presqu\'île de Crozon',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Championnat départemental bloc',
        description: 'Compétition officielle FFME, catégories jeunes et adultes.',
        date: '2026-10-04',
        startTime: '09:00',
        endTime: '17:00',
        location: 'Brest',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Contest interne de fin de saison',
        description: 'Ambiance décontractée, buvette et remise de prix maison.',
        date: '2026-11-22',
        startTime: '14:00',
        endTime: '20:00',
        location: 'Salle des sports Bodénès, Lesneven',
        createdAt: now,
        updatedAt: now,
      },
      {
        title: 'Stage d\'escalade de la Toussaint',
        description: 'Trois jours de stage intensif pendant les vacances : technique, bloc et sortie falaise. Ouvert aux ados et adultes.',
        date: '2026-10-26',
        endDate: '2026-10-28',
        location: 'Salle des sports Bodénès + falaises du littoral',
        createdAt: now,
        updatedAt: now,
      },
    ]).run()
  }

  if (db.select().from(articles).all().length === 0) {
    const admin = db.select().from(users).all()[0]
    if (admin) {
      db.insert(articles).values([
        {
          title: 'Le Bloc des Légendes lance son site !',
          summary: 'Toutes les infos du club enfin au même endroit : planning, actus et contact.',
          content: 'Bienvenue sur le nouveau site du Bloc des Légendes. Vous y trouverez le planning des séances, les actualités du club et un formulaire de contact.',
          status: 'published',
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
          authorId: admin.id,
        },
        {
          title: 'Sortie falaise de printemps',
          summary: 'Inscriptions ouvertes pour la sortie annuelle en falaise, tous niveaux.',
          content: 'La traditionnelle sortie falaise du club aura lieu au printemps. Débutants bienvenus, encadrement assuré par les bénévoles diplômés.',
          status: 'published',
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
          authorId: admin.id,
        },
        {
          title: 'Nouveaux blocs : le mur fait peau neuve',
          summary: 'Les ouvreurs ont démonté tout le pan central — 25 nouveaux blocs du jaune au noir.',
          content: 'Grosse session d\'ouverture ce week-end : le pan central a été entièrement renouvelé. Au programme, 25 nouveaux blocs étalés du jaune (débutant) au noir (expert), avec un focus sur les volumes et les dalles techniques. Merci aux bénévoles ouvreurs !',
          status: 'published',
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
          authorId: admin.id,
        },
        {
          title: 'Le club aux championnats départementaux',
          summary: 'Six grimpeurs du club qualifiés, deux podiums — retour sur une belle journée de compétition.',
          content: 'L\'équipe compétition du Bloc des Légendes s\'est déplacée aux championnats départementaux de bloc. Six qualifiés, deux podiums et de très belles performances chez les jeunes. Bravo à tous les grimpeurs et aux encadrants.',
          status: 'published',
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
          authorId: admin.id,
        },
        {
          title: 'Brouillon : résultats du contest interne',
          summary: 'Récap du contest de bloc de fin de saison.',
          content: 'À compléter après le contest.',
          status: 'draft',
          createdAt: now,
          updatedAt: now,
          authorId: admin.id,
        },
      ]).run()
    }
  }
}
