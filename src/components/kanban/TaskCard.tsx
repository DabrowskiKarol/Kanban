import {
  CalendarDaysIcon,
  EllipsisHorizontalIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { PRIORITIES } from '../../lib/constants'
import { formatDateLabel } from '../../lib/utils'
import type { BoardTask } from '../../types/models'

export function TaskCard({
  task,
  onEdit,
}: {
  task: BoardTask
  onEdit: (task: BoardTask) => void
}) {
  const priority = PRIORITIES.find((item) => item.value === task.priority)

  return (
    <button className="task-card w-full text-left" onClick={() => onEdit(task)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${priority?.tone}`}
          >
            {priority?.label}
          </span>
          <h4 className="mt-3 text-lg font-semibold leading-snug">{task.title}</h4>
        </div>
        <EllipsisHorizontalIcon className="h-5 w-5 text-copy" />
      </div>
      {task.description ? (
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-copy">{task.description}</p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-copy">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDaysIcon className="h-4 w-4" />
          {formatDateLabel(task.dueDate)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <UserCircleIcon className="h-4 w-4" />
          {task.assigneeName || 'Unassigned'}
        </span>
      </div>
    </button>
  )
}
