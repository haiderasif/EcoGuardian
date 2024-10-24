import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

function AppButton({
  title,
  onPress,
  width,
  bgcolor = "primery",
  textcol = "white",
  margin = 0,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgcolor }, { width: width }]}
      onPress={onPress}
    >
      <Text style={[styles.text, { color: textcol }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 13,
    marginVertical: 10,
    alignSelf: "center",
    height: 55,
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "uppercase",
  },
});

export default AppButton;
