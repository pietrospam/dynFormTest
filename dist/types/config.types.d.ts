export type UIComponentType = 'TextInput' | 'Select' | 'NumberInput' | 'Textarea' | 'Section' | string;
export interface InputProps {
    maxLength?: number;
    minLength?: number;
    [key: string]: unknown;
}
export interface FieldUIConfig {
    component: UIComponentType;
    placeholder?: string;
    inputProps?: InputProps;
}
export interface ContainerUIConfig {
    component: UIComponentType;
}
export interface FieldDefinition {
    container: string;
    dataType: 'string' | 'number' | 'boolean';
    label: string;
    defaultValue: unknown;
    allowEmpty: boolean;
    ui: FieldUIConfig;
}
export interface ContainerDefinition {
    label: string;
    visible: boolean;
    enabled: boolean;
    ui: ContainerUIConfig;
}
export interface OptionItem {
    value: string;
    label: string;
}
export interface FieldOptionsConfig {
    source: 'static' | 'dynamic';
    allowEmptyOption?: boolean;
    emptyOptionLabel?: string;
    items: OptionItem[];
}
export interface ValidationRule {
    type: string;
    value?: unknown;
    errorCode: string;
}
export interface ErrorCatalogEntry {
    message: string;
}
export interface ContainerOverride {
    visible?: boolean;
    enabled?: boolean;
}
export interface FieldOverride {
    visible?: boolean;
    enabled?: boolean;
    required?: boolean;
}
export interface OperationTypeRule {
    containers?: Record<string, ContainerOverride>;
    fields?: Record<string, FieldOverride>;
}
export interface GlobalOverrides {
    $allContainers?: ContainerOverride;
    $allFields?: FieldOverride;
    containers?: Record<string, ContainerOverride>;
    fields?: Record<string, FieldOverride>;
}
export type OperationStatusRule = GlobalOverrides;
export interface FormConfig {
    containers: Record<string, ContainerDefinition>;
    fieldDefinitions: Record<string, FieldDefinition>;
    fieldOptions: Record<string, FieldOptionsConfig>;
    validationRules: Record<string, ValidationRule[]>;
    errorCatalog: Record<string, ErrorCatalogEntry>;
    operationTypeRules: Record<string, OperationTypeRule>;
    operationStatusRules: Record<string, OperationStatusRule>;
}
//# sourceMappingURL=config.types.d.ts.map