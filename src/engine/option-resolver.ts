import type { FormConfig, OptionItem } from '../types/config.types'

/**
 * Resolves options for a select field.
 * Currently supports only static sources.
 */
export function resolveOptions(
  fieldName: string,
  config: FormConfig
): OptionItem[] {
  const optionsConfig = config.fieldOptions[fieldName]
  
  if (!optionsConfig) {
    return []
  }

  // Only static source is supported in this version
  if (optionsConfig.source !== 'static') {
    return []
  }

  const options: OptionItem[] = []

  // Add empty option if configured
  if (optionsConfig.allowEmptyOption) {
    options.push({
      value: '',
      label: optionsConfig.emptyOptionLabel || '-- seleccionar --',
    })
  }

  // Add configured items
  if (Array.isArray(optionsConfig.items)) {
    options.push(...optionsConfig.items)
  }

  return options
}
