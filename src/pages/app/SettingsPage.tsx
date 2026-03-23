export function SettingsPage() {
  return (
    <div className="grid gap-6">
      <section className="surface-panel p-6 sm:p-8">
        <p className="label-text">Ustawienia</p>
        <h1 className="mt-3 text-4xl font-semibold">Informacje o wdrożeniu projektu</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="surface-soft p-5">
            <h2 className="text-2xl font-semibold">Przyjazne dla hostingu statycznego</h2>
            <p className="mt-3 text-sm leading-7 text-copy">
              Aplikacja używa `HashRouter`, więc hosting statyczny na `github.io` działa
              poprawnie bez dodatkowych przekierowań po stronie serwera.
            </p>
          </div>
          <div className="surface-soft p-5">
            <h2 className="text-2xl font-semibold">Lokalne zapisywanie danych</h2>
            <p className="mt-3 text-sm leading-7 text-copy">
              Profile i dane tablic są zapisywane lokalnie w przeglądarce, dzięki czemu
              ta wersja jest łatwa do pokazania i udostępnienia bez konfiguracji backendu.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
