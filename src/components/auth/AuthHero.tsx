export function AuthHero() {
  return (
    <div className="surface-panel relative overflow-hidden p-6 sm:p-8 lg:p-10">
      <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-b from-[#753991]/12 to-transparent blur-3xl" />
      <p className="label-text">Editorial Efficiency</p>
      <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
        Wspólne projekty, które przypominają eleganckie studio pracy, a nie generyczny dashboard.
      </h1>
      <p className="mt-6 max-w-lg text-sm leading-7 text-copy sm:text-base">
        Przestrzenne planowanie, elegancki ruch i wspólny system tablic dla małych
        zespołów, które chcą więcej spokoju i mniej chaosu.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="surface-soft p-5">
          <p className="text-4xl font-semibold text-ink">4</p>
          <p className="mt-2 text-sm text-copy">Domyślne kolumny do szybkiego startu</p>
        </div>
        <div className="surface-soft p-5">
          <p className="text-4xl font-semibold text-ink">100%</p>
          <p className="mt-2 text-sm text-copy">Wersja frontend-only gotowa pod GitHub Pages</p>
        </div>
      </div>
    </div>
  )
}
