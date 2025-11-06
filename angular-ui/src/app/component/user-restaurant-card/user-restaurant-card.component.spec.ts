import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRestaurantCardComponent } from './user-restaurant-card.component';

describe('UserRestaurantCardComponent', () => {
  let component: UserRestaurantCardComponent;
  let fixture: ComponentFixture<UserRestaurantCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserRestaurantCardComponent]
    });
    fixture = TestBed.createComponent(UserRestaurantCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
