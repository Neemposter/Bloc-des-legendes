import { articles, ARTICLE_STATUSES } from '../../../db/schema'

interface ArticleBody {
  title: string
  summary: string
  content: string
  imageUrl?: string | null
  status?: string
}

export default defineEventHandler(async (event) => {
  const session = await useAdminSession(event)
  const body = await readBody<ArticleBody>(event)

  if (!body.title?.trim()) throw createError({ statusCode: 422, message: 'Le titre est requis.' })
  if (!body.summary?.trim()) throw createError({ statusCode: 422, message: 'Le résumé est requis.' })
  if (!body.content?.trim()) throw createError({ statusCode: 422, message: 'Le contenu est requis.' })

  const status = (ARTICLE_STATUSES as readonly string[]).includes(body.status ?? '')
    ? (body.status as typeof ARTICLE_STATUSES[number])
    : 'draft'
  const now = new Date().toISOString()

  const db = useDb()
  return db.insert(articles).values({
    title: body.title.trim(),
    summary: body.summary.trim(),
    content: body.content.trim(),
    imageUrl: body.imageUrl?.trim() || null,
    status,
    publishedAt: status === 'published' ? now : null,
    createdAt: now,
    updatedAt: now,
    authorId: session.data.userId,
  }).returning().get()
})
