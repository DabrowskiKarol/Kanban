export function FirebaseNotice() {
  return (
    <div className="surface-glass max-w-2xl p-6 text-left">
      <p className="label-text">Local mode</p>
      <h2 className="mt-3 text-2xl font-semibold">This version runs fully in your browser</h2>
      <p className="mt-4 text-sm leading-7 text-copy">
        Profiles, boards, columns, and tasks are stored in local browser storage so you
        can use the app immediately without a backend.
      </p>
    </div>
  )
}
