import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckpaymentJobComponent } from './checkpayment-job.component';

describe('CheckpaymentJobComponent', () => {
  let component: CheckpaymentJobComponent;
  let fixture: ComponentFixture<CheckpaymentJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckpaymentJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckpaymentJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
