import { useEffect, useMemo, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BoardCard } from '../../components/dashboard/BoardCard'
import { StatsCard } from '../../components/dashboard/StatsCard'
import { BoardModal } from '../../components/modals/BoardModal'
import { Button } from '../../components/ui/Button'
import { createBoard, subscribeToBoards } from '../../firebase/firestore'
import { useAuth } from '../../hooks/useAuth'
import type { Board } from '../../types/models'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [boards, setBoards] = useState<Board[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user?.email) return
    return subscribeToBoards(user.email, setBoards)
  }, [user?.email])

  const overview = useMemo(() => {
    const memberCount = boards.reduce((sum, board) => sum + board.memberEmails.length, 0)

    return {
      boards: boards.length.toString().padStart(2, '0'),
      collaborators: `${memberCount}`,
      active: `${boards.filter((board) => board.pendingInviteEmails.length === 0).length}`,
    }
  }, [boards])

  return (
    <div className="space-y-6">
      <section className="surface-panel overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="label-text">Dashboard</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
              Welcome back, {profile?.firstName || 'friend'}.
              <span className="block text-[#753991]">Let the work surface stay light.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-8 text-copy sm:text-base">
              Review your shared boards, jump into a project, or create a new collaborative
              space with just enough structure to keep momentum.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => setOpen(true)}>
                <PlusIcon className="h-4 w-4" />
                Create a board
              </Button>
              {boards[0] ? (
                <Button variant="secondary" onClick={() => navigate(`/boards/${boards[0].id}`)}>
                  Open latest board
                </Button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <StatsCard
              label="Shared boards"
              value={overview.boards}
              detail="Distinct workspaces you can access right now."
            />
            <StatsCard
              label="Collaborators"
              value={overview.collaborators}
              detail="Cumulative board member count across your spaces."
            />
            <StatsCard
              label="Ready to move"
              value={overview.active}
              detail="Boards without pending invite follow-up."
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="label-text">Your boards</p>
              <h2 className="mt-3 text-3xl font-semibold">Shared project spaces</h2>
            </div>
            <Button variant="secondary" onClick={() => setOpen(true)}>
              New board
            </Button>
          </div>
          {boards.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {boards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          ) : (
            <div className="surface-soft p-8 text-center">
              <p className="label-text">Empty state</p>
              <h3 className="mt-3 text-2xl font-semibold">No boards yet</h3>
              <p className="mt-4 text-sm leading-7 text-copy">
                Create your first workspace and invite your friends to start planning together.
              </p>
            </div>
          )}
        </div>

        <div className="surface-panel p-6 sm:p-8">
          <p className="label-text">Quick overview</p>
          <h2 className="mt-3 text-3xl font-semibold">A refined glance at your setup</h2>
          <div className="mt-8 space-y-4">
            {boards.slice(0, 4).map((board, index) => (
              <button
                key={board.id}
                className="surface-soft flex w-full items-center justify-between p-5 text-left transition hover:-translate-y-0.5"
                onClick={() => navigate(`/boards/${board.id}`)}
              >
                <div>
                  <p className="label-text">Board {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-2 text-xl font-semibold">{board.name}</h3>
                  <p className="mt-2 text-sm text-copy">{board.memberEmails.length} members</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ink">
                    {board.pendingInviteEmails.length} pending
                  </p>
                  <p className="mt-1 text-xs text-copy">invite follow-ups</p>
                </div>
              </button>
            ))}
            {!boards.length ? (
              <div className="surface-soft p-6">
                <p className="text-sm leading-7 text-copy">
                  Once you create boards, this area becomes your quick overview for member
                  count, pending invites, and recently touched spaces.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <BoardModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async (values) => {
          if (!user?.email) return
          const boardId = await createBoard({
            name: values.name,
            description: values.description,
            ownerId: user.uid,
            ownerEmail: user.email,
          })
          toast.success('Board created')
          navigate(`/boards/${boardId}`)
        }}
      />
    </div>
  )
}
