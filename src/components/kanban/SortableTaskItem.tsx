import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BoardTask } from '../../types/models'
import { TaskCard } from './TaskCard'

export function SortableTaskItem({
  task,
  onEdit,
}: {
  task: BoardTask
  onEdit: (task: BoardTask) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? 'opacity-70' : undefined}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} onEdit={onEdit} />
    </div>
  )
}
