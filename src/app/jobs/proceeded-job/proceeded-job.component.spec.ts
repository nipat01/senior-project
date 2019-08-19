import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceededJobComponent } from './proceeded-job.component';

describe('ProceededJobComponent', () => {
  let component: ProceededJobComponent;
  let fixture: ComponentFixture<ProceededJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProceededJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceededJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
