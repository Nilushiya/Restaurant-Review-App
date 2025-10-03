package com.devtiro.restaurant.services.impl;

import com.devtiro.restaurant.domain.GeoLocation;
import com.devtiro.restaurant.domain.entities.Address;
import com.devtiro.restaurant.services.GeoLocationService;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class NominatimGeoLocationService  implements GeoLocationService {
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public GeoLocation geoLocate(Address address) {
        String query = String.format("%s, %s, %s",
                address.getStreetName(), address.getCity(), address.getCountry());

        String url = "https://nominatim.openstreetmap.org/search?q=" + query + "&format=json&limit=1";

        ResponseEntity<List<Map<String, Object>>> response =
                restTemplate.exchange(url, HttpMethod.GET, null,
                        new ParameterizedTypeReference<>() {});

        if (response.getBody() != null && !response.getBody().isEmpty()) {
            Map<String, Object> location = response.getBody().get(0);
            double lat = Double.parseDouble((String) location.get("lat"));
            double lon = Double.parseDouble((String) location.get("lon"));

            return GeoLocation.builder()
                    .latitude(lat)
                    .longitude(lon)
                    .build();
        } else {
            throw new RuntimeException("Could not geocode address: " + query);
        }
    }
}
