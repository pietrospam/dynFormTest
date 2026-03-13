# Especificación: Página Web Demo - Dynamic Form Rules Engine

## 1. Objetivo

Crear una página web interactiva que demuestre el funcionamiento del Dynamic Form Rules Engine, permitiendo al usuario:

- Visualizar el formulario dinámico renderizado
- Cambiar el contexto (operationType, operationStatus) en tiempo real
- Ver cómo cambian los campos según las reglas
- Probar validaciones
- Inspeccionar el estado resuelto de campos y containers

---

## 2. Stack Tecnológico

- **Framework**: React 18+ con TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Estado**: React hooks (useState, useEffect)
- **Engine**: dynamic-form-rules-engine (local)

---

## 3. Layout de la Página

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header: "Dynamic Form Rules Engine - Demo"                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐  ┌─────────────────────────────────────┐  │
│  │  Panel de Control   │  │  Formulario Dinámico                │  │
│  │                     │  │                                     │  │
│  │  Operation Type:    │  │  ┌─────────────────────────────┐   │  │
│  │  [PMI ▼]            │  │  │ Datos del Transportista     │   │  │
│  │                     │  │  │                             │   │  │
│  │  Operation Status:  │  │  │  CUIT: [___________]        │   │  │
│  │  [PENDIENTE ▼]      │  │  │  Nombre: [___________]      │   │  │
│  │                     │  │  │  Tipo Doc: [-- select --]   │   │  │
│  │  ─────────────────  │  │  └─────────────────────────────┘   │  │
│  │                     │  │                                     │  │
│  │  [Validar Form]     │  │  ┌─────────────────────────────┐   │  │
│  │  [Reset Form]       │  │  │ Datos de la Carga           │   │  │
│  │                     │  │  │                             │   │  │
│  └─────────────────────┘  │  │  Peso Bruto: [________]     │   │  │
│                           │  │  Observaciones: [______]    │   │  │
│  ┌─────────────────────┐  │  └─────────────────────────────┘   │  │
│  │  Inspector          │  │                                     │  │
│  │                     │  │  [Guardar]                          │  │
│  │  Field: cuit...     │  │                                     │  │
│  │  visible: true      │  └─────────────────────────────────────┘  │
│  │  enabled: true      │                                           │
│  │  required: true     │  ┌─────────────────────────────────────┐  │
│  │  validations: [...]│  │  Resultado Validación               │  │
│  │                     │  │  ✅ Formulario válido               │  │
│  └─────────────────────┘  │  o                                  │  │
│                           │  ❌ cuitTransportista: obligatorio  │  │
│                           │  ❌ pesoBruto: debe ser positivo    │  │
│                           └─────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Componentes

### 4.1 `App.tsx`
Componente raíz que inicializa el engine y gestiona el estado global.

```tsx
// Estado principal
- context: { operationType, operationStatus }
- formData: Record<string, unknown>
- validationResult: FormValidationResult | null
- selectedField: string | null (para inspector)
```

### 4.2 `ControlPanel.tsx`
Panel lateral para cambiar el contexto.

**Props:**
- `context`: FormContext actual
- `onContextChange`: callback para actualizar contexto
- `onValidate`: callback para validar formulario
- `onReset`: callback para resetear formulario

**Elementos:**
- Select para `operationType`: PMI, SIN_TRANSPORTISTA
- Select para `operationStatus`: PENDIENTE, EGRESADA
- Botón "Validar Formulario"
- Botón "Reset"

### 4.3 `DynamicForm.tsx`
Contenedor principal del formulario.

**Props:**
- `engine`: FormRulesEngine
- `context`: FormContext
- `formData`: datos del formulario
- `onChange`: callback cuando cambia un campo
- `onFieldSelect`: callback cuando se selecciona un campo (para inspector)
- `validationErrors`: errores de validación por campo

**Comportamiento:**
- Obtiene `getFormDefinition()` del engine
- Itera containers y renderiza `FormSection` para cada uno visible
- Muestra mensaje si no hay containers visibles

### 4.4 `FormSection.tsx`
Sección/container del formulario.

**Props:**
- `container`: ResolvedContainer
- `fields`: ResolvedField[]
- `formData`: datos del formulario
- `onChange`: callback
- `onFieldSelect`: callback
- `validationErrors`: errores

**Render:**
- Card con título del container
- Grid de campos usando `FieldRenderer`
- Visual disabled si container.enabled = false

### 4.5 `FieldRenderer.tsx`
Renderiza el campo según su tipo de componente.

**Props:**
- `field`: ResolvedField
- `value`: valor actual
- `onChange`: callback
- `onFocus`: callback (para inspector)
- `onBlur` **(nuevo)**: llamado cuando el campo pierde foco; se usa para disparar validación individual sobre ese field, p.ej. `brix` o `cuitTransportista`
- `error`: error de validación si existe

**Componentes soportados:**
- `TextInput`: input type text
- `NumberInput`: input type number
- `Select`: select con options
- `Textarea`: textarea

**Visual:**
- Label con asterisco si required
- Estilo disabled si !enabled
- Borde rojo y mensaje si hay error

### 4.6 Pie de formulario
Al final del formulario (debajo de los campos visibles) se muestra un botón **Siguiente** en todos los contextos. El botón está deshabilitado mientras existan errores de validación; el demo recalcula automáticamente `validateForm` cada vez que cambian los datos o se abandona un campo, por lo que basta con depender de `validationResult.valid`.

### 4.7 `FieldInspector.tsx`
Panel que muestra el estado resuelto del campo seleccionado.

**Props:**
- `field`: ResolvedField | null
- `engine`: FormRulesEngine
- `context`: FormContext

**Muestra:**
- Nombre del campo
- `visible`, `enabled`, `required`
- `dataType`, `defaultValue`
- Lista de validaciones configuradas
- Container al que pertenece

### 4.7 `ValidationResults.tsx`
Panel que muestra los resultados de la última validación.

**Props:**
- `result`: FormValidationResult | null

**Render:**
- Icono ✅/❌ según valid
- Lista de errores por campo si los hay

---

## 5. Flujo de Datos

```
┌──────────────┐
│ ControlPanel │
└──────┬───────┘
       │ onContextChange
       ▼
┌──────────────┐     ┌────────────────┐
│     App      │────▶│ FormRulesEngine│
│   (state)    │     │   .load()      │
└──────┬───────┘     │   .getForm...  │
       │             └────────────────┘
       ▼
┌──────────────┐
│ DynamicForm  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ FormSection  │ (por cada container visible)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│FieldRenderer │ (por cada field visible)
└──────────────┘
```

---

## 6. Interacciones Clave

### 6.1 Cambio de Contexto
1. Usuario cambia `operationType` o `operationStatus`
2. `App` actualiza `context` state
3. `DynamicForm` re-renderiza consultando al engine
4. Containers/campos aparecen/desaparecen según reglas
5. Valores de campos invisibles se mantienen (no se pierden)

### 6.2 Edición de Campo
1. Usuario escribe en un campo
2. `FieldRenderer` llama `onChange(fieldName, newValue)`
3. `App` actualiza `formData` state
4. Si hay `validationResult`, se limpia el error de ese campo

### 6.3 Validación
1. Usuario clickea "Validar Formulario"
2. `App` llama `engine.validateForm(formData, context)`
3. Se guarda resultado en state
4. `ValidationResults` muestra errores
5. `FieldRenderer` muestra errores inline por campo

### 6.4 Reset
1. Usuario clickea "Reset"
2. `App` llama `engine.getInitialValues(context)`
3. Se actualiza `formData` con valores por defecto
4. Se limpia `validationResult`

### 6.5 Inspector
1. Usuario hace focus en un campo
2. `App` actualiza `selectedField`
3. `FieldInspector` muestra metadata del campo seleccionado

---

## 7. Estados Visuales

### Campo Normal
- Label negro
- Input con borde gris
- Fondo blanco

### Campo Required
- Label con asterisco rojo: "CUIT *"

### Campo Disabled
- Fondo gris claro
- Texto gris
- Cursor not-allowed

### Campo con Error
- Borde rojo
- Mensaje de error debajo en rojo
- Icono de warning

### Container Disabled
- Todos sus campos disabled
- Opacidad reducida
- Badge "Solo lectura"

### Container Oculto
- No se renderiza

---

## 8. Responsive

- **Desktop (>1024px)**: Layout de 3 columnas (control | form | inspector)
- **Tablet (768-1024px)**: Layout de 2 columnas (control+inspector colapsable | form)
- **Mobile (<768px)**: Layout de 1 columna con tabs o acordeón

---

## 9. Estructura de Archivos

```
demo/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── ControlPanel.tsx
│   │   ├── DynamicForm.tsx
│   │   ├── FormSection.tsx
│   │   ├── FieldRenderer.tsx
│   │   ├── FieldInspector.tsx
│   │   ├── ValidationResults.tsx
│   │   └── ui/
│   │       ├── TextInput.tsx
│   │       ├── NumberInput.tsx
│   │       ├── Select.tsx
│   │       ├── Textarea.tsx
│   │       ├── Button.tsx
│   │       └── Card.tsx
│   ├── hooks/
│   │   └── useFormEngine.ts
│   ├── config/
│   │   └── index.ts (re-exporta JSONs de config)
│   └── styles/
│       └── index.css
└── public/
    └── favicon.ico
```

---

## 10. Hook Principal: `useFormEngine`

```typescript
function useFormEngine(context: FormContext) {
  const [engine] = useState(() => {
    const e = new FormRulesEngine()
    e.load(config)
    return e
  })

  const formDefinition = useMemo(
    () => engine.getFormDefinition(context),
    [engine, context]
  )

  const initialValues = useMemo(
    () => engine.getInitialValues(context),
    [engine, context]
  )

  const validateField = useCallback(
    (fieldName: string, value: unknown) => 
      engine.validateField(fieldName, value, context),
    [engine, context]
  )

  const validateForm = useCallback(
    (formData: FormData) => 
      engine.validateForm(formData, context),
    [engine, context]
  )

  return {
    engine,
    formDefinition,
    initialValues,
    validateField,
    validateForm,
  }
}
```

---

## 11. Escenarios de Demo

La página debe facilitar probar estos escenarios:

### Escenario 1: PMI Normal
- operationType: PMI
- operationStatus: PENDIENTE
- Resultado: Todo visible y editable

### Escenario 2: Sin Transportista
- operationType: SIN_TRANSPORTISTA
- operationStatus: PENDIENTE
- Resultado: Sección transportista oculta

### Escenario 3: Operación Cerrada
- operationType: PMI
- operationStatus: EGRESADA
- Resultado: Todo disabled excepto observaciones

### Escenario 4: Validación con Errores
- Dejar campos required vacíos
- Poner peso negativo
- Validar y ver errores

---

## 12. Criterios de Aceptación

- [ ] La página carga sin errores
- [ ] Cambiar operationType actualiza el formulario inmediatamente
- [ ] Cambiar operationStatus actualiza el formulario inmediatamente
- [ ] Campos required muestran asterisco
- [ ] Campos disabled no son editables
- [ ] Containers ocultos no se renderizan
- [ ] Validar muestra todos los errores
- [ ] Errores se muestran inline en cada campo
- [ ] Reset vuelve a valores iniciales
- [ ] Inspector muestra metadata del campo seleccionado
- [ ] Select muestra opciones correctas incluyendo opción vacía
- [ ] La página es responsive

---

## 13. Comandos

```bash
# Desde la carpeta demo/
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
```
