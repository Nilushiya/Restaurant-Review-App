package com.nilu.restaurant.controllers;

import com.nilu.restaurant.domain.ReviewCreateUpdateRequest;
import com.nilu.restaurant.domain.dtos.RestaurantDto;
import com.nilu.restaurant.domain.dtos.ReviewCreateUpdateRequestDto;
import com.nilu.restaurant.domain.dtos.ReviewDto;
import com.nilu.restaurant.domain.entities.Review;
import com.nilu.restaurant.domain.entities.User;
import com.nilu.restaurant.mappers.RestaurantMapper;
import com.nilu.restaurant.mappers.ReviewMapper;
import com.nilu.restaurant.services.ReviewService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.nilu.restaurant.utils.JwtUtils.jwtToUser;

@RestController
@RequestMapping(path = "/api/reviews")
@SecurityRequirement(name = "KeyCloak")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewMapper reviewMapper;
    private final RestaurantMapper restaurantMapper;
    private final ReviewService reviewService;

    @PostMapping("/{restaurantId}")
    public ResponseEntity<ReviewDto> createReview(
            @PathVariable String restaurantId,
            @Valid @RequestBody ReviewCreateUpdateRequestDto review,
            @AuthenticationPrincipal Jwt jwt) {

        ReviewCreateUpdateRequest reviewCreateUpdateRequest = reviewMapper.toReviewCreateUpdateRequest(review);

        User user = jwtToUser(jwt);

        Review createdReview = reviewService.createReview(user, restaurantId, reviewCreateUpdateRequest);

        return ResponseEntity.ok(reviewMapper.toDto(createdReview));
    }

    @GetMapping("/{restaurantId}/list")
    public Page<ReviewDto> listReviews(
            @PathVariable String restaurantId,
            @PageableDefault(
                    size = 20,
                    page = 1,
                    sort = "datePosted",
                    direction = Sort.Direction.DESC) Pageable pageable
            ) {
        return reviewService
                .listReviews(restaurantId, pageable)
                .map(reviewMapper::toDto);
    }


    @GetMapping(path = "/{restaurantId}/{reviewId}")
    public ResponseEntity<ReviewDto> getReview(
            @PathVariable String restaurantId,
            @PathVariable String reviewId
    ) {
        return reviewService.getReview(restaurantId, reviewId)
                .map(reviewMapper::toDto)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping
    public ResponseEntity<List<RestaurantDto>> getReviewsByReviewer(
            @AuthenticationPrincipal Jwt jwt
    ) {
        User user = jwtToUser(jwt);
33333333333333        List<RestaurantDto> restaurant = reviewService.getReviewByReviewer(user).stream()
                .map(restaurantMapper::toRestaurantDto)
                .collect(Collectors.toList());

        if (restaurant.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(restaurant);
    }


    @PutMapping(path = "/{restaurantId}/{reviewId}")
    public ResponseEntity<ReviewDto> updateReview(
            @PathVariable String restaurantId,
            @PathVariable String reviewId,
            @Valid @RequestBody ReviewCreateUpdateRequestDto review,
            @AuthenticationPrincipal Jwt jwt
    ){
        ReviewCreateUpdateRequest reviewCreateUpdateRequest = reviewMapper.toReviewCreateUpdateRequest(review);
        User user = jwtToUser(jwt);

        Review updatedReview = reviewService.updateReview(
                user, restaurantId, reviewId, reviewCreateUpdateRequest
        );

        return ResponseEntity.ok(reviewMapper.toDto(updatedReview));
    }

    @DeleteMapping(path = "/{restaurantId}/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String restaurantId,
            @PathVariable String reviewId
    ) {
        reviewService.deleteReview(restaurantId, reviewId);
        return ResponseEntity.noContent().build();
    }
}
