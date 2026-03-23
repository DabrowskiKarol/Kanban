import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../ui/Modal'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'

const schema = z.object({
  name: z.string().min(3, 'Board name must be at least 3 characters.'),
  description: z.string().max(280, 'Keep the description under 280 characters.'),
})

type FormValues = z.infer<typeof schema>

export function BoardModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (values: FormValues) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    reset()
    onClose()
  })

  return (
    <Modal open={open} onClose={onClose} title="Create a shared board">
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="label-text">Board name</label>
          <Input {...register('name')} placeholder="Spring editorial sprint" />
          {errors.name ? <p className="mt-2 text-xs text-rose-500">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="label-text">Description</label>
          <Textarea
            {...register('description')}
            placeholder="A calm shared space for planning launches, reviews, and decisions."
          />
          {errors.description ? (
            <p className="mt-2 text-xs text-rose-500">{errors.description.message}</p>
          ) : null}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create board'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
