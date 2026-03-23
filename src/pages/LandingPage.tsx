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
            <p className="label-text">Collaborative Kanban</p>
            <h1 className="mt-2 text-2xl font-semibold">Editorial Boards</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="premium-button-secondary">
              Log in
            </Link>
            <Link to="/register" className="premium-button">
              Start free
            </Link>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="surface-panel p-8 sm:p-10 lg:p-12">
            <p className="label-text">High-End Editorial Workflow</p>
            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-6xl">
              Shared boards with the calm, floating rhythm of a premium studio desk.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-copy">
              Organize projects with friends, invite collaborators by email, assign work,
              and move elegant task cards through a live kanban system powered by Firebase.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/register" className="premium-button">
                Create account
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link to="/login" className="premium-button-secondary">
                Continue to workspace
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="surface-soft p-6">
              <ChartBarSquareIcon className="h-8 w-8 text-[#753991]" />
              <h3 className="mt-6 text-2xl font-semibold">Editorial overview</h3>
              <p className="mt-3 text-sm leading-7 text-copy">
                A dashboard that leads with whitespace, not noise, plus board summaries,
                due dates, and quick insight into shared progress.
              </p>
            </div>
            <div className="surface-soft p-6">
              <RectangleGroupIcon className="h-8 w-8 text-[#209dd7]" />
              <h3 className="mt-6 text-2xl font-semibold">Fluid kanban motion</h3>
              <p className="mt-3 text-sm leading-7 text-copy">
                Move cards across floating columns, edit details in frosted modals, and
                keep every workspace member aligned in real time.
              </p>
            </div>
            <div className="surface-soft p-6">
              <UserGroupIcon className="h-8 w-8 text-[#ecad0a]" />
              <h3 className="mt-6 text-2xl font-semibold">Small-group collaboration</h3>
              <p className="mt-3 text-sm leading-7 text-copy">
                Built for practical shared use with Firebase Auth, Firestore, and Storage,
                ready to deploy on GitHub Pages.
              </p>
            </div>
          </div>
        </section>
        <FirebaseNotice />
      </div>
    </div>
  )
}
