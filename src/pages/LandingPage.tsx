import {
  ArrowRightIcon,
  ChartBarSquareIcon,
  RectangleGroupIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { Link, Navigate } from 'react-router-dom'
import { FirebaseNotice } from '../components/shared/FirebaseNotice'
import { useAuth } from '../hooks/useAuth'

export function LandingPage() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="editorial-page">
      <div className="page-inner flex min-h-screen flex-col gap-10">
        <header className="flex items-center justify-between gap-4 py-4">
          <div>
            <p className="label-text">Wspólny kanban</p>
            <h1 className="mt-2 text-2xl font-semibold">Editorial Boards</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="premium-button-secondary">
              Zaloguj się
            </Link>
            <Link to="/register" className="premium-button">
              Zacznij
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface-panel p-8 sm:p-10 lg:p-12">
            <p className="label-text">Editorialny przepływ pracy</p>
            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-6xl">
              Wspólne tablice z lekkim rytmem pracy przypominającym eleganckie studio.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-copy">
              Organizuj projekty ze znajomymi, zapraszaj współpracowników, przydzielaj
              zadania i przesuwaj eleganckie karty w spokojnym systemie kanban.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/register" className="premium-button">
                Utwórz profil
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link to="/login" className="premium-button-secondary">
                Przejdź do aplikacji
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="surface-soft p-6">
              <ChartBarSquareIcon className="h-8 w-8 text-[#753991]" />
              <h3 className="mt-6 text-2xl font-semibold">Redakcyjny przegląd</h3>
              <p className="mt-3 text-sm leading-7 text-copy">
                Pulpit oparty na przestrzeni, nie chaosie, z podsumowaniami tablic,
                terminami i szybkim wglądem w postęp.
              </p>
            </div>
            <div className="surface-soft p-6">
              <RectangleGroupIcon className="h-8 w-8 text-[#209dd7]" />
              <h3 className="mt-6 text-2xl font-semibold">Płynny ruch kanban</h3>
              <p className="mt-3 text-sm leading-7 text-copy">
                Przesuwaj karty między unoszącymi się kolumnami, edytuj szczegóły w
                matowych modalach i utrzymuj porządek pracy.
              </p>
            </div>
            <div className="surface-soft p-6">
              <UserGroupIcon className="h-8 w-8 text-[#ecad0a]" />
              <h3 className="mt-6 text-2xl font-semibold">Współpraca w małej grupie</h3>
              <p className="mt-3 text-sm leading-7 text-copy">
                Zbudowane do praktycznego użycia przez znajomych i małe zespoły, gotowe
                do publikacji na GitHub Pages.
              </p>
            </div>
          </div>
        </section>
        <FirebaseNotice />
      </div>
    </div>
  )
}
