import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { registerWithEmail } from '../../firebase/auth'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  firstName: z.string().min(2, 'Wpisz imię.'),
  lastName: z.string().min(2, 'Wpisz nazwisko.'),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [photo, setPhoto] = useState<File | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const fullName = `${watch('firstName') || ''} ${watch('lastName') || ''}`.trim()
  const previewUrl = useMemo(() => (photo ? URL.createObjectURL(photo) : ''), [photo])

  if (user) return <Navigate to="/app" replace />

  const submit = handleSubmit(async (values) => {
    try {
      await registerWithEmail({ ...values, photo })
      toast.success('Utworzono profil')
      navigate('/app')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się utworzyć profilu')
    }
  })

  return (
    <div className="surface-glass p-6 sm:p-8">
      <p className="label-text">Dołącz do studia</p>
      <h2 className="mt-3 text-3xl font-semibold">Utwórz lokalny profil</h2>
      <form className="mt-8 space-y-5" onSubmit={submit}>
        <div className="flex items-center gap-4 rounded-[24px] bg-white/50 p-4">
          <Avatar src={previewUrl} name={fullName || 'New user'} className="h-16 w-16" />
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
            <Input {...register('firstName')} placeholder="Jan" />
            {errors.firstName ? (
              <p className="mt-2 text-xs text-rose-500">{errors.firstName.message}</p>
            ) : null}
          </div>
          <div>
            <label className="label-text">Nazwisko</label>
            <Input {...register('lastName')} placeholder="Kowalski" />
            {errors.lastName ? (
              <p className="mt-2 text-xs text-rose-500">{errors.lastName.message}</p>
            ) : null}
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Tworzenie profilu...' : 'Utwórz profil'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-copy">
        Masz już lokalny profil?{' '}
        <Link to="/login" className="font-semibold text-[#753991]">
          Zaloguj się
        </Link>
      </p>
    </div>
  )
}
