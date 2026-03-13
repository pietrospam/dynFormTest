import { useEffect, useMemo, useState } from 'react'
import { Button, Select, TextInput, Textarea } from '../ui'

const configFiles = [
  'containers.definition.json',
  'fieldDefinitions.json',
  'fieldOptions.json',
  'validationRules.json',
  'errorCatalog.json',
  'operationTypeRules.json',
  'operationStatusRules.json',
] as const

type ConfigFileKey = (typeof configFiles)[number]

type ContainerDefinition = {
  label: string
  visible: boolean
  enabled: boolean
  ui: { component: string }
}

type FieldDefinition = {
  container: string
  dataType: 'string' | 'number' | 'boolean'
  label: string
  defaultValue: unknown
  allowEmpty: boolean
  ui: { component: string; placeholder?: string; inputProps?: Record<string, unknown> }
}

type ValidationRule = {
  type: string
  value?: unknown
  errorCode: string
}

type OverrideRule = {
  visible?: boolean
  enabled?: boolean
  required?: boolean
}

type OperationTypeRule = {
  containers?: Record<string, OverrideRule>
  fields?: Record<string, OverrideRule>
}

type OperationStatusRule = {
  $allContainers?: OverrideRule
  $allFields?: OverrideRule
  containers?: Record<string, OverrideRule>
  fields?: Record<string, OverrideRule>
}

type FieldOption = {
  source: 'static' | 'dynamic'
  allowEmptyOption?: boolean
  emptyOptionLabel?: string
  items: Array<{ value: string; label: string }>
}

type ErrorCatalog = Record<string, { message: string }>

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function loadJson(key: ConfigFileKey) {
  const raw = import.meta.glob('../../config/*.json', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>
  const path = `../../config/${key}`
  return raw[path]
}

function ensureJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}

export function ConfigEditor() {
  const [selected, setSelected] = useState<ConfigFileKey>(configFiles[0])
  const [mode, setMode] = useState<'visual' | 'json'>('visual')
  const [json, setJson] = useState(() => loadJson(selected))
  const [configObject, setConfigObject] = useState<unknown>(() => JSON.parse(json))
  const [allConfigs, setAllConfigs] = useState<Record<ConfigFileKey, unknown>>(() => {
    const map = {} as Record<ConfigFileKey, unknown>
    configFiles.forEach((file) => {
      map[file] = JSON.parse(loadJson(file))
    })
    return map
  })
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    // Sync object -> json when object changes
    setJson(ensureJson(configObject))
  }, [configObject])

  useEffect(() => {
    // Keep master map of all configs updated as user edits
    setAllConfigs((prev) => ({ ...prev, [selected]: configObject }))
  }, [configObject, selected])

  useEffect(() => {
    // Sync json -> object when json changes and is valid.
    try {
      const parsed = JSON.parse(json)
      setConfigObject(parsed)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [json])

  useEffect(() => {
    if (!message) return
    const timeout = window.setTimeout(() => setMessage(null), 3000)
    return () => window.clearTimeout(timeout)
  }, [message])

  const parsed = useMemo(() => {
    try {
      return JSON.parse(json)
    } catch {
      return null
    }
  }, [json])

  const handleFileChange = (file: ConfigFileKey) => {
    setSelected(file)
    const nextJson = loadJson(file)
    setJson(nextJson)
    setConfigObject(JSON.parse(nextJson))
    setError(null)
  }

  const handleDownload = () => {
    if (!parsed) return
    downloadText(selected, json)
    setMessage('JSON descargado. Reemplazá el archivo en config/.')
  }

  const handleValidate = () => {
    try {
      JSON.parse(json)
      setError(null)
      setMessage('JSON válido ✅')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      setMessage('JSON inválido ❌ revisá los errores')
    }
  }

  const handleReset = () => {
    const nextJson = loadJson(selected)
    setJson(nextJson)
    setConfigObject(JSON.parse(nextJson))
    setError(null)
    setMessage('Restaurado a la versión original')
  }

  const renderVisualEditor = () => {
    if (!parsed) {
      return (
        <div className="p-4 border rounded bg-white">
          <p className="text-sm text-gray-600">No es posible mostrar el editor visual porque el JSON actual tiene errores.</p>
        </div>
      )
    }

    const availableContainers =
      Object.keys(allConfigs['containers.definition.json'] as Record<string, unknown>) || []
    const availableFields =
      Object.keys(allConfigs['fieldDefinitions.json'] as Record<string, unknown>) || []

    switch (selected) {
      case 'fieldDefinitions.json':
        return (
          <FieldDefinitionsEditor
            value={parsed as Record<string, FieldDefinition>}
            onChange={(next) => setConfigObject(next)}
          />
        )
      case 'containers.definition.json':
        return (
          <ContainersEditor
            value={parsed as Record<string, ContainerDefinition>}
            onChange={(next) => setConfigObject(next)}
          />
        )
      case 'validationRules.json':
        return (
          <ValidationRulesEditor
            value={parsed as Record<string, ValidationRule[]>}
            onChange={(next) => setConfigObject(next)}
          />
        )
      case 'operationTypeRules.json':
        return (
          <OperationTypeRulesEditor
            value={parsed as Record<string, OperationTypeRule>}
            onChange={(next) => setConfigObject(next)}
            availableContainers={availableContainers}
            availableFields={availableFields}
          />
        )
      case 'operationStatusRules.json':
        return (
          <OperationStatusRulesEditor
            value={parsed as Record<string, OperationStatusRule>}
            onChange={(next) => setConfigObject(next)}
            availableContainers={availableContainers}
            availableFields={availableFields}
          />
        )
      case 'fieldOptions.json':
        return (
          <FieldOptionsEditor
            value={parsed as Record<string, FieldOption>}
            onChange={(next) => setConfigObject(next)}
          />
        )
      case 'errorCatalog.json':
        return (
          <ErrorCatalogEditor
            value={parsed as ErrorCatalog}
            onChange={(next) => setConfigObject(next)}
          />
        )
      default:
        return (
          <div className="p-4 border rounded bg-white">
            <p className="text-sm text-gray-600">
              Edición visual no disponible para este archivo. Usá el modo JSON.
            </p>
          </div>
        )
    }
  }

  const fileGroups = [
    {
      label: 'Estructura',
      files: ['containers.definition.json', 'fieldDefinitions.json'] as const,
    },
    {
      label: 'Reglas',
      files: ['validationRules.json', 'operationTypeRules.json', 'operationStatusRules.json'] as const,
    },
    {
      label: 'Otros',
      files: ['fieldOptions.json', 'errorCatalog.json'] as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <aside className="space-y-6">
        <div className="border rounded-lg bg-white shadow-sm p-5">
          <div className="text-sm font-semibold text-gray-700">Archivos</div>
          <p className="text-xs text-gray-500 mb-3">
            Seleccioná el archivo de configuración a editar.
          </p>

          {fileGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {group.label}
              </div>
              <div className="mt-2 space-y-2">
                {group.files.map((file) => (
                  <button
                    key={file}
                    type="button"
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selected === file
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleFileChange(file)}
                  >
                    {file.replace('.json', '')}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-3">
            <div className="text-sm font-semibold text-gray-700 mb-2">Modo</div>
            <div className="flex gap-2">
              <Button
                variant={mode === 'visual' ? 'primary' : 'secondary'}
                onClick={() => setMode('visual')}
              >
                Visual
              </Button>
              <Button
                variant={mode === 'json' ? 'primary' : 'secondary'}
                onClick={() => setMode('json')}
              >
                JSON
              </Button>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <Button variant="secondary" onClick={handleValidate} className="w-full">
              Validar JSON
            </Button>
            <Button onClick={handleDownload} disabled={!parsed} className="w-full">
              Descargar JSON
            </Button>
            <Button variant="secondary" onClick={handleReset} className="w-full">
              Restaurar original
            </Button>
          </div>
        </div>

        <div className="border rounded-lg bg-white shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-700">Estado</h3>
          <p className="text-xs text-gray-500 mt-2">
            {parsed
              ? 'JSON válido. Podés editar y descargar.'
              : 'JSON inválido. Corrige los errores antes de descargar.'}
          </p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
        </div>

        <div className="text-xs text-gray-500">
          Nota: los cambios no se guardan en el repositorio. Descargá el JSON y reemplazá el archivo en <code>config/</code>.
        </div>
      </aside>

      <main className="lg:col-span-3">
        <div className="border rounded-lg bg-white shadow-sm">
          {mode === 'json' ? (
            <div className="p-5">
              <Textarea label="JSON" value={json} onChange={setJson} rows={20} />
            </div>
          ) : (
            <div className="p-5">{renderVisualEditor()}</div>
          )}
        </div>
      </main>
    </div>
  )
}

function ContainersEditor({
  value,
  onChange,
}: {
  value: Record<string, ContainerDefinition>
  onChange: (value: Record<string, ContainerDefinition>) => void
}) {
  const [newKey, setNewKey] = useState('')
  const [newLabel, setNewLabel] = useState('')

  const add = () => {
    const key = newKey.trim()
    if (!key || value[key]) return
    onChange({
      ...value,
      [key]: {
        label: newLabel || key,
        visible: true,
        enabled: true,
        ui: { component: 'Section' },
      },
    })
    setNewKey('')
    setNewLabel('')
  }

  const update = (key: string, next: ContainerDefinition) => {
    onChange({ ...value, [key]: next })
  }

  const remove = (key: string) => {
    const next = { ...value }
    delete next[key]
    onChange(next)
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Contenedores</h3>
        <p className="text-sm text-gray-500">
          Editá las secciones que agrupan los campos del formulario.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(value).map(([key, container]) => (
          <div key={key} className="border rounded-lg bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{key}</div>
                <div className="text-xs text-gray-500">Identificador del contenedor</div>
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => remove(key)}
              >
                Eliminar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <TextInput
                label="Etiqueta"
                value={container.label}
                onChange={(v) => update(key, { ...container, label: v })}
                required
              />
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Visibilidad / estado</div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={container.visible}
                      onChange={(e) => update(key, { ...container, visible: e.target.checked })}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    Visible
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={container.enabled}
                      onChange={(e) => update(key, { ...container, enabled: e.target.checked })}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    Habilitado
                  </label>
                </div>
              </div>
              <TextInput
                label="Componente UI"
                value={container.ui.component}
                onChange={(v) => update(key, { ...container, ui: { ...container.ui, component: v } })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg bg-white p-4">
        <h4 className="text-sm font-semibold mb-3">Agregar nuevo contenedor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Clave (ID)"
            value={newKey}
            onChange={setNewKey}
            placeholder="ej: datosExtra"
          />
          <TextInput
            label="Etiqueta"
            value={newLabel}
            onChange={setNewLabel}
            placeholder="ej: Datos adicionales"
          />
        </div>
        <div className="mt-3">
          <Button onClick={add} disabled={!newKey.trim()}>
            Agregar contenedor
          </Button>
        </div>
      </div>
    </div>
  )
}

function FieldDefinitionsEditor({
  value,
  onChange,
}: {
  value: Record<string, FieldDefinition>
  onChange: (value: Record<string, FieldDefinition>) => void
}) {
  const [newKey, setNewKey] = useState('')

  const addField = () => {
    const key = newKey.trim()
    if (!key || value[key]) return
    onChange({
      ...value,
      [key]: {
        container: '',
        dataType: 'string',
        label: key,
        defaultValue: '',
        allowEmpty: true,
        ui: { component: 'TextInput' },
      },
    })
    setNewKey('')
  }

  const updateField = (key: string, next: FieldDefinition) => {
    onChange({ ...value, [key]: next })
  }

  const removeField = (key: string) => {
    const next = { ...value }
    delete next[key]
    onChange(next)
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Definición de campos</h3>
        <p className="text-sm text-gray-500">
          Agregá o modificá los campos que estarán disponibles en el formulario.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(value).map(([key, field]) => (
          <div key={key} className="border rounded-lg bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{key}</div>
                <div className="text-xs text-gray-500">Nombre del campo</div>
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => removeField(key)}
              >
                Eliminar
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <TextInput
                label="Etiqueta"
                value={field.label}
                onChange={(v) => updateField(key, { ...field, label: v })}
                required
              />

              <TextInput
                label="Contenedor"
                value={field.container}
                onChange={(v) => updateField(key, { ...field, container: v })}
                required
              />

              <TextInput
                label="Tipo de dato"
                value={field.dataType}
                onChange={(v) =>
                  updateField(key, { ...field, dataType: v as FieldDefinition['dataType'] })
                }
              />

              <TextInput
                label="Valor por defecto"
                value={String(field.defaultValue ?? '')}
                onChange={(v) => updateField(key, { ...field, defaultValue: v })}
              />

              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Opciones</div>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={field.allowEmpty}
                    onChange={(e) =>
                      updateField(key, { ...field, allowEmpty: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  Permite vacío
                </label>
              </div>

              <TextInput
                label="Componente UI"
                value={field.ui.component}
                onChange={(v) =>
                  updateField(key, {
                    ...field,
                    ui: { ...field.ui, component: v },
                  })
                }
              />

              <TextInput
                label="Placeholder"
                value={field.ui.placeholder ?? ''}
                onChange={(v) =>
                  updateField(key, {
                    ...field,
                    ui: { ...field.ui, placeholder: v },
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-lg bg-white p-4">
        <h4 className="text-sm font-semibold mb-3">Agregar nuevo campo</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Clave (nombre de campo)"
            value={newKey}
            onChange={setNewKey}
            placeholder="ej: nuevoCampo"
          />
        </div>
        <div className="mt-3">
          <Button onClick={addField} disabled={!newKey.trim()}>
            Agregar campo
          </Button>
        </div>
      </div>
    </div>
  )
}

function ValidationRulesEditor({
  value,
  onChange,
}: {
  value: Record<string, ValidationRule[]>
  onChange: (value: Record<string, ValidationRule[]>) => void
}) {
  const [newField, setNewField] = useState('')

  const addField = () => {
    const key = newField.trim()
    if (!key || value[key]) return
    onChange({ ...value, [key]: [] })
    setNewField('')
  }

  const updateRules = (field: string, rules: ValidationRule[]) => {
    onChange({ ...value, [field]: rules })
  }

  const removeField = (field: string) => {
    const next = { ...value }
    delete next[field]
    onChange(next)
  }

  const addRule = (field: string) => {
    const current = value[field] ?? []
    updateRules(field, [...current, { type: 'required', errorCode: '' }])
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Reglas de validación</h3>
        <p className="text-sm text-gray-500">
          Definí las reglas que se aplican a cada campo.
        </p>
      </div>

      <div className="border rounded-lg bg-white p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <TextInput
            label="Nuevo campo"
            value={newField}
            onChange={setNewField}
            placeholder="ej: cuitTransportista"
          />
          <Button onClick={addField} disabled={!newField.trim()}>
            Agregar campo
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(value).map(([field, rules]) => (
          <div key={field} className="border rounded-lg bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{field}</div>
                <div className="text-xs text-gray-500">Reglas aplicadas a este campo</div>
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => removeField(field)}
              >
                Eliminar campo
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-white p-3 rounded border"
                >
                  <TextInput
                    label="Tipo"
                    value={rule.type}
                    onChange={(v) => {
                      const next = [...rules]
                      next[idx] = { ...next[idx], type: v }
                      updateRules(field, next)
                    }}
                  />
                  <TextInput
                    label="Valor"
                    value={rule.value !== undefined ? String(rule.value) : ''}
                    onChange={(v) => {
                      const next = [...rules]
                      next[idx] = { ...next[idx], value: v === '' ? undefined : v }
                      updateRules(field, next)
                    }}
                  />
                  <TextInput
                    label="Código de error"
                    value={rule.errorCode}
                    onChange={(v) => {
                      const next = [...rules]
                      next[idx] = { ...next[idx], errorCode: v }
                      updateRules(field, next)
                    }}
                  />
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const next = [...rules]
                      next.splice(idx, 1)
                      updateRules(field, next)
                    }}
                  >
                    Eliminar regla
                  </Button>
                </div>
              ))}

              <Button onClick={() => addRule(field)}>Agregar regla</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OperationTypeRulesEditor({
  value,
  onChange,
  availableContainers,
  availableFields,
}: {
  value: Record<string, OperationTypeRule>
  onChange: (value: Record<string, OperationTypeRule>) => void
  availableContainers: string[]
  availableFields: string[]
}) {
  const [newKey, setNewKey] = useState('')

  const addType = () => {
    const key = newKey.trim()
    if (!key || value[key]) return
    onChange({ ...value, [key]: { containers: {}, fields: {} } })
    setNewKey('')
  }

  const updateType = (type: string, next: OperationTypeRule) => {
    onChange({ ...value, [type]: next })
  }

  const removeType = (type: string) => {
    const next = { ...value }
    delete next[type]
    onChange(next)
  }

  const renderOverrides = (
    label: string,
    overrides: Record<string, OverrideRule> | undefined,
    onUpdate: (next: Record<string, OverrideRule>) => void,
    allowRequired = false
  ) => {
    const items = overrides ? Object.entries(overrides) : []
    const [newKeyOverride, setNewKeyOverride] = useState('')

    const addOverride = () => {
      const key = newKeyOverride.trim()
      if (!key || (overrides && overrides[key])) return
      onUpdate({ ...(overrides ?? {}), [key]: {} })
      setNewKeyOverride('')
    }

    const updateOverride = (key: string, next: OverrideRule) => {
      onUpdate({ ...(overrides ?? {}), [key]: next })
    }

    const removeOverride = (key: string) => {
      const next = { ...(overrides ?? {}) }
      delete next[key]
      onUpdate(next)
    }

    return (
      <div className="border rounded-lg bg-white p-4">
        <h4 className="text-sm font-semibold mb-3">{label}</h4>
        <div className="space-y-3">
          {items.map(([key, override]) => (
            <div key={key} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-gray-50 p-3 rounded border">
              <div>
                <div className="font-medium">{key}</div>
                <div className="text-xs text-gray-500">Clave</div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={override.visible ?? false}
                  onChange={(e) =>
                    updateOverride(key, { ...override, visible: e.target.checked })
                  }
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                Visible
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={override.enabled ?? false}
                  onChange={(e) =>
                    updateOverride(key, { ...override, enabled: e.target.checked })
                  }
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                Habilitado
              </label>
              {allowRequired && (
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={override.required ?? false}
                    onChange={(e) =>
                      updateOverride(key, { ...override, required: e.target.checked })
                    }
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  Requerido
                </label>
              )}
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => removeOverride(key)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Agregar nueva clave</div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <TextInput
              label="Clave"
              value={newKeyOverride}
              onChange={setNewKeyOverride}
              placeholder="ej: datosTransportista"
            />
            <Button onClick={addOverride} disabled={!newKeyOverride.trim()}>
              Agregar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Reglas por tipo de operación</h3>
        <p className="text-sm text-gray-500">
          Configurá qué contenedores y campos se habilitan o requieren según el tipo de operación.
        </p>
      </div>

      <div className="border rounded-lg bg-white p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <TextInput
            label="Nuevo tipo de operación"
            value={newKey}
            onChange={setNewKey}
            placeholder="ej: PMI"
          />
          <Button onClick={addType} disabled={!newKey.trim()}>
            Agregar tipo
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(value).map(([type, rule]) => (
          <div key={type} className="border rounded-lg bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{type}</div>
                <div className="text-xs text-gray-500">Reglas aplicadas a este tipo de operación</div>
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => removeType(type)}
              >
                Eliminar tipo
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {renderOverrides(
                'Contenedores',
                rule.containers,
                (next) => updateType(type, { ...rule, containers: next }),
                false
              )}
              {renderOverrides(
                'Campos',
                rule.fields,
                (next) => updateType(type, { ...rule, fields: next }),
                true
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function OperationStatusRulesEditor({
  value,
  onChange,
  availableContainers,
  availableFields,
}: {
  value: Record<string, OperationStatusRule>
  onChange: (value: Record<string, OperationStatusRule>) => void
  availableContainers: string[]
  availableFields: string[]
}) {
  const [newKey, setNewKey] = useState('')
  const [newContainer, setNewContainer] = useState('')
  const [newField, setNewField] = useState('')

  const addStatus = () => {
    const key = newKey.trim()
    if (!key || value[key]) return
    onChange({
      ...value,
      [key]: {
        $allContainers: {},
        $allFields: {},
        containers: {},
        fields: {},
      },
    })
    setNewKey('')
  }

  const updateStatus = (key: string, next: OperationStatusRule) => {
    onChange({ ...value, [key]: next })
  }

  const removeStatus = (key: string) => {
    const next = { ...value }
    delete next[key]
    onChange(next)
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Reglas por estado de operación</h3>
        <p className="text-sm text-gray-500">
          Configurá reglas globales y por campo para cada estado.
        </p>
      </div>

      <div className="border rounded-lg bg-white p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <TextInput
            label="Nuevo estado"
            value={newKey}
            onChange={setNewKey}
            placeholder="ej: PENDIENTE"
          />
          <Button onClick={addStatus} disabled={!newKey.trim()}>
            Agregar estado
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(value).map(([status, rule]) => (
          <div key={status} className="border rounded-lg bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{status}</div>
                <div className="text-xs text-gray-500">Reglas para este estado</div>
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => removeStatus(status)}
              >
                Eliminar estado
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="border rounded-lg bg-white p-4">
                <h4 className="text-sm font-semibold mb-3">Todas las reglas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-2">$allContainers</div>
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={rule.$allContainers?.enabled ?? false}
                          onChange={(e) =>
                            updateStatus(status, {
                              ...rule,
                              $allContainers: {
                                ...rule.$allContainers,
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        Habilitar contenedores
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-2">$allFields</div>
                    <div className="flex flex-col gap-2">
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={rule.$allFields?.enabled ?? false}
                          onChange={(e) =>
                            updateStatus(status, {
                              ...rule,
                              $allFields: {
                                ...rule.$allFields,
                                enabled: e.target.checked,
                              },
                            })
                          }
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        Habilitar campos
                      </label>
                      <label className="inline-flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={rule.$allFields?.required ?? false}
                          onChange={(e) =>
                            updateStatus(status, {
                              ...rule,
                              $allFields: {
                                ...rule.$allFields,
                                required: e.target.checked,
                              },
                            })
                          }
                          className="form-checkbox h-4 w-4 text-blue-600"
                        />
                        Requerir campos
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">Contenedores específicos</h4>
                <div className="space-y-3">
                  {(Object.entries(rule.containers ?? {}) as [string, OverrideRule][]).map(
                    ([key, override]) => (
                      <div
                        key={key}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-white p-3 rounded border"
                      >
                        <div>
                          <div className="font-medium">{key}</div>
                          <div className="text-xs text-gray-500">Contenedor</div>
                        </div>
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={override.visible ?? false}
                            onChange={(e) =>
                              updateStatus(status, {
                                ...rule,
                                containers: {
                                  ...rule.containers,
                                  [key]: { ...override, visible: e.target.checked },
                                },
                              })
                            }
                            className="form-checkbox h-4 w-4 text-blue-600"
                          />
                          Visible
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={override.enabled ?? false}
                            onChange={(e) =>
                              updateStatus(status, {
                                ...rule,
                                containers: {
                                  ...rule.containers,
                                  [key]: { ...override, enabled: e.target.checked },
                                },
                              })
                            }
                            className="form-checkbox h-4 w-4 text-blue-600"
                          />
                          Habilitado
                        </label>
                        <button
                          type="button"
                          className="text-xs text-red-600 hover:underline"
                          onClick={() => {
                            const next = { ...rule.containers }
                            if (next) {
                              delete next[key]
                            }
                            updateStatus(status, { ...rule, containers: next })
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    )
                  )}

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                      <Select
                        label="Agregar contenedor"
                        value={newContainer}
                        onChange={setNewContainer}
                        options={[
                          { value: '', label: 'Seleccionar contenedor...' },
                          ...availableContainers
                            .filter((k) => !(rule.containers && k in rule.containers))
                            .map((k) => ({ value: k, label: k })),
                        ]}
                      />
                      <Button
                        variant="secondary"
                        disabled={!newContainer}
                        onClick={() => {
                          if (!newContainer) return
                          updateStatus(status, {
                            ...rule,
                            containers: {
                              ...rule.containers,
                              [newContainer]: {},
                            },
                          })
                          setNewContainer('')
                        }}
                      >
                        Agregar contenedor
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
                      <Select
                        label="Agregar campo"
                        value={newField}
                        onChange={setNewField}
                        options={[
                          { value: '', label: 'Seleccionar campo...' },
                          ...availableFields
                            .filter((k) => !(rule.fields && k in rule.fields))
                            .map((k) => ({ value: k, label: k })),
                        ]}
                      />
                      <Button
                        variant="secondary"
                        disabled={!newField}
                        onClick={() => {
                          if (!newField) return
                          updateStatus(status, {
                            ...rule,
                            fields: {
                              ...rule.fields,
                              [newField]: {},
                            },
                          })
                          setNewField('')
                        }}
                      >
                        Agregar campo
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FieldOptionsEditor({
  value,
  onChange,
}: {
  value: Record<string, FieldOption>
  onChange: (value: Record<string, FieldOption>) => void
}) {
  const [newKey, setNewKey] = useState('')

  const addFieldOption = () => {
    const key = newKey.trim()
    if (!key || value[key]) return
    onChange({
      ...value,
      [key]: {
        source: 'static',
        allowEmptyOption: true,
        emptyOptionLabel: '-- seleccionar --',
        items: [],
      },
    })
    setNewKey('')
  }

  const updateFieldOption = (key: string, next: FieldOption) => {
    onChange({ ...value, [key]: next })
  }

  const removeFieldOption = (key: string) => {
    const next = { ...value }
    delete next[key]
    onChange(next)
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Opciones de campos</h3>
        <p className="text-sm text-gray-500">
          Configurá los valores posibles para campos tipo select.
        </p>
      </div>

      <div className="border rounded-lg bg-white p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <TextInput
            label="Nuevo campo"
            value={newKey}
            onChange={setNewKey}
            placeholder="ej: tipoDocumento"
          />
          <Button onClick={addFieldOption} disabled={!newKey.trim()}>
            Agregar campo
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(value).map(([key, opt]) => (
          <div key={key} className="border rounded-lg bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{key}</div>
                <div className="text-xs text-gray-500">Opciones de selección</div>
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => removeFieldOption(key)}
              >
                Eliminar campo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select
                label="Source"
                value={opt.source}
                onChange={(v) =>
                  updateFieldOption(key, {
                    ...opt,
                    source: v as FieldOption['source'],
                  })
                }
                options={[
                  { value: 'static', label: 'Static' },
                  { value: 'dynamic', label: 'Dynamic' },
                ]}
              />
              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={opt.allowEmptyOption ?? false}
                    onChange={(e) =>
                      updateFieldOption(key, {
                        ...opt,
                        allowEmptyOption: e.target.checked,
                      })
                    }
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  Permitir opción vacía
                </label>
                <TextInput
                  label="Label opción vacía"
                  value={opt.emptyOptionLabel ?? ''}
                  onChange={(v) =>
                    updateFieldOption(key, {
                      ...opt,
                      emptyOptionLabel: v,
                    })
                  }
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold mb-2">Items</div>
              <div className="space-y-2">
                {(opt.items ?? []).map((item, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <TextInput
                      label="Valor"
                      value={item.value}
                      onChange={(v) => {
                        const items = [...(opt.items ?? [])]
                        items[idx] = { ...items[idx], value: v }
                        updateFieldOption(key, { ...opt, items })
                      }}
                    />
                    <TextInput
                      label="Etiqueta"
                      value={item.label}
                      onChange={(v) => {
                        const items = [...(opt.items ?? [])]
                        items[idx] = { ...items[idx], label: v }
                        updateFieldOption(key, { ...opt, items })
                      }}
                    />
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const items = [...(opt.items ?? [])]
                        items.splice(idx, 1)
                        updateFieldOption(key, { ...opt, items })
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={() =>
                    updateFieldOption(key, {
                      ...opt,
                      items: [...(opt.items ?? []), { value: '', label: '' }],
                    })
                  }
                >
                  Agregar item
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorCatalogEditor({
  value,
  onChange,
}: {
  value: ErrorCatalog
  onChange: (value: ErrorCatalog) => void
}) {
  const [newKey, setNewKey] = useState('')
  const [search, setSearch] = useState('')

  const filteredEntries = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return Object.entries(value)
    return Object.entries(value).filter(([key, entry]) => {
      return (
        key.toLowerCase().includes(term) || entry.message.toLowerCase().includes(term)
      )
    })
  }, [search, value])

  const addEntry = () => {
    const key = newKey.trim()
    if (!key || value[key]) return
    onChange({ ...value, [key]: { message: '' } })
    setNewKey('')
  }

  const updateEntry = (key: string, message: string) => {
    onChange({ ...value, [key]: { message } })
  }

  const removeEntry = (key: string) => {
    const next = { ...value }
    delete next[key]
    onChange(next)
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Catálogo de errores</h3>
        <p className="text-sm text-gray-500">
          Mensajes que se muestran según el error (por código).
        </p>
      </div>

      <div className="border rounded-lg bg-white p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <TextInput
            label="Buscar"
            value={search}
            onChange={setSearch}
            placeholder="Buscar por código o mensaje..."
          />
        </div>
      </div>

      <div className="border rounded-lg bg-white p-4 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <TextInput
            label="Nuevo código"
            value={newKey}
            onChange={setNewKey}
            placeholder="ej: ERR_REQUIRED"
          />
          <Button onClick={addEntry} disabled={!newKey.trim()}>
            Agregar código
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredEntries.map(([key, entry]) => (
          <div key={key} className="border rounded-lg bg-gray-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">{key}</div>
                <div className="text-xs text-gray-500">Código de error</div>
              </div>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => removeEntry(key)}
              >
                Eliminar
              </button>
            </div>
            <div className="mt-4">
              <TextInput
                label="Mensaje"
                value={entry.message}
                onChange={(v) => updateEntry(key, v)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
