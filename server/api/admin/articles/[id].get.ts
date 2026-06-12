import { eq } from 'drizzle-orm'
import { articles } from '../../../db/schema'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const db = useDb()
  const article = db.select().from(articles).where(eq(articles.id, id)).get()
  if (!article) throw createError({ statusCode: 404, message: 'Article introuvable.' })

  return article
})
