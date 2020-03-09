import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl, ValidatorFn } from '@angular/forms';
import { FormComponent, FormValidator, HelperService } from '@formql/core';
import { createNumberMask, createAutoCorrectedDatePipe } from 'text-mask-addons';

@Component({
    selector: 'formql-mat-form-field',
    template: `<div *ngIf="formControl!=null">
    <mat-form-field style="width:100%">
      <input *ngIf="currencyMask" [textMask]="{mask: currencyMask}"
        [id]="field.componentId"
        [type]="field.type == 'number' ? 'text' : field.type" [formControl]="formControl" matInput [placeholder]="field.label"
      [required]="field.rules?.required?.value">
      <input *ngIf="!currencyMask" [id]="field.componentId"
        [type]="field.type" [formControl]="formControl" matInput [placeholder]="field.label"
      [required]="field.rules?.required?.value">
      <mat-error *ngIf="!formControl.valid && formControl.touched">
        <span *ngIf="formControl.errors?.required">{{ field.rules?.required?.errorMessage }}</span>
        <span *ngIf="formControl.errors?.email">{{ field.rules?.email?.errorMessage }}</span>
        <span *ngIf="formControl.errors?.max">{{ field.rules?.max?.errorMessage }}</span>
        <span *ngIf="formControl.errors?.min">{{ field.rules?.min?.errorMessage }}</span>
        <span *ngIf="formControl.errors?.maxlength">{{ field.rules?.maxLength?.errorMessage }}</span>
        <span *ngIf="formControl.errors?.minlength">{{ field.rules?.minLength?.errorMessage }}</span>
        <span *ngIf="formControl.errors?.pattern">{{ field.rules?.pattern?.errorMessage }}</span>
      </mat-error>
    </mat-form-field>
  </div>`,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FormQLMatFormFieldComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => FormQLMatFormFieldComponent),
            multi: true
        }]
})
export class FormQLMatFormFieldComponent implements OnInit, ControlValueAccessor {

    static componentName = 'FormQLMatFormFieldComponent';
    static formQLComponent = true;

    static validators = [
        <FormValidator>{
            name: 'required',
            key: 'required',
            validator: Validators.required
        },
        <FormValidator>{
            name: 'email',
            key: 'email',
            validator: Validators.email
        },
        <FormValidator>{
            name: 'max',
            key: 'max',
            validator: function (val: any) {
                return Validators.max(Number(val))
            }
        },
        <FormValidator>{
            name: 'min',
            key: 'min',
            validator: function(val: any) {
                return Validators.min(Number(val))
            }
        },
        <FormValidator>{
            name: 'minLength',
            key: 'minLength',
            validator: function (val: any) {
                return Validators.minLength(Number(val));
            }
        },
        <FormValidator>{
            name: 'maxLength',
            key: 'maxLength',
            validator: function (val: any) {
                return Validators.maxLength(Number(val));
            }
        },
        <FormValidator>{
            name: 'pattern',
            key: 'pattern',
            validator: function (val: any) {
                return Validators.pattern(val);
            }
        }
    ];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;

    private _value: string;
    currencyMask: any;

    private _propagateChange = (_: any) => { };

    constructor() {}

    ngOnInit(): void {
        // if (this.field && this.field.textMask)
        //     this.currencyMask = createNumberMask(this.field.textMask);
        if (this.field && this.field.textMask && this.field.type) {
            switch (this.field.type) {
                case 'number':
                    this.currencyMask = createNumberMask(this.field.textMask);
                    break;

                case 'date':
                    this.currencyMask = createAutoCorrectedDatePipe(this.field.textMask);
                    break;

                case 'text':
                    this.currencyMask = HelperService.maskToArray(this.field.textMask);
                    break;
            }
        }
    }

    get value(): any {
        return this._value;
    }

    set value(value: any) {
        this._value = value;
        this._propagateChange(this._value);
    }

    writeValue(value: string): void {
        if (value)
            this._value = value;
    }

    registerOnChange(fn: any): void {
        this._propagateChange = fn;
    }

    registerOnTouched(fn: any): void { }
}
