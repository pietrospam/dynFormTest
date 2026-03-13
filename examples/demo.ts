import { FormRulesEngine } from '../src/engine/FormRulesEngine'
import containers from '../config/containers.definition.json'
import fieldDefinitions from '../config/fieldDefinitions.json'
import fieldOptions from '../config/fieldOptions.json'
import validationRules from '../config/validationRules.json'
import errorCatalog from '../config/errorCatalog.json'
import operationTypeRules from '../config/operationTypeRules.json'
import operationStatusRules from '../config/operationStatusRules.json'

const engine = new FormRulesEngine()

// Cargar configuración
engine.load({
  containers,
  fieldDefinitions,
  fieldOptions,
  validationRules,
  errorCatalog,
  operationTypeRules,
  operationStatusRules,
})

console.log('=== DEMO: Dynamic Form Rules Engine ===\n')

// Contexto PMI + PENDIENTE
const contextPMI = { operationType: 'PMI', operationStatus: 'PENDIENTE' }

console.log('📋 Contexto:', contextPMI)
console.log('\n--- Containers ---')
const container = engine.getContainerDefinition('datosTransportista', contextPMI)
console.log('datosTransportista:', { visible: container?.visible, enabled: container?.enabled })

console.log('\n--- Campos ---')
const cuit = engine.getFieldDefinition('cuitTransportista', contextPMI)
console.log('cuitTransportista:', { 
  visible: cuit?.visible, 
  enabled: cuit?.enabled, 
  required: cuit?.required 
})

const tipoDoc = engine.getFieldDefinition('tipoDocumento', contextPMI)
console.log('tipoDocumento options:', tipoDoc?.options?.map(o => o.label).join(', '))

console.log('\n--- Valores iniciales ---')
const initialValues = engine.getInitialValues(contextPMI)
console.log(initialValues)

console.log('\n--- Validación de campo ---')
const validResult = engine.validateField('pesoBruto', 100, contextPMI)
console.log('pesoBruto=100:', validResult.valid ? '✅ válido' : '❌ inválido')

const invalidResult = engine.validateField('pesoBruto', -10, contextPMI)
console.log('pesoBruto=-10:', invalidResult.valid ? '✅ válido' : `❌ ${invalidResult.errors[0]?.message}`)

console.log('\n--- Validación de formulario ---')
const formResult = engine.validateForm({
  cuitTransportista: '20123456789',
  pesoBruto: 150,
}, contextPMI)
console.log('Formulario válido:', formResult.valid ? '✅' : '❌')

const formInvalid = engine.validateForm({
  cuitTransportista: '',
  pesoBruto: -5,
}, contextPMI)
console.log('Formulario con errores:', Object.keys(formInvalid.errors).join(', '))

console.log('\n=== Contexto SIN_TRANSPORTISTA ===')
const contextSinTransp = { operationType: 'SIN_TRANSPORTISTA', operationStatus: 'PENDIENTE' }
const containerHidden = engine.getContainerDefinition('datosTransportista', contextSinTransp)
console.log('datosTransportista visible:', containerHidden?.visible)
const cuitHidden = engine.getFieldDefinition('cuitTransportista', contextSinTransp)
console.log('cuitTransportista:', cuitHidden === null ? 'No renderizable (container oculto)' : 'visible')

console.log('\n=== Contexto EGRESADA ===')
const contextEgresada = { operationType: 'PMI', operationStatus: 'EGRESADA' }
const pesoEgresada = engine.getFieldDefinition('pesoBruto', contextEgresada)
console.log('pesoBruto:', { enabled: pesoEgresada?.enabled, required: pesoEgresada?.required })
const obsEgresada = engine.getFieldDefinition('observaciones', contextEgresada)
console.log('observaciones (override especial):', { enabled: obsEgresada?.enabled })
