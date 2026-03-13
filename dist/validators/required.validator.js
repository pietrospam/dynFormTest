/**
 * Validates that a value is not empty.
 * Considers null, undefined, empty string, and empty arrays as empty.
 */
export const requiredValidator = (value) => {
    if (value === null || value === undefined) {
        return false;
    }
    if (typeof value === 'string' && value.trim() === '') {
        return false;
    }
    if (Array.isArray(value) && value.length === 0) {
        return false;
    }
    return true;
};
//# sourceMappingURL=required.validator.js.map