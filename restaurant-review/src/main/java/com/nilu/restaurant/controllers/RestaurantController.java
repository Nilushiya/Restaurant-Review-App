package com.nilu.restaurant.controllers;

import com.nilu.restaurant.domain.RestaurantCreateUpdateRequest;
import com.nilu.restaurant.domain.dtos.RestaurantCreateUpdateRequestDto;
import com.nilu.restaurant.domain.dtos.RestaurantDto;
import com.nilu.restaurant.domain.dtos.RestaurantSummaryDto;
import com.nilu.restaurant.domain.entities.Restaurant;
import com.nilu.restaurant.domain.entities.User;
import com.nilu.restaurant.mappers.RestaurantMapper;
import com.nilu.restaurant.services.RestaurantService;
import com.nilu.restaurant.utils.JwtUtils;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

import static com.nilu.restaurant.utils.JwtUtils.jwtToUser;

@RestController
@RequestMapping(path = "/api/restaurants")
@SecurityRequirement(name = "KeyCloak")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final RestaurantMapper restaurantMapper;

    @PostMapping
    @PreAuthorize("hasRole('restaurantAdmin')")
    public ResponseEntity<RestaurantDto> createRestaurant(
            @Valid @RequestBody RestaurantCreateUpdateRequestDto request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        RestaurantCreateUpdateRequest restaurantCreateUpdateRequest = restaurantMapper
                .toRestaurantCreateUpdateRequest(request);
        User user = jwtToUser(jwt);
        Restaurant restaurant = restaurantService.createRestaurant(restaurantCreateUpdateRequest, user);
        RestaurantDto createdRestaurantDto = restaurantMapper.toRestaurantDto(restaurant);
        return ResponseEntity.ok(createdRestaurantDto);
    }

    @GetMapping
    public Page<RestaurantSummaryDto> searchRestaurants(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Float minRating,
            @RequestParam(required = false) Float latitude,
            @RequestParam(required = false) Float longitude,
            @RequestParam(required = false) Float radius,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "4") int size
    ){
        Page<Restaurant> searchResults = restaurantService.searchRestaurants(
                q, minRating, latitude, longitude, radius, PageRequest.of(page - 1, size)
        );

        return searchResults.map(restaurantMapper::toSummaryDto);
    }

    @GetMapping(path = "/{restaurant_id}")
    public ResponseEntity<RestaurantDto> getRestaurant(@PathVariable("restaurant_id") String restaurantId) {
        return restaurantService.getRestaurant(restaurantId)
                .map(restaurant -> ResponseEntity.ok(restaurantMapper.toRestaurantDto(restaurant)))
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/restaurantByOwner")
    public ResponseEntity<List<RestaurantDto>> getMyRestaurants(
            @AuthenticationPrincipal Jwt jwt) {

        User user = JwtUtils.jwtToUser(jwt);

        List<Restaurant> restaurants = restaurantService.getRestaurantsByOwnerId(user.getId());

        if (restaurants.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        List<RestaurantDto> restaurantDtos = restaurants.stream()
                .map(restaurantMapper::toRestaurantDto)
                .toList();

        return ResponseEntity.ok(restaurantDtos);
    }


    @PutMapping(path = "/{restaurant_id}")
    public ResponseEntity<RestaurantDto> updateRestaurant(
            @PathVariable("restaurant_id") String restaurantId,
            @Valid @RequestBody RestaurantCreateUpdateRequestDto requestDto
    ) {
        RestaurantCreateUpdateRequest request = restaurantMapper
                .toRestaurantCreateUpdateRequest(requestDto);

        Restaurant updatedRestaurant = restaurantService.updateRestaurant(restaurantId, request);

        return ResponseEntity.ok(restaurantMapper.toRestaurantDto(updatedRestaurant));
    }

    @DeleteMapping(path = "/{restaurant_id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable("restaurant_id") String restaurantId) {
        restaurantService.deleteRestaurant(restaurantId);
        return ResponseEntity.noContent().build();
    }
}
