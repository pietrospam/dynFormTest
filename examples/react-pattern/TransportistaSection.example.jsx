function TransportistaSection({ engine, context, formData }) {
  const container = engine.getContainerDefinition("datosTransportista", context, formData)

  if (!container?.visible) return null

  return (
    <Section title={container.label} disabled={!container.enabled}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldSlot engine={engine} fieldName="cuitTransportista" context={context} formData={formData} />
        <FieldSlot engine={engine} fieldName="nombreTransportista" context={context} formData={formData} />
        <FieldSlot engine={engine} fieldName="tipoDocumento" context={context} formData={formData} />
      </div>
    </Section>
  )
}

export default TransportistaSection
