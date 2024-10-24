import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import EditProfile from "../screens/EditProfile";
import DeleteUser from "../screens/DeleteUser";
import MyListingScreen from "../screens/MyListing";
import UpdatePost from "../screens/UpdatePost";
import { MyForest } from "../screens/MyForest";
import NewsListScreen from "../screens/NewsListScreen";
const Stack = createStackNavigator();

export const AccountNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      ...TransitionPresets.ModalSlideFromBottomIOS,
    }}
  >
    <Stack.Screen
      name="Account"
      options={{ headerShown: false }}
      component={AccountScreen}
    />
    <Stack.Screen
      name="Edit Profile"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "#F8F1F1" },
        headerBackTitle: "Back",
      }}
      component={EditProfile}
    />
    <Stack.Screen
      name="My Listing"
      options={{
        headerShown: true,
        headerTitle: "My lisitng",
        headerStyle: { backgroundColor: "#F8F1F1" },
        headerBackTitle: "Back",
      }}
      component={MyListingScreen}
    />
    <Stack.Screen
      name="Delete User"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "#F8F1F1" },
        headerBackTitle: "Back",
      }}
      component={DeleteUser}
    />
    <Stack.Screen
      name="Update Post"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "#F8F1F1" },
        headerBackTitle: "Back",
      }}
      component={UpdatePost}
    />
    <Stack.Screen
      name="MyForest"
      options={{
        headerShown: true,
        headerTitle: "",
        headerStyle: { backgroundColor: "#F8F1F1" },
        headerBackTitle: "Back",
      }}
      component={MyForest}
    />
  </Stack.Navigator>
);
