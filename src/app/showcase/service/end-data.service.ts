import { Injectable } from "@angular/core";
import { IFormQLService, FormWindow, FormDataSource } from "@formql/core";
import { of, throwError } from 'rxjs';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class EndDataService implements IFormQLService{

  constructor(private http: HttpClient) {}
    
  getData(dataSource: FormDataSource, ids: Array<string>) {
    //   if (!ids)
    //       throwError('no ids provided!');

    //   let item = localStorage.getItem(ids[0]);
    //   if (item)
    //       return of(JSON.parse(item));
      
    //   return of({});
    return this.http.get(`assets/api/formData.json`)
  }    

  getForm(name: string) {
      let item = localStorage.getItem(name);
      if (item)
          return of(JSON.parse(item));
      else
          return this.http.get(`assets/api/mortgageCalculator.json`);
  }

  getForms() {
      return of(new Array<FormWindow>());
  }

  saveForm(name: string, form: FormWindow) {
      localStorage.setItem(name, JSON.stringify(form));
      return of(form);
  }

  saveData(dataSource: FormDataSource, ids: Array<string>, data: any) {
      if (!ids)
          throwError('no ids provided!');

      localStorage.setItem(ids[0], JSON.stringify(data));
      return of(data);
  }

}
