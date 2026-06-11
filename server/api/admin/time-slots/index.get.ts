import { timeSlots } from '../../../db/schema'

export default defineEventHandler(() => {
  const db = useDb()
  return db.select().from(timeSlots).all()
})
