import { ThemeProvider } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { ModeProvider } from "@/context/ModeContext";
import React from "react";

export default function RootLayout() {
  return( 
  <ThemeProvider>
    <ModeProvider>
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="admin/(tabs)" options={{headerShown:false}}/>
        <Stack.Screen name="user/(tabs)" options={{headerShown:false}}/>
        <Stack.Screen name="restaurentAdmin/(tabs)" options={{headerShown:false}}/> 
        <Stack.Screen name="restaurentAdmin/restaurantForm" options={{ headerTitleStyle: { fontSize: 20, fontWeight: "bold" } }}/>
      </Stack>
    </AuthProvider>
    </ModeProvider>
    </ThemeProvider>);
}
