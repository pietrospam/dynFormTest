# Config Editor Web App - Especificación

## Objetivo

Crear una aplicación web independiente dentro del repositorio que permita **editar visualmente los archivos de configuración** utilizados por el motor de formularios (`dynFormTest`). Esta app debe ser una herramienta de edición / exportación, con:

- **Modo visual** (formularios para cada tipo de config)
- **Modo JSON** (edición raw+validación)
- **Export / descarga** de JSON actualizado
- **Soporte para los archivos** del motor: contenedores, campos, reglas, validaciones, catálogo de errores, opciones, reglas de operación.

La app debe vivir fuera de `demo/` (por ejemplo `config-editor/`) para que no mezcle su código con el demo.

---

## Alcance inicial (MVP)

### Archivos a editar

La aplicación debe permitir seleccionar y editar al menos:

- `containers.definition.json`
- `fieldDefinitions.json`
- `fieldOptions.json`
- `validationRules.json`
- `errorCatalog.json`
- `operationTypeRules.json`
- `operationStatusRules.json`


### Funcionalidades mínimas

1. Selector de archivo (dropdown) para elegir qué config editar.
2. **Modo JSON**:
   - Editor de texto con validación de JSON.
   - Guardar/descargar JSON válido.
3. **Modo Visual** (MVP inicial):
   - Editor visual básico para al menos **una o dos configuraciones** (por ejemplo `fieldDefinitions.json` y `containers.definition.json`).
   - Permitir CRUD (crear/editar/eliminar) y campos clave.
4. Descarga del JSON modificado (botón “Descargar”).
5. Nota visible que indique que los cambios no se aplican directamente al repositorio; deben descargarse y reemplazarse manualmente.

---

## Requisitos de UX (básicos)

- Interfaz limpia y legible (usar Tailwind o similar).
- Validación de JSON con mensaje claro.
- Botones para “Restaurar”, “Descargar”, “Copiar”, “Validar”.
- Estado de “errores de validación” visible.

---

## Estructura recomendada del proyecto

```
config-editor/
  package.json
  vite.config.ts
  tsconfig.json
  public/
  src/
    App.tsx
    main.tsx
    components/
      ConfigEditor.tsx
      ... (UI helpers)
    config/
      containers.definition.json
      ... (copias de las configs)
    types/
      config.types.ts (puede reutilizar el de la librería)
```

---

## Pasos siguientes sugeridos

1. Crear el proyecto `config-editor/` con Vite + React + TS.
2. Implementar el componente base `ConfigEditor` con modo JSON + descarga.
3. Añadir editor visual para al menos `fieldDefinitions.json`.
4. Extender editores visuales a más archivos (validaciones, reglas, etc.).
