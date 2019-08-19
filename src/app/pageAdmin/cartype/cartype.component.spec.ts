import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartypeComponent } from './cartype.component';

describe('CartypeComponent', () => {
  let component: CartypeComponent;
  let fixture: ComponentFixture<CartypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
