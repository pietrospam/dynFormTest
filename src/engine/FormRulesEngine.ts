import type { FormConfig } from '../types/config.types'
import type { 
  FormContext, 
  ResolvedContainer, 
  ResolvedField, 
  ResolvedFormDefinition,
  InitialValues,
  FormData 
} from '../types/engine.types'
import type { 
  FieldValidationResult, 
  FormValidationResult 
} from '../types/validation.types'

import { loadConfig } from './config-loader'
import { resolveContainer, resolveAllContainers } from './container-resolver'
import { resolveField, resolveAllFields } from './field-resolver'
import { validateFieldValue, validateFormData } from './validation-resolver'

export class FormRulesEngine {
  private config: FormConfig | null = null

  /**
   * Returns the configuration merged with a screen-specific override (if any).
   * Screen overrides are defined under `config.screens[screenId]`.
   */
  private getConfigForContext(context: FormContext): FormConfig {
    this.ensureLoaded()

    const base = this.config!
    const screenId = context.screenId as string | undefined
    if (!screenId) return base

    const screenOverride = base.screens?.[screenId]
    if (!screenOverride) return base

    return mergeFormConfig(base, screenOverride)
  }

  /**
   * Loads and validates the configuration.
   * @throws Error if configuration is invalid
   */
  load(config: unknown): void {
    this.config = loadConfig(config)
  }

  /**
   * Returns the loaded configuration (for testing/debugging)
   */
  getConfig(): FormConfig | null {
    return this.config
  }

  /**
   * Resolves a container definition based on context.
   * Returns null if container doesn't exist or its container is not visible.
   */
  getContainerDefinition(
    containerName: string,
    context: FormContext,
    _formData?: FormData
  ): ResolvedContainer | null {
    const config = this.getConfigForContext(context)
    return resolveContainer(containerName, config, context)
  }

  /**
   * Resolves a field definition based on context.
   * Returns null if field doesn't exist or its container is not visible.
   */
  getFieldDefinition(
    fieldName: string,
    context: FormContext,
    _formData?: FormData
  ): ResolvedField | null {
    const config = this.getConfigForContext(context)
    return resolveField(fieldName, config, context)
  }

  /**
   * Resolves the entire form definition grouped by containers.
   */
  getFormDefinition(
    context: FormContext,
    _formData?: FormData
  ): ResolvedFormDefinition {
    const config = this.getConfigForContext(context)

    const containers = resolveAllContainers(config, context)
    const fields = resolveAllFields(config, context, containers)
    
    // Group fields by container
    const result: ResolvedFormDefinition = { containers: {} }
    
    for (const [containerName, container] of Object.entries(containers)) {
      if (!container.visible) continue
      
      result.containers[containerName] = {
        container,
        fields: [],
      }
    }
    
    for (const [_fieldName, field] of Object.entries(fields)) {
      if (!field.visible) continue
      
      const containerName = field.container
      if (result.containers[containerName]) {
        result.containers[containerName].fields.push(field)
      }
    }
    
    return result
  }

  /**
   * Returns initial values for all fields based on their defaultValue.
   */
  getInitialValues(context: FormContext): InitialValues {
    this.ensureLoaded()
    
    const config = this.getConfigForContext(context)
    const initialValues: InitialValues = {}
    const containers = resolveAllContainers(config, context)
    const fields = resolveAllFields(config, context, containers)
    
    for (const [_fieldName, field] of Object.entries(fields)) {
      if (field.visible) {
        initialValues[field.name] = field.defaultValue
      }
    }
    
    return initialValues
  }

  /**
   * Validates a single field.
   */
  validateField(
    fieldName: string,
    value: unknown,
    context: FormContext,
    formData?: FormData
  ): FieldValidationResult {
    const config = this.getConfigForContext(context)
    return validateFieldValue(fieldName, value, config, context, formData)
  }

  /**
   * Validates the entire form.
   */
  validateForm(
    formData: FormData,
    context: FormContext
  ): FormValidationResult {
    const config = this.getConfigForContext(context)
    return validateFormData(formData, config, context)
  }

  /**
   * Ensures configuration has been loaded.
   */
  private ensureLoaded(): void {
    if (!this.config) {
      throw new Error('Configuration not loaded. Call load() first.')
    }
  }
}

function mergeFormConfig(base: FormConfig, override: Partial<FormConfig>): FormConfig {
  return {
    ...base,
    ...override,
    containers: { ...base.containers, ...(override.containers ?? {}) },
    fieldDefinitions: { ...base.fieldDefinitions, ...(override.fieldDefinitions ?? {}) },
    fieldOptions: { ...base.fieldOptions, ...(override.fieldOptions ?? {}) },
    validationRules: { ...base.validationRules, ...(override.validationRules ?? {}) },
    errorCatalog: { ...base.errorCatalog, ...(override.errorCatalog ?? {}) },
    operationTypeRules: {
      ...base.operationTypeRules,
      ...(override.operationTypeRules ?? {}),
    },
    operationStatusRules: {
      ...base.operationStatusRules,
      ...(override.operationStatusRules ?? {}),
    },
    screens: base.screens,
  }
}
