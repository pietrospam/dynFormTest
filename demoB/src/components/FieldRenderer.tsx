import { TextInput, NumberInput, Select, Textarea, Label } from './ui'
import type { ResolvedField } from '../../../src/types/engine.types'

interface FieldRendererProps {
  field: ResolvedField
  value: unknown
  onChange: (value: unknown) => void
  onFocus: () => void
  onBlur?: () => void
  error?: string
}

export function FieldRenderer({
  field,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
}: FieldRendererProps) {
  const { ui, label, enabled, required } = field

  switch (ui.component) {
    case 'TextInput':
      return (
        <TextInput
          label={label}
          value={String(value ?? '')}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={ui.placeholder}
          maxLength={ui.inputProps?.maxLength}
          disabled={!enabled}
          required={required}
          error={error}
        />
      )

    case 'NumberInput':
      return (
        <NumberInput
          label={label}
          value={value as number | null}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={ui.placeholder}
          disabled={!enabled}
          required={required}
          error={error}
        />
      )

    case 'Select':
      return (
        <Select
          label={label}
          value={value as string | null}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          options={field.options || []}
          disabled={!enabled}
          required={required}
          error={error}
        />
      )

    case 'Textarea':
      return (
        <Textarea
          label={label}
          value={String(value ?? '')}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={ui.placeholder}
          maxLength={ui.inputProps?.maxLength}
          disabled={!enabled}
          required={required}
          error={error}
        />
      )

    case 'Label':
      return <Label label={label} value={value} />

    default:
      return (
        <div className="text-gray-500 text-sm">
          Componente no soportado: {ui.component}
        </div>
      )
  }
}
