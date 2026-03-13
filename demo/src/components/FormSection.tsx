import { Card } from './ui'
import { FieldRenderer } from './FieldRenderer'
import type { ResolvedContainer, ResolvedField } from '../../../src/types/engine.types'
import type { FieldValidationError } from '../../../src/types/validation.types'

interface FormSectionProps {
  container: ResolvedContainer
  fields: ResolvedField[]
  formData: Record<string, unknown>
  onChange: (fieldName: string, value: unknown) => void
  onFieldSelect: (fieldName: string) => void
  onBlur?: (fieldName: string) => void
  validationErrors: Record<string, FieldValidationError[]>
}

export function FormSection({
  container,
  fields,
  formData,
  onChange,
  onFieldSelect,
  onBlur,
  validationErrors,
}: FormSectionProps) {
  return (
    <Card title={container.label} disabled={!container.enabled} className="mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <FieldRenderer
            key={field.name}
            field={field}
            value={formData[field.name]}
            onChange={(value) => onChange(field.name, value)}
            onFocus={() => onFieldSelect(field.name)}
            onBlur={() => onBlur?.(field.name)}
            error={validationErrors[field.name]?.[0]?.message}
          />
        ))}
      </div>
    </Card>
  )
}
