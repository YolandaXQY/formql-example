import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormqlFrontDataComponent } from './formql-front-data.component';

describe('FormqlFrontDataComponent', () => {
  let component: FormqlFrontDataComponent;
  let fixture: ComponentFixture<FormqlFrontDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormqlFrontDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormqlFrontDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
