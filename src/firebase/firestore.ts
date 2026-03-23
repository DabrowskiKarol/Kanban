import { DEFAULT_COLUMNS } from '../lib/constants'
import {
  createId,
  getSessionUserId,
  readDatabase,
  subscribeStore,
  writeDatabase,
} from '../lib/localStore'
import type { Board, BoardColumn, BoardTask, UserProfile } from '../types/models'

type BoardPayload = {
  name: string
  description: string
  ownerId: string
  ownerEmail: string
}

type TaskPayload = {
  title: string
  description: string
  columnId: string
  priority: BoardTask['priority']
  dueDate: string | null
  assigneeId: string | null
  assigneeName: string | null
  createdBy: string
  createdByName: string
  order: number
}

export async function resolvePendingInvites(email: string, uid: string) {
  const normalizedEmail = email.toLowerCase()
  const database = readDatabase()
  const shouldUpdate = database.boards.some(
    (board) =>
      board.memberEmails.includes(normalizedEmail) &&
      !board.memberIds.includes(uid),
  )

  if (!shouldUpdate) return

  writeDatabase((current) => ({
    ...current,
    boards: current.boards.map((board) =>
      board.memberEmails.includes(normalizedEmail) && !board.memberIds.includes(uid)
        ? {
            ...board,
            memberIds: [...board.memberIds, uid],
            pendingInviteEmails: board.pendingInviteEmails.filter(
              (item) => item !== normalizedEmail,
            ),
          }
        : board,
    ),
  }))
}

export async function createBoard(payload: BoardPayload) {
  const boardId = createId()
  const board: Board = {
    id: boardId,
    name: payload.name,
    description: payload.description,
    ownerId: payload.ownerId,
    memberIds: [payload.ownerId],
    memberEmails: [payload.ownerEmail.toLowerCase()],
    pendingInviteEmails: [],
    createdAt: null,
    updatedAt: null,
  }

  writeDatabase((database) => ({
    ...database,
    boards: [board, ...database.boards],
    columnsByBoard: {
      ...database.columnsByBoard,
      [boardId]: DEFAULT_COLUMNS.map((column) => ({
        id: createId(),
        title: column.title,
        order: column.order,
        tone: column.tone,
        createdAt: null,
        updatedAt: null,
      })),
    },
    tasksByBoard: {
      ...database.tasksByBoard,
      [boardId]: [],
    },
  }))

  return boardId
}

export async function inviteBoardMember(boardId: string, email: string) {
  const normalizedEmail = email.trim().toLowerCase()

  writeDatabase((database) => ({
    ...database,
    boards: database.boards.map((board) =>
      board.id === boardId
        ? {
            ...board,
            memberEmails: Array.from(new Set([...board.memberEmails, normalizedEmail])),
            pendingInviteEmails: Array.from(
              new Set([...board.pendingInviteEmails, normalizedEmail]),
            ),
          }
        : board,
    ),
  }))
}

function getVisibleBoards() {
  const database = readDatabase()
  const sessionId = getSessionUserId()
  return database.boards.filter((board) => (sessionId ? board.memberIds.includes(sessionId) : true))
}

export function subscribeToBoards(email: string, callback: (boards: Board[]) => void) {
  void email

  const emit = () => callback(getVisibleBoards())
  emit()
  return subscribeStore(emit)
}

export function subscribeToBoard(boardId: string, callback: (board: Board | null) => void) {
  const emit = () => {
    callback(readDatabase().boards.find((item) => item.id === boardId) || null)
  }
  emit()
  return subscribeStore(emit)
}

export function subscribeToColumns(boardId: string, callback: (columns: BoardColumn[]) => void) {
  const emit = () => callback(readDatabase().columnsByBoard[boardId] || [])
  emit()
  return subscribeStore(emit)
}

export function subscribeToTasks(boardId: string, callback: (tasks: BoardTask[]) => void) {
  const emit = () => callback(readDatabase().tasksByBoard[boardId] || [])
  emit()
  return subscribeStore(emit)
}

export async function fetchBoardMembers(memberIds: string[]) {
  return readDatabase().profiles.filter((profile) => memberIds.includes(profile.id))
}

export function subscribeToUserProfile(
  userId: string,
  callback: (profile: UserProfile | null) => void,
) {
  const emit = () => callback(readDatabase().profiles.find((item) => item.id === userId) || null)
  emit()
  return subscribeStore(emit)
}

export async function updateUserProfile(
  userId: string,
  payload: Partial<Pick<UserProfile, 'firstName' | 'lastName' | 'displayName' | 'photoURL'>>,
) {
  writeDatabase((database) => ({
    ...database,
    profiles: database.profiles.map((profile) =>
      profile.id === userId ? { ...profile, ...payload } : profile,
    ),
  }))
}

export async function createColumn(boardId: string, title: string, tone: string, order: number) {
  writeDatabase((database) => ({
    ...database,
    columnsByBoard: {
      ...database.columnsByBoard,
      [boardId]: [
        ...(database.columnsByBoard[boardId] || []),
        { id: createId(), title, tone, order, createdAt: null, updatedAt: null },
      ],
    },
  }))
}

export async function updateColumn(
  boardId: string,
  columnId: string,
  payload: Partial<Pick<BoardColumn, 'title' | 'tone' | 'order'>>,
) {
  writeDatabase((database) => ({
    ...database,
    columnsByBoard: {
      ...database.columnsByBoard,
      [boardId]: (database.columnsByBoard[boardId] || []).map((column) =>
        column.id === columnId ? { ...column, ...payload } : column,
      ),
    },
  }))
}

export async function deleteColumn(boardId: string, columnId: string) {
  writeDatabase((database) => ({
    ...database,
    columnsByBoard: {
      ...database.columnsByBoard,
      [boardId]: (database.columnsByBoard[boardId] || []).filter((item) => item.id !== columnId),
    },
  }))
}

export async function createTask(boardId: string, payload: TaskPayload) {
  writeDatabase((database) => ({
    ...database,
    tasksByBoard: {
      ...database.tasksByBoard,
      [boardId]: [
        ...(database.tasksByBoard[boardId] || []),
        { id: createId(), ...payload, createdAt: null, updatedAt: null },
      ],
    },
  }))
}

export async function updateTask(
  boardId: string,
  taskId: string,
  payload: Partial<Omit<TaskPayload, 'createdBy' | 'createdByName'>>,
) {
  writeDatabase((database) => ({
    ...database,
    tasksByBoard: {
      ...database.tasksByBoard,
      [boardId]: (database.tasksByBoard[boardId] || []).map((task) =>
        task.id === taskId ? { ...task, ...payload } : task,
      ),
    },
  }))
}

export async function deleteTask(boardId: string, taskId: string) {
  writeDatabase((database) => ({
    ...database,
    tasksByBoard: {
      ...database.tasksByBoard,
      [boardId]: (database.tasksByBoard[boardId] || []).filter((task) => task.id !== taskId),
    },
  }))
}

export async function reorderTasks(
  boardId: string,
  updates: Array<{ id: string; columnId: string; order: number }>,
) {
  writeDatabase((database) => ({
    ...database,
    tasksByBoard: {
      ...database.tasksByBoard,
      [boardId]: (database.tasksByBoard[boardId] || []).map((task) => {
        const update = updates.find((item) => item.id === task.id)
        return update ? { ...task, columnId: update.columnId, order: update.order } : task
      }),
    },
  }))
}

export async function getBoard(boardId: string) {
  return readDatabase().boards.find((board) => board.id === boardId) || null
}
