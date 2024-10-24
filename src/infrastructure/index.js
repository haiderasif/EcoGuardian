import React, { useContext } from "react";
import { AppNavigator } from "./app.navigator";
import { View, Text } from "react-native";
import AuthNavigator from "./auth.navigator";
import { NavigationContainer } from "@react-navigation/native";
import { AuthenticationContext } from "../services/authentication/authentication.context";
import { WalkthroughProvider } from "../components/WalkthroughContext";
import { CopilotProvider } from "react-native-copilot";
export const Navigator = () => {
  const { isauthenticated } = useContext(AuthenticationContext);
  return (
    <NavigationContainer>
      <CopilotProvider>
        {isauthenticated ? (
          <WalkthroughProvider>
            <AppNavigator />
          </WalkthroughProvider>
        ) : (
          <AuthNavigator />
        )}
      </CopilotProvider>
    </NavigationContainer>
  );
};
