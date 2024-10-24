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
        key: "AIzaSyBy9zj9lPNOZWZHenVb3uf1S1NHXgzdrJk",
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
