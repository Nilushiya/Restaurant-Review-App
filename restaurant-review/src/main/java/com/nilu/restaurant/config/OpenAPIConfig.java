package com.nilu.restaurant.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {
    String keycloakServerUrl = "https://lucina-headed-manifoldly.ngrok-free.dev/realms/restaurant-review/protocol/openid-connect";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Restaurant API").version("v1"))
                .components(new Components()
                        .addSecuritySchemes("Keycloak", new SecurityScheme()
                                .type(SecurityScheme.Type.OAUTH2)
                                .flows(new OAuthFlows()
                                        .authorizationCode(new OAuthFlow()
                                                .authorizationUrl(keycloakServerUrl + "/auth")
                                                .tokenUrl(keycloakServerUrl + "/token")
                                                .scopes(new Scopes().addString("openid", "OpenID Connect scope"))))))
            .addSecurityItem(new SecurityRequirement().addList("Keycloak"));
    }
}