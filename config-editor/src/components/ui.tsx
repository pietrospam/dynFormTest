import React from 'react'

export function Button({
  children,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }) {
  const base =
    'px-3 py-2 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500'
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : variant === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'

  return (
    <button className={`${base} ${styles}`} type="button" {...props}>
      {children}
    </button>
  )
}

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
    </label>
  )
}

export function Textarea({
  label,
  value,
  onChange,
  rows = 10,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
  disabled?: boolean
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <textarea
        className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        disabled={disabled}
      />
    </label>
  )
}

export function Select({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  disabled?: boolean
}) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <select
        className="mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  )
}
