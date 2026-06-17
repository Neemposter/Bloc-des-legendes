export const useAuth = () => {
  const user = useState<{ userId: number; email: string } | null>('admin-user', () => null)
  // useRequestFetch : en SSR, $fetch ne transmet pas les cookies de la requête
  // entrante → /api/auth/me répondait 401 au refresh d'une page admin
  const requestFetch = useRequestFetch()

  async function fetchUser() {
    try {
      user.value = await requestFetch('/api/auth/me')
    }
    catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    await $fetch('/api/auth/login', { method: 'POST', body: { email, password } })
    await fetchUser()
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/admin/login')
  }

  return { user: readonly(user), fetchUser, login, logout }
}
