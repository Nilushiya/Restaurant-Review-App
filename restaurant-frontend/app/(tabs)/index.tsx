import { Link } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";


export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <ImageBackground
            source={require("../../assets/images/home-bg.jpg")}
            style={styles.background}
            resizeMode="cover"
      >
          <LinearGradient
        colors={["rgba(122, 40, 2, 0.9)", "transparent"]} 
        style={styles.gradient}
      />
        <Text style={styles.textMain}>Discover Your Next Favorite Restaurant</Text>
        <Text style={styles.textSub}>Read authentic reviews from real diners and fine the perfect spot for your next meal.</Text>
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
    backgroundColor:"black",
    margin:20,
    opacity:0.7,
    padding:10,
    marginTop:10,
    borderRadius:10,
  },
});
