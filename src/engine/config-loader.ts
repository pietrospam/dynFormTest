import type { 
  FormConfig, 
  ValidationRule, 
  ErrorCatalogEntry 
} from '../types/config.types'

/**
 * Validates and loads the form configuration.
 * Throws errors if configuration is invalid.
 */
export function loadConfig(config: unknown): FormConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('Configuration must be an object')
  }

  const cfg = config as Record<string, unknown>

  // Validate required top-level keys
  if (!cfg.containers || typeof cfg.containers !== 'object') {
    throw new Error('Missing or invalid "containers" configuration')
  }

  if (!cfg.fieldDefinitions || typeof cfg.fieldDefinitions !== 'object') {
    throw new Error('Missing or invalid "fieldDefinitions" configuration')
  }

  if (!cfg.errorCatalog || typeof cfg.errorCatalog !== 'object') {
    throw new Error('Missing or invalid "errorCatalog" configuration')
  }

  // Build the config object with defaults
  const formConfig: FormConfig = {
    containers: cfg.containers as FormConfig['containers'],
    fieldDefinitions: cfg.fieldDefinitions as FormConfig['fieldDefinitions'],
    fieldOptions: (cfg.fieldOptions as FormConfig['fieldOptions']) || {},
    validationRules: (cfg.validationRules as FormConfig['validationRules']) || {},
    errorCatalog: cfg.errorCatalog as FormConfig['errorCatalog'],
    operationTypeRules: (cfg.operationTypeRules as FormConfig['operationTypeRules']) || {},
    operationStatusRules: (cfg.operationStatusRules as FormConfig['operationStatusRules']) || {},
  }

  // Validate error codes referenced in validation rules exist in catalog
  validateErrorCodes(formConfig.validationRules, formConfig.errorCatalog)

  // Validate field containers exist
  validateFieldContainers(formConfig.fieldDefinitions, formConfig.containers)

  return formConfig
}

/**
 * Validates that all error codes referenced in validation rules exist in the catalog.
 */
function validateErrorCodes(
  validationRules: Record<string, ValidationRule[]>,
  errorCatalog: Record<string, ErrorCatalogEntry>
): void {
  for (const [fieldName, rules] of Object.entries(validationRules)) {
    for (const rule of rules) {
      if (!errorCatalog[rule.errorCode]) {
        throw new Error(
          `Validation rule for field "${fieldName}" references non-existent error code: "${rule.errorCode}"`
        )
      }
    }
  }
}

/**
 * Validates that all fields reference existing containers.
 */
function validateFieldContainers(
  fieldDefinitions: FormConfig['fieldDefinitions'],
  containers: FormConfig['containers']
): void {
  for (const [fieldName, fieldDef] of Object.entries(fieldDefinitions)) {
    if (!containers[fieldDef.container]) {
      throw new Error(
        `Field "${fieldName}" references non-existent container: "${fieldDef.container}"`
      )
    }
  }
}
