export const keycloakConfig = {
  issuer: 'https://lucina-headed-manifoldly.ngrok-free.dev/realms/restaurant-review',  //realm
  clientId: 'reactNative-app',                   //  client ID
  redirectUrl: 'restaurantfrontend:/callback',    //  app.json scheme
  scopes: ['openid', 'profile', 'email'],
    discoveryUrl: 'https://lucina-headed-manifoldly.ngrok-free.dev/realms/restaurant-review/.well-known/openid-configuration', // <-- add this
};