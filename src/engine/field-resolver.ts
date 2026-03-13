import type { FormConfig } from '../types/config.types'
import type { FormContext, ResolvedField, ResolvedContainer } from '../types/engine.types'
import { resolveContainer } from './container-resolver'
import { resolveOptions } from './option-resolver'

/**
 * Resolves a field definition based on context.
 * Applies operation type and status rules to determine final state.
 * Returns null if the field's container is invisible.
 */
export function resolveField(
  fieldName: string,
  config: FormConfig,
  context: FormContext,
  resolvedContainers?: Record<string, ResolvedContainer>
): ResolvedField | null {
  const baseField = config.fieldDefinitions[fieldName]
  
  if (!baseField) {
    return null
  }

  // Get the resolved container state
  const container = resolvedContainers?.[baseField.container] 
    ?? resolveContainer(baseField.container, config, context)
  
  // If container is not visible, field should not be rendered
  if (!container || !container.visible) {
    return null
  }

  // Start with base definition
  // Default: visible=true, enabled follows container, required from allowEmpty
  const resolved: ResolvedField = {
    name: fieldName,
    container: baseField.container,
    dataType: baseField.dataType,
    label: baseField.label,
    defaultValue: baseField.defaultValue,
    allowEmpty: baseField.allowEmpty,
    visible: true,
    enabled: container.enabled, // Inherit from container by default
    required: !baseField.allowEmpty,
    ui: { ...baseField.ui },
    validations: config.validationRules[fieldName] || [],
  }

  // Resolve options if it's a select component
  if (baseField.ui.component === 'Select') {
    resolved.options = resolveOptions(fieldName, config)
  }

  // Apply operation type rules
  const typeRule = config.operationTypeRules[context.operationType]
  if (typeRule?.fields?.[fieldName]) {
    const override = typeRule.fields[fieldName]
    if (override.visible !== undefined) resolved.visible = override.visible
    if (override.enabled !== undefined) resolved.enabled = override.enabled
    if (override.required !== undefined) resolved.required = override.required
  }

  // Apply operation status rules (these can override type rules)
  const statusRule = config.operationStatusRules[context.operationStatus]
  
  // Track if there's a specific field override (highest priority)
  let hasSpecificFieldOverride = false
  
  if (statusRule) {
    // Apply global field rules first
    if (statusRule.$allFields) {
      const globalOverride = statusRule.$allFields
      if (globalOverride.visible !== undefined) resolved.visible = globalOverride.visible
      if (globalOverride.enabled !== undefined) resolved.enabled = globalOverride.enabled
      if (globalOverride.required !== undefined) resolved.required = globalOverride.required
    }
    
    // Then apply specific field rules (highest priority)
    if (statusRule.fields?.[fieldName]) {
      hasSpecificFieldOverride = true
      const override = statusRule.fields[fieldName]
      if (override.visible !== undefined) resolved.visible = override.visible
      if (override.enabled !== undefined) resolved.enabled = override.enabled
      if (override.required !== undefined) resolved.required = override.required
    }
  }

  // If container is disabled and there's no specific field override, field should be disabled
  if (!container.enabled && !hasSpecificFieldOverride) {
    resolved.enabled = false
  }

  // If field is not enabled, it should not be required
  if (!resolved.enabled) {
    resolved.required = false
  }

  return resolved
}

/**
 * Resolves all fields based on context.
 */
export function resolveAllFields(
  config: FormConfig,
  context: FormContext,
  resolvedContainers?: Record<string, ResolvedContainer>
): Record<string, ResolvedField> {
  const resolved: Record<string, ResolvedField> = {}
  
  for (const fieldName of Object.keys(config.fieldDefinitions)) {
    const field = resolveField(fieldName, config, context, resolvedContainers)
    if (field && field.visible) {
      resolved[fieldName] = field
    }
  }
  
  return resolved
}
