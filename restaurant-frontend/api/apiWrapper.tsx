import { Alert } from "react-native";
import { router } from "expo-router";

export const callApiWithToken = async (
  apiFunc: (token: string) => Promise<any>,
  accessToken: string,
  refreshTokenFunc?: () => Promise<string>
) => {
  try {
    return await apiFunc(accessToken);
  } catch (error: any) {
    // If expired, try refresh
    if (error.message?.includes("401") || error.message?.includes("expired")) {
      if (refreshTokenFunc) {
        const newToken = await refreshTokenFunc();
        if (newToken) {
          return await apiFunc(newToken); // retry with new token
        }
      }
      Alert.alert("Unauthorized", "Session expired. Please login again.");
    }
    throw error;
  }
};

