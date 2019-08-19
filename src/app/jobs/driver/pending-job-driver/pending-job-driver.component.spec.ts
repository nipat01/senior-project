import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingJobDriverComponent } from './pending-job-driver.component';

describe('PendingJobDriverComponent', () => {
  let component: PendingJobDriverComponent;
  let fixture: ComponentFixture<PendingJobDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingJobDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingJobDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
