import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import type { Board } from '../../types/models'
import { formatTimestamp } from '../../lib/utils'

export function BoardCard({ board }: { board: Board }) {
  return (
    <Link
      to={`/boards/${board.id}`}
      className="surface-panel flex h-full flex-col justify-between p-6 transition hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(3,33,71,0.11)]"
    >
      <div>
        <p className="label-text">Wspólna tablica</p>
        <div className="mt-4 flex items-start justify-between gap-4">
          <h3 className="text-2xl font-semibold">{board.name}</h3>
          <ArrowUpRightIcon className="h-5 w-5 text-copy" />
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-copy">
          {board.description || 'Spokojna, wspólna przestrzeń do skupionej pracy.'}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between text-xs text-copy">
        <span>{board.memberEmails.length} członków</span>
        <span>Aktualizacja {formatTimestamp(board.updatedAt, 'MMM d')}</span>
      </div>
    </Link>
  )
}
