// ============================================
// Configuration Types for Dynamic Form Rules Engine
// ============================================

// UI Component types
export type UIComponentType = 'TextInput' | 'Select' | 'NumberInput' | 'Textarea' | 'Section' | string

// Input props for UI components
export interface InputProps {
  maxLength?: number
  minLength?: number
  [key: string]: unknown
}

// UI configuration for fields
export interface FieldUIConfig {
  component: UIComponentType
  placeholder?: string
  inputProps?: InputProps
}

// UI configuration for containers
export interface ContainerUIConfig {
  component: UIComponentType
}

// Base field definition from fieldDefinitions.json
export interface FieldDefinition {
  container: string
  dataType: 'string' | 'number' | 'boolean'
  label: string
  defaultValue: unknown
  allowEmpty: boolean
  ui: FieldUIConfig
}

// Container definition from containers.definition.json
export interface ContainerDefinition {
  label: string
  visible: boolean
  enabled: boolean
  ui: ContainerUIConfig
}

// Option item for select fields
export interface OptionItem {
  value: string
  label: string
}

// Field options configuration from fieldOptions.json
export interface FieldOptionsConfig {
  source: 'static' | 'dynamic'
  allowEmptyOption?: boolean
  emptyOptionLabel?: string
  items: OptionItem[]
}

// Validation rule from validationRules.json
export interface ValidationRule {
  type: string
  value?: unknown
  errorCode: string
}

// Error catalog entry from errorCatalog.json
export interface ErrorCatalogEntry {
  message: string
}

// Container override in operation rules
export interface ContainerOverride {
  visible?: boolean
  enabled?: boolean
}

// Field override in operation rules
export interface FieldOverride {
  visible?: boolean
  enabled?: boolean
  required?: boolean
}

// Operation type rule from operationTypeRules.json
export interface OperationTypeRule {
  containers?: Record<string, ContainerOverride>
  fields?: Record<string, FieldOverride>
}

// Global overrides ($allFields, $allContainers)
export interface GlobalOverrides {
  $allContainers?: ContainerOverride
  $allFields?: FieldOverride
  containers?: Record<string, ContainerOverride>
  fields?: Record<string, FieldOverride>
}

// Operation status rule from operationStatusRules.json
export type OperationStatusRule = GlobalOverrides

// Full configuration object
export type FormConfigScreenOverrides = Partial<{
  containers: Record<string, ContainerDefinition>
  fieldDefinitions: Record<string, FieldDefinition>
  fieldOptions: Record<string, FieldOptionsConfig>
  validationRules: Record<string, ValidationRule[]>
  errorCatalog: Record<string, ErrorCatalogEntry>
  operationTypeRules: Record<string, OperationTypeRule>
  operationStatusRules: Record<string, OperationStatusRule>
}>

export interface FormConfig {
  containers: Record<string, ContainerDefinition>
  fieldDefinitions: Record<string, FieldDefinition>
  fieldOptions: Record<string, FieldOptionsConfig>
  validationRules: Record<string, ValidationRule[]>
  errorCatalog: Record<string, ErrorCatalogEntry>
  operationTypeRules: Record<string, OperationTypeRule>
  operationStatusRules: Record<string, OperationStatusRule>
  /**
   * Optional screen-based overrides.
   * When context.screenId is provided, the engine will merge the override config.
   */
  screens?: Record<string, FormConfigScreenOverrides>
}
