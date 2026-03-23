import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '../ui/Modal'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'

const schema = z.object({
  name: z.string().min(3, 'Nazwa tablicy musi mieć co najmniej 3 znaki.'),
  description: z.string().max(280, 'Opis powinien mieć maksymalnie 280 znaków.'),
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
    <Modal open={open} onClose={onClose} title="Utwórz wspólną tablicę">
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="label-text">Nazwa tablicy</label>
          <Input {...register('name')} placeholder="Wiosenny sprint redakcyjny" />
          {errors.name ? <p className="mt-2 text-xs text-rose-500">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="label-text">Opis</label>
          <Textarea
            {...register('description')}
            placeholder="Spokojna wspólna przestrzeń do planowania publikacji, przeglądów i decyzji."
          />
          {errors.description ? (
            <p className="mt-2 text-xs text-rose-500">{errors.description.message}</p>
          ) : null}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Tworzenie...' : 'Utwórz tablicę'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
