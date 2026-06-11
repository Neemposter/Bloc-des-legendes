import { desc, eq } from 'drizzle-orm'
import { contactMessages } from '../../../db/schema'

export default defineEventHandler((event) => {
  const { unread } = getQuery(event)
  const db = useDb()

  if (unread === 'true') {
    return db.select().from(contactMessages)
      .where(eq(contactMessages.isRead, false))
      .orderBy(desc(contactMessages.createdAt))
      .all()
  }

  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).all()
})
