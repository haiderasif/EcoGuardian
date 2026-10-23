import "./src/services/firebase";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Navigator } from "./src/infrastructure/index";
import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";
import { FirebaseContextProvider } from "./src/services/FirebaseData";
import { LogBox } from "react-native";

export default function App() {
  LogBox.ignoreAllLogs();
  return (
    <>
      <FirebaseContextProvider>
        <AuthenticationContextProvider>
          <Navigator />
        </AuthenticationContextProvider>
      </FirebaseContextProvider>
      <ExpoStatusBar style="auto" />
    </>
  );
}
