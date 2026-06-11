import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
export const ARTICLE_STATUSES = ['draft', 'published'] as const

// Comptes admin du back-office
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull(), // ISO 8601
})

// Actualités du club
export const articles = sqliteTable('articles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  summary: text('summary').notNull(), // affiché sur les cartes actualités
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  status: text('status', { enum: ARTICLE_STATUSES }).notNull().default('draft'),
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  authorId: integer('author_id').notNull().references(() => users.id),
})

// Planning hebdomadaire récurrent, affichage public
export const timeSlots = sqliteTable('time_slots', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  day: text('day', { enum: WEEKDAYS }).notNull(),
  startTime: text('start_time').notNull(), // HH:MM
  endTime: text('end_time').notNull(), // HH:MM
  groupName: text('group_name').notNull(),
  instructor: text('instructor'),
  capacity: integer('capacity').notNull().default(0),
})

// Messages du formulaire de contact, consultés en admin
export const contactMessages = sqliteTable('contact_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject'),
  message: text('message').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
})

// Config éditable en admin, ex : key = registration_link
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: text('updated_at').notNull(),
})
