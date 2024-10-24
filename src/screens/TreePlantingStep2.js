import React, { useState } from "react";
import { View, StyleSheet, Text, Modal, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import { Button } from "react-native-paper";
import filling from "../../assets/filling.mp4";

export const TreePlantingStep2 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <>
        <Video
          source={filling} // Ensure source is an object with uri
          style={styles.video} // Style for the video component
          useNativeControls // To show default video controls
          resizeMode="contain" // Optional: to maintain aspect ratio
          volume={1.0} // Set volume to maximum
        />
        <Text style={styles.text}>
          This is the second part of the tree plantation process. This video
          shows how to properly place the tree in the hole and fill the hole.
          Please follow the video and press continue whenever you are ready.
        </Text>
        <TouchableOpacity
          style={styles.Buttons}
          onPress={() => {
            navigation.navigate("TreePlantingStep3");
          }}
        >
          <Text style={styles.ButtonText}>Continue</Text>
        </TouchableOpacity>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    textAlign: "center",
  },
  Buttons: {
    backgroundColor: "#6200ee",
    padding: 10,
    marginTop: 20,

    alignItems: "center",
  },
  ButtonText: {
    color: "white",
    fontSize: 16,
  },
  video: {
    width: "100%",
    height: 400,
  },
  text: {
    fontSize: 18,
    padding: 20,
  },
});
