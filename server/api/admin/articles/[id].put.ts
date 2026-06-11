import { eq } from 'drizzle-orm'
import { articles, ARTICLE_STATUSES } from '../../../db/schema'

interface ArticleBody {
  title?: string
  summary?: string
  content?: string
  imageUrl?: string | null
  status?: string
}

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const body = await readBody<ArticleBody>(event)
  const db = useDb()

  const existing = db.select().from(articles).where(eq(articles.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, message: 'Article introuvable.' })

  const status = (ARTICLE_STATUSES as readonly string[]).includes(body.status ?? '')
    ? (body.status as typeof ARTICLE_STATUSES[number])
    : existing.status
  const now = new Date().toISOString()

  return db.update(articles).set({
    title: body.title?.trim() ?? existing.title,
    summary: body.summary?.trim() ?? existing.summary,
    content: body.content?.trim() ?? existing.content,
    imageUrl: 'imageUrl' in body ? (body.imageUrl?.trim() || null) : existing.imageUrl,
    status,
    publishedAt: status === 'published' && !existing.publishedAt ? now : existing.publishedAt,
    updatedAt: now,
  }).where(eq(articles.id, id)).returning().get()
})
