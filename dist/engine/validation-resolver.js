import { validators } from '../validators';
import { resolveField, resolveAllFields } from './field-resolver';
import { resolveAllContainers } from './container-resolver';
/**
 * Validates a single field value.
 */
export function validateFieldValue(fieldName, value, config, context, _formData) {
    const errors = [];
    // Resolve field to check if it should be validated
    const field = resolveField(fieldName, config, context);
    // If field is not visible or container is invisible, skip validation
    if (!field || !field.visible) {
        return { valid: true, errors: [] };
    }
    // If field is not enabled, skip validation
    if (!field.enabled) {
        return { valid: true, errors: [] };
    }
    const rules = config.validationRules[fieldName] || [];
    // Check required first if the field is required
    if (field.required) {
        const requiredRule = rules.find(r => r.type === 'required');
        if (requiredRule) {
            const validator = validators['required'];
            if (validator && !validator(value)) {
                const errorMsg = config.errorCatalog[requiredRule.errorCode]?.message || 'Error de validación';
                errors.push({
                    errorCode: requiredRule.errorCode,
                    message: errorMsg,
                });
                // Return early - if required fails, no need to run other validations
                return { valid: false, errors };
            }
        }
        else {
            // Field is required but no required rule defined - create implicit check
            const validator = validators['required'];
            if (validator && !validator(value)) {
                errors.push({
                    errorCode: 'ERR_REQUIRED',
                    message: config.errorCatalog['ERR_REQUIRED']?.message || 'El campo es obligatorio.',
                });
                return { valid: false, errors };
            }
        }
    }
    // If value is empty and field is not required, skip other validations
    if (value === null || value === undefined || value === '') {
        return { valid: true, errors: [] };
    }
    // Run all other validations except required
    for (const rule of rules) {
        if (rule.type === 'required')
            continue;
        const validator = validators[rule.type];
        if (!validator) {
            console.warn(`Unknown validator type: ${rule.type}`);
            continue;
        }
        const isValid = validator(value, rule.value, fieldName);
        if (!isValid) {
            const errorMsg = config.errorCatalog[rule.errorCode]?.message || 'Error de validación';
            errors.push({
                errorCode: rule.errorCode,
                message: errorMsg,
            });
        }
    }
    return {
        valid: errors.length === 0,
        errors,
    };
}
/**
 * Validates an entire form.
 */
export function validateFormData(formData, config, context) {
    const allErrors = {};
    let isValid = true;
    // Resolve all containers and fields first
    const containers = resolveAllContainers(config, context);
    const fields = resolveAllFields(config, context, containers);
    // Validate each visible and enabled field
    for (const [fieldName, field] of Object.entries(fields)) {
        if (!field.visible || !field.enabled)
            continue;
        const value = formData[fieldName];
        const result = validateFieldValue(fieldName, value, config, context, formData);
        if (!result.valid) {
            isValid = false;
            allErrors[fieldName] = result.errors;
        }
    }
    return {
        valid: isValid,
        errors: allErrors,
    };
}
//# sourceMappingURL=validation-resolver.js.map