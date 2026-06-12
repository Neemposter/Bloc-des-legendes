export const useAuth = () => {
  const user = useState<{ userId: number; email: string } | null>('admin-user', () => null)

  async function fetchUser() {
    try {
      user.value = await $fetch('/api/auth/me')
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
