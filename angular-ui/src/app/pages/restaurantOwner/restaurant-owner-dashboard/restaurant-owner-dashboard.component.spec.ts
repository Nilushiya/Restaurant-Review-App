import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOwnerDashboardComponent } from './restaurant-owner-dashboard.component';

describe('RestaurantOwnerDashboardComponent', () => {
  let component: RestaurantOwnerDashboardComponent;
  let fixture: ComponentFixture<RestaurantOwnerDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestaurantOwnerDashboardComponent]
    });
    fixture = TestBed.createComponent(RestaurantOwnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
