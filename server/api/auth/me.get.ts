export default defineEventHandler(async (event) => {
  const session = await useAdminSession(event)
  if (!session.data.userId) {
    throw createError({ statusCode: 401, message: 'Non authentifié.' })
  }
  return { userId: session.data.userId, email: session.data.email }
})
