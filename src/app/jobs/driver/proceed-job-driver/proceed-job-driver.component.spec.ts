import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedJobDriverComponent } from './proceed-job-driver.component';

describe('ProceedJobDriverComponent', () => {
  let component: ProceedJobDriverComponent;
  let fixture: ComponentFixture<ProceedJobDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProceedJobDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedJobDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
