import { hashPassword } from '../utils/password'
import { articles, settings, timeSlots, users } from './schema'
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
    db.insert(timeSlots).values([
      { day: 'monday', startTime: '17:30', endTime: '19:00', groupName: 'École d\'escalade (8-12 ans)', instructor: 'Manon', capacity: 12 },
      { day: 'monday', startTime: '19:00', endTime: '21:00', groupName: 'Adultes loisir', instructor: 'Karim', capacity: 16 },
      { day: 'tuesday', startTime: '18:00', endTime: '19:30', groupName: 'Ados perfectionnement', instructor: 'Léa', capacity: 10 },
      { day: 'tuesday', startTime: '19:30', endTime: '21:30', groupName: 'Équipe compétition', instructor: 'Bastien', capacity: 8 },
      { day: 'wednesday', startTime: '14:00', endTime: '15:30', groupName: 'École d\'escalade (6-9 ans)', instructor: 'Manon', capacity: 12 },
      { day: 'wednesday', startTime: '15:30', endTime: '17:00', groupName: 'École d\'escalade (10-13 ans)', instructor: 'Léa', capacity: 12 },
      { day: 'wednesday', startTime: '18:00', endTime: '21:00', groupName: 'Accès libre adhérents', instructor: null, capacity: 30 },
      { day: 'thursday', startTime: '19:00', endTime: '21:00', groupName: 'Adultes loisir', instructor: 'Karim', capacity: 16 },
      { day: 'friday', startTime: '17:30', endTime: '19:00', groupName: 'Ados loisir', instructor: 'Bastien', capacity: 12 },
      { day: 'friday', startTime: '19:00', endTime: '22:00', groupName: 'Soirée bloc — accès libre', instructor: null, capacity: 30 },
      { day: 'saturday', startTime: '10:00', endTime: '12:00', groupName: 'Grimpe en famille', instructor: 'Manon', capacity: 14 },
      { day: 'saturday', startTime: '14:00', endTime: '17:00', groupName: 'Accès libre adhérents', instructor: null, capacity: 30 },
      { day: 'sunday', startTime: '10:00', endTime: '13:00', groupName: 'Accès libre adhérents', instructor: null, capacity: 30 },
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
