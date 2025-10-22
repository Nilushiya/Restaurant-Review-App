package com.nilu.restaurant.utils;

import com.nilu.restaurant.domain.entities.User;
import org.springframework.security.oauth2.jwt.Jwt;

public class JwtUtils {
    private JwtUtils() {}
    public static User jwtToUser(Jwt jwt) {
        return User.builder()
                .id(jwt.getSubject())
                .username(jwt.getClaimAsString("preferred_username"))
                .givenName(jwt.getClaimAsString("given_name"))
                .familyName(jwt.getClaimAsString("family_name"))
                .build();
    }
}
