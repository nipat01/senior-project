import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartypeUserComponent } from './cartype-user.component';

describe('CartypeUserComponent', () => {
  let component: CartypeUserComponent;
  let fixture: ComponentFixture<CartypeUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartypeUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartypeUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
