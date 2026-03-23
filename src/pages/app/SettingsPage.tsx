export function SettingsPage() {
  return (
    <div className="grid gap-6">
      <section className="surface-panel p-6 sm:p-8">
        <p className="label-text">Settings</p>
        <h1 className="mt-3 text-4xl font-semibold">Project deployment notes</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="surface-soft p-5">
            <h2 className="text-2xl font-semibold">Static-friendly</h2>
            <p className="mt-3 text-sm leading-7 text-copy">
              The app uses HashRouter so static hosting works cleanly on github.io without
              server rewrites for private pages like board routes.
            </p>
          </div>
          <div className="surface-soft p-5">
            <h2 className="text-2xl font-semibold">Local persistence</h2>
            <p className="mt-3 text-sm leading-7 text-copy">
              Profiles and board data are saved in local browser storage, which makes this
              version easy to demo and share without backend setup.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
