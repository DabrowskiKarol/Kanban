import { Link } from 'react-router-dom'

export function ForgotPasswordPage() {
  return (
    <div className="surface-glass p-6 sm:p-8">
      <p className="label-text">No password needed</p>
      <h2 className="mt-3 text-3xl font-semibold">This build uses a local profile flow</h2>
      <p className="mt-4 text-sm leading-7 text-copy">
        Just go back and enter your name to continue, or create a fresh profile with a
        photo in the registration view.
      </p>
      <p className="mt-6 text-sm text-copy">
        <Link to="/login" className="font-semibold text-[#753991]">
          Back to log in
        </Link>
      </p>
    </div>
  )
}
