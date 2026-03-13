import { useMemo, useCallback } from 'react'
import { FormRulesEngine } from '../../../src/engine/FormRulesEngine'
import type { FormContext, FormData, ResolvedFormDefinition } from '../../../src/types/engine.types'
import type { FormValidationResult, FieldValidationResult } from '../../../src/types/validation.types'
import type { FormConfig } from '../../../src/types/config.types'

export function useFormEngine(context: FormContext, config: FormConfig) {
  // Rebuild engine whenever the configuration changes.
  const engine = useMemo(() => {
    const e = new FormRulesEngine()
    e.load(config)
    return e
  }, [config])

  // Get form definition based on context
  const formDefinition: ResolvedFormDefinition = useMemo(
    () => engine.getFormDefinition(context),
    [engine, context]
  )

  // Get initial values based on context
  const initialValues = useMemo(
    () => engine.getInitialValues(context),
    [engine, context]
  )

  // Validate a single field
  const validateField = useCallback(
    (fieldName: string, value: unknown): FieldValidationResult =>
      engine.validateField(fieldName, value, context),
    [engine, context]
  )

  // Validate entire form
  const validateForm = useCallback(
    (formData: FormData): FormValidationResult =>
      engine.validateForm(formData, context),
    [engine, context]
  )

  // Get field definition for inspector
  const getFieldDefinition = useCallback(
    (fieldName: string) => engine.getFieldDefinition(fieldName, context),
    [engine, context]
  )

  return {
    engine,
    formDefinition,
    initialValues,
    validateField,
    validateForm,
    getFieldDefinition,
  }
}
