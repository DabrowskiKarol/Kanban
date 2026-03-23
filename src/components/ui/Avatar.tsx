import { initials } from '../../lib/utils'

export function Avatar({
  src,
  name,
  className = '',
}: {
  src?: string | null
  name?: string | null
  className?: string
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`h-11 w-11 rounded-2xl object-cover shadow-[0_12px_28px_rgba(3,33,71,0.12)] ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-[#032147] text-sm font-semibold text-white shadow-[0_12px_28px_rgba(3,33,71,0.18)] ${className}`}
    >
      {initials(name)}
    </div>
  )
}
