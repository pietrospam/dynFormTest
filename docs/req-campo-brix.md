# Requerimiento: Campo BRIX y Tipo de Operación UVA

## 1. Descripción

Agregar un nuevo campo `brix` de tipo numérico con soporte para 2 decimales, con validación de rango [10, 25]. Además, crear un nuevo tipo de operación `UVA` donde únicamente se muestre este campo.

---

## 2. Cambios Requeridos

### 2.1 Archivos de Configuración

| Archivo | Cambio |
|---------|--------|
| `config/containers.definition.json` | Agregar container `datosCalidad` |
| `config/fieldDefinitions.json` | Agregar campo `brix` |
| `config/validationRules.json` | Agregar regla de rango para `brix` |
| `config/errorCatalog.json` | Agregar código `ERR_BRIX_RANGE` |
| `config/operationTypeRules.json` | Agregar tipo `UVA` con visibilidad específica |

### 2.2 Archivos de Test

| Archivo | Cambio |
|---------|--------|
| `tests/config/*.json` | Replicar cambios de configuración |

### 2.3 Código (si aplica)

No se requieren cambios de código. El validador `range` ya está implementado en `src/validators/index.ts`.

### 2.4 Demo Web

| Archivo | Cambio |
|---------|--------|
| `demo/src/config/index.ts` | Agregar opción `UVA` a `operationTypes` |

---

## 3. Detalle de Configuración

### 3.1 Container: `datosCalidad`

```json
{
  "datosCalidad": {
    "label": "Datos de Calidad",
    "visible": true,
    "enabled": true,
    "ui": {
      "component": "Section"
    }
  }
}
```

### 3.2 Campo: `brix`

```json
{
  "brix": {
    "container": "datosCalidad",
    "dataType": "number",
    "label": "Grados Brix",
    "defaultValue": null,
    "allowEmpty": false,
    "ui": {
      "component": "NumberInput",
      "placeholder": "Ej: 18.5",
      "inputProps": {
        "step": 0.01,
        "min": 10,
        "max": 25
      }
    }
  }
}
```

### 3.3 Validación: `brix`

```json
{
  "brix": [
    { "type": "required", "errorCode": "ERR_REQUIRED" },
    { "type": "numeric", "errorCode": "ERR_NUMERIC" },
    { "type": "range", "value": [10, 25], "errorCode": "ERR_BRIX_RANGE" }
  ]
}
```

### 3.4 Error: `ERR_BRIX_RANGE`

```json
{
  "ERR_BRIX_RANGE": {
    "message": "El campo brix debe ser un valor comprendido entre 10 y 25"
  }
}
```

### 3.5 Tipo de Operación: `UVA`

```json
{
  "UVA": {
    "containers": {
      "datosTransportista": { "visible": false },
      "datosCarga": { "visible": false },
      "datosCalidad": { "visible": true, "enabled": true }
    },
    "fields": {
      "brix": { "visible": true, "enabled": true, "required": true }
    }
  }
}
```

### 3.6 Otros Tipos de Operación

Para `PMI` y `SIN_TRANSPORTISTA`, el container `datosCalidad` debe estar oculto:

```json
{
  "PMI": {
    "containers": {
      "datosCalidad": { "visible": false }
    }
  },
  "SIN_TRANSPORTISTA": {
    "containers": {
      "datosCalidad": { "visible": false }
    }
  }
}
```

---

## 4. Resultado Esperado

### Contexto: `operationType = UVA`

- Solo se muestra el container "Datos de Calidad"
- Solo se muestra el campo "Grados Brix"
- El campo es requerido
- Validación de rango [10, 25]

### Contexto: `operationType = PMI` o `SIN_TRANSPORTISTA`

- El container "Datos de Calidad" está oculto
- El campo `brix` no se renderiza ni se valida

---

## 5. Test Cases

### TC-BRIX-01
Campo `brix = 18.5` debe validar correctamente.

### TC-BRIX-02
Campo `brix = 9` debe devolver `ERR_BRIX_RANGE`.

### TC-BRIX-03
Campo `brix = 26` debe devolver `ERR_BRIX_RANGE`.

### TC-BRIX-04
En `operationType = UVA`, solo debe verse el campo `brix`.

### TC-BRIX-05
En `operationType = PMI`, el container `datosCalidad` debe estar oculto.

---

## 6. Demo Web

Agregar "UVA - Uva" a las opciones de tipo de operación para poder probar el nuevo escenario.
