# Dynamic Form Rules Engine
## Spec reformulada para Node.js / Electron + React

---

## 1. Objetivo

Desarrollar una librería reutilizable para aplicaciones Electron/Node.js que permita definir el comportamiento de formularios mediante archivos JSON.

La librería debe:

- resolver visibilidad de containers y campos
- resolver enabled / disabled
- resolver required según contexto
- devolver valores por defecto
- devolver options para campos tipo select
- validar campos y formularios completos
- centralizar mensajes de error mediante códigos

La librería **no** debe:

- renderizar JSX / HTML
- decidir layout visual final
- imponer clases CSS responsivas
- reemplazar a React como dueño de la composición visual

---

## 2. Principio de diseño

### 2.1 Separación de responsabilidades

#### La librería resuelve
- reglas de negocio de pantalla
- metadata funcional
- validaciones
- options
- estado final del campo o container

#### React resuelve
- layout
- orden visual
- filas / columnas
- grid / flex
- CSS y responsividad
- componente concreto a renderizar

### 2.2 Consecuencia importante

Dar de alta un campo en JSON **no alcanza** para que aparezca en pantalla.

Para mostrar un campo nuevo normalmente se requieren 2 pasos:

1. Darlo de alta en configuración
2. Ubicarlo en el layout React donde corresponda

Eso es comportamiento esperado y deseado.

---

## 3. Conceptos del modelo

### Field
Campo individual del formulario.

### Container
Sección o agrupador lógico de campos.

### Context
Objeto que describe el estado del formulario en tiempo de ejecución.

Ejemplo:

```json
{
  "operationType": "PMI",
  "operationStatus": "PENDIENTE"
}
```

### Validation Rule
Regla declarativa que se aplica al campo.

### Error Catalog
Catálogo centralizado de mensajes por código.

---

## 4. Estructura de configuración

```text
config/
 ├ containers.definition.json
 ├ fieldDefinitions.json
 ├ fieldOptions.json
 ├ validationRules.json
 ├ errorCatalog.json
 ├ operationTypeRules.json
 └ operationStatusRules.json
```

Cada archivo tiene una única responsabilidad principal.

---

## 5. Reglas de diseño de la configuración

### 5.1 Qué sí va en JSON

- nombre del campo
- label
- dataType
- defaultValue
- allowEmpty
- componente lógico (`TextInput`, `Select`, etc.)
- placeholder
- props funcionales del input como `maxLength`
- options de selects
- validaciones
- visibilidad / habilitación / required según contexto
- pertenencia a container

### 5.2 Qué no debería ir en JSON

- widths fijos en px
- grid CSS real
- breakpoints concretos
- clases responsivas
- layout detallado de filas y columnas

La razón es evitar acoplamiento entre configuración declarativa y CSS/responsividad.

---

## 6. Containers

Archivo: `containers.definition.json`

Responsabilidad:
- definir secciones lógicas
- exponer metadata funcional del agrupador

Ejemplo:

```json
{
  "datosTransportista": {
    "label": "Datos del transportista",
    "visible": true,
    "enabled": true,
    "ui": {
      "component": "Section"
    }
  }
}
```

### Reglas

- si un container resulta `visible = false`, no se renderiza
- si un container resulta `visible = false`, sus campos no se renderizan
- si un container resulta `visible = false`, sus campos no se validan
- si un container resulta `enabled = false`, por defecto sus campos quedan deshabilitados

---

## 7. Fields

Archivo: `fieldDefinitions.json`

Responsabilidad:
- definir la identidad base del campo
- definir metadata funcional del control

Ejemplo:

```json
{
  "cuitTransportista": {
    "container": "datosTransportista",
    "dataType": "string",
    "label": "CUIT",
    "defaultValue": "",
    "allowEmpty": false,
    "ui": {
      "component": "TextInput",
      "placeholder": "Ingresá el CUIT",
      "inputProps": {
        "maxLength": 11
      }
    }
  }
}
```

### Campos soportados

- `container`
- `dataType`
- `label`
- `defaultValue`
- `allowEmpty`
- `ui.component`
- `ui.placeholder`
- `ui.inputProps`

### Nota sobre `inputProps.maxLength`

`maxLength` dentro de `ui.inputProps` sirve para que el frontend lo aplique al input.

Eso **no reemplaza** a la validación funcional `maxLength`, que debe seguir definida en `validationRules.json` si se desea validar formalmente el dato.

---

## 8. Options para Select

Archivo: `fieldOptions.json`

Responsabilidad:
- definir la fuente de opciones de campos tipo `Select`

Ejemplo:

```json
{
  "tipoDocumento": {
    "source": "static",
    "allowEmptyOption": true,
    "emptyOptionLabel": "-- seleccionar --",
    "items": [
      { "value": "DNI", "label": "DNI" },
      { "value": "CUIT", "label": "CUIT" }
    ]
  }
}
```

### Reglas

- en esta primera etapa solo se soporta `source = static`
- si `allowEmptyOption = true`, la librería puede devolver una opción vacía al inicio

---

## 9. Validaciones

Archivo: `validationRules.json`

Responsabilidad:
- definir validaciones funcionales por campo

Ejemplo:

```json
{
  "pesoBruto": [
    { "type": "required", "errorCode": "ERR_REQUIRED" },
    { "type": "numeric", "errorCode": "ERR_NUMERIC" },
    { "type": "positive", "errorCode": "ERR_POSITIVE" }
  ]
}
```

### Validaciones mínimas sugeridas

- `required`
- `numeric`
- `string`
- `positive`
- `min`
- `max`
- `range`
- `minLength`
- `maxLength`
- `oneOf`

---

## 10. Catálogo de errores

Archivo: `errorCatalog.json`

Responsabilidad:
- centralizar mensajes por código

Ejemplo:

```json
{
  "ERR_REQUIRED": {
    "message": "El campo es obligatorio."
  }
}
```

### Regla

Toda validación debe referenciar un `errorCode` existente en el catálogo.

---

## 11. Reglas por tipo de operación

Archivo: `operationTypeRules.json`

Responsabilidad:
- ajustar comportamiento según `operationType`

Puede aplicar overrides a:
- containers
- fields

Ejemplo:

```json
{
  "SIN_TRANSPORTISTA": {
    "containers": {
      "datosTransportista": {
        "visible": false
      }
    }
  }
}
```

---

## 12. Reglas por estado de operación

Archivo: `operationStatusRules.json`

Responsabilidad:
- ajustar comportamiento según `operationStatus`

Ejemplo:

```json
{
  "EGRESADA": {
    "$allFields": {
      "enabled": false,
      "required": false
    },
    "$allContainers": {
      "enabled": false
    }
  }
}
```

### Regla clave

Un estado como `EGRESADA` puede bloquear la edición de casi todo el formulario de forma global.

---

## 13. Precedencia de resolución

La resolución final recomendada sigue este orden:

1. `containers.definition.json`
2. `fieldDefinitions.json`
3. `fieldOptions.json`
4. `validationRules.json`
5. `operationTypeRules.json`
6. `operationStatusRules.json`

Las reglas posteriores pisan las anteriores.

---

## 14. API pública sugerida

### 14.1 `load(config)`
Carga toda la configuración.

```ts
engine.load({
  containers,
  fieldDefinitions,
  fieldOptions,
  validationRules,
  errorCatalog,
  operationTypeRules,
  operationStatusRules
})
```

### 14.2 `getContainerDefinition(containerName, context, formData?)`
Devuelve el container resuelto.

### 14.3 `getFieldDefinition(fieldName, context, formData?)`
Devuelve el campo resuelto.

### 14.4 `getFormDefinition(context, formData?)`
Devuelve el formulario resuelto agrupado por containers.

### 14.5 `getInitialValues(context)`
Devuelve el objeto inicial según `defaultValue`.

### 14.6 `validateField(fieldName, value, context, formData?)`
Valida un campo puntual.

### 14.7 `validateForm(formData, context)`
Valida el formulario completo.

---

## 15. Contrato de salida sugerido

### Field resuelto

```json
{
  "name": "cuitTransportista",
  "container": "datosTransportista",
  "dataType": "string",
  "label": "CUIT",
  "defaultValue": "",
  "allowEmpty": false,
  "visible": true,
  "enabled": true,
  "required": true,
  "ui": {
    "component": "TextInput",
    "placeholder": "Ingresá el CUIT",
    "inputProps": {
      "maxLength": 11
    }
  },
  "validations": [
    {
      "type": "required",
      "errorCode": "ERR_REQUIRED"
    }
  ]
}
```

### Container resuelto

```json
{
  "name": "datosTransportista",
  "label": "Datos del transportista",
  "visible": true,
  "enabled": true,
  "ui": {
    "component": "Section"
  }
}
```

---

## 16. Integración con React

### Regla principal

React conserva el control del layout.

Ejemplo conceptual:

```jsx
function TransportistaSection({ context, formData }) {
  const container = engine.getContainerDefinition("datosTransportista", context, formData)

  if (!container?.visible) return null

  return (
    <Section title={container.label} disabled={!container.enabled}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldSlot fieldName="cuitTransportista" context={context} formData={formData} />
        <FieldSlot fieldName="nombreTransportista" context={context} formData={formData} />
        <FieldSlot fieldName="tipoDocumento" context={context} formData={formData} />
      </div>
    </Section>
  )
}
```

### `FieldSlot`

`FieldSlot` consulta a la librería y decide si renderiza o no.

```jsx
function FieldSlot({ fieldName, context, formData }) {
  const field = engine.getFieldDefinition(fieldName, context, formData)

  if (!field || !field.visible) return null

  switch (field.ui.component) {
    case "TextInput":
      return (
        <TextInput
          label={field.label}
          disabled={!field.enabled}
          required={field.required}
          placeholder={field.ui?.placeholder}
          maxLength={field.ui?.inputProps?.maxLength}
        />
      )

    case "Select":
      return (
        <Select
          label={field.label}
          disabled={!field.enabled}
          required={field.required}
          options={field.options || []}
        />
      )

    default:
      return null
  }
}
```

---

## 17. Ejemplo funcional del formulario

### Contexto A

```json
{
  "operationType": "PMI",
  "operationStatus": "PENDIENTE"
}
```

Resultado esperado:
- se ve `datosTransportista`
- se ve `datosCarga`
- `cuitTransportista` requerido
- `pesoBruto` requerido

### Contexto B

```json
{
  "operationType": "SIN_TRANSPORTISTA",
  "operationStatus": "PENDIENTE"
}
```

Resultado esperado:
- `datosTransportista` oculto
- sus campos no se renderizan
- sus campos no se validan

### Contexto C

```json
{
  "operationType": "PMI",
  "operationStatus": "EGRESADA"
}
```

Resultado esperado:
- containers visibles según corresponda
- campos deshabilitados globalmente
- sin required activos en campos disabled

---

## 18. Test cases

### 18.1 Configuración

#### TC-CONFIG-01
Dado un set completo de JSON válidos, `load()` debe cargar sin error.

#### TC-CONFIG-02
Si falta `fieldDefinitions`, `load()` debe fallar.

#### TC-CONFIG-03
Si una validación referencia un `errorCode` inexistente, la librería debe fallar al cargar o reportar inconsistencia.

### 18.2 Containers

#### TC-CONTAINER-01
Dado `operationType = SIN_TRANSPORTISTA`, `datosTransportista.visible` debe resultar `false`.

#### TC-CONTAINER-02
Si un container es invisible, sus campos no deben devolverse como renderables.

#### TC-CONTAINER-03
Si un container es invisible, sus campos no deben validarse.

### 18.3 Fields

#### TC-FIELD-01
Dado `operationType = PMI` y `operationStatus = PENDIENTE`, `cuitTransportista` debe resultar visible, enabled y required.

#### TC-FIELD-02
Dado `operationStatus = EGRESADA`, `pesoBruto.enabled` debe resultar `false`.

### 18.4 Options

#### TC-OPTIONS-01
`tipoDocumento` debe devolver opciones estáticas.

#### TC-OPTIONS-02
Si `allowEmptyOption = true`, debe existir opción vacía al inicio.

### 18.5 Validación de campo

#### TC-VAL-01
`pesoBruto = 100` debe validar correctamente.

#### TC-VAL-02
`pesoBruto = -10` debe devolver `ERR_POSITIVE`.

#### TC-VAL-03
`cuitTransportista = ""` en contexto requerido debe devolver `ERR_REQUIRED`.

#### TC-VAL-04
`nombreTransportista` con más de 80 caracteres debe devolver `ERR_MAX_80`.

### 18.6 Validación de formulario

#### TC-FORM-01
Un formulario válido debe devolver `valid = true`.

#### TC-FORM-02
Un formulario con múltiples errores debe devolver todos los errores esperados.

#### TC-FORM-03
Los campos invisibles no deben validarse.

#### TC-FORM-04
Los campos disabled por estado no deben disparar `required`.

---

## 19. Estructura de proyecto sugerida

```text
dynamic-form-rules-engine-example/
  config/
    containers.definition.json
    fieldDefinitions.json
    fieldOptions.json
    validationRules.json
    errorCatalog.json
    operationTypeRules.json
    operationStatusRules.json
  docs/
    spec.md
  src/
    engine/
      FormRulesEngine.ts
      config-loader.ts
      field-resolver.ts
      container-resolver.ts
      validation-resolver.ts
      option-resolver.ts
    validators/
      required.validator.ts
      numeric.validator.ts
      positive.validator.ts
      minLength.validator.ts
      maxLength.validator.ts
    types/
      config.types.ts
      engine.types.ts
      validation.types.ts
  tests/
    config/
      ...copias de config de prueba...
    unit/
      load.spec.ts
      container-resolution.spec.ts
      field-resolution.spec.ts
      validate-field.spec.ts
      validate-form.spec.ts
  examples/
    react-pattern/
      TransportistaSection.example.jsx
      FieldSlot.example.jsx
```

---

## 20. Criterios de aceptación

- la librería carga los JSON de configuración
- la librería resuelve containers y fields por contexto
- la librería expone metadata lista para que React renderice
- el layout sigue estando del lado de React
- la librería devuelve initial values
- la librería valida field y form
- los campos invisibles no se validan
- los campos disabled por estado no exigen required

