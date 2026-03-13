function FieldSlot({ engine, fieldName, context, formData }) {
  const field = engine.getFieldDefinition(fieldName, context, formData)

  if (!field || !field.visible) return null

  switch (field.ui.component) {
    case "TextInput":
      return (
        <TextInput
          label={field.label}
          disabled={!field.enabled}
          required={field.required}
          placeholder={field.ui?.placeholder}
          maxLength={field.ui?.inputProps?.maxLength}
        />
      )

    case "Select":
      return (
        <Select
          label={field.label}
          disabled={!field.enabled}
          required={field.required}
          options={field.options || []}
        />
      )

    case "NumberInput":
      return (
        <NumberInput
          label={field.label}
          disabled={!field.enabled}
          required={field.required}
          placeholder={field.ui?.placeholder}
        />
      )

    default:
      return null
  }
}

export default FieldSlot
