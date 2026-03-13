import { FormSection } from './FormSection'
import type { ResolvedFormDefinition } from '../../../src/types/engine.types'
import type { FieldValidationError } from '../../../src/types/validation.types'

interface DynamicFormProps {
  formDefinition: ResolvedFormDefinition
  formData: Record<string, unknown>
  onChange: (fieldName: string, value: unknown) => void
  onFieldSelect: (fieldName: string) => void
  onBlur?: (fieldName: string) => void
  validationErrors: Record<string, FieldValidationError[]>
}

export function DynamicForm({
  formDefinition,
  formData,
  onChange,
  onFieldSelect,
  onBlur,
  validationErrors,
}: DynamicFormProps) {
  const containerNames = Object.keys(formDefinition.containers)

  if (containerNames.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay containers visibles para este contexto.</p>
      </div>
    )
  }

  return (
    <div>
      {containerNames.map((containerName) => {
        const { container, fields } = formDefinition.containers[containerName]
        
        if (fields.length === 0) return null

        return (
          <FormSection
              key={containerName}
              container={container}
              fields={fields}
              formData={formData}
              onChange={onChange}
              onFieldSelect={onFieldSelect}
              onBlur={onBlur}
              validationErrors={validationErrors}
            />
        )
      })}
    </div>
  )
}
