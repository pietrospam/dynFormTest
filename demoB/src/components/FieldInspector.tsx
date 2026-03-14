import { Card } from './ui'
import type { ResolvedField } from '../../../src/types/engine.types'

interface FieldInspectorProps {
  field: ResolvedField | null
}

export function FieldInspector({ field }: FieldInspectorProps) {
  if (!field) {
    return (
      <Card title="Inspector">
        <p className="text-gray-500 text-sm">
          Hacé click en un campo para ver su información.
        </p>
      </Card>
    )
  }

  return (
    <Card title="Inspector">
      <div className="space-y-3 text-sm">
        {/* Field Name */}
        <div>
          <span className="font-medium text-gray-700">Campo:</span>
          <span className="ml-2 font-mono text-blue-600">{field.name}</span>
        </div>

        {/* Container */}
        <div>
          <span className="font-medium text-gray-700">Container:</span>
          <span className="ml-2 text-gray-600">{field.container}</span>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="visible" value={field.visible} />
          <StatusBadge label="enabled" value={field.enabled} />
          <StatusBadge label="required" value={field.required} />
        </div>

        {/* Data Type */}
        <div>
          <span className="font-medium text-gray-700">Tipo de dato:</span>
          <span className="ml-2 text-gray-600">{field.dataType}</span>
        </div>

        {/* Default Value */}
        <div>
          <span className="font-medium text-gray-700">Valor por defecto:</span>
          <span className="ml-2 font-mono text-gray-600">
            {JSON.stringify(field.defaultValue)}
          </span>
        </div>

        {/* UI Component */}
        <div>
          <span className="font-medium text-gray-700">Componente:</span>
          <span className="ml-2 text-gray-600">{field.ui.component}</span>
        </div>

        {/* Validations */}
        {field.validations.length > 0 && (
          <div>
            <span className="font-medium text-gray-700 block mb-1">
              Validaciones:
            </span>
            <ul className="list-disc list-inside text-gray-600 text-xs space-y-1">
              {field.validations.map((v, i) => (
                <li key={i}>
                  <span className="font-mono">{v.type}</span>
                  {v.value !== undefined && (
                    <span className="text-gray-400">
                      {' '}= {JSON.stringify(v.value)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Options (for Select) */}
        {field.options && field.options.length > 0 && (
          <div>
            <span className="font-medium text-gray-700 block mb-1">
              Opciones:
            </span>
            <ul className="list-disc list-inside text-gray-600 text-xs space-y-1">
              {field.options.map((opt, i) => (
                <li key={i}>
                  {opt.label}
                  <span className="text-gray-400"> ({opt.value || 'vacío'})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}

function StatusBadge({ label, value }: { label: string; value: boolean }) {
  return (
    <span
      className={`
        px-2 py-0.5 rounded text-xs font-medium
        ${value 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
        }
      `}
    >
      {label}: {value ? 'true' : 'false'}
    </span>
  )
}
