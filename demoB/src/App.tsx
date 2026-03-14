import { useEffect, useState } from 'react'
import {
  ControlPanel,
  ConfigEditor,
  DynamicForm,
  FieldInspector,
  ValidationResults,
} from './components'
import { Button } from './components/ui'
import { useFormEngine } from './hooks/useFormEngine'
import { config } from './config'
import type { FormConfig } from '../../src/types/config.types'
import type { FormContext } from '../../src/types/engine.types'
import type { FormValidationResult } from '../../src/types/validation.types'
import type { ResolvedField } from '../../src/types/engine.types'

function App() {
  // Config state (allows edits in demo to affect the engine)
  const [runtimeConfig, setRuntimeConfig] = useState<FormConfig>(
    config as unknown as FormConfig
  )

  const handleConfigChange = (file: string, value: unknown) => {
    setRuntimeConfig((prev) => {
      const next = { ...prev }
      switch (file) {
        case 'containers.definition.json':
          next.containers = value as typeof prev.containers
          break
        case 'fieldDefinitions.json':
          next.fieldDefinitions = value as typeof prev.fieldDefinitions
          break
        case 'fieldOptions.json':
          next.fieldOptions = value as typeof prev.fieldOptions
          break
        case 'validationRules.json':
          next.validationRules = value as typeof prev.validationRules
          break
        case 'errorCatalog.json':
          next.errorCatalog = value as typeof prev.errorCatalog
          break
        case 'operationTypeRules.json':
          next.operationTypeRules = value as typeof prev.operationTypeRules
          break
        case 'operationStatusRules.json':
          next.operationStatusRules = value as typeof prev.operationStatusRules
          break
        case 'screens.json':
          next.screens = value as typeof prev.screens
          break
        default:
          break
      }
      return next
    })
  }

  // Context state
  const [context, setContext] = useState<FormContext>({
    screenId: 'OperacionesGenerales',
    operationType: 'PMI',
    operationStatus: 'PENDIENTE',
  })

  // Form engine hook
  const {
    formDefinition,
    initialValues,
    validateForm,
    validateField,
    getFieldDefinition,
  } = useFormEngine(context, runtimeConfig)

  // Form data state
  const [formData, setFormData] = useState<Record<string, unknown>>({})

  // Validation result state
  const [validationResult, setValidationResult] =
    useState<FormValidationResult | null>(null)

  // Automatically validate whenever data changes so the "Siguiente" button
  // can be enabled/disabled in real time.  We run the engine's full form
  // validation here, but individual-field blur handlers also update the
  // same state.
  useEffect(() => {
    const result = validateForm(formData)
    setValidationResult(result)
  }, [formData, validateForm])

  // Selected field for inspector
  const [selectedField, setSelectedField] = useState<ResolvedField | null>(null)

  // Initialize form data when context changes
  useEffect(() => {
    setFormData(initialValues)
    setValidationResult(null)
  }, [context, initialValues])

  // Handle field change
  const handleFieldChange = (fieldName: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }))
    // Clear validation error for this field
    if (validationResult?.errors[fieldName]) {
      setValidationResult((prev) => {
        if (!prev) return null
        const newErrors = { ...prev.errors }
        delete newErrors[fieldName]
        return {
          valid: Object.keys(newErrors).length === 0,
          errors: newErrors,
        }
      })
    }
  }

  // Handle field selection for inspector
  const handleFieldSelect = (fieldName: string) => {
    const field = getFieldDefinition(fieldName)
    setSelectedField(field)
  }

  // Handle form validation
  const handleValidate = () => {
    const result = validateForm(formData)
    setValidationResult(result)
  }

  // Handle field blur (runs validation for single field)
  const handleFieldBlur = (fieldName: string) => {
    const result = validateField(fieldName, formData[fieldName])
    setValidationResult((prev) => {
      const errors = { ...(prev?.errors || {}) }
      if (!result.valid) {
        errors[fieldName] = result.errors
      } else {
        delete errors[fieldName]
      }
      return { valid: Object.keys(errors).length === 0, errors }
    })
  }

  // Handle form reset
  const handleReset = () => {
    setFormData(initialValues)
    setValidationResult(null)
    setSelectedField(null)
  }

  // Determine if the "Siguiente" button should be active.
  const canProceed = validationResult?.valid ?? false

  const [view, setView] = useState<'form' | 'config'>('form')

  const screenOptions = Object.keys(runtimeConfig.screens ?? {}).map((id) => ({
    value: id,
    label: id === 'default' ? 'Default (sin override)' : id,
  }))

  const handleCreateScreen = (id: string) => {
    setRuntimeConfig((prev) => ({
      ...prev,
      screens: {
        ...(prev.screens ?? {}),
        [id]: {},
      },
    }))
    setContext((prev) => ({ ...prev, screenId: id }))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dynamic Form Rules Engine
              </h1>
              <p className="text-sm text-gray-500">
                Demo interactivo - Cambiá el contexto para ver cómo se comporta el
                formulario
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={view === 'form' ? 'primary' : 'secondary'}
                onClick={() => setView('form')}
              >
                Formulario
              </Button>
              <Button
                variant={view === 'config' ? 'primary' : 'secondary'}
                onClick={() => setView('config')}
              >
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - Control */}
          <div className="lg:col-span-3 space-y-4">
            <ControlPanel
              context={context}
              onContextChange={setContext}
              onValidate={handleValidate}
              onReset={handleReset}
              screenOptions={screenOptions}
              onCreateScreen={handleCreateScreen}
            />
          </div>

          {/* Center - Form / Config */}
          <div className="lg:col-span-6">
            {view === 'form' ? (
              <>
                <DynamicForm
                  formDefinition={formDefinition}
                  formData={formData}
                  onChange={handleFieldChange}
                  onFieldSelect={handleFieldSelect}
                  onBlur={handleFieldBlur}
                  validationErrors={validationResult?.errors || {}}
                />

                {/* pie de formulario: boton Siguiente */}
                <div className="mt-4 text-right">
                  <Button
                    onClick={() => console.log('siguiente pulsado')}
                    disabled={!canProceed}
                  >
                    Siguiente
                  </Button>
                </div>
              </>
            ) : (
              <ConfigEditor config={runtimeConfig} onConfigChange={handleConfigChange} />
            )}
          </div>

          {/* Right Panel - Inspector & Validation */}
          <div className="lg:col-span-3 space-y-4">
            <FieldInspector field={selectedField} />
            <ValidationResults result={validationResult} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
          Dynamic Form Rules Engine - La librería no renderiza UI, solo resuelve
          reglas de negocio
        </div>
      </footer>
    </div>
  )
}

export default App
