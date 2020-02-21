import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, Validators, FormControl } from '@angular/forms';
import { FormComponent, FormValidator } from '@formql/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

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
            name: 'Required',
            validator: Validators.required,
            key: 'required'
        }
    ];

    @Input() field: FormComponent<any>;
    @Input() formControl: FormControl;

    private _value: string;
    currencyMask: any;

    private _propagateChange = (_: any) => { };

    constructor() {}

    ngOnInit(): void {
        if (this.field && this.field.textMask)
            this.currencyMask = createNumberMask(this.field.textMask);
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
