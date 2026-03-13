import { FormRulesEngine } from '../../src/engine/FormRulesEngine'

describe('FormRulesEngine screenId overrides', () => {
  it('applies screen-specific config override when screenId is provided', () => {
    const engine = new FormRulesEngine()

    const baseConfig = {
      containers: {
        c1: { label: 'Container 1', visible: true, enabled: true, ui: { component: 'Section' } },
      },
      fieldDefinitions: {
        f1: {
          container: 'c1',
          dataType: 'string',
          label: 'Field 1',
          defaultValue: '',
          allowEmpty: true,
          ui: { component: 'TextInput' },
        },
      },
      fieldOptions: {},
      validationRules: {
        f1: [{ type: 'required', errorCode: 'ERR_REQUIRED' }],
      },
      errorCatalog: {
        ERR_REQUIRED: { message: 'Required' },
      },
      operationTypeRules: {},
      operationStatusRules: {},
      screens: {
        screenA: {
          containers: {
            c1: { visible: false },
          },
        },
      },
    }

    engine.load(baseConfig)

    const formDefault = engine.getFormDefinition({ operationType: '', operationStatus: '' })
    expect(Object.keys(formDefault.containers)).toEqual(['c1'])

    const formScreenA = engine.getFormDefinition({
      screenId: 'screenA',
      operationType: '',
      operationStatus: '',
    })

    expect(Object.keys(formScreenA.containers)).toEqual([])
  })
})
