interface Option {
  value: string
  label: string
}

interface SelectProps {
  label: string
  value: string | null
  onChange: (value: string | null) => void
  onFocus?: () => void
  onBlur?: () => void
  options: Option[]
  disabled?: boolean
  required?: boolean
  error?: string
}

export function Select({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  options,
  disabled,
  required,
  error,
}: SelectProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
