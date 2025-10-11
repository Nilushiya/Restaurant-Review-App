package com.nilu.restaurant.services;

import com.nilu.restaurant.domain.GeoLocation;
import com.nilu.restaurant.domain.entities.Address;

public interface GeoLocationService {
    GeoLocation geoLocate(Address address);
}
