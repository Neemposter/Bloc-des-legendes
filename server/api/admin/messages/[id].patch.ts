import { eq } from 'drizzle-orm'
import { contactMessages } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: 'ID invalide.' })

  const { isRead } = await readBody<{ isRead: boolean }>(event)
  if (typeof isRead !== 'boolean') throw createError({ statusCode: 422, message: 'isRead (boolean) est requis.' })

  const db = useDb()
  const existing = db.select().from(contactMessages).where(eq(contactMessages.id, id)).get()
  if (!existing) throw createError({ statusCode: 404, message: 'Message introuvable.' })

  return db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, id)).returning().get()
})
