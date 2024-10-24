import React, { useEffect, useState, useContext } from "react";

import { CopilotProvider } from "react-native-copilot";
import CopilitMapScreen from "./CopilotMapScreen";

const MapScreen = ({ navigation }) => {
  return (
    <CopilotProvider
      tooltipStyle={{ marginBottom: -60 }} // Tooltip background color globally
      arrowColor="#3498db" // Arrow color globally
      overlay="svg" // You can use 'view' or 'svg' for the overlay
    >
      <CopilitMapScreen navigation={navigation} />
    </CopilotProvider>
  );
};

export default MapScreen;
