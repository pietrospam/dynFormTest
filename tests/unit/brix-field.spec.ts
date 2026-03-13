import { describe, it, expect, beforeAll } from 'vitest'
import { FormRulesEngine } from '../../src/engine/FormRulesEngine'
import type { FormConfig } from '../../src/types/config.types'
import containers from '../config/containers.definition.json'
import fieldDefinitions from '../config/fieldDefinitions.json'
import fieldOptions from '../config/fieldOptions.json'
import validationRules from '../config/validationRules.json'
import errorCatalog from '../config/errorCatalog.json'
import operationTypeRules from '../config/operationTypeRules.json'
import operationStatusRules from '../config/operationStatusRules.json'

describe('BRIX Field - TC-BRIX-01 through TC-BRIX-05', () => {
  let engine: FormRulesEngine

  beforeAll(() => {
    const config: FormConfig = {
      containers,
      fieldDefinitions,
      fieldOptions,
      validationRules,
      errorCatalog,
      operationTypeRules,
      operationStatusRules,
    }
    engine = new FormRulesEngine()
    engine.load(config)
  })

  describe('TC-BRIX-01: Campo visible y habilitado en UVA', () => {
    it('should show brix field visible for UVA operation', () => {
      const result = engine.getFieldDefinition('brix', { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.visible).toBe(true)
    })

    it('should show brix field enabled for UVA operation', () => {
      const result = engine.getFieldDefinition('brix', { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.enabled).toBe(true)
    })

    it('should show brix field required for UVA operation', () => {
      const result = engine.getFieldDefinition('brix', { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.required).toBe(true)
    })

    it('should show datosCalidad container visible for UVA operation', () => {
      const result = engine.getContainerDefinition('datosCalidad', { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.visible).toBe(true)
      expect(result.enabled).toBe(true)
    })
  })

  describe('TC-BRIX-02: Campo oculto en PMI', () => {
    it('should hide brix field for PMI operation (container hidden)', () => {
      const result = engine.getFieldDefinition('brix', { operationType: 'PMI', operationStatus: 'PENDIENTE' })
      // Field returns null when its container is hidden
      expect(result).toBeNull()
    })

    it('should hide datosCalidad container for PMI operation', () => {
      const result = engine.getContainerDefinition('datosCalidad', { operationType: 'PMI', operationStatus: 'PENDIENTE' })
      expect(result.visible).toBe(false)
    })
  })

  describe('TC-BRIX-03: Campo oculto en SIN_TRANSPORTISTA', () => {
    it('should hide brix field for SIN_TRANSPORTISTA operation (container hidden)', () => {
      const result = engine.getFieldDefinition('brix', { operationType: 'SIN_TRANSPORTISTA', operationStatus: 'PENDIENTE' })
      // Field returns null when its container is hidden
      expect(result).toBeNull()
    })

    it('should hide datosCalidad container for SIN_TRANSPORTISTA operation', () => {
      const result = engine.getContainerDefinition('datosCalidad', { operationType: 'SIN_TRANSPORTISTA', operationStatus: 'PENDIENTE' })
      expect(result.visible).toBe(false)
    })
  })

  describe('TC-BRIX-04: Validación range - valores inválidos', () => {
    it('should fail validation for brix = 9.99 (below minimum)', () => {
      const result = engine.validateField('brix', 9.99, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.message.includes('entre 10 y 25'))).toBe(true)
    })

    it('should fail validation for brix = 25.01 (above maximum)', () => {
      const result = engine.validateField('brix', 25.01, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.message.includes('entre 10 y 25'))).toBe(true)
    })

    it('should fail validation for brix = 5 (way below minimum)', () => {
      const result = engine.validateField('brix', 5, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.message.includes('entre 10 y 25'))).toBe(true)
    })

    it('should fail validation for brix = 30 (way above maximum)', () => {
      const result = engine.validateField('brix', 30, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.message.includes('entre 10 y 25'))).toBe(true)
    })
  })

  describe('TC-BRIX-05: Validación range - valores válidos', () => {
    it('should pass validation for brix = 10 (minimum boundary)', () => {
      const result = engine.validateField('brix', 10, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should pass validation for brix = 25 (maximum boundary)', () => {
      const result = engine.validateField('brix', 25, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should pass validation for brix = 17.5 (middle value)', () => {
      const result = engine.validateField('brix', 17.5, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should pass validation for brix = 10.01 (just above minimum)', () => {
      const result = engine.validateField('brix', 10.01, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should pass validation for brix = 24.99 (just below maximum)', () => {
      const result = engine.validateField('brix', 24.99, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('BRIX - Additional validations', () => {
    it('should fail required validation when brix is empty in UVA', () => {
      const result = engine.validateField('brix', '', { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(false)
    })

    it('should fail numeric validation when brix is not a number', () => {
      const result = engine.validateField('brix', 'abc', { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(false)
    })

    it('should skip validation for hidden field in PMI', () => {
      const result = engine.validateField('brix', '', { operationType: 'PMI', operationStatus: 'PENDIENTE' })
      // Campo oculto no requiere validación
      expect(result.valid).toBe(true)
    })
  })

  describe('UVA - Form validation', () => {
    it('should validate complete UVA form with brix only', () => {
      const values = { brix: 18.5 }
      const result = engine.validateForm(values, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(true)
    })

    it('should fail UVA form when brix is missing', () => {
      const values = {}
      const result = engine.validateForm(values, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(false)
      expect(result.errors.brix).toBeDefined()
    })

    it('should fail UVA form when brix is out of range', () => {
      const values = { brix: 50 }
      const result = engine.validateForm(values, { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.valid).toBe(false)
      expect(result.errors.brix).toBeDefined()
    })
  })

  describe('UVA - Other containers hidden', () => {
    it('should hide datosTransportista container for UVA', () => {
      const result = engine.getContainerDefinition('datosTransportista', { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.visible).toBe(false)
    })

    it('should hide datosCarga container for UVA', () => {
      const result = engine.getContainerDefinition('datosCarga', { operationType: 'UVA', operationStatus: 'PENDIENTE' })
      expect(result.visible).toBe(false)
    })
  })
})
