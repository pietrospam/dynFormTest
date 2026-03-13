export interface FieldValidationError {
    errorCode: string;
    message: string;
}
export interface FieldValidationResult {
    valid: boolean;
    errors: FieldValidationError[];
}
export interface FormValidationResult {
    valid: boolean;
    errors: Record<string, FieldValidationError[]>;
}
export type ValidatorFn = (value: unknown, ruleValue?: unknown, fieldName?: string) => boolean;
//# sourceMappingURL=validation.types.d.ts.map