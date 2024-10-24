import React from "react";
import { StyleSheet,Text } from "react-native";

import AppText from "../AppText";

function ErrorMessage({ error, visible }) {
  if (!visible || !error) return null;

  return (
  <Text style = {styles.error}>{error}</Text>
  )
}

const styles = StyleSheet.create({
  error: {
    marginLeft: 20,
    color: "red",
  },
});

export default ErrorMessage;
