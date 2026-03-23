import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import {
  ArrowsPointingInIcon,
  ArrowsPointingOutIcon,
  CalendarDaysIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  RectangleStackIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline'
import { useOutletContext, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ColumnView } from '../../components/kanban/ColumnView'
import { ColumnModal } from '../../components/modals/ColumnModal'
import { InviteModal } from '../../components/modals/InviteModal'
import { TaskModal } from '../../components/modals/TaskModal'
import { Avatar } from '../../components/ui/Avatar'
import { Button } from '../../components/ui/Button'
import {
  createColumn,
  createTask,
  deleteColumn,
  deleteTask,
  inviteBoardMember,
  reorderTasks,
  updateColumn,
  updateTask,
} from '../../firebase/firestore'
import { useBoardData } from '../../hooks/useBoardData'
import { useAuth } from '../../hooks/useAuth'
import { sortByOrder } from '../../lib/utils'
import type { BoardColumn, BoardTask } from '../../types/models'

interface LayoutControls {
  sidebarHidden: boolean
  setSidebarHidden: (hidden: boolean) => void
}

export function BoardPage() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const { sidebarHidden, setSidebarHidden } = useOutletContext<LayoutControls>()
  const { board, columns, tasks, members, loading } = useBoardData(id)
  const [activeTask, setActiveTask] = useState<BoardTask | null>(null)
  const [taskColumnId, setTaskColumnId] = useState<string | null>(null)
  const [columnModalOpen, setColumnModalOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [taskOpen, setTaskOpen] = useState(false)
  const [editingColumn, setEditingColumn] = useState<BoardColumn | null>(null)
  const [draggingTask, setDraggingTask] = useState<BoardTask | null>(null)
  const [headerHidden, setHeaderHidden] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const tasksByColumn = useMemo(() => {
    return columns.reduce<Record<string, BoardTask[]>>((accumulator, column) => {
      accumulator[column.id] = sortByOrder(tasks.filter((task) => task.columnId === column.id))
      return accumulator
    }, {})
  }, [columns, tasks])

  const canAccess = Boolean(
    user &&
      board &&
      (board.memberIds.includes(user.uid) ||
        board.memberEmails.includes(user.email?.toLowerCase() || '')),
  )

  if (loading) {
    return (
      <div className="surface-panel p-10">
        <h1 className="text-3xl font-semibold">Ładowanie tablicy...</h1>
      </div>
    )
  }

  if (!board || !canAccess) {
    return (
      <div className="surface-panel p-10">
        <p className="label-text">Niedostępne</p>
        <h1 className="mt-3 text-3xl font-semibold">Ta tablica nie jest dla Ciebie dostępna.</h1>
      </div>
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((item) => item.id === event.active.id)
    setDraggingTask(task || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setDraggingTask(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const task = tasks.find((item) => item.id === active.id)
    if (!task) return

    const overTask = tasks.find((item) => item.id === over.id)
    const overIsColumn = over.data.current?.type === 'column'
    const targetColumnId = (overIsColumn ? String(over.id) : overTask?.columnId) || task.columnId

    const targetTasks = sortByOrder(
      tasks.filter((item) => item.columnId === targetColumnId && item.id !== task.id),
    )
    const insertIndex = overTask
      ? targetTasks.findIndex((item) => item.id === overTask.id)
      : targetTasks.length

    const reordered = [...targetTasks]
    reordered.splice(insertIndex < 0 ? reordered.length : insertIndex, 0, {
      ...task,
      columnId: targetColumnId,
    })

    const sourceTasks = sortByOrder(
      tasks.filter((item) => item.columnId === task.columnId && item.id !== task.id),
    )

    const updates = [
      ...reordered.map((item, index) => ({
        id: item.id,
        columnId: targetColumnId,
        order: index,
      })),
      ...(task.columnId === targetColumnId
        ? []
        : sourceTasks.map((item, index) => ({
            id: item.id,
            columnId: task.columnId,
            order: index,
          }))),
    ]

    try {
      await reorderTasks(board.id, updates)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Nie udało się przenieść zadania')
    }
  }

  const focusMode = sidebarHidden && headerHidden

  return (
    <div className="space-y-6">
      <section className="surface-panel overflow-hidden p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="label-text">Przestrzeń tablicy</p>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">{board.name}</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                const next = !sidebarHidden
                setSidebarHidden(next)
              }}
            >
              {sidebarHidden ? <EyeIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
              {sidebarHidden ? 'Pokaż panel boczny' : 'Ukryj panel boczny'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setHeaderHidden((current) => !current)}
            >
              {headerHidden ? <RectangleStackIcon className="h-4 w-4" /> : <EyeSlashIcon className="h-4 w-4" />}
              {headerHidden ? 'Pokaż przegląd' : 'Ukryj przegląd'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                const next = !focusMode
                setSidebarHidden(next)
                setHeaderHidden(next)
              }}
            >
              {focusMode ? <ArrowsPointingInIcon className="h-4 w-4" /> : <ArrowsPointingOutIcon className="h-4 w-4" />}
              {focusMode ? 'Wyjdź z trybu skupienia' : 'Powiększ tablicę'}
            </Button>
          </div>
        </div>

        {!headerHidden ? (
          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mt-1 max-w-3xl text-sm leading-8 text-copy sm:text-base">
                {board.description || 'Wspólna redakcyjna tablica do uporządkowanej i eleganckiej pracy.'}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    setActiveTask(null)
                    setTaskColumnId(columns[0]?.id || null)
                    setTaskOpen(true)
                  }}
                >
                  <PlusIcon className="h-4 w-4" />
                  Nowe zadanie
                </Button>
                <Button variant="secondary" onClick={() => setInviteOpen(true)}>
                  <UserPlusIcon className="h-4 w-4" />
                  Zaproś osobę
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingColumn(null)
                    setColumnModalOpen(true)
                  }}
                >
                  Dodaj kolumnę
                </Button>
              </div>
            </div>

            <div className="surface-soft p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="label-text">Przegląd</p>
                  <h2 className="mt-3 text-2xl font-semibold">Rytm zespołu</h2>
                </div>
                <span className="rounded-full bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-copy">
                  {tasks.length} zadań
                </span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {members.map((member) => (
                  <Avatar
                    key={member.id}
                    src={member.photoURL}
                    name={member.displayName}
                    className="-mr-2 border-4 border-[#f3f5fd]"
                  />
                ))}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] bg-white/60 p-4">
                  <p className="label-text">Wkrótce termin</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {
                      tasks.filter(
                        (task) =>
                          task.dueDate &&
                          new Date(task.dueDate) <= new Date(Date.now() + 3 * 86400000),
                      ).length
                    }
                  </p>
                </div>
                <div className="rounded-[22px] bg-white/60 p-4">
                  <p className="label-text">Oczekujące zaproszenia</p>
                  <p className="mt-2 text-2xl font-semibold">{board.pendingInviteEmails.length}</p>
                </div>
              </div>
              <div className="mt-6 rounded-[22px] bg-white/60 p-4 text-sm text-copy">
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-4 w-4" />
                  Dane tablicy odświeżają się na żywo w tej sesji.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setActiveTask(null)
                setTaskColumnId(columns[0]?.id || null)
                setTaskOpen(true)
              }}
            >
              <PlusIcon className="h-4 w-4" />
              Nowe zadanie
            </Button>
            <Button variant="secondary" onClick={() => setInviteOpen(true)}>
              <UserPlusIcon className="h-4 w-4" />
              Zaproś osobę
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setEditingColumn(null)
                setColumnModalOpen(true)
              }}
            >
              Dodaj kolumnę
            </Button>
          </div>
        )}
      </section>

      <section className={`surface-panel p-4 sm:p-5 ${focusMode ? 'min-h-[calc(100vh-11rem)]' : ''}`}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columns.map((column) => column.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className={`scroll-thin flex gap-5 overflow-x-auto pb-2 ${focusMode ? 'min-h-[calc(100vh-15rem)] items-start' : ''}`}>
              {columns.map((column) => (
                <ColumnView
                  key={column.id}
                  column={column}
                  tasks={tasksByColumn[column.id] || []}
                  onAddTask={(columnId) => {
                    setActiveTask(null)
                    setTaskColumnId(columnId)
                    setTaskOpen(true)
                  }}
                  onEditTask={(task) => {
                    setActiveTask(task)
                    setTaskColumnId(task.columnId)
                    setTaskOpen(true)
                  }}
                  onEditColumn={(nextColumn) => {
                    setEditingColumn(nextColumn)
                    setColumnModalOpen(true)
                  }}
                  onDeleteColumn={async (columnToDelete) => {
                    if ((tasksByColumn[columnToDelete.id] || []).length) {
                      toast.error('Przenieś zadania z tej kolumny przed jej usunięciem')
                      return
                    }
                    await deleteColumn(board.id, columnToDelete.id)
                    toast.success('Usunięto kolumnę')
                  }}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {draggingTask ? <div className="task-card w-[280px]">{draggingTask.title}</div> : null}
          </DragOverlay>
        </DndContext>
      </section>

      <InviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        onInvite={async (email) => {
          try {
            await inviteBoardMember(board.id, email)
            toast.success('Zapisano zaproszenie')
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Nie udało się zaprosić osoby')
          }
        }}
      />

      <ColumnModal
        open={columnModalOpen}
        onClose={() => {
          setColumnModalOpen(false)
          setEditingColumn(null)
        }}
        initialColumn={editingColumn}
        onSubmit={async (values) => {
          try {
            if (editingColumn) {
              await updateColumn(board.id, editingColumn.id, values)
              toast.success('Zaktualizowano kolumnę')
            } else {
              await createColumn(board.id, values.title, values.tone, columns.length)
              toast.success('Utworzono kolumnę')
            }
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Nie udało się zapisać kolumny')
          }
        }}
      />

      <TaskModal
        open={taskOpen}
        onClose={() => {
          setTaskOpen(false)
          setActiveTask(null)
          setTaskColumnId(null)
        }}
        initialTask={activeTask}
        columns={columns}
        members={members}
        onSubmit={async (values) => {
          try {
            const assignee = members.find((member) => member.id === values.assigneeId)
            if (activeTask) {
              await updateTask(board.id, activeTask.id, {
                title: values.title,
                description: values.description,
                columnId: values.columnId,
                priority: values.priority,
                dueDate: values.dueDate || null,
                assigneeId: values.assigneeId || null,
                assigneeName: assignee?.displayName || null,
              })
              toast.success('Zaktualizowano zadanie')
              return
            }

            await createTask(board.id, {
              title: values.title,
              description: values.description,
              columnId: values.columnId || taskColumnId || columns[0]?.id || '',
              priority: values.priority,
              dueDate: values.dueDate || null,
              assigneeId: values.assigneeId || null,
              assigneeName: assignee?.displayName || null,
              createdBy: user!.uid,
              createdByName: profile?.displayName || user?.displayName || 'Nieznany',
              order: tasks.filter(
                (task) =>
                  task.columnId === (values.columnId || taskColumnId || columns[0]?.id),
              ).length,
            })
            toast.success('Utworzono zadanie')
          } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Nie udało się zapisać zadania')
          }
        }}
        onDelete={
          activeTask
            ? async () => {
                await deleteTask(board.id, activeTask.id)
                toast.success('Usunięto zadanie')
              }
            : undefined
        }
      />
    </div>
  )
}
