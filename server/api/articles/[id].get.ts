import { eq, and } from 'drizzle-orm'
import { articles } from '../../db/schema'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id || isNaN(id)) throw createError({ statusCode: 400, message: 'id invalide' })

  const db = useDb()
  const article = db
    .select()
    .from(articles)
    .where(and(eq(articles.id, id), eq(articles.status, 'published')))
    .get()

  if (!article) throw createError({ statusCode: 404, message: 'Article introuvable' })
  return article
})
