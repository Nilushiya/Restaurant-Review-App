import useTheme  from "@/hooks/useTheme";
import { Link, Redirect } from "expo-router";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {useAuth} from '@/context/AuthContext'
import { useMode } from '@/context/ModeContext';
import { useRouter } from 'expo-router';

export default function Index() {
  const {toggleDarkMode} = useTheme();
  const { user} = useAuth();
  const { setIsEditMode } = useMode();
  const router = useRouter();
  const handleAdd = () => {
    setIsEditMode(false); 
    router.push('/restaurentAdmin/restaurantForm'); 
  };
 
  if (!user) {
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
        <Text style={styles.textMain}>Welcome, Restaurent Admin {user.username}!</Text>
        <TouchableOpacity onPress={handleAdd}>
          <Text style={styles.textSub}>Add Restaurant</Text>
        </TouchableOpacity>
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
   textSub: {
    color: "white",
    fontSize: 15,
    backgroundColor:"rgba(233, 94, 30, 0.9)",
    fontWeight: "bold",
    margin:20,
    opacity:0.8,
    padding:10,
    marginTop:10,
    borderRadius:10,
  },
});
