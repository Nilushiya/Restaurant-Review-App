import useTheme  from "@/hooks/useTheme";
import { Link } from "expo-router";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {useAuth} from '@/context/AuthContext'
import { Redirect, Slot } from 'expo-router';

export default function Index() {
  const {toggleDarkMode} = useTheme();
  const { user, signIn, signOut } = useAuth();
  if (!user) {
    // If logged out, redirect to main home
    return <Redirect href="/" />;
  }
  return (
    <View
      style={styles.container}
    >
      <ImageBackground
            source={require("../../../assets/images/home-bg.jpg")}
            style={styles.background}
            resizeMode="cover"
      >
          <LinearGradient
        colors={["rgba(122, 40, 2, 0.9)", "transparent"]} 
        style={styles.gradient}
      />
        <Text style={styles.textMain}>Welcome, Admin {user.username}!</Text>
      </ImageBackground>
      <Link href={"./about"}>go to About</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
   background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
   gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  textMain: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft:20,
  },
});
