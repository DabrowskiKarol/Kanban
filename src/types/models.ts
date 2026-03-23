import { Timestamp } from 'firebase/firestore'

export type TaskPriority = 'low' | 'medium' | 'high'

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  displayName: string
  photoURL: string
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface SessionUser {
  uid: string
  email: string
  displayName: string
  photoURL: string
}

export interface Board {
  id: string
  name: string
  description: string
  ownerId: string
  memberIds: string[]
  memberEmails: string[]
  pendingInviteEmails: string[]
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface BoardColumn {
  id: string
  title: string
  order: number
  tone: string
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface BoardTask {
  id: string
  title: string
  description: string
  columnId: string
  order: number
  priority: TaskPriority
  dueDate: string | null
  assigneeId: string | null
  assigneeName: string | null
  createdBy: string
  createdByName: string
  createdAt?: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface BoardSummary {
  board: Board
  columns: BoardColumn[]
  tasks: BoardTask[]
  members: UserProfile[]
}
