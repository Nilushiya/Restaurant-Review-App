package com.nilu.restaurant;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//@SecurityScheme(
//		name = "KeyCloak",
//		openIdConnectUrl = "https://lucina-headed-manifoldly.ngrok-free.dev/realms/restaurant-review/.well-known/openid-configuration",
//		scheme = "bearer",
//		type = SecuritySchemeType.OPENIDCONNECT,
//		in =  SecuritySchemeIn.HEADER
//
//)
@SpringBootApplication(scanBasePackages = "com.nilu.restaurant")

//@SpringBootApplication
public class RestaurantApplication {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantApplication.class, args);
	}

}
