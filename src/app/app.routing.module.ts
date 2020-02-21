import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormqlEndDataComponent } from './showcase/formql-end-data/formql-end-data.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/formql/contactInfo/123/edit'},
    { path: 'formql/:name/:id/edit', component: FormqlEndDataComponent}
]
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }