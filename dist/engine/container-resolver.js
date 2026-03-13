/**
 * Resolves a container definition based on context.
 * Applies operation type and status rules to determine final state.
 */
export function resolveContainer(containerName, config, context) {
    const baseContainer = config.containers[containerName];
    if (!baseContainer) {
        return null;
    }
    // Start with base definition
    const resolved = {
        name: containerName,
        label: baseContainer.label,
        visible: baseContainer.visible,
        enabled: baseContainer.enabled,
        ui: { ...baseContainer.ui },
    };
    // Apply operation type rules
    const typeRule = config.operationTypeRules[context.operationType];
    if (typeRule?.containers?.[containerName]) {
        const override = typeRule.containers[containerName];
        if (override.visible !== undefined)
            resolved.visible = override.visible;
        if (override.enabled !== undefined)
            resolved.enabled = override.enabled;
    }
    // Apply operation status rules (these can override type rules)
    const statusRule = config.operationStatusRules[context.operationStatus];
    if (statusRule) {
        // Apply global container rules first
        if (statusRule.$allContainers) {
            const globalOverride = statusRule.$allContainers;
            if (globalOverride.visible !== undefined)
                resolved.visible = globalOverride.visible;
            if (globalOverride.enabled !== undefined)
                resolved.enabled = globalOverride.enabled;
        }
        // Then apply specific container rules
        if (statusRule.containers?.[containerName]) {
            const override = statusRule.containers[containerName];
            if (override.visible !== undefined)
                resolved.visible = override.visible;
            if (override.enabled !== undefined)
                resolved.enabled = override.enabled;
        }
    }
    return resolved;
}
/**
 * Resolves all containers based on context.
 */
export function resolveAllContainers(config, context) {
    const resolved = {};
    for (const containerName of Object.keys(config.containers)) {
        const container = resolveContainer(containerName, config, context);
        if (container) {
            resolved[containerName] = container;
        }
    }
    return resolved;
}
//# sourceMappingURL=container-resolver.js.map