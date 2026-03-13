import { FormRulesEngine } from '../../src/engine/FormRulesEngine'
import containers from '../config/containers.definition.json'
import fieldDefinitions from '../config/fieldDefinitions.json'
import fieldOptions from '../config/fieldOptions.json'
import validationRules from '../config/validationRules.json'
import errorCatalog from '../config/errorCatalog.json'
import operationTypeRules from '../config/operationTypeRules.json'
import operationStatusRules from '../config/operationStatusRules.json'

describe("container resolution", () => {
  let engine: FormRulesEngine

  beforeEach(() => {
    engine = new FormRulesEngine()
    engine.load({
      containers,
      fieldDefinitions,
      fieldOptions,
      validationRules,
      errorCatalog,
      operationTypeRules,
      operationStatusRules,
    })
  })

  // TC-CONTAINER-01
  it("should hide datosTransportista for SIN_TRANSPORTISTA", () => {
    const container = engine.getContainerDefinition("datosTransportista", {
      operationType: "SIN_TRANSPORTISTA",
      operationStatus: "PENDIENTE",
    })

    expect(container?.visible).toBe(false)
  })

  it("should show datosTransportista for PMI", () => {
    const container = engine.getContainerDefinition("datosTransportista", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(container?.visible).toBe(true)
    expect(container?.enabled).toBe(true)
  })

  it("should show datosCarga for both PMI and SIN_TRANSPORTISTA", () => {
    const containerPMI = engine.getContainerDefinition("datosCarga", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    const containerSinTransp = engine.getContainerDefinition("datosCarga", {
      operationType: "SIN_TRANSPORTISTA",
      operationStatus: "PENDIENTE",
    })

    expect(containerPMI?.visible).toBe(true)
    expect(containerSinTransp?.visible).toBe(true)
  })

  // TC-CONTAINER-02 - tested in field-resolution.spec.ts

  it("should disable containers when status is EGRESADA", () => {
    const container = engine.getContainerDefinition("datosTransportista", {
      operationType: "PMI",
      operationStatus: "EGRESADA",
    })

    expect(container?.visible).toBe(true)
    expect(container?.enabled).toBe(false)
  })

  it("should return null for non-existent container", () => {
    const container = engine.getContainerDefinition("nonExistent", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(container).toBeNull()
  })

  it("should preserve container metadata", () => {
    const container = engine.getContainerDefinition("datosTransportista", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(container?.name).toBe("datosTransportista")
    expect(container?.label).toBe("Datos del transportista")
    expect(container?.ui.component).toBe("Section")
  })
})
