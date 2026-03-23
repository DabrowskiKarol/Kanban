import type { Board, BoardColumn, BoardTask, SessionUser, UserProfile } from '../types/models'

const STORAGE_KEY = 'editorial-boards-store'
const SESSION_KEY = 'editorial-boards-session'
const EVENT_NAME = 'editorial-boards-updated'

interface LocalDatabase {
  profiles: UserProfile[]
  boards: Board[]
  columnsByBoard: Record<string, BoardColumn[]>
  tasksByBoard: Record<string, BoardTask[]>
}

function createEmptyDatabase(): LocalDatabase {
  return {
    profiles: [],
    boards: [],
    columnsByBoard: {},
    tasksByBoard: {},
  }
}

export function createId() {
  return crypto.randomUUID()
}

export function readDatabase(): LocalDatabase {
  if (typeof window === 'undefined') return createEmptyDatabase()

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return createEmptyDatabase()

  try {
    return JSON.parse(raw) as LocalDatabase
  } catch {
    return createEmptyDatabase()
  }
}

export function writeDatabase(updater: (database: LocalDatabase) => LocalDatabase) {
  const next = updater(readDatabase())
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent(EVENT_NAME))
  return next
}

export function subscribeStore(callback: () => void) {
  const listener = () => callback()
  window.addEventListener(EVENT_NAME, listener)
  window.addEventListener('storage', listener)

  return () => {
    window.removeEventListener(EVENT_NAME, listener)
    window.removeEventListener('storage', listener)
  }
}

export function getSessionUserId() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(SESSION_KEY)
}

export function setSessionUserId(userId: string | null) {
  if (typeof window === 'undefined') return

  if (userId) {
    window.localStorage.setItem(SESSION_KEY, userId)
  } else {
    window.localStorage.removeItem(SESSION_KEY)
  }

  window.dispatchEvent(new CustomEvent(EVENT_NAME))
}

export function getSessionUser(): SessionUser | null {
  const userId = getSessionUserId()
  if (!userId) return null

  const profile = readDatabase().profiles.find((item) => item.id === userId)
  if (!profile) return null

  return {
    uid: profile.id,
    email: profile.email,
    displayName: profile.displayName,
    photoURL: profile.photoURL,
  }
}
