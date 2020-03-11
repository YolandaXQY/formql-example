import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormQLModule } from '@formql/core';
import { TextMaskModule } from 'angular2-text-mask';
import { FormQLMatFormFieldComponent } from './components/formql-mat-form-field.component';
import { FormQLMatTextareaComponent } from './components/formql-mat-textarea.component';
import { FormQLMatCheckboxComponent } from './components/formql-mat-checkbox.component';
import { FormQLMatDatepickerComponent } from './components/formql-mat-datepicker.component';
import { FormQLMatButtonComponent } from './components/formql-mat-button.component';
import { FormQLInternalMaterialModule } from './formql-internal-material';
import { FormQLMatSelectComponent } from './components/formql-mat-select.component';
import { FormqlRadioGroupComponent } from './components/formql-radio-group.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormQLModule,
        TextMaskModule,
        ReactiveFormsModule,
        CommonModule,
        FormQLInternalMaterialModule
    ],
    declarations: [
        FormQLMatFormFieldComponent,
        FormQLMatTextareaComponent,
        FormQLMatCheckboxComponent,
        FormQLMatDatepickerComponent,
        FormQLMatButtonComponent,
        FormQLMatSelectComponent,
        FormqlRadioGroupComponent
    ],
    exports: [
        FormQLInternalMaterialModule
    ],
    entryComponents: [
        FormQLMatFormFieldComponent,
        FormQLMatTextareaComponent,
        FormQLMatCheckboxComponent,
        FormQLMatDatepickerComponent,
        FormQLMatButtonComponent,
        FormQLMatSelectComponent,
        FormqlRadioGroupComponent
    ]
})
export class FormQLMaterialModule { }