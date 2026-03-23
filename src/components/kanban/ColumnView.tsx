import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '../ui/Button'
import { SortableTaskItem } from './SortableTaskItem'
import type { BoardColumn, BoardTask } from '../../types/models'
import { cn } from '../../lib/utils'

export function ColumnView({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onEditColumn,
  onDeleteColumn,
}: {
  column: BoardColumn
  tasks: BoardTask[]
  onAddTask: (columnId: string) => void
  onEditTask: (task: BoardTask) => void
  onEditColumn: (column: BoardColumn) => void
  onDeleteColumn: (column: BoardColumn) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: {
        type: 'column',
      },
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <section
      ref={setNodeRef}
      style={style}
      className={cn(
        'surface-panel flex w-[320px] shrink-0 flex-col p-4 sm:p-5',
        isDragging && 'opacity-60',
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <p className="label-text">Column {String(column.order + 1).padStart(2, '0')}</p>
          <h3 className="mt-2 text-xl font-semibold">{column.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="rounded-2xl p-2 text-copy transition hover:bg-white/70 hover:text-ink"
            onClick={() => onEditColumn(column)}
          >
            <PencilSquareIcon className="h-5 w-5" />
          </button>
          <button
            className="rounded-2xl p-2 text-copy transition hover:bg-white/70 hover:text-ink"
            onClick={() => onDeleteColumn(column)}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={cn('rounded-[22px] p-3', column.tone)}>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-copy">{tasks.length} tasks</span>
          <EllipsisHorizontalIcon className="h-5 w-5 text-copy" />
        </div>

        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <div className="scroll-thin space-y-3">
            {tasks.map((task) => (
              <SortableTaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </SortableContext>

        <Button
          variant="ghost"
          className="mt-4 w-full justify-center rounded-[20px] bg-white/55 py-3"
          onClick={() => onAddTask(column.id)}
        >
          <PlusIcon className="h-4 w-4" />
          New task
        </Button>
      </div>
    </section>
  )
}
