import { useEffect, useMemo, useState } from 'react'
import { jsonConfigs, type JsonConfigKey } from '../config/jsonConfigs'
import { Button, Select, TextInput, Textarea } from './ui'
import type {
  ContainerDefinition,
  FieldDefinition,
  FormConfig,
  FormConfigScreenOverrides,
  ValidationRule,
} from '../../../src/types/config.types'

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

type EditorMode = 'visual' | 'json'

function CheckboxField({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="form-checkbox h-4 w-4 text-blue-600"
      />
      {label}
    </label>
  )
}

function FieldDefinitionEditor({
  fieldName,
  value,
  onChange,
  onDelete,
}: {
  fieldName: string
  value: FieldDefinition
  onChange: (value: FieldDefinition) => void
  onDelete: () => void
}) {
  const update = (partial: Partial<FieldDefinition>) => onChange({ ...value, ...partial })

  return (
    <details className="border rounded p-3 mb-3" open>
      <summary className="cursor-pointer font-semibold">{fieldName}</summary>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
        <TextInput
          label="Etiqueta"
          value={value.label}
          onChange={(v) => update({ label: v })}
          required
        />
        <TextInput
          label="Contenedor"
          value={value.container}
          onChange={(v) => update({ container: v })}
          required
        />
        <Select
          label="Tipo de dato"
          value={value.dataType}
          onChange={(v) => update({ dataType: (v as FieldDefinition['dataType']) || 'string' })}
          options={[
            { value: 'string', label: 'string' },
            { value: 'number', label: 'number' },
            { value: 'boolean', label: 'boolean' },
          ]}
        />
        <TextInput
          label="Valor por defecto"
          value={String(value.defaultValue ?? '')}
          onChange={(v) => update({ defaultValue: v })}
        />
        <CheckboxField
          label="Permite vacío"
          checked={value.allowEmpty}
          onChange={(c) => update({ allowEmpty: c })}
        />
      </div>
      <div className="mt-3">
        <h4 className="text-sm font-semibold mb-2">Configuración UI</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Componente UI"
            value={value.ui.component}
            onChange={(v) => update({ ui: { ...value.ui, component: v } })}
          />
          <TextInput
            label="Placeholder"
            value={value.ui.placeholder ?? ''}
            onChange={(v) => update({ ui: { ...value.ui, placeholder: v } })}
          />
        </div>
      </div>
      <div className="mt-4 text-right">
        <Button variant="secondary" onClick={onDelete}>
          Eliminar campo
        </Button>
      </div>
    </details>
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
    if (!newField.trim() || value[newField]) return
    onChange({ ...value, [newField.trim()]: [] })
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
      <div className="flex flex-wrap gap-2 items-center mb-4">
        <TextInput
          label="Nuevo campo"
          value={newField}
          onChange={setNewField}
          placeholder="Nombre del campo"
        />
        <Button onClick={addField} disabled={!newField.trim()}>
          Agregar campo
        </Button>
      </div>

      {Object.entries(value).map(([field, rules]) => (
        <details key={field} className="border rounded p-3 mb-3" open>
          <summary className="cursor-pointer font-semibold">{field}</summary>
          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={() => removeField(field)}
              className="mb-3"
            >
              Eliminar campo
            </Button>
            <div className="space-y-3">
              {rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 border rounded grid grid-cols-1 md:grid-cols-4 gap-3 items-end"
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
                      const parsed = v === '' ? undefined : v
                      const next = [...rules]
                      next[idx] = { ...next[idx], value: parsed }
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
              <Button onClick={() => addRule(field)}>
                Agregar regla
              </Button>
            </div>
          </div>
        </details>
      ))}
    </div>
  )
}

function getConfigForFile(file: JsonConfigKey, config: FormConfig): unknown {
  switch (file) {
    case 'containers.definition.json':
      return config.containers
    case 'fieldDefinitions.json':
      return config.fieldDefinitions
    case 'fieldOptions.json':
      return config.fieldOptions
    case 'validationRules.json':
      return config.validationRules
    case 'errorCatalog.json':
      return config.errorCatalog
    case 'operationTypeRules.json':
      return config.operationTypeRules
    case 'operationStatusRules.json':
      return config.operationStatusRules
    case 'screens.json':
      return config.screens ?? {}
    default:
      return null
  }
}

function ConfigEditor({
  config,
  onConfigChange,
}: {
  config: FormConfig
  onConfigChange?: (file: JsonConfigKey, value: unknown) => void
}) {
  const files = useMemo(() => Object.keys(jsonConfigs) as JsonConfigKey[], [])
  const [selected, setSelected] = useState<JsonConfigKey>(files[0])
  const [mode, setMode] = useState<EditorMode>('visual')
  const [configData, setConfigData] = useState<unknown>(() =>
    getConfigForFile(files[0], config)
  )
  const [text, setText] = useState(() =>
    JSON.stringify(getConfigForFile(files[0], config), null, 2)
  )
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const value = getConfigForFile(selected, config)
    setConfigData(value)
    setText(JSON.stringify(value, null, 2))
    setError(null)
  }, [config, selected])

  const validate = () => {
    try {
      JSON.parse(text)
      setError(null)
      return true
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
      return false
    }
  }

  const handleFileChange = (file: JsonConfigKey) => {
    setSelected(file)
  }

  const handleDownload = () => {
    const content = mode === 'json' ? text : JSON.stringify(configData, null, 2)
    downloadText(selected, content)
  }

  const handleCopy = async () => {
    try {
      const content = mode === 'json' ? text : JSON.stringify(configData, null, 2)
      await navigator.clipboard.writeText(content)
    } catch {
      // ignore
    }
  }

  const handleReset = () => {
    const value = getConfigForFile(selected, config)
    setConfigData(value)
    setText(JSON.stringify(value, null, 2))
    setError(null)
  }

  const safeSetConfigData = (next: unknown) => {
    setConfigData(next)
    setText(JSON.stringify(next, null, 2))
    onConfigChange?.(selected, next)
  }

  const handleTextChange = (value: string) => {
    setText(value)
    try {
      const parsedValue = JSON.parse(value)
      setConfigData(parsedValue)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <label className="text-sm font-medium">Archivo:</label>
        <select
          value={selected}
          onChange={(e) => handleFileChange(e.target.value as JsonConfigKey)}
          className="px-2 py-1 border rounded"
        >
          {files.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
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

        <Button onClick={validate} variant="secondary">
          Validar JSON
        </Button>

        <Button onClick={handleDownload} disabled={!!error}>
          Descargar
        </Button>

        <Button
          onClick={() => onConfigChange?.(selected, configData)}
          variant="secondary"
          disabled={!!error || !onConfigChange}
        >
          Aplicar cambios en demo
        </Button>

        <Button onClick={handleCopy} variant="secondary">
          Copiar al portapapeles
        </Button>

        <Button onClick={handleReset} variant="secondary">
          Restaurar
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-600">Error al parsear JSON: {error}</div>
      )}

      {mode === 'json' ? (
        <Textarea
          label="JSON"
          value={text}
          onChange={handleTextChange}
          rows={20}
        />
      ) : (
        <div className="p-4 border rounded bg-white">
          <ConfigFileVisualEditor
            file={selected}
            value={configData}
            onChange={safeSetConfigData}
          />
        </div>
      )}

      <div className="text-xs text-gray-500">
        Nota: los cambios no se escriben directamente en los archivos del proyecto.
        Descargá el JSON y reemplazá el archivo correspondiente en <code>config/</code>.
      </div>
    </div>
  )
}

function ConfigFileVisualEditor({
  file,
  value,
  onChange,
}: {
  file: JsonConfigKey
  value: unknown
  onChange: (value: unknown) => void
}) {
  switch (file) {
    case 'containers.definition.json':
      return (
        <ContainersEditor
          value={value as Record<string, ContainerDefinition>}
          onChange={onChange}
        />
      )
    case 'fieldDefinitions.json':
      return (
        <FieldDefinitionsEditor
          value={value as Record<string, FieldDefinition>}
          onChange={onChange}
        />
      )
    case 'validationRules.json':
      return (
        <ValidationRulesEditor
          value={value as Record<string, ValidationRule[]>}
          onChange={onChange}
        />
      )
    case 'screens.json':
      return (
        <ScreensEditor
          value={value as Record<string, FormConfigScreenOverrides>}
          onChange={onChange}
        />
      )
    default:
      return (
        <div className="text-sm text-gray-600">
          Edición visual no disponible para este archivo. Usá la pestaña JSON.
        </div>
      )
  }
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

      {Object.entries(value).map(([key, container]) => (
        <details key={key} className="border rounded p-3 mb-3" open>
          <summary className="cursor-pointer font-semibold">{key}</summary>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <TextInput
              label="Etiqueta"
              value={container.label}
              onChange={(v) => update(key, { ...container, label: v })}
              required
            />
            <div className="flex flex-col gap-2">
              <CheckboxField
                label="Visible"
                checked={container.visible}
                onChange={(c) => update(key, { ...container, visible: c })}
              />
              <CheckboxField
                label="Habilitado"
                checked={container.enabled}
                onChange={(c) => update(key, { ...container, enabled: c })}
              />
            </div>
            <TextInput
              label="Componente UI"
              value={container.ui.component}
              onChange={(v) =>
                update(key, { ...container, ui: { ...container.ui, component: v } })
              }
            />
          </div>
          <div className="mt-4 text-right">
            <Button variant="secondary" onClick={() => remove(key)}>
              Eliminar contenedor
            </Button>
          </div>
        </details>
      ))}

      <div className="border rounded p-3">
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

      {Object.entries(value).map(([key, field]) => (
        <FieldDefinitionEditor
          key={key}
          fieldName={key}
          value={field}
          onChange={(next) => updateField(key, next)}
          onDelete={() => removeField(key)}
        />
      ))}

      <div className="border rounded p-3">
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

function ScreensEditor({
  value,
  onChange,
}: {
  value: Record<string, FormConfigScreenOverrides>
  onChange: (value: Record<string, FormConfigScreenOverrides>) => void
}) {
  const [newScreenId, setNewScreenId] = useState('')
  const [texts, setTexts] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  // Sync local text representation when value changes.
  useEffect(() => {
    setTexts(
      Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, JSON.stringify(val, null, 2)])
      )
    )
    setErrors({})
  }, [value])

  const addScreen = () => {
    const id = newScreenId.trim()
    if (!id || value[id]) return
    onChange({ ...value, [id]: {} })
    setNewScreenId('')
  }

  const removeScreen = (id: string) => {
    const next = { ...value }
    delete next[id]
    onChange(next)
  }

  const updateScreenJson = (id: string, jsonText: string) => {
    setTexts((prev) => ({ ...prev, [id]: jsonText }))
    try {
      const parsed = JSON.parse(jsonText)
      setErrors((prev) => ({ ...prev, [id]: null }))
      onChange({ ...value, [id]: parsed })
    } catch (err: unknown) {
      setErrors((prev) => ({
        ...prev,
        [id]: err instanceof Error ? err.message : String(err),
      }))
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Pantallas</h3>
        <p className="text-sm text-gray-500">
          Crea diferentes pantallas (screenId) y define overrides de configuración.
        </p>
      </div>

      <div className="border rounded p-3 mb-4">
        <h4 className="text-sm font-semibold mb-2">Agregar nueva pantalla</h4>
        <div className="flex gap-2 flex-wrap">
          <TextInput
            label="ID de pantalla"
            value={newScreenId}
            onChange={setNewScreenId}
            placeholder="ej: pantallaC"
          />
          <Button onClick={addScreen} disabled={!newScreenId.trim()}>
            Agregar
          </Button>
        </div>
      </div>

      {Object.entries(value).map(([id]) => (
        <details key={id} className="border rounded p-3 mb-3" open>
          <summary className="cursor-pointer font-semibold">{id}</summary>
          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={() => removeScreen(id)}
              className="mb-3"
            >
              Eliminar pantalla
            </Button>
            <Textarea
              label="Overrides (JSON)"
              value={texts[id] ?? ''}
              onChange={(v) => updateScreenJson(id, v)}
              rows={10}
            />
            {errors[id] && (
              <div className="text-sm text-red-600 mt-2">{errors[id]}</div>
            )}
          </div>
        </details>
      ))}
    </div>
  )
}

export { ConfigEditor }
