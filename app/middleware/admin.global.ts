export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') return

  const { user, fetchUser } = useAuth()
  if (!user.value) await fetchUser()
  if (!user.value) return navigateTo('/admin/login')
})
