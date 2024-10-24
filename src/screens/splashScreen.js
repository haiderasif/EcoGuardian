import React from "react";
import { ImageBackground, StyleSheet, Image, Text, View } from "react-native";
import AppButton from "../components/AppButton";

function Welcome({ navigation }) {
  return (
    <ImageBackground
      style={styles.background}
      source={require("../../assets/background.png")}
    >
      <View style={styles.alignitem}>
        <View style={{ top: 250, right: 15 }}>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Text style={{ fontSize: 45, fontWeight: "bold" }}>Plant a </Text>
            <Text
              style={{ color: "#16C79A", fontSize: 45, fontWeight: "bold" }}
            >
              tree,
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Text
              style={{ color: "#16C79A", fontSize: 45, fontWeight: "bold" }}
            >
              save{" "}
            </Text>
            <Text style={{ fontSize: 45, fontWeight: "bold" }}>the world</Text>
          </View>
        </View>
      </View>
      <View style={styles.containerView}>
        <AppButton
          width="80%"
          title="Sign in"
          bgcolor="#16C79A"
          onPress={() => navigation.navigate("Login")}
        />
        <AppButton
          width="80%"
          title="Create Account"
          bgcolor="#F8F1F1"
          textcol="black"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#F8F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  containerView: {
    flex: 1,
    padding: 20,
    width: "100%",
    justifyContent: "flex-end",
  },
  alignitem: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tag: {
    fontSize: 25,
    fontWeight: "600",
  },
});
export default Welcome;
