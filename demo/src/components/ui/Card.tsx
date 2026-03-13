import React from 'react'

interface CardProps {
  title?: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function Card({ title, children, disabled, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        ${disabled ? 'opacity-60' : ''}
        ${className}
      `}
    >
      {title && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            {title}
            {disabled && (
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                Solo lectura
              </span>
            )}
          </h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}
