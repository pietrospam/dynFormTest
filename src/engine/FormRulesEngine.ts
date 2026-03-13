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
    this.ensureLoaded()
    return resolveContainer(containerName, this.config!, context)
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
    this.ensureLoaded()
    return resolveField(fieldName, this.config!, context)
  }

  /**
   * Resolves the entire form definition grouped by containers.
   */
  getFormDefinition(
    context: FormContext, 
    _formData?: FormData
  ): ResolvedFormDefinition {
    this.ensureLoaded()
    
    const containers = resolveAllContainers(this.config!, context)
    const fields = resolveAllFields(this.config!, context, containers)
    
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
    
    const initialValues: InitialValues = {}
    const containers = resolveAllContainers(this.config!, context)
    const fields = resolveAllFields(this.config!, context, containers)
    
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
    this.ensureLoaded()
    return validateFieldValue(fieldName, value, this.config!, context, formData)
  }

  /**
   * Validates the entire form.
   */
  validateForm(
    formData: FormData, 
    context: FormContext
  ): FormValidationResult {
    this.ensureLoaded()
    return validateFormData(formData, this.config!, context)
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
