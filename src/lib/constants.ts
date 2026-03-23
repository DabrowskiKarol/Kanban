export const PRIORITIES = [
  { value: 'low', label: 'Low', tone: 'bg-sky-100 text-sky-700' },
  { value: 'medium', label: 'Medium', tone: 'bg-violet-100 text-violet-700' },
  { value: 'high', label: 'High', tone: 'bg-amber-100 text-amber-700' },
] as const

export const COLUMN_TONES = [
  'bg-white/78',
  'bg-[#f9f5ff]/82',
  'bg-[#eef8fd]/86',
  'bg-[#fffaf0]/88',
  'bg-[#efe0ff]/92',
  'bg-[#dff3ff]/94',
  'bg-[#ffe7bf]/94',
  'bg-[#ffdce8]/94',
  'bg-[#dff6eb]/94',
  'bg-[#ffe1f7]/94',
  'bg-[#e5e4ff]/94',
  'bg-[#ffe0d6]/94',
] as const

export const DEFAULT_COLUMNS = [
  { title: 'Backlog', order: 0, tone: 'bg-white/78' },
  { title: 'In Motion', order: 1, tone: 'bg-[#f9f5ff]/82' },
  { title: 'Review', order: 2, tone: 'bg-[#eef8fd]/86' },
  { title: 'Done', order: 3, tone: 'bg-[#fffaf0]/88' },
]
