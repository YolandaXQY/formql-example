import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormqlEndDataComponent } from './formql-end-data.component';

describe('FormqlEndDataComponent', () => {
  let component: FormqlEndDataComponent;
  let fixture: ComponentFixture<FormqlEndDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormqlEndDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormqlEndDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
