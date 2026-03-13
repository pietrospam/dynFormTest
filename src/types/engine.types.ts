import type { 
  FieldUIConfig, 
  ContainerUIConfig, 
  OptionItem, 
  ValidationRule 
} from './config.types'

// ============================================
// Engine Types - Resolved definitions
// ============================================

// Context object for form resolution
export interface FormContext {
  operationType: string
  operationStatus: string
  [key: string]: unknown
}

// Resolved container definition
export interface ResolvedContainer {
  name: string
  label: string
  visible: boolean
  enabled: boolean
  ui: ContainerUIConfig
}

// Resolved field definition
export interface ResolvedField {
  name: string
  container: string
  dataType: 'string' | 'number' | 'boolean'
  label: string
  defaultValue: unknown
  allowEmpty: boolean
  visible: boolean
  enabled: boolean
  required: boolean
  ui: FieldUIConfig
  options?: OptionItem[]
  validations: ValidationRule[]
}

// Form data object
export type FormData = Record<string, unknown>

// Resolved form definition grouped by containers
export interface ResolvedFormDefinition {
  containers: Record<string, {
    container: ResolvedContainer
    fields: ResolvedField[]
  }>
}

// Initial values object
export type InitialValues = Record<string, unknown>
