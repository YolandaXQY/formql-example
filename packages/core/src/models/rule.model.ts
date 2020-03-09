import { ValidatorFn } from '@angular/forms';

export declare interface FormRules {
    [key: string]: FormRule;
}

export interface FormRule {
    key: string;
    condition: string;
    value: boolean | any;
    errorMessage: string;
}

export interface FormValidator {
    name: string;
    key: string;
    // 多加了一种类型
    validator: ValidatorFn | (() => ValidatorFn);
    parameters: any;
}
