import { useMemo, useState } from 'react'
import { jsonConfigs, type JsonConfigKey } from '../config/jsonConfigs'
import { Button } from './ui'

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function ConfigEditor() {
  const files = useMemo(() => Object.keys(jsonConfigs) as JsonConfigKey[], [])
  const [selected, setSelected] = useState<JsonConfigKey>(files[0])
  const [text, setText] = useState(() =>
    JSON.stringify(jsonConfigs[files[0]], null, 2)
  )
  const [error, setError] = useState<string | null>(null)

  const parsed = useMemo(() => {
    try {
      return JSON.parse(text)
    } catch (err: unknown) {
      return null
    }
  }, [text])

  const validate = () => {
    try {
      JSON.parse(text)
      setError(null)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      return false
    }
  }

  const handleFileChange = (file: JsonConfigKey) => {
    setSelected(file)
    setText(JSON.stringify(jsonConfigs[file], null, 2))
    setError(null)
  }

  const handleDownload = () => {
    if (!validate()) return
    downloadText(selected, text)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // ignore
    }
  }

  const handleReset = () => {
    setText(JSON.stringify(jsonConfigs[selected], null, 2))
    setError(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <label className="text-sm font-medium">Archivo:</label>
        <select
          value={selected}
          onChange={(e) => handleFileChange(e.target.value as JsonConfigKey)}
          className="px-2 py-1 border rounded"
        >
          {files.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>

        <Button onClick={validate} variant="secondary">
          Validar JSON
        </Button>

        <Button onClick={handleDownload} disabled={!parsed}>
          Descargar
        </Button>

        <Button onClick={handleCopy} variant="secondary">
          Copiar al portapapeles
        </Button>

        <Button onClick={handleReset} variant="secondary">
          Restaurar
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600">Error al parsear JSON: {error}</div>
      )}

      <textarea
        className="w-full h-[400px] p-3 border rounded font-mono text-sm bg-white"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="text-xs text-gray-500">
        Nota: los cambios no se escriben directamente en los archivos del proyecto.
        Descargá el JSON y reemplazá el archivo correspondiente en <code>config/</code>.
      </div>
    </div>
  )
}
