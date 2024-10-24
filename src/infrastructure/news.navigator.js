import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import NewsListScreen from "../screens/NewsListScreen";
import NewsDetailScreen from "../screens/NewsDetailScreen";

const Stack = createStackNavigator();

export const NewsNavigator = () => (
  <Stack.Navigator
    screenOptions={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
  >
    <Stack.Screen
      name="NewsList"
      component={NewsListScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NewsDetail"
      component={NewsDetailScreen}
      options={{ title: "News Details" }}
    />
  </Stack.Navigator>
);
