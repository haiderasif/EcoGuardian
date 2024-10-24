import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import ListingScreen from "../screens/ListingScreen";
import ListingDetailsScreen from "../screens/ListingDetailedScreen";
import { MapDetailedScreen } from "../screens/MapDetailedScreen";
import UserAccountScreen from "../screens/UserAccountScreen";
const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator
    screenOptions={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
  >
    <Stack.Screen
      name="Listings"
      options={{ headerShown: false }}
      component={ListingScreen}
    />
    <Stack.Screen
      name="ListingDetails"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "#F8F1F1" },
        headerBackTitle: "Back",
      }}
      component={ListingDetailsScreen}
    />
    <Stack.Screen
      name="MapDetailed"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "#F8F1F1" },
        headerBackTitle: "Back",
      }}
      component={MapDetailedScreen}
    />
    <Stack.Screen
      name="UserAccount"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "#F8F1F1" },
        headerBackTitle: "Back",
      }}
      component={UserAccountScreen}
    />
  </Stack.Navigator>
);

export default FeedNavigator;
