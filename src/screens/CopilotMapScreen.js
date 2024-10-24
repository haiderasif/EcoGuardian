import React, { useEffect, useState, useContext } from "react";
import { Text, Modal, Button, View, ActivityIndicator } from "react-native";
import { MapInput } from "../components/search.component";
import { MyMapView } from "../components/mapview.component";
import { FirebaseContext } from "../services/FirebaseData";
import useLocation from "../services/location.service";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  CopilotStep,
  walkthroughable,
  useCopilot,
  CopilotProvider,
} from "react-native-copilot";
import { useWalkthrough } from "../components/WalkthroughContext";

const WalkthroughableView = walkthroughable(View);

const CopilitMapScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);

  const location = useLocation();
  const { GetMapData, mapData } = useContext(FirebaseContext);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState({});
  const { start } = useCopilot();
  const { setIsWalkthroughActive, isWalkthroughActive } = useWalkthrough();

  useEffect(() => {
    GetMapData();
  }, []);

  useEffect(() => {
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      });
      setIsLoading(false);
    }
  }, [location]);

  const getCoordsFromName = (loc) => {
    setRegion({
      latitude: loc.lat,
      longitude: loc.lng,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    });
  };

  const handleStartTutorial = () => {
    setIsWalkthroughActive(true); // Activate the walkthrough for AppNavigator
    start(); // Start the walkthrough tutorial
    setModalVisible(false);
  };

  const handleSkipTutorial = () => {
    setModalVisible(false);
  };

  return (
    <>
      <View
        style={{ position: "absolute", top: "50%", left: "50%", zIndex: 10000 }}
      >
        {isLoading && (
          <ActivityIndicator
            size={50}
            style={{ marginLeft: -25, zIndex: 1 }}
            animating={true}
            color="#0000ff"
          />
        )}
      </View>

      <CopilotStep
        text="This search bar helps you to search different locations on the map "
        order={2}
        name="search"
      >
        <WalkthroughableView style={{ height: 100, top: 10, zIndex: 1 }}>
          <MapInput notifyChange={(loc) => getCoordsFromName(loc)} />
        </WalkthroughableView>
      </CopilotStep>
      <CopilotStep
        text="This is the map where plantation sites will be displayed. Plantation sites are represented by the red markers shown. Click on the marker to read more about the plantation site. 
         "
        order={1}
        name="map"
      >
        <WalkthroughableView style={{ top: 50 }}>
          <MyMapView
            navigation={navigation}
            listingData={mapData}
            region={region}
          />
        </WalkthroughableView>
      </CopilotStep>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleSkipTutorial}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <Text style={{ fontSize: 18, marginBottom: 20 }}>
              Welcome to the EcoGuardian Application. Please take this quick
              tutorial to understand basic functionality of this page
            </Text>
            <Button title="Give Tutorial" onPress={handleStartTutorial} />
            <Button title="Skip" onPress={handleSkipTutorial} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CopilitMapScreen;
