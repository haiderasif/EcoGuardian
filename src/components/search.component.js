import React from "react";
import { Platform } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export const MapInput = ({ notifyChange }) => {
  const isAndroid = Platform.OS === "android";
  return (
    <GooglePlacesAutocomplete
      placeholder="Search"
      minLength={2}
      autoFocus={true}
      returnKeyType={"search"}
      listViewDisplayed={false}
      fetchDetails={true}
      onPress={(data, details = null) => {
        notifyChange(details.geometry.location);
      }}
      query={{
        key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
        language: "en",
      }}
      nearbyPlacesAPI="GooglePlacesSearch"
      debounce={300}
      styles={{
        textInputContainer: {
          padding: 16,
        },
        listView: {
          padding: 16,

          zIndex: 100000,
          paddingBottom: 250,
        },
        container: {
          top: isAndroid ? 27 : 30,
          width: isAndroid ? 350 : "100%",
          zIndex: 100000,
        },
      }}
    />
  );
};
