import { eq } from 'drizzle-orm'
import { articles } from '../../../db/schema'

export default defineEventHandler((event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const db = useDb()
  const existing = db.select().from(articles).where(eq(articles.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, message: 'Article introuvable.' })

  db.delete(articles).where(eq(articles.id, id)).run()
  return { ok: true }
})
