import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviceUserComponent } from './revice-user.component';

describe('ReviceUserComponent', () => {
  let component: ReviceUserComponent;
  let fixture: ComponentFixture<ReviceUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviceUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviceUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
