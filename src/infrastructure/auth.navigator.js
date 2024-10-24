import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, Button } from "react-native";
import Login from "../screens/Login";
import RegisterScreen from "../screens/RegisterScreen";
import splashScreen from "../screens/splashScreen";
import ForgetPassword from "../screens/ForgetPassword";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Welcome"
      options={{ headerShown: false }}
      component={splashScreen}
    />
    <Stack.Screen
      name="Login"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "white" },
        headerBackTitle: "Back",
      }}
      component={Login}
    />
    <Stack.Screen
      name="Register"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "white" },
        headerBackTitle: "Back",
      }}
      component={RegisterScreen}
    />
    <Stack.Screen
      name="ForgetPassword"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "#F8F1F1" },
        headerBackTitle: "Back",
      }}
      component={ForgetPassword}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
