export const Footer = () => (
  <footer className="bg-brand text-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-lg font-semibold">Hotel Willa</p>
        <p className="text-sm text-white/80">Where thoughtful stays meet modern luxury.</p>
      </div>
      <div className="text-sm text-white/80">
        <p>Media & assets in `backend/media/seed/`. Replace with your own.</p>
        <p>&copy; {new Date().getFullYear()} Hotel Willa. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

