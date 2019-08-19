import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioUserComponent } from './portfolio-user.component';

describe('PortfolioUserComponent', () => {
  let component: PortfolioUserComponent;
  let fixture: ComponentFixture<PortfolioUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
