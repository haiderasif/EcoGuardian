import React, { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import colors from "../styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

function AppTextInput({ icon, ...otherProps }) {
  const [focus, setFocus] = useState(false);
  const customStyle = focus ? styles.containerFocused : styles.container;
  const customIcon = focus ? styles.iconFocused : styles.icon;
  return (
    <View style={customStyle}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={colors.medium}
        style={customIcon}
      />

      <TextInput
        onFocus={() => {
          setFocus(true);
        }}
        onEndEditing={() => {
          setFocus(false);
        }}
        placeholderTextColor={colors.medium}
        {...otherProps}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    width: "90%",
    padding: 15,
    marginVertical: 10,
    marginLeft: 20,
  },
  containerFocused: {
    backgroundColor: colors.light,
    borderRadius: 5,
    borderColor: colors.primery,
    borderWidth: 2,
    flexDirection: "row",
    width: "90%",
    padding: 15,
    marginVertical: 10,
    marginLeft: 20,
  },
  icon: {
    marginRight: 10,
  },
  iconFocused: {
    color: colors.primery,
    marginRight: 10,
  },
});

export default AppTextInput;
