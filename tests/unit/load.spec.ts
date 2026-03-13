import { FormRulesEngine } from '../../src/engine/FormRulesEngine'
import containers from '../config/containers.definition.json'
import fieldDefinitions from '../config/fieldDefinitions.json'
import fieldOptions from '../config/fieldOptions.json'
import validationRules from '../config/validationRules.json'
import errorCatalog from '../config/errorCatalog.json'
import operationTypeRules from '../config/operationTypeRules.json'
import operationStatusRules from '../config/operationStatusRules.json'

describe("FormRulesEngine.load", () => {
  let engine: FormRulesEngine

  beforeEach(() => {
    engine = new FormRulesEngine()
  })

  // TC-CONFIG-01
  it("should load valid configuration", () => {
    expect(() => {
      engine.load({
        containers,
        fieldDefinitions,
        fieldOptions,
        validationRules,
        errorCatalog,
        operationTypeRules,
        operationStatusRules,
      })
    }).not.toThrow()

    expect(engine.getConfig()).not.toBeNull()
  })

  // TC-CONFIG-02
  it("should fail if fieldDefinitions is missing", () => {
    expect(() => {
      engine.load({
        containers,
        errorCatalog,
      })
    }).toThrow('Missing or invalid "fieldDefinitions" configuration')
  })

  it("should fail if containers is missing", () => {
    expect(() => {
      engine.load({
        fieldDefinitions,
        errorCatalog,
      })
    }).toThrow('Missing or invalid "containers" configuration')
  })

  it("should fail if errorCatalog is missing", () => {
    expect(() => {
      engine.load({
        containers,
        fieldDefinitions,
      })
    }).toThrow('Missing or invalid "errorCatalog" configuration')
  })

  // TC-CONFIG-03
  it("should fail if validation rule references non-existent errorCode", () => {
    expect(() => {
      engine.load({
        containers,
        fieldDefinitions,
        errorCatalog,
        validationRules: {
          cuitTransportista: [
            { type: "required", errorCode: "ERR_NONEXISTENT" }
          ]
        },
      })
    }).toThrow('references non-existent error code: "ERR_NONEXISTENT"')
  })

  it("should fail if field references non-existent container", () => {
    expect(() => {
      engine.load({
        containers,
        fieldDefinitions: {
          testField: {
            container: "nonExistentContainer",
            dataType: "string",
            label: "Test",
            defaultValue: "",
            allowEmpty: true,
            ui: { component: "TextInput" }
          }
        },
        errorCatalog,
      })
    }).toThrow('references non-existent container: "nonExistentContainer"')
  })

  it("should throw if config not loaded when accessing methods", () => {
    expect(() => {
      engine.getContainerDefinition("datosTransportista", { 
        operationType: "PMI", 
        operationStatus: "PENDIENTE" 
      })
    }).toThrow('Configuration not loaded. Call load() first.')
  })
})
