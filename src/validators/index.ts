import { requiredValidator } from './required.validator'
import { numericValidator } from './numeric.validator'
import { positiveValidator } from './positive.validator'
import { minLengthValidator } from './minLength.validator'
import { maxLengthValidator } from './maxLength.validator'
import type { ValidatorFn } from '../types/validation.types'

/**
 * oneOf validator - checks if value is in allowed list
 */
export const oneOfValidator: ValidatorFn = (
  value: unknown, 
  allowedValues?: unknown
): boolean => {
  if (value === null || value === undefined || value === '') {
    return true // Empty values pass - use required for mandatory
  }
  
  if (!Array.isArray(allowedValues)) {
    return true
  }
  
  return allowedValues.includes(value)
}

/**
 * min validator - checks if numeric value is >= minimum
 */
export const minValidator: ValidatorFn = (
  value: unknown, 
  minValue?: unknown
): boolean => {
  if (value === null || value === undefined || value === '') {
    return true
  }
  
  const num = typeof value === 'number' ? value : Number(value)
  const min = typeof minValue === 'number' ? minValue : -Infinity
  
  if (isNaN(num)) {
    return true
  }
  
  return num >= min
}

/**
 * max validator - checks if numeric value is <= maximum
 */
export const maxValidator: ValidatorFn = (
  value: unknown, 
  maxValue?: unknown
): boolean => {
  if (value === null || value === undefined || value === '') {
    return true
  }
  
  const num = typeof value === 'number' ? value : Number(value)
  const max = typeof maxValue === 'number' ? maxValue : Infinity
  
  if (isNaN(num)) {
    return true
  }
  
  return num <= max
}

/**
 * range validator - checks if numeric value is within range [min, max]
 */
export const rangeValidator: ValidatorFn = (
  value: unknown, 
  rangeValue?: unknown
): boolean => {
  if (value === null || value === undefined || value === '') {
    return true
  }
  
  const num = typeof value === 'number' ? value : Number(value)
  
  if (isNaN(num)) {
    return true
  }
  
  if (!Array.isArray(rangeValue) || rangeValue.length !== 2) {
    return true
  }
  
  const [min, max] = rangeValue as [number, number]
  return num >= min && num <= max
}

// Validator registry
export const validators: Record<string, ValidatorFn> = {
  required: requiredValidator,
  numeric: numericValidator,
  positive: positiveValidator,
  minLength: minLengthValidator,
  maxLength: maxLengthValidator,
  oneOf: oneOfValidator,
  min: minValidator,
  max: maxValidator,
  range: rangeValidator,
}

export {
  requiredValidator,
  numericValidator,
  positiveValidator,
  minLengthValidator,
  maxLengthValidator,
}
