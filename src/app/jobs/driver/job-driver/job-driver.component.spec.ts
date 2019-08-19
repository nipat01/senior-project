import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobDriverComponent } from './job-driver.component';

describe('JobDriverComponent', () => {
  let component: JobDriverComponent;
  let fixture: ComponentFixture<JobDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
