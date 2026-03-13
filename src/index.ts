// Dynamic Form Rules Engine
// Main exports

export { FormRulesEngine } from './engine/FormRulesEngine'

// Type exports
export type {
  FormConfig,
  FieldDefinition,
  ContainerDefinition,
  FieldOptionsConfig,
  OptionItem,
  ValidationRule,
  ErrorCatalogEntry,
  OperationTypeRule,
  OperationStatusRule,
  FieldOverride,
  ContainerOverride,
} from './types/config.types'

export type {
  FormContext,
  ResolvedContainer,
  ResolvedField,
  ResolvedFormDefinition,
  FormData,
  InitialValues,
} from './types/engine.types'

export type {
  FieldValidationResult,
  FormValidationResult,
  FieldValidationError,
  ValidatorFn,
} from './types/validation.types'

// Validator exports (for extension)
export { validators } from './validators'
