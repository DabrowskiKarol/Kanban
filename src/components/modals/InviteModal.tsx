import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

const schema = z.object({
  email: z.email('Wpisz poprawny adres e-mail.'),
})

type InviteValues = z.infer<typeof schema>

export function InviteModal({
  open,
  onClose,
  onInvite,
}: {
  open: boolean
  onClose: () => void
  onInvite: (email: string) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteValues>({
    resolver: zodResolver(schema),
  })

  const submit = handleSubmit(async (values) => {
    await onInvite(values.email)
    reset()
    onClose()
  })

  return (
    <Modal open={open} onClose={onClose} title="Zaproś współpracownika">
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="label-text">Adres e-mail</label>
          <Input {...register('email')} placeholder="friend@example.com" />
          {errors.email ? <p className="mt-2 text-xs text-rose-500">{errors.email.message}</p> : null}
        </div>
        <p className="text-sm leading-7 text-copy">
          Jeśli ta osoba ma już konto, pojawi się na tablicy od razu.
          W przeciwnym razie adres pozostanie na liście zaproszeń do czasu rejestracji.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij zaproszenie'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
