import useTheme from '@/hooks/useTheme'
import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import {useAuth} from '@/context/AuthContext'

const TabsLayout = () => {
  const { colors } = useTheme();
  const { user, signIn, signOut } = useAuth();
console.log('TabsLayout user:', user);  
  const renderHeaderRight = () => {
    if (user) {
      const firstLetter = user.username?.charAt(0)?.toUpperCase() || '?';
      return (
        
        // <TouchableOpacity
        //   onPress={signOut}
          
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 ,
            marginRight: 15,
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            paddingTop: 6,
          }}>
            {firstLetter}
          </Text>
        // </TouchableOpacity>
      );
    } 
  };

  return (
    <Tabs
      screenOptions={{
        headerTitle:"Restaurant Reviews",
                headerTitleStyle: {
                  fontSize: 24,         
                  fontWeight: "bold",    
                  color: "#c45a03ff",       
                  textAlign: "center",   
                },
        tabBarActiveTintColor: colors.primary,      
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { paddingTop: 10, height: 75, backgroundColor: colors.surface, borderTopColor: colors.border},
    }}>
            <Tabs.Screen
             name="index"
             options={{
                headerRight: renderHeaderRight,
                tabBarIcon:({color,size})=> 
                (<MaterialIcons name="home" color={color} size={size} />),
                tabBarLabel: ({ focused }) => (focused ? null : <Text style={{fontSize:10,}}>Home</Text>),}}/>
            {/* <Tabs.Screen
             name="review" 
             options={{headerTitle:"Review",
                tabBarIcon:({color,size})=> 
            (<FontAwesome name="star" color={color} size={size} />),
                tabBarLabel: ({ focused }) => (focused ? null : <Text style={{fontSize:10,}}>Review</Text>),}}/> */}
            <Tabs.Screen
             name="settings" 
             options={{headerTitle:"Settings",
                tabBarIcon:({color,size})=> 
            (<Ionicons name="settings" color={color} size={size} />),
                tabBarLabel: ({ focused }) => (focused ? null : <Text style={{fontSize:10,}}>Settings</Text>),}}/>
    </Tabs>
  )
}

export default TabsLayout

