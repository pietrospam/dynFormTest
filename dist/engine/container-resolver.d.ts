import type { FormConfig } from '../types/config.types';
import type { FormContext, ResolvedContainer } from '../types/engine.types';
/**
 * Resolves a container definition based on context.
 * Applies operation type and status rules to determine final state.
 */
export declare function resolveContainer(containerName: string, config: FormConfig, context: FormContext): ResolvedContainer | null;
/**
 * Resolves all containers based on context.
 */
export declare function resolveAllContainers(config: FormConfig, context: FormContext): Record<string, ResolvedContainer>;
//# sourceMappingURL=container-resolver.d.ts.map