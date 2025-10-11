package com.nilu.restaurant.repositories.jpa;

import com.nilu.restaurant.domain.entities.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantJPARepo extends JpaRepository<Restaurant, String> {
}
