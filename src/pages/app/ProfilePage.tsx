import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'

const profileSchema = z.object({
  firstName: z.string().min(2, 'Wpisz imię.'),
  lastName: z.string().min(2, 'Wpisz nazwisko.'),
})

type ProfileValues = z.infer<typeof profileSchema>

export function ProfilePage() {
  const { user, profile, saveProfile } = useAuth()
  const [photo, setPhoto] = useState<File | null>(null)
  const previewUrl = useMemo(
    () => (photo ? URL.createObjectURL(photo) : profile?.photoURL || ''),
    [photo, profile?.photoURL],
  )
  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
    },
  })

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.88fr]">
      <section className="surface-panel p-6 sm:p-8">
        <p className="label-text">Profil</p>
        <h1 className="mt-3 text-4xl font-semibold">Tożsamość Twojej przestrzeni pracy</h1>
        <form
          className="mt-8 space-y-5"
          onSubmit={profileForm.handleSubmit(async (values) => {
            await saveProfile({ ...values, photo })
            setPhoto(null)
          })}
        >
          <div className="surface-soft flex items-center gap-4 p-5">
            <Avatar src={previewUrl} name={profile?.displayName} className="h-20 w-20" />
            <div className="min-w-0 flex-1">
              <label className="label-text">Zdjęcie profilowe</label>
              <Input
                type="file"
                accept="image/*"
                className="mt-2 file:mr-3 file:rounded-xl file:border-0 file:bg-[#032147] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white"
                onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
              />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="label-text">Imię</label>
              <Input {...profileForm.register('firstName')} />
            </div>
            <div>
              <label className="label-text">Nazwisko</label>
              <Input {...profileForm.register('lastName')} />
            </div>
          </div>
          <div>
            <label className="label-text">Lokalny identyfikator profilu</label>
            <Input value={user?.uid || ''} disabled />
          </div>
          <Button type="submit" disabled={profileForm.formState.isSubmitting}>
            {profileForm.formState.isSubmitting ? 'Zapisywanie...' : 'Zapisz profil'}
          </Button>
        </form>
      </section>

      <section className="surface-panel p-6 sm:p-8">
        <p className="label-text">Dostęp</p>
        <h2 className="mt-3 text-3xl font-semibold">Lokalny tryb bez hasła</h2>
        <p className="mt-4 text-sm leading-7 text-copy">
          Ta wersja przechowuje sesję w pamięci przeglądarki. Aby szybko zmienić osobę,
          wystarczy się wylogować i wpisać inne imię oraz nazwisko na ekranie logowania.
        </p>
      </section>
    </div>
  )
}
