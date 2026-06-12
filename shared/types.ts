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
}

// Miroir des lignes de la table events
export interface ClubEvent {
  id: number
  title: string
  description: string | null
  date: string // YYYY-MM-DD
  startTime: string | null // HH:MM
  endTime: string | null // HH:MM
  location: string | null
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
