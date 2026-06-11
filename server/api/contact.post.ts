import { contactMessages } from '../db/schema'

interface ContactBody {
  name: string
  email: string
  subject?: string
  message: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event)

  if (!body.name?.trim()) throw createError({ statusCode: 422, message: 'Le nom est requis.' })
  if (!body.email?.trim() || !body.email.includes('@')) throw createError({ statusCode: 422, message: 'Email invalide.' })
  if (!body.message?.trim()) throw createError({ statusCode: 422, message: 'Le message est requis.' })

  const db = useDb()
  db.insert(contactMessages).values({
    name: body.name.trim(),
    email: body.email.trim(),
    subject: body.subject?.trim() || null,
    message: body.message.trim(),
    isRead: false,
    createdAt: new Date().toISOString(),
  }).run()

  return { ok: true }
})
