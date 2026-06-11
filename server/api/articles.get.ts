import { eq, desc } from 'drizzle-orm'
import { articles } from '../db/schema'

export default defineEventHandler(() => {
  const db = useDb()
  return db
    .select()
    .from(articles)
    .where(eq(articles.status, 'published'))
    .orderBy(desc(articles.publishedAt))
    .all()
})
