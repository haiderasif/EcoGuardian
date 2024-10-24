import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

export const AppLoader = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../../assets/appLoader.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  animation: {
    width: 200, // Adjust width as needed
    height: 200, // Adjust height as needed
  },
});
