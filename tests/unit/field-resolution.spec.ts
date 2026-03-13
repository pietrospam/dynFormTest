import { FormRulesEngine } from '../../src/engine/FormRulesEngine'
import containers from '../config/containers.definition.json'
import fieldDefinitions from '../config/fieldDefinitions.json'
import fieldOptions from '../config/fieldOptions.json'
import validationRules from '../config/validationRules.json'
import errorCatalog from '../config/errorCatalog.json'
import operationTypeRules from '../config/operationTypeRules.json'
import operationStatusRules from '../config/operationStatusRules.json'

describe("field resolution", () => {
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

  // TC-FIELD-01
  it("should resolve cuitTransportista as required in PMI + PENDIENTE", () => {
    const field = engine.getFieldDefinition("cuitTransportista", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(field).not.toBeNull()
    expect(field?.visible).toBe(true)
    expect(field?.enabled).toBe(true)
    expect(field?.required).toBe(true)
  })

  // TC-FIELD-02
  it("should disable pesoBruto when status is EGRESADA", () => {
    const field = engine.getFieldDefinition("pesoBruto", {
      operationType: "PMI",
      operationStatus: "EGRESADA",
    })

    expect(field?.enabled).toBe(false)
    expect(field?.required).toBe(false) // Disabled fields should not be required
  })

  // TC-CONTAINER-02
  it("should not return fields from invisible containers", () => {
    const field = engine.getFieldDefinition("cuitTransportista", {
      operationType: "SIN_TRANSPORTISTA",
      operationStatus: "PENDIENTE",
    })

    expect(field).toBeNull()
  })

  it("should resolve pesoBruto as required in PMI + PENDIENTE", () => {
    const field = engine.getFieldDefinition("pesoBruto", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(field?.required).toBe(true)
  })

  it("should resolve observaciones as enabled in EGRESADA", () => {
    const field = engine.getFieldDefinition("observaciones", {
      operationType: "PMI",
      operationStatus: "EGRESADA",
    })

    // observaciones has specific override in EGRESADA status
    expect(field?.enabled).toBe(true)
  })

  // TC-OPTIONS-01
  it("should return static options for tipoDocumento", () => {
    const field = engine.getFieldDefinition("tipoDocumento", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(field?.options).toBeDefined()
    expect(field?.options?.length).toBeGreaterThan(0)
  })

  // TC-OPTIONS-02
  it("should include empty option when allowEmptyOption is true", () => {
    const field = engine.getFieldDefinition("tipoDocumento", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    const emptyOption = field?.options?.find(o => o.value === '')
    expect(emptyOption).toBeDefined()
    expect(emptyOption?.label).toBe("-- seleccionar --")
  })

  it("should return null for non-existent field", () => {
    const field = engine.getFieldDefinition("nonExistent", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(field).toBeNull()
  })

  it("should include validations in resolved field", () => {
    const field = engine.getFieldDefinition("cuitTransportista", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(field?.validations).toBeDefined()
    expect(field?.validations?.length).toBeGreaterThan(0)
    expect(field?.validations?.some(v => v.type === 'required')).toBe(true)
  })

  it("should preserve field metadata", () => {
    const field = engine.getFieldDefinition("cuitTransportista", {
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(field?.name).toBe("cuitTransportista")
    expect(field?.container).toBe("datosTransportista")
    expect(field?.label).toBe("CUIT")
    expect(field?.dataType).toBe("string")
    expect(field?.ui.component).toBe("TextInput")
    expect(field?.ui.inputProps?.maxLength).toBe(11)
  })
})

describe("getFormDefinition", () => {
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

  it("should return form grouped by containers", () => {
    const form = engine.getFormDefinition({
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(form.containers.datosTransportista).toBeDefined()
    expect(form.containers.datosCarga).toBeDefined()
  })

  it("should not include invisible containers", () => {
    const form = engine.getFormDefinition({
      operationType: "SIN_TRANSPORTISTA",
      operationStatus: "PENDIENTE",
    })

    expect(form.containers.datosTransportista).toBeUndefined()
    expect(form.containers.datosCarga).toBeDefined()
  })
})

describe("getInitialValues", () => {
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

  it("should return initial values for visible fields", () => {
    const values = engine.getInitialValues({
      operationType: "PMI",
      operationStatus: "PENDIENTE",
    })

    expect(values.cuitTransportista).toBe("")
    expect(values.nombreTransportista).toBe("")
    expect(values.pesoBruto).toBeNull()
  })

  it("should not include fields from invisible containers", () => {
    const values = engine.getInitialValues({
      operationType: "SIN_TRANSPORTISTA",
      operationStatus: "PENDIENTE",
    })

    expect(values.cuitTransportista).toBeUndefined()
    expect(values.pesoBruto).toBeNull()
  })
})
