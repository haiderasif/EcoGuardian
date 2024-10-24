import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Video } from "expo-av";
import { Button } from "react-native-paper";
import final_step from "../../assets/final_step.mp4";

export const TreePlantingStep3 = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <>
        <Video
          source={final_step} // Ensure source is an object with uri
          style={styles.video} // Style for the video component
          useNativeControls // To show default video controls
          resizeMode="contain" // Optional: to maintain aspect ratio
          volume={1.0} // Set volume to maximum
        />
        <Text style={styles.text}>
          This is the final and optional step of the tree plantation process.
          This video shows how to put bark mulch around your tree. Bark mulch
          helps with weed suppression, moisture retention, and soil insulation.
          However, bark mulch is known for its long-lasting durability compared
          to finer organic mulches like wood chips or shredded leaves.
        </Text>
        <TouchableOpacity
          style={styles.Buttons}
          onPress={() => {
            navigation.navigate("VerifyPlantation");
          }}
        >
          <Text style={styles.ButtonText}>Continue</Text>
        </TouchableOpacity>
      </>
    </ScrollView>
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
