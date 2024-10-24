import React, { useState } from "react";
import { View, StyleSheet, Text, Modal, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import { Button } from "react-native-paper";
import digHoleVideo from "../../assets/dig_hole.mp4";

export const TreePlantingStep1 = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const handleContinue = () => {
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeading}>Important Notice</Text>
              <Text style={styles.modalText}>
                Before you plant a tree you need to know that the Uk law states
                that You have the right to plant what you want, where you want
                within your property. However, it is sensible and neighbourly to
                consider the consequences of planting potentially large or
                imposing trees or hedges close to a boundary and make planting
                decisions to minimise negative impact. Ultimately you will still
                be liable for any damage caused by them. Before you plant a tree
                you need to have these things in mind.
              </Text>
              <Text style={styles.modalHeading}>What things do i need?</Text>
              <Text style={styles.listItem}>
                • Bare-root or containerised tree
              </Text>
              <Text style={styles.listItem}>• Spade and fork</Text>
              <Text style={styles.listItem}>• Bucket of water</Text>
              <Text style={styles.listItem}>• Watering can or hose</Text>
              <Text style={styles.listItem}>
                • Tree guard or spiral (optional)
              </Text>
              <Text style={styles.listItem}>
                • Mulch (organic matter, such as chipped bark)
              </Text>

              <View>
                <TouchableOpacity
                  style={styles.Buttons}
                  onPress={handleContinue}
                >
                  <Text style={styles.ButtonText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Video
          source={digHoleVideo} // Ensure source is an object with uri
          style={styles.video} // Style for the video component
          useNativeControls // To show default video controls
          resizeMode="contain" // Optional: to maintain aspect ratio
          volume={1.0} // Set volume to maximum
        />
        <Text style={styles.text}>
          This is the first part of tree plantation process. The video above
          shows how to properly dig a hole. Please follow the video and press
          continue for the next step when ready.{" "}
        </Text>
        <TouchableOpacity
          style={styles.Buttons}
          onPress={() => {
            navigation.navigate("TreePlantingStep2");
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
    width: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    textAlign: "justify",
  },
  modalList: {
    textAlign: "left",
    fontWeight: 500,
  },
  modalHeading: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    paddingBottom: 10,
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
