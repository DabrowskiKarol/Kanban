export const isFirebaseConfigured = true
export const app = null
export const auth = null
export const db = null
export const storage = null

export function ensureFirebaseConfigured() {
  return { auth: null, db: null, storage: null }
}
