export function StatsCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="surface-soft p-5">
      <p className="label-text">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm leading-7 text-copy">{detail}</p>
    </div>
  )
}
