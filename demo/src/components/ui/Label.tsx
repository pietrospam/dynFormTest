interface LabelProps {
  label: string
  value: unknown
  className?: string
}

export function Label({ label, value, className }: LabelProps) {
  return (
    <div className={className}>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      <div className="mt-1 text-sm text-gray-900">{String(value ?? '')}</div>
    </div>
  )
}
