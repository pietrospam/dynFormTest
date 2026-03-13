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

## Carpeta de docs

- `docs/spec.md`: spec funcional y técnica reformulada

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
