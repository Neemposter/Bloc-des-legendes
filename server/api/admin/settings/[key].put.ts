import { eq } from 'drizzle-orm'
import { settings } from '../../../db/schema'

const ALLOWED_KEYS = ['registration_link'] as const

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  if (!key || !(ALLOWED_KEYS as readonly string[]).includes(key)) {
    throw createError({ statusCode: 400, message: 'Clé de configuration invalide.' })
  }

  const { value } = await readBody<{ value: string }>(event)
  if (!value?.trim()) throw createError({ statusCode: 422, message: 'La valeur est requise.' })

  const db = useDb()
  const updated = db.update(settings).set({
    value: value.trim(),
    updatedAt: new Date().toISOString(),
  }).where(eq(settings.key, key)).returning().get()

  if (!updated) throw createError({ statusCode: 404, message: 'Paramètre introuvable.' })
  return updated
})
