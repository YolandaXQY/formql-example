import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormqlSelectorComponent } from './showcase/formql-selector/formql-selector.component';
import { FormqlEndDataComponent } from './showcase/formql-end-data/formql-end-data.component';
import { FormqlFrontDataComponent } from './showcase/formql-front-data/formql-front-data.component';
import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormQLModule } from '@formql/core';
import { FormQLEditorModule } from '@formql/editor';
import { ReactiveFormsModule } from '@angular/forms';
import { FormQLMaterialModule } from '@formql/material';
import { EndDataService } from './showcase/service/end-data.service';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    AppComponent,
    FormqlSelectorComponent,
    FormqlEndDataComponent,
    FormqlFrontDataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormQLModule,
    FormQLEditorModule,
    FormQLMaterialModule,
    ReactiveFormsModule,
    TextMaskModule
  ],
  providers: [
    EndDataService,
    { provide: 'FormQLService', useClass: EndDataService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
