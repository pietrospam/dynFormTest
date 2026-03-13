/**
 * Validates and loads the form configuration.
 * Throws errors if configuration is invalid.
 */
export function loadConfig(config) {
    if (!config || typeof config !== 'object') {
        throw new Error('Configuration must be an object');
    }
    const cfg = config;
    // Validate required top-level keys
    if (!cfg.containers || typeof cfg.containers !== 'object') {
        throw new Error('Missing or invalid "containers" configuration');
    }
    if (!cfg.fieldDefinitions || typeof cfg.fieldDefinitions !== 'object') {
        throw new Error('Missing or invalid "fieldDefinitions" configuration');
    }
    if (!cfg.errorCatalog || typeof cfg.errorCatalog !== 'object') {
        throw new Error('Missing or invalid "errorCatalog" configuration');
    }
    // Build the config object with defaults
    const formConfig = {
        containers: cfg.containers,
        fieldDefinitions: cfg.fieldDefinitions,
        fieldOptions: cfg.fieldOptions || {},
        validationRules: cfg.validationRules || {},
        errorCatalog: cfg.errorCatalog,
        operationTypeRules: cfg.operationTypeRules || {},
        operationStatusRules: cfg.operationStatusRules || {},
    };
    // Validate error codes referenced in validation rules exist in catalog
    validateErrorCodes(formConfig.validationRules, formConfig.errorCatalog);
    // Validate field containers exist
    validateFieldContainers(formConfig.fieldDefinitions, formConfig.containers);
    return formConfig;
}
/**
 * Validates that all error codes referenced in validation rules exist in the catalog.
 */
function validateErrorCodes(validationRules, errorCatalog) {
    for (const [fieldName, rules] of Object.entries(validationRules)) {
        for (const rule of rules) {
            if (!errorCatalog[rule.errorCode]) {
                throw new Error(`Validation rule for field "${fieldName}" references non-existent error code: "${rule.errorCode}"`);
            }
        }
    }
}
/**
 * Validates that all fields reference existing containers.
 */
function validateFieldContainers(fieldDefinitions, containers) {
    for (const [fieldName, fieldDef] of Object.entries(fieldDefinitions)) {
        if (!containers[fieldDef.container]) {
            throw new Error(`Field "${fieldName}" references non-existent container: "${fieldDef.container}"`);
        }
    }
}
//# sourceMappingURL=config-loader.js.map