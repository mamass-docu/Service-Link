import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  useEffect(() => {
    let timer;

    const checkIntro = async () => {
      const introShowed = await AsyncStorage.getItem("introShowed");

      if (!introShowed) await AsyncStorage.setItem("introShowed", "true");

      timer = setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: introShowed ? "Login" : "Boarding1" }],
        });
      }, 3000);
    };

    checkIntro();

    return () => clearTimeout(timer); // ✅ Cleanup timeout properly
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor="#FFB800"
        barStyle="light-content"
        translucent={true}
      />
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text style={styles.serviceText}>SERVICE</Text>
          <Text style={styles.linkText}>LINK</Text>
        </View>
      </View>
    </>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFB800",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: height * 0.05,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  serviceText: {
    fontSize: width * 0.12, // Responsive font size
    fontFamily: "Poppins-Bold", // Make sure you have this font
    color: "#FFFFFF",
    letterSpacing: 2,
    includeFontPadding: false,
    padding: 0,
    marginBottom: -10, // Adjust this to bring the texts closer together
  },
  linkText: {
    fontSize: width * 0.12, // Same size as serviceText
    fontFamily: "Poppins-Bold", // Make sure you have this font
    color: "#000000",
    letterSpacing: 2,
    includeFontPadding: false,
    padding: 0,
  },

  fadeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  // For potential scaling animation
  scaleContainer: {
    transform: [{ scale: 1 }], // Initial scale
  },

  // For potential slide animation
  slideContainer: {
    transform: [{ translateY: 0 }], // Initial position
  },
});
