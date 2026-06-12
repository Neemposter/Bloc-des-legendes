import { desc } from 'drizzle-orm'
import { articles } from '../../../db/schema'

export default defineEventHandler(() => {
  const db = useDb()
  return db.select().from(articles).orderBy(desc(articles.createdAt)).all()
})
