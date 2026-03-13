import { Card, Button } from './ui'
import { operationTypes, operationStatuses } from '../config'
import type { FormContext } from '../../../src/types/engine.types'

interface ControlPanelProps {
  context: FormContext
  onContextChange: (context: FormContext) => void
  onValidate: () => void
  onReset: () => void
}

export function ControlPanel({
  context,
  onContextChange,
  onValidate,
  onReset,
}: ControlPanelProps) {
  return (
    <Card title="Panel de Control">
      <div className="space-y-4">
        {/* Operation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Operación
          </label>
          <select
            value={context.operationType}
            onChange={(e) =>
              onContextChange({ ...context, operationType: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {operationTypes.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Operation Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado de Operación
          </label>
          <select
            value={context.operationStatus}
            onChange={(e) =>
              onContextChange({ ...context, operationStatus: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {operationStatuses.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Context Preview */}
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-xs text-gray-500 mb-1">Contexto actual:</p>
          <pre className="text-xs text-gray-700 overflow-auto">
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <Button onClick={onValidate} className="w-full">
            Validar Formulario
          </Button>
          <Button onClick={onReset} variant="secondary" className="w-full">
            Reset
          </Button>
        </div>
      </div>
    </Card>
  )
}
