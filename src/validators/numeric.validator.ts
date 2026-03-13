import type { ValidatorFn } from '../types/validation.types'

/**
 * Validates that a value is numeric.
 * Accepts numbers and numeric strings.
 */
export const numericValidator: ValidatorFn = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') {
    return true // Empty values pass - use required for mandatory
  }
  
  if (typeof value === 'number') {
    return !isNaN(value)
  }
  
  if (typeof value === 'string') {
    const num = Number(value)
    return !isNaN(num)
  }
  
  return false
}
