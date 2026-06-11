import type { H3Event } from 'h3'

export function useAdminSession(event: H3Event) {
  const config = useRuntimeConfig()
  return useSession<{ userId: number; email: string }>(event, {
    password: config.sessionSecret as string,
    name: 'bloc-admin',
    maxAge: 60 * 60 * 8, // 8h
  })
}
