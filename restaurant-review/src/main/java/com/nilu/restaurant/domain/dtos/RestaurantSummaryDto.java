package com.nilu.restaurant.domain.dtos;

import com.nilu.restaurant.domain.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.elasticsearch.core.geo.GeoPoint;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RestaurantSummaryDto {
    private String id;
    private String name;
    private String cuisineType;
    private Float averageRating;
    private Integer totalReviews;
    private GeoPoint geoLocation;
    private AddressDto address;
    private List<PhotoDto> photos;
    private UserDto createdBy;
}
