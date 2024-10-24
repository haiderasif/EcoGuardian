import React, { useState, useEffect, useContext } from "react";
import { SafeAreaView, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import { styles } from "../styles/styles";
import { MapCallout } from "./map.callout";
import useLocation from "../services/location.service";
import { ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import {
  CopilotStep,
  walkthroughable,
  useCopilot,
  CopilotProvider,
} from "react-native-copilot";

const WalkthroughableView = walkthroughable(View);

export const MyMapView = (props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <MapView
        mapType="standard"
        style={styles.mapContainer}
        zoomControlEnabled={true}
        region={props.region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {props.listingData.map((x) => {
          return (
            <Marker
              key={x.key}
              tracksViewChanges={false}
              coordinate={{
                latitude: parseFloat(x.Latitude),
                longitude: parseFloat(x.Longitude),
              }}
            >
              <Callout
                onPress={() =>
                  props.navigation.navigate("MapDetailedScreen", {
                    detail: { x },
                  })
                }
              >
                <MapCallout x={x} />
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </SafeAreaView>
  );
};
