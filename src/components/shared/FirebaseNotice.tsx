export function FirebaseNotice() {
  return (
    <div className="surface-glass max-w-2xl p-6 text-left">
      <p className="label-text">Tryb lokalny</p>
      <h2 className="mt-3 text-2xl font-semibold">Ta wersja działa w całości w przeglądarce</h2>
      <p className="mt-4 text-sm leading-7 text-copy">
        Profile, tablice, kolumny i zadania są zapisywane w pamięci przeglądarki,
        więc możesz korzystać z aplikacji od razu, bez backendu.
      </p>
    </div>
  )
}
