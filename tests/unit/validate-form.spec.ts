import { FormRulesEngine } from '../../src/engine/FormRulesEngine'
import containers from '../config/containers.definition.json'
import fieldDefinitions from '../config/fieldDefinitions.json'
import fieldOptions from '../config/fieldOptions.json'
import validationRules from '../config/validationRules.json'
import errorCatalog from '../config/errorCatalog.json'
import operationTypeRules from '../config/operationTypeRules.json'
import operationStatusRules from '../config/operationStatusRules.json'

describe("validateForm", () => {
  let engine: FormRulesEngine
  const contextPMI = { operationType: "PMI", operationStatus: "PENDIENTE" }
  const contextEgresada = { operationType: "PMI", operationStatus: "EGRESADA" }
  const contextSinTransp = { operationType: "SIN_TRANSPORTISTA", operationStatus: "PENDIENTE" }

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

  // TC-FORM-01
  it("should return valid = true for valid form data", () => {
    const formData = {
      cuitTransportista: "20123456789",
      nombreTransportista: "Juan Pérez",
      tipoDocumento: "DNI",
      pesoBruto: 100,
      observaciones: "Todo ok",
    }

    const result = engine.validateForm(formData, contextPMI)

    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  // TC-FORM-02
  it("should return all errors for form with multiple invalid fields", () => {
    const formData = {
      cuitTransportista: "", // Required
      nombreTransportista: "a".repeat(81), // Too long
      tipoDocumento: "INVALID", // Invalid option
      pesoBruto: -10, // Negative
      observaciones: "",
    }

    const result = engine.validateForm(formData, contextPMI)

    expect(result.valid).toBe(false)
    expect(result.errors.cuitTransportista).toBeDefined()
    expect(result.errors.nombreTransportista).toBeDefined()
    expect(result.errors.tipoDocumento).toBeDefined()
    expect(result.errors.pesoBruto).toBeDefined()
  })

  // TC-FORM-03
  it("should skip invisible fields validation", () => {
    const formData = {
      cuitTransportista: "", // Would fail required, but container is invisible
      pesoBruto: 100,
      observaciones: "",
    }

    const result = engine.validateForm(formData, contextSinTransp)

    // cuitTransportista should not be validated because its container is invisible
    expect(result.errors.cuitTransportista).toBeUndefined()
    expect(result.valid).toBe(true)
  })

  // TC-FORM-04
  it("should not require disabled fields", () => {
    const formData = {
      cuitTransportista: "", // Required but disabled in EGRESADA
      pesoBruto: null, // Required but disabled in EGRESADA
      observaciones: "Test",
    }

    const result = engine.validateForm(formData, contextEgresada)

    // Required fields should not trigger errors when disabled
    expect(result.errors.cuitTransportista).toBeUndefined()
    expect(result.errors.pesoBruto).toBeUndefined()
    expect(result.valid).toBe(true)
  })

  it("should validate multiple required fields", () => {
    const formData = {
      cuitTransportista: "",
      pesoBruto: null,
    }

    const result = engine.validateForm(formData, contextPMI)

    expect(result.valid).toBe(false)
    expect(result.errors.cuitTransportista).toBeDefined()
    expect(result.errors.pesoBruto).toBeDefined()
  })

  it("should return error messages with proper format", () => {
    const formData = {
      cuitTransportista: "",
      pesoBruto: 100,
    }

    const result = engine.validateForm(formData, contextPMI)

    expect(result.errors.cuitTransportista[0].errorCode).toBe("ERR_REQUIRED")
    expect(result.errors.cuitTransportista[0].message).toBe("El campo es obligatorio.")
  })

  it("should validate observaciones in EGRESADA (special override)", () => {
    const formData = {
      observaciones: "x".repeat(201), // Too long
    }

    const result = engine.validateForm(formData, contextEgresada)

    // observaciones is enabled in EGRESADA, so maxLength should be validated
    expect(result.valid).toBe(false)
    expect(result.errors.observaciones).toBeDefined()
  })

  it("should handle empty form data", () => {
    const result = engine.validateForm({}, contextPMI)

    expect(result.valid).toBe(false)
    // Required fields should fail
    expect(result.errors.cuitTransportista).toBeDefined()
    expect(result.errors.pesoBruto).toBeDefined()
  })
})
