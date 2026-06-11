import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../db/schema'

export { schema }

let _db: ReturnType<typeof createDb> | null = null

function createDb() {
  const path = process.env.DB_PATH ?? '.data/blocdeslegendes.sqlite'
  mkdirSync(dirname(path), { recursive: true })
  const sqlite = new Database(path)
  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('foreign_keys = ON')
  return drizzle(sqlite, { schema })
}

export function useDb() {
  if (!_db) {
    _db = createDb()
  }
  return _db
}
