import containers from '../../../config/containers.definition.json'
import fieldDefinitions from '../../../config/fieldDefinitions.json'
import fieldOptions from '../../../config/fieldOptions.json'
import validationRules from '../../../config/validationRules.json'
import errorCatalog from '../../../config/errorCatalog.json'
import operationTypeRules from '../../../config/operationTypeRules.json'
import operationStatusRules from '../../../config/operationStatusRules.json'

export const jsonConfigs = {
  'containers.definition.json': containers,
  'fieldDefinitions.json': fieldDefinitions,
  'fieldOptions.json': fieldOptions,
  'validationRules.json': validationRules,
  'errorCatalog.json': errorCatalog,
  'operationTypeRules.json': operationTypeRules,
  'operationStatusRules.json': operationStatusRules,
} as const

export type JsonConfigKey = keyof typeof jsonConfigs
