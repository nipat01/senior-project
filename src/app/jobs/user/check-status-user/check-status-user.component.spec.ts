import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckStatusUserComponent } from './check-status-user.component';

describe('CheckStatusUserComponent', () => {
  let component: CheckStatusUserComponent;
  let fixture: ComponentFixture<CheckStatusUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckStatusUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckStatusUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
