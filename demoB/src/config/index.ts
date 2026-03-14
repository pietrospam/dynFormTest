// Re-export configuration files
import containers from '../../config/containers.definition.json'
import fieldDefinitions from '../../config/fieldDefinitions.json'
import fieldOptions from '../../config/fieldOptions.json'
import validationRules from '../../config/validationRules.json'
import errorCatalog from '../../config/errorCatalog.json'
import operationTypeRules from '../../config/operationTypeRules.json'
import operationStatusRules from '../../config/operationStatusRules.json'
import screens from '../../config/screens.json'

export const config = {
  containers,
  fieldDefinitions,
  fieldOptions,
  validationRules,
  errorCatalog,
  operationTypeRules,
  operationStatusRules,
  screens,
}

// Available operation types and statuses for UI
export const operationTypes = [
  { value: 'PTMI', label: 'PTMI' },
  { value: 'PTME', label: 'PTME' },
  { value: 'ESTIBA', label: 'ESTIBA' },
  { value: 'INSUMOS', label: 'INSUMOS' },
  { value: 'GASES', label: 'Gases' },
  { value: 'VINOGRANEL', label: 'Vino a Granel' },
  { value: 'SERVICIOS', label: 'SERVICIOS' },
  { value: 'SCRAP', label: 'SCRAP' },
]

export const operationStatuses = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EGRESADA', label: 'Egresada' },
]
