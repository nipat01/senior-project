import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckdataJobComponent } from './checkdata-job.component';

describe('CheckdataJobComponent', () => {
  let component: CheckdataJobComponent;
  let fixture: ComponentFixture<CheckdataJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckdataJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckdataJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
