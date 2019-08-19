import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingJobComponent } from './pending-job.component';

describe('PendingJobComponent', () => {
  let component: PendingJobComponent;
  let fixture: ComponentFixture<PendingJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
