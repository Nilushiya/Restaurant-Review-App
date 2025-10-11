package com.nilu.restaurant.mappers;

import com.nilu.restaurant.domain.ReviewCreateUpdateRequest;
import com.nilu.restaurant.domain.dtos.ReviewCreateUpdateRequestDto;
import com.nilu.restaurant.domain.dtos.ReviewDto;
import com.nilu.restaurant.domain.entities.Review;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReviewMapper {

    ReviewCreateUpdateRequest toReviewCreateUpdateRequest(ReviewCreateUpdateRequestDto dto);

    ReviewDto toDto(Review review);

}
