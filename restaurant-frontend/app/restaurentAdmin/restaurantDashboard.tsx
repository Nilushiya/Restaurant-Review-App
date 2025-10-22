import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function RestaurantDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  if (!user || !user.roles.includes('restaurantAdmin')) {
    router.replace('/'); 
    return null;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, Admin!</Text>
    </View>
  );
}
