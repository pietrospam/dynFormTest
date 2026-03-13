import type { ValidatorFn } from '../types/validation.types'

/**
 * Validates that a string does not exceed the specified maximum length.
 */
export const maxLengthValidator: ValidatorFn = (
  value: unknown, 
  maxLength?: unknown
): boolean => {
  if (value === null || value === undefined || value === '') {
    return true // Empty values pass
  }
  
  const strValue = String(value)
  const max = typeof maxLength === 'number' ? maxLength : Infinity
  
  return strValue.length <= max
}
