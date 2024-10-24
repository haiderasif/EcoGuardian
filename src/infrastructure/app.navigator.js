import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { walkthroughable, CopilotStep } from "react-native-copilot";
import { useWalkthrough } from "../components/WalkthroughContext";
import { MapNavigator } from "./Map.navigator";
import { NewsNavigator } from "./news.navigator";
import { AccountNavigator } from "./account.navigator";
import ListingEditScreen from "../screens/ListingEdit";
import NewListingButton from "../components/NewListingButton";
import FeedNavigator from "./feed.navigator";

const WalkthroughableIcon = walkthroughable(Ionicons);

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const { isWalkthroughActive } = useWalkthrough();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Social Feed") {
            iconName = "people-sharp";
          } else if (route.name === "Profile") {
            iconName = "settings";
          } else if (route.name === "Map") {
            iconName = "map";
          } else if (route.name === "News") {
            iconName = "newspaper";
          }

          return (
            <CopilotStep
              text={`This is the ${route.name} tab`}
              order={route.name === "Map" ? 3 : route.name === "News" ? 4 : 5}
              name={`${route.name}-tab`}
            >
              <WalkthroughableIcon name={iconName} size={size} color={color} />
            </CopilotStep>
          );
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={MapNavigator} />
      <Tab.Screen name="News" component={NewsNavigator} />
      <Tab.Screen
        name="ListingEdit"
        component={ListingEditScreen}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton
              onPress={() => navigation.navigate("ListingEdit")}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <WalkthroughableIcon name="plus-circle" size={size} color={color} />
          ),
        })}
      />
      <Tab.Screen name="Social Feed" component={FeedNavigator} />
      <Tab.Screen name="Profile" component={AccountNavigator} />
    </Tab.Navigator>
  );
};
