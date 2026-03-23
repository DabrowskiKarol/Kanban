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
  displayName: z.string().min(2, 'Enter your name to continue.'),
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
      toast.success('Welcome in')
      navigate(from)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not log in')
    }
  })

  return (
    <div className="surface-glass p-6 sm:p-8">
      <p className="label-text">Quick access</p>
      <h2 className="mt-3 text-3xl font-semibold">Log in with your name</h2>
      <p className="mt-4 text-sm leading-7 text-copy">
        This build uses a lightweight local profile flow with no password required.
      </p>
      <div className="mt-6 flex items-center gap-4 rounded-[24px] bg-white/50 p-4">
        <Avatar name={watch('displayName') || 'Guest User'} className="h-16 w-16" />
        <div>
          <p className="label-text">Optional photo</p>
          <p className="mt-2 text-sm text-copy">
            Photo is set during registration or profile editing.
          </p>
        </div>
      </div>
      <form className="mt-8 space-y-5" onSubmit={submit}>
        <div>
          <label className="label-text">Your name</label>
          <Input {...register('displayName')} placeholder="Avery Morgan" />
          {errors.displayName ? (
            <p className="mt-2 text-xs text-rose-500">{errors.displayName.message}</p>
          ) : null}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Logging in...' : 'Enter workspace'}
        </Button>
      </form>
      <p className="mt-6 text-sm text-copy">
        Need a fresh local profile?{' '}
        <Link to="/register" className="font-semibold text-[#753991]">
          Create one
        </Link>
      </p>
    </div>
  )
}
