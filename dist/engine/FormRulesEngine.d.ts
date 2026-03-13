import type { FormConfig } from '../types/config.types';
import type { FormContext, ResolvedContainer, ResolvedField, ResolvedFormDefinition, InitialValues, FormData } from '../types/engine.types';
import type { FieldValidationResult, FormValidationResult } from '../types/validation.types';
export declare class FormRulesEngine {
    private config;
    /**
     * Loads and validates the configuration.
     * @throws Error if configuration is invalid
     */
    load(config: unknown): void;
    /**
     * Returns the loaded configuration (for testing/debugging)
     */
    getConfig(): FormConfig | null;
    /**
     * Resolves a container definition based on context.
     * Returns null if container doesn't exist or its container is not visible.
     */
    getContainerDefinition(containerName: string, context: FormContext, _formData?: FormData): ResolvedContainer | null;
    /**
     * Resolves a field definition based on context.
     * Returns null if field doesn't exist or its container is not visible.
     */
    getFieldDefinition(fieldName: string, context: FormContext, _formData?: FormData): ResolvedField | null;
    /**
     * Resolves the entire form definition grouped by containers.
     */
    getFormDefinition(context: FormContext, _formData?: FormData): ResolvedFormDefinition;
    /**
     * Returns initial values for all fields based on their defaultValue.
     */
    getInitialValues(context: FormContext): InitialValues;
    /**
     * Validates a single field.
     */
    validateField(fieldName: string, value: unknown, context: FormContext, formData?: FormData): FieldValidationResult;
    /**
     * Validates the entire form.
     */
    validateForm(formData: FormData, context: FormContext): FormValidationResult;
    /**
     * Ensures configuration has been loaded.
     */
    private ensureLoaded;
}
//# sourceMappingURL=FormRulesEngine.d.ts.map