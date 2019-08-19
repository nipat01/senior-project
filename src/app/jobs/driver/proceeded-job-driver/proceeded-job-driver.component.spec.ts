import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceededJobDriverComponent } from './proceeded-job-driver.component';

describe('ProceededJobDriverComponent', () => {
  let component: ProceededJobDriverComponent;
  let fixture: ComponentFixture<ProceededJobDriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProceededJobDriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceededJobDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
