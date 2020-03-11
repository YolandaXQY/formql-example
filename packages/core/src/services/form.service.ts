import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { FormWindow, FormState, FormDataSource } from '../models/form-window.model';
import { FormComponent } from '../models/form-component.model';
import { UUID } from 'angular2-uuid';
import { HelperService } from './helper.service';
import { IFormQLService } from '../interfaces/formql-service';
import { HttpClient } from '@angular/common/http';
import { Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    private service: IFormQLService;

    constructor(
        @Inject('FormQLService') srv,
        private http: HttpClient
    ) {
        this.service = srv;
    }


    getFormAndData(formName: string, ids: Array<string>): Observable<FormState> {
        if (ids)
            return this.service.getForm(formName).pipe(
                map(response => <FormWindow>response),
                concatMap(model =>
                    this.service.getData(model.dataSource, ids).pipe(
                        map(data => this.populateComponents(model, data))
                    )));
        else
            return this.service.getForm(formName).pipe(
                map(model => this.populateComponents(model, null))
            );
    }

    populateComponents(form: FormWindow, data: any): FormState {
        let formState = <FormState>{
            components: new Array<FormComponent<any>>(),
            data: { ...data },
            form: form
        };

        form.pages.forEach(page => {
            if (!page.pageId)
                page.pageId = UUID.UUID();

            if (page.sections != null)
                page.sections.forEach(section => {

                    if (!section.sectionId)
                        section.sectionId = UUID.UUID();

                    if (section.components != null)
                        section.components.forEach(component => {
                            if (!component.componentId)
                                component.componentId = UUID.UUID();

                            component.value = this.getValue(component.schema, data, component.type);
                            formState.components.push(component);

                            if (!data)
                                formState.data = this.initiateData(formState.data, component.schema);
                        });
                });
        });
        formState = this.resolveConditions(formState);
        return formState;
    }

    initiateData(data: any, schema: string) {
        if (schema && schema.indexOf('.') !== -1) {
            const arr = schema.split('.');
            let item = data;
            let key = '';
            for (let i = 0; i <= arr.length - 2; i++) {
                key = arr[i];
                if (!item[key])
                    item[key] = {};

                if (i !== arr.length - 2)
                    item = item[key];
            }
        }
        return data;
    }


    getValue(schema: string, data: any, type: string) {
        const evaluatedValue = HelperService.evaluateValue(schema, data);
        if (evaluatedValue.error)
            return null;
        else
            return HelperService.resolveType(evaluatedValue.value, type);
    }

    setValue(schema: string, value: any, data: any) {
        if (value === undefined || value === '')
            value = null;
        if (schema) {
            if (!data)
                data = {};
            let key = schema;
            if (schema.indexOf('.') !== -1) {
                const arr = schema.split('.');
                let item = data;
                for (let i = 0; i <= arr.length - 1; i++) {
                    key = arr[i];
                    if (!item[key])
                        item[key] = {};

                    if (i !== arr.length - 1)
                        item = item[key];
                }
                item[key] = value;
            } else
                data[key] = value;
        }
        return data;
    }

    getData(query: FormDataSource, ids: Array<string>) {
        return this.service.getData(query, ids).pipe(
            map((data: any) => {
                if (data)
                    return data;
                else
                    return {};
            }));
    }

    getForms() {
        return this.service.getForms().pipe(
            map((data: any) => {
                return data;
            }));
    }

    getForm(name: string) {
        return this.service.getForm(name).pipe(
            map((data: FormWindow) => {
                return data;
            }));
    }

    saveForm(name: string, form: FormWindow) {
        // remove all transactional data
        const updateForm = HelperService.deepCopy(form);
        updateForm.pages.forEach(page => {
            page.sections.forEach(section => {
                section.components.forEach(component => {
                    component.value = null;
                    if (component.rules != null)
                        Object.keys(component.rules).forEach(p => {
                            component.rules[p].value = null;
                        });
                });
            });
        });

        return this.service.saveForm(name, updateForm).pipe(
            map((response: any) => {
                return response;
            }));
    }

    saveData(dataSource: FormDataSource, ids: Array<string>, data: any) {
        return this.service.saveData(dataSource, ids, data).pipe(
            map((result: any) => {
                return result;
            }));
    }

    updateComponent(component: FormComponent<any>, formState: FormState) {
        const value = HelperService.resolveType(component.value, component.type);
        formState.data = this.setValue(component.schema, value, formState.data);
        formState = this.resolveConditions(formState);
        formState.components.forEach((c: FormComponent<any>) => {
            if (c.schema === component.schema || (c.schema && c.schema.indexOf('.') === -1))
                c.value = this.getValue(c.schema, formState.data, c.type);
        });
        return formState;
    }

    /**
     * 根据值规则进行初始值计算
     * @param formState 
     * @param reRun 
     */
    resolveConditions(formState: FormState, reRun = false): FormState {
        let recalculate = false;
        formState.components.forEach(component => {
            if (component.rules)
                Object.keys(component.rules).forEach(key => {
                    const property = component.rules[key];
                    if (property.condition) {
                        let evaluatedValue: any;
                        if (key === 'value') {
                            evaluatedValue = HelperService.evaluateValue(property.condition, formState.data);
                        } else if (key === 'api') {
                            evaluatedValue = { value: null, error: null};
                            this.getDataFromAPI(property.condition, formState.data).then(res => {
                                                              
                            });
                        } else {
                            evaluatedValue = HelperService.evaluateCondition(property.condition, formState.data);
                        }

                        if (!evaluatedValue.error && key === 'value') {
                            const value = HelperService.resolveType(evaluatedValue.value, component.type);
                            if (component.value !== value) {
                                recalculate = true;
                                formState.data = this.setValue(component.schema, value, formState.data);
                                component.value = value;
                            }
                        }
                        property.value = evaluatedValue.value;
                    } else
                        delete component.rules[key];
                });
        });

        // recalculate the calculated values as they might be dependant from each other
        if (recalculate) {
            recalculate = false;
            formState.components.
                filter(component => component.rules && component.rules['value'] && component.rules['value'].condition).
                forEach(component => {
                    const property = component.rules['value'];
                    const evaluatedValue = HelperService.evaluateValue(property.condition, formState.data);
                    if (!evaluatedValue.error) {
                        const value = HelperService.resolveType(evaluatedValue.value, component.type);
                        if (component.value !== value) {
                            recalculate = true;
                            component.value = value;
                            formState.data = this.setValue(component.schema, value, formState.data);
                            property.value = true;
                        }
                    }
                });
            if (recalculate && !reRun)
                formState = this.resolveConditions(formState, true);
        }
        const configurationPromiseArr = [];
        formState.components.forEach(component => {
            if (component.type === 'select' && component.dataSource === 'api') {
                configurationPromiseArr.push(this.getComponentConfiguration(component, formState.data));
            }
        });
        Promise.all(configurationPromiseArr).then(data => {
            data.forEach(c => {
                let item = formState.components.find(d => d.componentId === c.componentId);
                if (item) {
                    item = Object.assign(item, c);
                }
            })
        })
        return formState;
    }
    
    /**
     * 当formComponent的configration的是需要根据某个值动态加载的，需要调用这个函数
     * @param component 
     * @param data 
     */
    getComponentConfiguration(component: FormComponent<any>, data: any): Promise<FormComponent<any>> {
        return new Promise((resolve, reject) => {
            const reg = new RegExp(/\${.+}/g);
            const matchedStr = component.apiAddress.match(reg);
            const schema = matchedStr.length > 0 ? matchedStr[0].slice(2, -1) : null;
            if (schema !== null) {
                const value = HelperService.evaluateValue(schema, data).value;
                if (value) {
                    const apiAddr = component.apiAddress.replace(reg, value);
                    this.http.get(apiAddr).subscribe(res => {
                        component.configuration = res;
                    });
                    resolve(component);
                } else {
                    resolve(component);
                }

            } else {
                resolve(component);
            }
        })
    }

    /**
     * 这个函数的目的: 校验需要走后端需要调用的，没有得到真正的使用。
     * @param apiAddress 
     * @param data 
     */
    getDataFromAPI(apiAddress: string, data: any): Promise<any> {
        return new Promise(resolve => {
            const reg = new RegExp(/\${.+}/g);
            const matchedStr = apiAddress.match(reg);
            const schema = matchedStr.length > 0 ? matchedStr[0].slice(2, -1) : null;
            if (schema !== null) {
                const value = HelperService.evaluateValue(schema, data).value;
                if (value) {
                    const apiAddr = apiAddress.replace(reg, value);
                    this.http.get(apiAddr).subscribe(res => {
                        resolve(res);
                    });
                } else {
                    resolve(null)
                }
            } else {
                resolve(null)
            }
        })
    }
}

