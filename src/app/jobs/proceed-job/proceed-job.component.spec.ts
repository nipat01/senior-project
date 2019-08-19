import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceedJobComponent } from './proceed-job.component';

describe('ProceedJobComponent', () => {
  let component: ProceedJobComponent;
  let fixture: ComponentFixture<ProceedJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProceedJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceedJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
