import type { FormConfig } from '../types/config.types';
import type { FormContext, ResolvedField, ResolvedContainer } from '../types/engine.types';
/**
 * Resolves a field definition based on context.
 * Applies operation type and status rules to determine final state.
 * Returns null if the field's container is invisible.
 */
export declare function resolveField(fieldName: string, config: FormConfig, context: FormContext, resolvedContainers?: Record<string, ResolvedContainer>): ResolvedField | null;
/**
 * Resolves all fields based on context.
 */
export declare function resolveAllFields(config: FormConfig, context: FormContext, resolvedContainers?: Record<string, ResolvedContainer>): Record<string, ResolvedField>;
//# sourceMappingURL=field-resolver.d.ts.map