# DemoB - Configuración "Operaciones Generales"

Este demo está diseñado para usar la configuración expresada en la tabla de campos que compartiste.

## Contenido
- `config/containers.definition.json`: secciones del formulario.
- `config/fieldDefinitions.json`: definición de todos los campos mostrados en la tabla.
- `config/fieldOptions.json`: opciones para selects (`planta`, `tipoMovimiento`, `tipoCarga`).
- `config/validationRules.json`: algunas validaciones de ejemplo.
- `config/screens.json`: contiene la pantalla `OperacionesGenerales` con overrides de campos deshabilitados según la tabla.

## Ejecutar

```bash
cd demoB
npm install
npm run dev
```

Luego abrí el navegador en `http://localhost:5176/`.

## Qué hace

- La demo renderiza los campos y contenedores usando la librería del proyecto (`src/engine`).
- Se puede cambiar la pantalla (`screenId`) desde el panel izquierdo.
- También podés editar la configuración en la pestaña "Configuración".
