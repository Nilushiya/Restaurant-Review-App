package com.nilu.restaurant.services;

import com.nilu.restaurant.domain.ReviewCreateUpdateRequest;
import com.nilu.restaurant.domain.entities.Restaurant;
import com.nilu.restaurant.domain.entities.Review;
import com.nilu.restaurant.domain.entities.User;
import io.micrometer.observation.ObservationFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    Review createReview(User author, String restaurantId, ReviewCreateUpdateRequest review);
    Page<Review> listReviews(String restaurantId, Pageable pageable);
    Optional<Review> getReview(String restaurantId, String reviewId);
    Review updateReview(User author, String restaurantId, String reviewId, ReviewCreateUpdateRequest review);
    void deleteReview(String restaurantId, String reviewId);

    List<Restaurant> getReviewByReviewer(User user);
}
