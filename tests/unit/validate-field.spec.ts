import { FormRulesEngine } from '../../src/engine/FormRulesEngine'
import containers from '../config/containers.definition.json'
import fieldDefinitions from '../config/fieldDefinitions.json'
import fieldOptions from '../config/fieldOptions.json'
import validationRules from '../config/validationRules.json'
import errorCatalog from '../config/errorCatalog.json'
import operationTypeRules from '../config/operationTypeRules.json'
import operationStatusRules from '../config/operationStatusRules.json'

describe("validateField", () => {
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

  // TC-VAL-01
  it("should validate pesoBruto = 100 correctly", () => {
    const result = engine.validateField("pesoBruto", 100, contextPMI)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  // TC-VAL-02
  it("should return ERR_POSITIVE when pesoBruto is negative", () => {
    const result = engine.validateField("pesoBruto", -10, contextPMI)

    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.errorCode === "ERR_POSITIVE")).toBe(true)
  })

  // TC-VAL-03
  it("should return ERR_REQUIRED when cuitTransportista is empty", () => {
    const result = engine.validateField("cuitTransportista", "", contextPMI)

    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.errorCode === "ERR_REQUIRED")).toBe(true)
  })

  // TC-VAL-04
  it("should return ERR_MAX_80 when nombreTransportista exceeds 80 chars", () => {
    const longName = "a".repeat(81)
    const result = engine.validateField("nombreTransportista", longName, contextPMI)

    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.errorCode === "ERR_MAX_80")).toBe(true)
  })

  it("should return ERR_NUMERIC when cuitTransportista is not numeric", () => {
    const result = engine.validateField("cuitTransportista", "abc", contextPMI)

    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.errorCode === "ERR_NUMERIC")).toBe(true)
  })

  it("should return ERR_MAX_11 when cuitTransportista exceeds 11 chars", () => {
    const result = engine.validateField("cuitTransportista", "123456789012", contextPMI)

    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.errorCode === "ERR_MAX_11")).toBe(true)
  })

  it("should return ERR_INVALID_OPTION for invalid tipoDocumento", () => {
    const result = engine.validateField("tipoDocumento", "INVALID", contextPMI)

    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.errorCode === "ERR_INVALID_OPTION")).toBe(true)
  })

  it("should pass validation for valid tipoDocumento", () => {
    const result = engine.validateField("tipoDocumento", "DNI", contextPMI)

    expect(result.valid).toBe(true)
  })

  it("should skip validation for invisible fields (container invisible)", () => {
    // cuitTransportista is in datosTransportista, which is invisible in SIN_TRANSPORTISTA
    const result = engine.validateField("cuitTransportista", "", contextSinTransp)

    expect(result.valid).toBe(true)
  })

  it("should skip validation for disabled fields", () => {
    // pesoBruto is disabled in EGRESADA status
    const result = engine.validateField("pesoBruto", -100, contextEgresada)

    expect(result.valid).toBe(true) // Should not validate disabled fields
  })

  it("should skip non-required validations for empty optional fields", () => {
    // nombreTransportista is optional (allowEmpty: true)
    const result = engine.validateField("nombreTransportista", "", contextPMI)

    expect(result.valid).toBe(true)
  })

  it("should validate observaciones maxLength", () => {
    const longText = "x".repeat(201)
    const result = engine.validateField("observaciones", longText, contextPMI)

    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.errorCode === "ERR_MAX_200")).toBe(true)
  })

  it("should include error messages in validation result", () => {
    const result = engine.validateField("pesoBruto", -10, contextPMI)

    expect(result.errors[0].message).toBe("El valor debe ser mayor a 0.")
  })
})
