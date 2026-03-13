import type { FormConfig } from '../types/config.types';
import type { FormContext, FormData } from '../types/engine.types';
import type { FieldValidationResult, FormValidationResult } from '../types/validation.types';
/**
 * Validates a single field value.
 */
export declare function validateFieldValue(fieldName: string, value: unknown, config: FormConfig, context: FormContext, _formData?: FormData): FieldValidationResult;
/**
 * Validates an entire form.
 */
export declare function validateFormData(formData: FormData, config: FormConfig, context: FormContext): FormValidationResult;
//# sourceMappingURL=validation-resolver.d.ts.map