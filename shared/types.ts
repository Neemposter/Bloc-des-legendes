export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'

export type ArticleStatus = 'draft' | 'published'

// Miroir des lignes de la table time_slots (cf. server/db/schema.ts)
export interface TimeSlot {
  id: number
  day: Weekday
  startTime: string // HH:MM
  endTime: string // HH:MM
  groupName: string
  instructor: string | null
  capacity: number
  recurring: boolean // chaque semaine, sinon ponctuel à une date
  date: string | null // YYYY-MM-DD si non récurrent
}

// Un jour d'un événement, avec ses horaires propres
export interface EventDay {
  date: string // YYYY-MM-DD
  startTime: string | null // HH:MM (vide = journée entière)
  endTime: string | null // HH:MM
}

// Miroir des lignes de la table events (enrichi de ses jours)
export interface ClubEvent {
  id: number
  title: string
  description: string | null
  date: string // YYYY-MM-DD (date de début = min des jours)
  endDate: string | null // YYYY-MM-DD, fin si multi-jours
  location: string | null
  days: EventDay[]
  createdAt: string
  updatedAt: string
}

// Miroir des lignes de la table articles
export interface Article {
  id: number
  title: string
  summary: string
  content: string
  imageUrl: string | null
  status: ArticleStatus
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  authorId: number
}

// Miroir des lignes de la table contact_messages
export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}
