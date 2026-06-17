export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/admin/')) return

  const session = await useAdminSession(event)
  if (!session.data.userId) {
    throw createError({ statusCode: 401, message: 'Non authentifié.' })
  }
})
