import { getApps, initializeApp } from "firebase/app";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Navigator } from "./src/infrastructure/index";
import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";
import { FirebaseContextProvider } from "./src/services/FirebaseData";
import { LogBox } from "react-native";

const InitializeFirebase = {
  apiKey: "AIzaSyASUyZgEMXJG_QgC54HRQy4J5HuxQ7Ok8k",
  authDomain: "ecoguardian-2c40a.firebaseapp.com",
  databaseURL: "https://ecoguardian-2c40a-default-rtdb.firebaseio.com",
  projectId: "ecoguardian-2c40a",
  storageBucket: "ecoguardian-2c40a.appspot.com",
  messagingSenderId: "1077108910126",
  appId: "1:1077108910126:web:68cd5c0af6bc94eb1e17bf",
};

if (!getApps.length) {
  initializeApp(InitializeFirebase);
}

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
