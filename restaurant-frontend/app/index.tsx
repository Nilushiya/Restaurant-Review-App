import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
  const { user, signIn } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(); 
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/home-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
        <LinearGradient
                colors={["rgba(122, 40, 2, 0.9)", "transparent"]} 
                style={styles.gradient}
              />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Restaurant App </Text>

        {user ? (
          <Text style={styles.loggedInText}>
            Logged in as {user.username} ({user.roles.join(", ")})
          </Text>
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Get Start</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
   background: {
    width: "100%",
    height: "100%",
  },
   gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)", // optional overlay
  },
   button: {
    backgroundColor: "#ff6347",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
   buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  loggedInText: {
    marginTop: 20,
    fontSize: 16,
    color: "#fff",
  },
});
