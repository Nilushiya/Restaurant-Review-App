import React from 'react';
import { Button, Text, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';

const Settings = () => {
  const { user, signOut } = useAuth();
console.log('Settings user:', user);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {user ? (
        <>
          <Text style={{ marginBottom: 10 }}>
            Logged in as: {user.username || 'User'}
          </Text>
          <Button title="Logout" onPress={signOut} />
        </>
      ) : (
        <Text>Not logged in</Text>
      )}
    </View>
  );
};

export default Settings;
