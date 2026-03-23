import { format } from 'date-fns'
import { clsx, type ClassValue } from 'clsx'
import { Timestamp } from 'firebase/firestore'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initials(name?: string | null) {
  if (!name) return 'EB'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function formatDateLabel(value?: string | null) {
  if (!value) return 'No due date'
  return format(new Date(value), 'MMM d')
}

export function formatTimestamp(
  value?: Timestamp | Date | null,
  pattern = 'MMM d, yyyy',
) {
  if (!value) return 'Just now'
  const date = value instanceof Timestamp ? value.toDate() : value
  return format(date, pattern)
}

export function toDateInputValue(value?: Timestamp | string | null) {
  if (!value) return ''
  if (typeof value === 'string') return value.slice(0, 10)
  return value.toDate().toISOString().slice(0, 10)
}

export function sortByOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => a.order - b.order)
}
