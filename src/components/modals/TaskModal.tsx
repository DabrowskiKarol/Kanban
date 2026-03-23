import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PRIORITIES } from '../../lib/constants'
import { toDateInputValue } from '../../lib/utils'
import type { BoardColumn, BoardTask, UserProfile } from '../../types/models'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { Modal } from '../ui/Modal'

const schema = z.object({
  title: z.string().min(2, 'Task title is too short.'),
  description: z.string(),
  columnId: z.string().min(1, 'Choose a column.'),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function TaskModal({
  open,
  onClose,
  columns,
  members,
  initialTask,
  onSubmit,
  onDelete,
}: {
  open: boolean
  onClose: () => void
  columns: BoardColumn[]
  members: UserProfile[]
  initialTask?: BoardTask | null
  onSubmit: (values: FormValues) => Promise<void>
  onDelete?: () => Promise<void>
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialTask?.title ?? '',
      description: initialTask?.description ?? '',
      columnId: initialTask?.columnId ?? columns[0]?.id ?? '',
      priority: initialTask?.priority ?? 'medium',
      dueDate: initialTask?.dueDate ?? '',
      assigneeId: initialTask?.assigneeId ?? '',
    },
  })

  useEffect(() => {
    reset({
      title: initialTask?.title ?? '',
      description: initialTask?.description ?? '',
      columnId: initialTask?.columnId ?? columns[0]?.id ?? '',
      priority: initialTask?.priority ?? 'medium',
      dueDate: toDateInputValue(initialTask?.dueDate ?? ''),
      assigneeId: initialTask?.assigneeId ?? '',
    })
  }, [columns, initialTask, reset])

  const submit = handleSubmit(async (values) => {
    await onSubmit(values)
    onClose()
  })

  return (
    <Modal open={open} onClose={onClose} title={initialTask ? 'Edit task' : 'Create task'}>
      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="label-text">Title</label>
          <Input {...register('title')} placeholder="Write launch recap" />
          {errors.title ? <p className="mt-2 text-xs text-rose-500">{errors.title.message}</p> : null}
        </div>
        <div>
          <label className="label-text">Description</label>
          <Textarea {...register('description')} placeholder="Context, notes, and expected outcome." />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-text">Column</label>
            <select className="ghost-input" {...register('columnId')}>
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Priority</label>
            <select className="ghost-input" {...register('priority')}>
              {PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-text">Due date</label>
            <Input type="date" {...register('dueDate')} />
          </div>
          <div>
            <label className="label-text">Assignee</label>
            <select className="ghost-input" {...register('assigneeId')}>
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-between gap-3">
          <div>
            {initialTask && onDelete ? (
              <Button
                variant="ghost"
                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                onClick={async () => {
                  await onDelete()
                  onClose()
                }}
              >
                Delete task
              </Button>
            ) : null}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialTask ? 'Save changes' : 'Create task'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
