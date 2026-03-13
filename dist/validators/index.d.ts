import { requiredValidator } from './required.validator';
import { numericValidator } from './numeric.validator';
import { positiveValidator } from './positive.validator';
import { minLengthValidator } from './minLength.validator';
import { maxLengthValidator } from './maxLength.validator';
import type { ValidatorFn } from '../types/validation.types';
/**
 * oneOf validator - checks if value is in allowed list
 */
export declare const oneOfValidator: ValidatorFn;
/**
 * min validator - checks if numeric value is >= minimum
 */
export declare const minValidator: ValidatorFn;
/**
 * max validator - checks if numeric value is <= maximum
 */
export declare const maxValidator: ValidatorFn;
/**
 * range validator - checks if numeric value is within range [min, max]
 */
export declare const rangeValidator: ValidatorFn;
export declare const validators: Record<string, ValidatorFn>;
export { requiredValidator, numericValidator, positiveValidator, minLengthValidator, maxLengthValidator, };
//# sourceMappingURL=index.d.ts.map