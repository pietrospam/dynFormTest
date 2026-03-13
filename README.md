# Dynamic Form Rules Engine

Ejemplo de estructura para una librería Node.js / Electron orientada a formularios React con:

- reglas declarativas en JSON
- soporte de containers / sections
- validaciones
- catálogo centralizado de errores
- options para selects
- layout y responsividad resueltos en React/CSS, no en JSON

## Idea principal

La librería **no renderiza UI** y **no decide layout visual**.

La librería resuelve:
- visibilidad
- enabled / disabled
- required
- validaciones
- default values
- options de selects
- metadata funcional del campo

El frontend React resuelve:
- ubicación visual de campos
- filas / columnas / grid
- CSS
- breakpoints y responsividad
- componente React concreto

## Soporte de múltiples pantallas (`screenId`)

La librería permite **usar distintas configuraciones según la pantalla** (o workflow) mediante un `screenId` en el contexto.

### Cómo funciona

- Pasás `screenId` junto con `operationType` / `operationStatus` al motor.
- La configuración JSON puede tener una sección `screens` con overrides:
  - El motor aplica la config base y luego mezcla (merge) los overrides de `screens[screenId]`.
- Esto permite tener:
  - **Distintas pantallas** que muestran campos distintos.
  - **Flujos completamente diferentes** (sin usar `operationType` / `operationStatus`).

### Estructura de ejemplo

```json
{
  "containers": { ... },
  "fieldDefinitions": { ... },
  "errorCatalog": { ... },
  "screens": {
    "pantallaA": {
      "containers": {
        "datosTransportista": { "visible": false }
      }
    },
    "pantallaB": {
      "fieldDefinitions": {
        "nombreTransportista": { "label": "Nombre (pantalla B)" }
      }
    }
  }
}
```

### Uso en el código

```ts
const context = {
  screenId: 'pantallaA',
  operationType: 'PMI',
  operationStatus: 'PENDIENTE',
}

const engine = new FormRulesEngine()
engine.load(config)
const formDef = engine.getFormDefinition(context)
```

> En el demo (carpeta `demo/`) podés crear nuevas `screenId` desde la interfaz y editar los overrides en el archivo `screens.json` directamente.

### Tests

Se incluye un test específico para validar que el `screenId` aplica los overrides correctamente:
- `tests/unit/screen-mode.spec.ts`

## Carpeta de docs

- `docs/spec.md`: spec funcional y técnica reformulada

## Ejecución

### Instalar dependencias

```bash
npm install
```

### Ejecutar tests

```bash
npm test
```

### Ejecutar demo (React)

```bash
cd demo
npm install
npm run dev
```

(Normalmente el demo corre en `http://localhost:5173/`)

## Carpeta de config

Contiene JSON de ejemplo:

- `containers.definition.json`
- `fieldDefinitions.json`
- `fieldOptions.json`
- `validationRules.json`
- `errorCatalog.json`
- `operationTypeRules.json`
- `operationStatusRules.json`

## Patrón sugerido en React

```jsx
<TransportistaSection context={context} formData={formData} />
```

Cada sección consulta a la librería para saber si el container debe mostrarse, y cada `FieldSlot` consulta a la librería para resolver el estado final del campo.
