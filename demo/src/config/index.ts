// Re-export configuration files
import containers from '../../../config/containers.definition.json'
import fieldDefinitions from '../../../config/fieldDefinitions.json'
import fieldOptions from '../../../config/fieldOptions.json'
import validationRules from '../../../config/validationRules.json'
import errorCatalog from '../../../config/errorCatalog.json'
import operationTypeRules from '../../../config/operationTypeRules.json'
import operationStatusRules from '../../../config/operationStatusRules.json'

export const config = {
  containers,
  fieldDefinitions,
  fieldOptions,
  validationRules,
  errorCatalog,
  operationTypeRules,
  operationStatusRules,
}

// Available operation types and statuses for UI
export const operationTypes = [
  { value: 'PMI', label: 'PMI - Producto Mercado Interno' },
  { value: 'SIN_TRANSPORTISTA', label: 'Sin Transportista' },
  { value: 'UVA', label: 'UVA - Uva' },
]

export const operationStatuses = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EGRESADA', label: 'Egresada' },
]
