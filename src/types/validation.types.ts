// ============================================
// Validation Types
// ============================================

// Single field validation error
export interface FieldValidationError {
  errorCode: string
  message: string
}

// Result of validating a single field
export interface FieldValidationResult {
  valid: boolean
  errors: FieldValidationError[]
}

// Result of validating the entire form
export interface FormValidationResult {
  valid: boolean
  errors: Record<string, FieldValidationError[]>
}

// Validator function signature
export type ValidatorFn = (
  value: unknown, 
  ruleValue?: unknown, 
  fieldName?: string
) => boolean
