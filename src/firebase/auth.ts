import type { SessionUser, UserProfile } from '../types/models'
import { createId, getSessionUser, readDatabase, setSessionUserId, writeDatabase } from '../lib/localStore'
import { uploadProfilePhoto } from './storage'

interface RegisterPayload {
  firstName: string
  lastName: string
  photo?: File | null
}

async function createOrUpdateSessionProfile(
  firstName: string,
  lastName: string,
  photo?: File | null,
) {
  const displayName = `${firstName} ${lastName}`.trim()
  const existingProfile = readDatabase().profiles.find(
    (item) => item.displayName.toLowerCase() === displayName.toLowerCase(),
  )

  const userId = existingProfile?.id || createId()
  const photoURL = photo
    ? await uploadProfilePhoto(photo, userId)
    : existingProfile?.photoURL || ''

  const profile: UserProfile = {
    id: userId,
    email: existingProfile?.email || `${displayName.toLowerCase().replace(/\s+/g, '.')}@local.app`,
    firstName,
    lastName,
    displayName,
    photoURL,
    createdAt: existingProfile?.createdAt || null,
    updatedAt: null,
  }

  writeDatabase((database) => ({
    ...database,
    profiles: existingProfile
      ? database.profiles.map((item) => (item.id === userId ? profile : item))
      : [...database.profiles, profile],
  }))

  setSessionUserId(userId)

  const sessionUser: SessionUser = {
    uid: profile.id,
    email: profile.email,
    displayName: profile.displayName,
    photoURL: profile.photoURL,
  }

  return sessionUser
}

export async function registerWithEmail(payload: RegisterPayload) {
  return createOrUpdateSessionProfile(payload.firstName, payload.lastName, payload.photo)
}

export async function loginWithEmail(email: string, password: string) {
  void password

  const parts = email.trim().split(/\s+/).filter(Boolean)
  const firstName = parts[0] || 'Guest'
  const lastName = parts.slice(1).join(' ') || 'User'

  return createOrUpdateSessionProfile(firstName, lastName)
}

export async function logoutUser() {
  setSessionUserId(null)
}

export async function sendResetEmail(email: string) {
  void email
}

export async function changePassword() {
  return
}

export function getCurrentSessionUser() {
  return getSessionUser()
}
