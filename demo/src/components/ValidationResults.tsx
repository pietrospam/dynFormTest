import { Card } from './ui'
import type { FormValidationResult } from '../../../src/types/validation.types'

interface ValidationResultsProps {
  result: FormValidationResult | null
}

export function ValidationResults({ result }: ValidationResultsProps) {
  if (!result) {
    return (
      <Card title="Resultado de Validación">
        <p className="text-gray-500 text-sm">
          Clickeá "Validar Formulario" para ver los resultados.
        </p>
      </Card>
    )
  }

  const errorFields = Object.keys(result.errors)

  return (
    <Card title="Resultado de Validación">
      {result.valid ? (
        <div className="flex items-center gap-2 text-green-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Formulario válido</span>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">
              {errorFields.length} campo{errorFields.length > 1 ? 's' : ''} con
              errores
            </span>
          </div>

          <ul className="space-y-2 text-sm">
            {errorFields.map((fieldName) => (
              <li key={fieldName} className="bg-red-50 p-2 rounded">
                <span className="font-mono text-red-700">{fieldName}</span>
                <ul className="ml-4 mt-1 text-red-600 list-disc list-inside">
                  {result.errors[fieldName].map((err, i) => (
                    <li key={i}>{err.message}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
