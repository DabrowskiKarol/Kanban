import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

const schema = z.object({
  email: z.email('Enter a valid email address.'),
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
    <Modal open={open} onClose={onClose} title="Invite a collaborator">
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="label-text">Email address</label>
          <Input {...register('email')} placeholder="friend@example.com" />
          {errors.email ? <p className="mt-2 text-xs text-rose-500">{errors.email.message}</p> : null}
        </div>
        <p className="text-sm leading-7 text-copy">
          If the person already has an account, they will appear on the board immediately.
          Otherwise their email remains invited until they sign up.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send invite'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
