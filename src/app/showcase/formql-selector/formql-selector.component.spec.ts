import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormqlSelectorComponent } from './formql-selector.component';

describe('FormqlSelectorComponent', () => {
  let component: FormqlSelectorComponent;
  let fixture: ComponentFixture<FormqlSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormqlSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormqlSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
