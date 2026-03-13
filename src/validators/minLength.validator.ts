import type { ValidatorFn } from '../types/validation.types'

/**
 * Validates that a string has at least the specified minimum length.
 */
export const minLengthValidator: ValidatorFn = (
  value: unknown, 
  minLength?: unknown
): boolean => {
  if (value === null || value === undefined || value === '') {
    return true // Empty values pass - use required for mandatory
  }
  
  if (typeof value !== 'string') {
    return true // Non-string values are not validated for length
  }
  
  const min = typeof minLength === 'number' ? minLength : 0
  return value.length >= min
}
