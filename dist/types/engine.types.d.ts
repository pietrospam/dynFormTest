import type { FieldUIConfig, ContainerUIConfig, OptionItem, ValidationRule } from './config.types';
export interface FormContext {
    operationType: string;
    operationStatus: string;
    [key: string]: unknown;
}
export interface ResolvedContainer {
    name: string;
    label: string;
    visible: boolean;
    enabled: boolean;
    ui: ContainerUIConfig;
}
export interface ResolvedField {
    name: string;
    container: string;
    dataType: 'string' | 'number' | 'boolean';
    label: string;
    defaultValue: unknown;
    allowEmpty: boolean;
    visible: boolean;
    enabled: boolean;
    required: boolean;
    ui: FieldUIConfig;
    options?: OptionItem[];
    validations: ValidationRule[];
}
export type FormData = Record<string, unknown>;
export interface ResolvedFormDefinition {
    containers: Record<string, {
        container: ResolvedContainer;
        fields: ResolvedField[];
    }>;
}
export type InitialValues = Record<string, unknown>;
//# sourceMappingURL=engine.types.d.ts.map