import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationJobComponent } from './notification-job.component';

describe('NotificationJobComponent', () => {
  let component: NotificationJobComponent;
  let fixture: ComponentFixture<NotificationJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
