import { createContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getCurrentSessionUser } from '../firebase/auth'
import { resolvePendingInvites, subscribeToUserProfile, updateUserProfile } from '../firebase/firestore'
import { uploadProfilePhoto } from '../firebase/storage'
import { getSessionUser, subscribeStore } from '../lib/localStore'
import type { SessionUser, UserProfile } from '../types/models'

interface AuthContextValue {
  user: SessionUser | null
  profile: UserProfile | null
  loading: boolean
  isConfigured: boolean
  refreshPendingInvites: () => Promise<void>
  saveProfile: (payload: {
    firstName: string
    lastName: string
    photo?: File | null
  }) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sync = () => {
      setUser(getCurrentSessionUser())
      setLoading(false)
    }

    sync()
    return subscribeStore(sync)
  }, [])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    return subscribeToUserProfile(user.uid, (nextProfile) => {
      setProfile(nextProfile)
    })
  }, [user])

  useEffect(() => {
    if (!user?.email) return
    resolvePendingInvites(user.email, user.uid).catch(console.error)
  }, [user])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      isConfigured: true,
      refreshPendingInvites: async () => {
        const sessionUser = getSessionUser()
        if (!sessionUser?.email) return
        await resolvePendingInvites(sessionUser.email, sessionUser.uid)
      },
      saveProfile: async ({ firstName, lastName, photo }) => {
        if (!user) return

        const displayName = `${firstName} ${lastName}`.trim()
        let photoURL = profile?.photoURL ?? user.photoURL ?? ''

        if (photo) {
          photoURL = await uploadProfilePhoto(photo, user.uid)
        }

        await updateUserProfile(user.uid, {
          firstName,
          lastName,
          displayName,
          photoURL,
        })

        toast.success('Profile updated')
      },
    }),
    [loading, profile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
