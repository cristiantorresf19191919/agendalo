import Link from 'next/link';

export default function RootNotFound() {
  return (
    <html lang="es" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="h-32 w-32 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
            <span className="text-5xl">✂️</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-4">404</h1>
          <h2 className="text-xl font-semibold mb-2">Página no encontrada</h2>
          <p className="text-sm text-zinc-500 mb-8">Parece que esta página se fue a una cita y no volvió</p>
          <Link
            href="/es"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </body>
    </html>
  );
}
