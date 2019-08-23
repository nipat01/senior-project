import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckLocitionComponent } from './check-locition.component';

describe('CheckLocitionComponent', () => {
  let component: CheckLocitionComponent;
  let fixture: ComponentFixture<CheckLocitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckLocitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckLocitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
