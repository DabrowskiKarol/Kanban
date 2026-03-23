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
  title: z.string().min(2, 'Column title is too short.'),
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
    <Modal open={open} onClose={onClose} title={initialColumn ? 'Edit column' : 'Create column'}>
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="label-text">Title</label>
          <Input {...register('title')} placeholder="Ideas" />
          {errors.title ? <p className="mt-2 text-xs text-rose-500">{errors.title.message}</p> : null}
        </div>
        <div>
          <label className="label-text">Tone</label>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {COLUMN_TONES.map((tone) => (
              <button
                key={tone}
                type="button"
                className={`h-14 rounded-2xl ${tone} ${selectedTone === tone ? 'ring-2 ring-[#209dd7]' : ''}`}
                onClick={() => setValue('tone', tone)}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : initialColumn ? 'Save changes' : 'Create column'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
