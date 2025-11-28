import { Link } from 'react-router-dom'

export const NotFoundPage = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
    <p className="text-sm uppercase tracking-widest text-brand">404</p>
    <h1 className="text-3xl font-semibold text-brand">This page checked out</h1>
    <p className="max-w-md text-sm text-gray-600">
      The Hotel Willa concierge couldn’t find that page. Choose a category from the navigation or return home.
    </p>
    <Link to="/" className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white">
      Return to home
    </Link>
  </div>
)

