import { eq } from 'drizzle-orm'
import { users } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email?: string; password?: string }>(event)

  if (!email?.trim() || !password) {
    throw createError({ statusCode: 422, message: 'Email et mot de passe requis.' })
  }

  const db = useDb()
  const user = db.select().from(users).where(eq(users.email, email.trim().toLowerCase())).get()

  if (!user || !verifyPassword(password, user.passwordHash)) {
    throw createError({ statusCode: 401, message: 'Identifiants incorrects.' })
  }

  const session = await useAdminSession(event)
  await session.update({ userId: user.id, email: user.email })

  return { ok: true, email: user.email }
})
