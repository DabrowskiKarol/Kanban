import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { loginWithEmail } from '../../firebase/auth'
import { useAuth } from '../../hooks/useAuth'

const schema = z.object({
  displayName: z.string().min(2, 'Wpisz imię i nazwisko, aby kontynuować.'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/app'
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  if (user) return <Navigate to="/app" replace />

  const submit = handleSubmit(async (values) => {
    try {
      await loginWithEmail(values.displayName, '')
      toast.success('Witamy')
      navigate(from)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się zalogować')
    }
  })

  return (
    <div className="surface-glass p-6 sm:p-8">
      <p className="label-text">Szybki dostęp</p>
      <h2 className="mt-3 text-3xl font-semibold">Zaloguj się swoim imieniem i nazwiskiem</h2>
      <p className="mt-4 text-sm leading-7 text-copy">
        Ta wersja używa lekkiego lokalnego profilu bez potrzeby wpisywania hasła.
      </p>
      <div className="mt-6 flex items-center gap-4 rounded-[24px] bg-white/50 p-4">
        <Avatar name={watch('displayName') || 'Guest User'} className="h-16 w-16" />
        <div>
          <p className="label-text">Opcjonalne zdjęcie</p>
          <p className="mt-2 text-sm text-copy">
            Zdjęcie ustawisz podczas rejestracji albo później w profilu.
          </p>
        </div>
      </div>
      <form className="mt-8 space-y-5" onSubmit={submit}>
        <div>
          <label className="label-text">Imię i nazwisko</label>
          <Input {...register('displayName')} placeholder="Jan Kowalski" />
          {errors.displayName ? (
            <p className="mt-2 text-xs text-rose-500">{errors.displayName.message}</p>
          ) : null}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Logowanie...' : 'Wejdź do aplikacji'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-copy">
        Chcesz utworzyć nowy lokalny profil?{' '}
        <Link to="/register" className="font-semibold text-[#753991]">
          Utwórz go
        </Link>
      </p>
    </div>
  )
}
