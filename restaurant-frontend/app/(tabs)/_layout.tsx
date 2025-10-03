import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "orange",      
        tabBarInactiveTintColor: "black",
        tabBarStyle: { paddingTop: 10, height: 75},
    }}>
            <Tabs.Screen
             name="index"
             options={{headerTitle:"Restaurant Reviews",
                headerTitleStyle: {
                  fontSize: 24,         
                  fontWeight: "bold",    
                  color: "#c45a03ff",       
                  textAlign: "center",   
                },
                tabBarIcon:({color,size})=> 
                (<MaterialIcons name="restaurant" color={color} size={size} />),
                tabBarLabel: ({ focused }) => (focused ? null : <Text style={{fontSize:10,}}>Home</Text>),}}/>
            <Tabs.Screen
             name="review" 
             options={{headerTitle:"Review",
                tabBarIcon:({color,size})=> 
            (<FontAwesome name="star" color={color} size={size} />),
                tabBarLabel: ({ focused }) => (focused ? null : <Text style={{fontSize:10,}}>Review</Text>),}}/>
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

