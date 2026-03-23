import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { COLUMN_TONES } from '../../lib/constants'
import type { BoardColumn } from '../../types/models'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'

const schema = z.object({
  title: z.string().min(2, 'Nazwa kolumny jest za krótka.'),
  tone: z.string(),
})

type FormValues = z.infer<typeof schema>

export function ColumnModal({
  open,
  onClose,
  initialColumn,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  initialColumn?: BoardColumn | null
  onSubmit: (values: FormValues) => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialColumn?.title ?? '',
      tone: initialColumn?.tone ?? COLUMN_TONES[0],
    },
  })

  useEffect(() => {
    reset({
      title: initialColumn?.title ?? '',
      tone: initialColumn?.tone ?? COLUMN_TONES[0],
    })
  }, [initialColumn, reset])

  const selectedTone = watch('tone')

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    onClose()
  })

  return (
    <Modal open={open} onClose={onClose} title={initialColumn ? 'Edytuj kolumnę' : 'Utwórz kolumnę'}>
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="label-text">Nazwa</label>
          <Input {...register('title')} placeholder="Pomysły" />
          {errors.title ? <p className="mt-2 text-xs text-rose-500">{errors.title.message}</p> : null}
        </div>
        <div>
          <label className="label-text">Kolor</label>
          <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {COLUMN_TONES.map((tone) => (
              <button
                key={tone}
                type="button"
                className={`h-14 rounded-2xl shadow-[0_12px_24px_rgba(3,33,71,0.05)] transition hover:-translate-y-0.5 ${tone} ${selectedTone === tone ? 'ring-2 ring-[#209dd7] ring-offset-2 ring-offset-white/60' : ''}`}
                onClick={() => setValue('tone', tone)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Anuluj
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Zapisywanie...' : initialColumn ? 'Zapisz zmiany' : 'Utwórz kolumnę'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
