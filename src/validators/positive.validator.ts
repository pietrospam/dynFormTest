import type { ValidatorFn } from '../types/validation.types'

/**
 * Validates that a numeric value is positive (greater than 0).
 */
export const positiveValidator: ValidatorFn = (value: unknown): boolean => {
  if (value === null || value === undefined || value === '') {
    return true // Empty values pass - use required for mandatory
  }
  
  const num = typeof value === 'number' ? value : Number(value)
  
  if (isNaN(num)) {
    return true // Non-numeric values are handled by numeric validator
  }
  
  return num > 0
}
