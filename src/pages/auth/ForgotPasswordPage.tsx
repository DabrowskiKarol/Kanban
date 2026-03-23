import { Link } from 'react-router-dom'

export function ForgotPasswordPage() {
  return (
    <div className="surface-glass p-6 sm:p-8">
      <p className="label-text">Hasło nie jest potrzebne</p>
      <h2 className="mt-3 text-3xl font-semibold">Ta wersja używa lokalnego profilu</h2>
      <p className="mt-4 text-sm leading-7 text-copy">
        Po prostu wróć i wpisz swoje imię oraz nazwisko, aby kontynuować,
        albo utwórz nowy profil ze zdjęciem na ekranie rejestracji.
      </p>
      <p className="mt-6 text-sm text-copy">
        <Link to="/login" className="font-semibold text-[#753991]">
          Wróć do logowania
        </Link>
      </p>
    </div>
  )
}
