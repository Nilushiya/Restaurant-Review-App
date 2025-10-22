import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { keycloakConfig } from './keycloakConfig ';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export function useAuthLogic() {
  const [user, setUser] = React.useState(null);
  const [accessToken, setAccessToken] = React.useState(null);
  const [refreshToken, setRefreshToken] = React.useState(null);
  const [hasExchanged, setHasExchanged] = React.useState(false);
  const router = useRouter();
  const discovery = {
    authorizationEndpoint: `${keycloakConfig.issuer}/protocol/openid-connect/auth`,
    tokenEndpoint: `${keycloakConfig.issuer}/protocol/openid-connect/token`,
    revocationEndpoint: `${keycloakConfig.issuer}/protocol/openid-connect/revoke`,
  };
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: keycloakConfig.clientId,
      redirectUri,
      scopes: keycloakConfig.scopes,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery
  );

  React.useEffect(() => {
    // console.log('Auth response:', response);
    // console.log('Request details:', hasExchanged  ,"request:", request);
    setHasExchanged(false);
    if (response?.type === 'success' && response.params?.code && !hasExchanged) {
      setHasExchanged(true);
      // console.log('Authorization code received:', response.params.code);
      exchangeCodeForToken(response.params.code);
    }
  }, [response]);

  const exchangeCodeForToken = async (code) => {
    // console.log('Exchanging code for token:', code);
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: keycloakConfig.clientId,
      code,
      redirect_uri: redirectUri,
      code_verifier: request.codeVerifier,
    });
// console.log('Token exchange request body:', body.toString());
    const res = await fetch(discovery.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const data = await res.json();
    // console.log('Token response data:', data);
    if (data.id_token) {
      const userInfo = parseJwt(data.id_token);
      const roles = userInfo?.roles || [];
// console.log('userInfo.preferred_username:', userInfo.preferred_username);
      // ✅ Update state
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      setUser({
        username: userInfo.given_name || userInfo.name || userInfo.preferred_username,
        email: userInfo.email,
        roles: roles,
      });
// console.log('User Info:', userInfo);
      // console.log('User Roles:', roles);
      // ✅ Navigate based on roles
      if (roles.includes("admin")) {
        router.replace("/admin/");
      } else if (roles.includes("restaurantAdmin")) {
        // console.log("Navigating to restaurant admin");
        router.replace("/restaurentAdmin/");
      } else {
        router.replace("/user/");
      }
    }
  } catch (error) {
    console.error('Token exchange error:', error);
  }
};


  const signIn = () => {
    setHasExchanged(false);
    // console.log('Starting sign-in process');
    promptAsync({ useProxy: true,
      extraParams: { kc_idp_hint: 'google' },
     })};

const signOut = async () => {
  try {
    if (!accessToken) {
      setUser(null);
      setHasExchanged(false);
      router.replace('/');
      return;
    }

    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
    const logoutUrl = `${keycloakConfig.issuer}/protocol/openid-connect/logout?client_id=${keycloakConfig.clientId}&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;
    const result = await WebBrowser.openAuthSessionAsync(logoutUrl, redirectUri);

    if (result.type === 'success') {
      console.log('Logout redirect received');
    } else {
      console.log('Logout dismissed or failed');
    }

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setHasExchanged(false);
    await WebBrowser.dismissBrowser();

setTimeout(() => {
  router.replace('/');
}, 500);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const refreshAccessToken = async () => {
    if (!refreshToken) return;

    try {
      const tokenResponse = await fetch(
        `${keycloakConfig.issuer}/protocol/openid-connect/token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `grant_type=refresh_token&client_id=${keycloakConfig.clientId}&refresh_token=${refreshToken}`,
        }
      );

      const tokenData = await tokenResponse.json();

      if (tokenData.access_token) {
        setAccessToken(tokenData.access_token);
        setRefreshToken(tokenData.refresh_token);
      } else {
        setAccessToken(null);
        setRefreshToken(null);
      }
    } catch (err) {
      console.log("Failed to refresh token:", err);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };


  return { user, signIn, signOut, accessToken, refreshToken, refreshAccessToken };
}

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}
