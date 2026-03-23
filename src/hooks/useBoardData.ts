import { useEffect, useState } from 'react'
import { fetchBoardMembers, subscribeToBoard, subscribeToColumns, subscribeToTasks } from '../firebase/firestore'
import type { Board, BoardColumn, BoardTask, UserProfile } from '../types/models'

export function useBoardData(boardId?: string) {
  const [board, setBoard] = useState<Board | null>(null)
  const [columns, setColumns] = useState<BoardColumn[]>([])
  const [tasks, setTasks] = useState<BoardTask[]>([])
  const [members, setMembers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!boardId) return

    const unsubscribeBoard = subscribeToBoard(boardId, async (nextBoard) => {
      setBoard(nextBoard)
      if (!nextBoard) {
        setMembers([])
        setLoading(false)
        return
      }

      const profiles = await fetchBoardMembers(nextBoard.memberIds || [])
      setMembers(profiles)
      setLoading(false)
    })

    const unsubscribeColumns = subscribeToColumns(boardId, setColumns)
    const unsubscribeTasks = subscribeToTasks(boardId, setTasks)

    return () => {
      unsubscribeBoard()
      unsubscribeColumns()
      unsubscribeTasks()
    }
  }, [boardId])

  return { board, columns, tasks, members, loading }
}
