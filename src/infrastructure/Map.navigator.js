import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import MapScreen from "../screens/MapScreen";
import CopilitMapScreen from "../screens/CopilotMapScreen";
import { MapDetailedScreen } from "../screens/MapDetailedScreen";
import { LocationReport } from "../screens/LocationReport";
import { VisualiseSite } from "../screens/VisualiseSite";
import { TreePlantingStep1 } from "../screens/TreePlantingStep1";
import { TreePlantingStep2 } from "../screens/TreePlantingStep2";
import { TreePlantingStep3 } from "../screens/TreePlantationStep3";
import { VerifyPlantation } from "../screens/VerifyPlantation";
const Stack = createStackNavigator();
export const MapNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.ModalSlideFromBottomIOS,
      }}
    >
      <Stack.Screen
        name="map"
        options={{ headerShown: false }}
        component={MapScreen}
      />
      <Stack.Screen
        name="MapDetailedScreen"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#F8F1F1" },
          headerBackTitle: "Back",
        }}
        component={MapDetailedScreen}
      />

      <Stack.Screen
        name="LocationReport"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#F8F1F1" },
          headerBackTitle: "Back",
        }}
        component={LocationReport}
      />
      <Stack.Screen
        name="VisualiseSite"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#F8F1F1" },
          headerBackTitle: "Back",
        }}
        component={VisualiseSite}
      />
      <Stack.Screen
        name="TreePlantingStep1"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#F8F1F1" },
          headerBackTitle: "Back",
        }}
        component={TreePlantingStep1}
      />
      <Stack.Screen
        name="TreePlantingStep2"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#F8F1F1" },
          headerBackTitle: "Back",
        }}
        component={TreePlantingStep2}
      />
      <Stack.Screen
        name="TreePlantingStep3"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#F8F1F1" },
          headerBackTitle: "Back",
        }}
        component={TreePlantingStep3}
      />
      <Stack.Screen
        name="VerifyPlantation"
        options={{
          headerShown: true,
          headerTitle: "",
          headerStyle: { backgroundColor: "#F8F1F1" },
          headerBackTitle: "Back",
        }}
        component={VerifyPlantation}
      />
    </Stack.Navigator>
  );
};
