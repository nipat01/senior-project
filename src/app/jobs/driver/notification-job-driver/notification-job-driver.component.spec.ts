import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationJobDriverComponent } from './notification-job-driver.component';

describe('NotificationJobDriverComponent', () => {
  let component: NotificationJobDriverComponent;
  let fixture: ComponentFixture<NotificationJobDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationJobDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationJobDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
