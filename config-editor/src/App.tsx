import { useMemo, useState } from 'react'
import { ConfigEditor } from './components/config/ConfigEditor'

export default function App() {
  const [view, setView] = useState<'editor' | 'about'>('editor')

  const title = useMemo(() => {
    if (view === 'about') return 'Acerca de'
    return 'DynForm Config Editor'
  }, [view])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600">Editor visual + JSON para las configuraciones del motor de formularios.</p>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded text-sm font-medium ${
                view === 'editor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
              onClick={() => setView('editor')}
            >
              Editor
            </button>
            <button
              className={`px-3 py-2 rounded text-sm font-medium ${
                view === 'about'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700'
              }`}
              onClick={() => setView('about')}
            >
              Acerca
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {view === 'editor' ? (
          <ConfigEditor />
        ) : (
          <div className="bg-white border rounded p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Acerca del editor</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Esta aplicación permite editar las configuraciones JSON que utiliza el motor de formularios.
              El modo visual ofrece formularios para manipular estructuras comunes y el modo JSON permite editar
              el contenido directamente.
            </p>
            <p className="mt-4 text-sm text-gray-700">
              Los cambios no se guardan automáticamente en el repositorio. Utilizá el botón "Descargar" para exportar
              el archivo y reemplazarlo manualmente en <code>config/</code> si querés que se apliquen en el código.
            </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-gray-500 text-center">
          DynForm Config Editor — Proyecto de edición de configuraciones.
        </div>
      </footer>
    </div>
  )
}
