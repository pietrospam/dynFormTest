# DynForm Config Editor

Este proyecto es una aplicación web independiente para editar las configuraciones JSON utilizadas por el motor de formularios (`dynFormTest`).

## Qué hace

- Permite seleccionar archivos de config (`*.json`) y editarlos.
- Ofrece un modo JSON para editar directamente y un modo visual (básico) para visualizar.
- Permite descargar el JSON resultante.

> Nota: los cambios no se escriben en el repositorio. Para que se apliquen, descargá el JSON y reemplazá el archivo en `config/` dentro del proyecto principal.

## Cómo ejecutar

```bash
cd config-editor
npm install
npm run dev
```

Luego abrí http://localhost:5174

## Cómo extender

- Agregar nuevos editores visuales en `src/components/config/ConfigEditor.tsx`.
- Agregar nuevos archivos de configuración en `src/config/`.

---

## Documentación

Ver `../docs/config-editor-spec.md` para la especificación de requerimientos y el roadmap de funcionalidades.
