import { Component, OnInit } from '@angular/core';
import { FormQLMode } from '@formql/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formql-end-data',
  templateUrl: './formql-end-data.component.html',
  styleUrls: ['./formql-end-data.component.css']
})
export class FormqlEndDataComponent implements OnInit {

  mode: FormQLMode = FormQLMode.View;
  formName: string;
  ids: Array<string>;

  constructor(
    private route: ActivatedRoute
  ) {
    let routeSnap = this.route.snapshot;
    if (this.isEditMode(routeSnap))
      this.mode = FormQLMode.Edit;

    if (routeSnap.params["name"])
      this.formName = routeSnap.params["name"];

    if (routeSnap.params["id"]) {
      this.ids = [routeSnap.params["id"]];
    }
  }

  ngOnInit(): void {

  }

  private isEditMode(routeSnap) {
    return (routeSnap.url.join("/").indexOf("/edit") != -1 || (routeSnap.parent != null && routeSnap.parent.url.join("/").indexOf("/edit") != -1));
  }

}
